/**
 * HandoffEngine — CareSetu AI
 *
 * Closed-loop lifecycle and SLA accountability for clinical and operational handoffs.
 *
 * Responsibilities:
 *   1. SLA deadline calculation by priority (critical=5m, urgent=15m, routine=30m).
 *   2. Server-side validation of handoff actions (acknowledge, reject, complete, cancel).
 *   3. Scheduled detection of overdue handoffs with automated blocker generation.
 *   4. Synchronization of encounter.unack_handoffs counter.
 *   5. Seamless integration with existing DischargePredictionEngine and OperationalRiskEngine.
 */
var HandoffEngine = Class.create()
HandoffEngine.prototype = {
    initialize: function() {},

    // ── Constants ─────────────────────────────────────────────────────────────
    STATUSES: {
        PENDING_ACK: 'pending_acknowledgment',
        ACKNOWLEDGED: 'acknowledged',
        IN_PROGRESS:  'in_progress',
        COMPLETED:    'completed',
        ESCALATED:    'escalated',
        CANCELLED:    'cancelled',
    },

    TERMINAL_STATUSES: ['completed', 'cancelled'],

    VALID_TRANSITIONS: {
        pending_acknowledgment: ['acknowledged', 'escalated', 'cancelled'],
        acknowledged:           ['in_progress', 'completed', 'cancelled'],
        in_progress:            ['completed', 'escalated', 'cancelled'],
        escalated:              ['acknowledged', 'completed', 'cancelled'],
        completed:              [],
        cancelled:              [],
    },

    // Default SLA minutes per priority
    SLA_MINUTES: {
        critical: 5,
        urgent:   15,
        routine:  30,
    },

    // ── Deadline Calculation ──────────────────────────────────────────────────
    /**
     * Calculates the acknowledgment deadline for a handoff based on priority.
     * @param {string} priority - 'routine' | 'urgent' | 'critical'
     * @returns {string} ISO DateTime string
     */
    computeDeadline: function(priority) {
        var prio = priority || 'routine'
        var mins = this.SLA_MINUTES[prio] || 30
        var now = new GlideDateTime()
        now.addSeconds(mins * 60)
        return now.getValue()
    },

    // ── Create Handoff ────────────────────────────────────────────────────────
    /**
     * Creates a new handoff record.
     * @param {object} fields
     * @returns {{ success: boolean, sys_id?: string, number?: string, error?: string }}
     */
    createHandoff: function(fields) {
        if (!fields || !fields.encounter) {
            return { success: false, error: 'Encounter reference is required.' }
        }
        if (!fields.sending_department || !fields.sending_staff) {
            return { success: false, error: 'Sending department and staff are required.' }
        }
        if (!fields.receiving_department) {
            return { success: false, error: 'Receiving department is required.' }
        }
        if (!fields.summary) {
            return { success: false, error: 'Handoff summary is required.' }
        }

        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (!enc.get(fields.encounter)) {
            return { success: false, error: 'Encounter not found: ' + fields.encounter }
        }

        var gr = new GlideRecord('x_caresetu_ai_handoff')
        gr.initialize()
        gr.setValue('encounter',            fields.encounter)
        gr.setValue('sending_department',   fields.sending_department)
        gr.setValue('sending_staff',        fields.sending_staff)
        gr.setValue('receiving_department', fields.receiving_department)
        if (fields.receiving_staff) gr.setValue('receiving_staff', fields.receiving_staff)

        var category = fields.category || 'shift_change'
        gr.setValue('category', category)

        var priority = fields.priority || 'routine'
        gr.setValue('priority', priority)

        gr.setValue('summary', fields.summary)
        if (fields.handoff_details) gr.setValue('handoff_details', fields.handoff_details)

        gr.setValue('status', this.STATUSES.PENDING_ACK)
        gr.setValue('is_overdue', 'false')

        var now = new GlideDateTime()
        gr.setValue('creation_time', now.getValue())
        gr.setValue('acknowledgment_deadline', this.computeDeadline(priority))

        var sysId = gr.insert()
        if (!sysId) {
            return { success: false, error: 'Failed to insert handoff record.' }
        }

        gs.info('HandoffEngine: created handoff ' + gr.getValue('number') + ' for encounter ' + enc.getValue('number'))

        // Sync unack_handoffs
        this.syncEncounterUnackCount(fields.encounter)

        return {
            success: true,
            sys_id:  sysId,
            number:  gr.getValue('number'),
            deadline: gr.getValue('acknowledgment_deadline'),
        }
    },

    // ── Acknowledge Handoff ────────────────────────────────────────────────────
    /**
     * Acknowledges a pending or escalated handoff.
     * @param {string} handoffSysId
     * @param {string} [staffSysId] - Optional user acknowledging
     * @param {string} [notes]       - Optional notes
     */
    acknowledgeHandoff: function(handoffSysId, staffSysId, notes) {
        var gr = new GlideRecord('x_caresetu_ai_handoff')
        if (!gr.get(handoffSysId)) {
            return { success: false, error: 'Handoff record not found: ' + handoffSysId }
        }

        var currentStatus = gr.getValue('status')
        if (currentStatus !== this.STATUSES.PENDING_ACK && currentStatus !== this.STATUSES.ESCALATED) {
            return { success: false, error: 'Cannot acknowledge handoff in status: ' + currentStatus }
        }

        var now = new GlideDateTime()
        gr.setValue('status', this.STATUSES.ACKNOWLEDGED)
        gr.setValue('acknowledged_time', now.getValue())
        gr.setValue('is_overdue', 'false')

        if (staffSysId) {
            gr.setValue('receiving_staff', staffSysId)
        }

        var stamp = '[' + now.getDisplayValue() + '] Acknowledged' + (notes ? ': ' + notes : '')
        this._appendNotes(gr, stamp)

        // Resolve any linked operational blocker
        this.resolveLinkedBlocker(gr, 'Handoff acknowledged')

        gr.update()

        gs.info('HandoffEngine: handoff ' + gr.getValue('number') + ' acknowledged')
        this.syncEncounterUnackCount(gr.getValue('encounter'))

        return {
            success: true,
            status: gr.getValue('status'),
            acknowledged_time: gr.getValue('acknowledged_time'),
        }
    },

    // ── Reject Handoff ────────────────────────────────────────────────────────
    /**
     * Rejects an unacknowledged handoff, moving it to escalated status and recording reason.
     * @param {string} handoffSysId
     * @param {string} [staffSysId]
     * @param {string} reason
     */
    rejectHandoff: function(handoffSysId, staffSysId, reason) {
        var gr = new GlideRecord('x_caresetu_ai_handoff')
        if (!gr.get(handoffSysId)) {
            return { success: false, error: 'Handoff record not found: ' + handoffSysId }
        }

        if (!reason) {
            return { success: false, error: 'A rejection reason is required.' }
        }

        var currentStatus = gr.getValue('status')
        if (currentStatus !== this.STATUSES.PENDING_ACK && currentStatus !== this.STATUSES.ESCALATED) {
            return { success: false, error: 'Cannot reject handoff in status: ' + currentStatus }
        }

        var now = new GlideDateTime()
        gr.setValue('status', this.STATUSES.ESCALATED)
        gr.setValue('rejection_reason', reason)
        gr.setValue('is_overdue', 'true')

        var stamp = '[' + now.getDisplayValue() + '] Rejected with reason: ' + reason
        this._appendNotes(gr, stamp)

        // Ensure operational blocker exists to flag coordination breakdown
        this._ensureBlockerExists(gr, 'Handoff Rejected: ' + reason)

        gr.update()

        gs.info('HandoffEngine: handoff ' + gr.getValue('number') + ' rejected/escalated')
        this.syncEncounterUnackCount(gr.getValue('encounter'))

        return {
            success: true,
            status: gr.getValue('status'),
            rejection_reason: reason,
        }
    },

    // ── Complete Handoff ──────────────────────────────────────────────────────
    /**
     * Completes an acknowledged or in-progress handoff.
     * @param {string} handoffSysId
     * @param {string} [notes]
     */
    completeHandoff: function(handoffSysId, notes) {
        var gr = new GlideRecord('x_caresetu_ai_handoff')
        if (!gr.get(handoffSysId)) {
            return { success: false, error: 'Handoff record not found: ' + handoffSysId }
        }

        var currentStatus = gr.getValue('status')
        if (currentStatus !== this.STATUSES.ACKNOWLEDGED && currentStatus !== this.STATUSES.IN_PROGRESS && currentStatus !== this.STATUSES.ESCALATED) {
            return { success: false, error: 'Cannot complete handoff in status: ' + currentStatus }
        }

        var now = new GlideDateTime()
        gr.setValue('status', this.STATUSES.COMPLETED)
        gr.setValue('completion_time', now.getValue())
        gr.setValue('is_overdue', 'false')

        var stamp = '[' + now.getDisplayValue() + '] Completed' + (notes ? ': ' + notes : '')
        this._appendNotes(gr, stamp)

        // Resolve linked blocker
        this.resolveLinkedBlocker(gr, 'Handoff completed')

        gr.update()

        gs.info('HandoffEngine: handoff ' + gr.getValue('number') + ' completed')
        this.syncEncounterUnackCount(gr.getValue('encounter'))

        return {
            success: true,
            status: gr.getValue('status'),
            completion_time: gr.getValue('completion_time'),
        }
    },

    // ── Cancel Handoff ────────────────────────────────────────────────────────
    /**
     * Cancels a handoff.
     * @param {string} handoffSysId
     * @param {string} reason
     */
    cancelHandoff: function(handoffSysId, reason) {
        var gr = new GlideRecord('x_caresetu_ai_handoff')
        if (!gr.get(handoffSysId)) {
            return { success: false, error: 'Handoff record not found: ' + handoffSysId }
        }

        var currentStatus = gr.getValue('status')
        if (currentStatus === this.STATUSES.COMPLETED) {
            return { success: false, error: 'Cannot cancel an already completed handoff.' }
        }

        var now = new GlideDateTime()
        gr.setValue('status', this.STATUSES.CANCELLED)
        gr.setValue('is_overdue', 'false')

        var stamp = '[' + now.getDisplayValue() + '] Cancelled: ' + (reason || 'No reason provided')
        this._appendNotes(gr, stamp)

        // Resolve linked blocker
        this.resolveLinkedBlocker(gr, 'Handoff cancelled')

        gr.update()

        gs.info('HandoffEngine: handoff ' + gr.getValue('number') + ' cancelled')
        this.syncEncounterUnackCount(gr.getValue('encounter'))

        return {
            success: true,
            status: gr.getValue('status'),
        }
    },

    // ── Scheduled Overdue Processing ──────────────────────────────────────────
    // ── Scheduled Overdue Processing ──────────────────────────────────────────
    /**
     * Sweeps active unacknowledged handoffs whose deadline has passed.
     * Marks them overdue, escalates them, and idempotently logs operational blockers.
     * Guarded against overlapping executions and duplicate records.
     * @returns {{ processed: number, escalated: number, errors: number, skipped?: boolean }}
     */
    processOverdueHandoffs: function() {
        if (HandoffEngine._isProcessing) {
            gs.warn('HandoffEngine.processOverdueHandoffs: execution already in progress — skipping overlapping run.')
            return { processed: 0, escalated: 0, errors: 0, skipped: true }
        }

        HandoffEngine._isProcessing = true
        try {
            var now = new GlideDateTime()
            var processed = 0, escalated = 0, errors = 0
            var encsToSync = {}

            var gr = new GlideRecord('x_caresetu_ai_handoff')
            gr.addQuery('status', this.STATUSES.PENDING_ACK)
            gr.addQuery('acknowledgment_deadline', '!=', '')
            gr.addQuery('acknowledgment_deadline', '<=', now.getValue())
            gr.query()

            while (gr.next()) {
                try {
                    // Re-verify status to prevent race conditions during concurrent runs
                    var verifyGr = new GlideRecord('x_caresetu_ai_handoff')
                    if (!verifyGr.get(gr.getUniqueValue()) || verifyGr.getValue('status') !== this.STATUSES.PENDING_ACK) {
                        continue
                    }

                    verifyGr.setValue('is_overdue', 'true')
                    verifyGr.setValue('status', this.STATUSES.ESCALATED)

                    var stamp = '[' + now.getDisplayValue() + '] SLA Breached: Acknowledgment deadline passed.'
                    this._appendNotes(verifyGr, stamp)

                    this._ensureBlockerExists(verifyGr, 'Handoff acknowledgment SLA breached')

                    verifyGr.update()

                    var encId = verifyGr.getValue('encounter')
                    if (encId) encsToSync[encId] = true

                    escalated++
                    processed++
                } catch (e) {
                    errors++
                    gs.error('HandoffEngine.processOverdueHandoffs: error on ' + gr.getUniqueValue() + ': ' + e.message)
                }
            }

            // Synchronize encounter unacknowledged count for all affected encounters
            for (var encSysId in encsToSync) {
                this.syncEncounterUnackCount(encSysId)
            }

            gs.info('HandoffEngine.processOverdueHandoffs: processed=' + processed + ' escalated=' + escalated + ' errors=' + errors)
            return { processed: processed, escalated: escalated, errors: errors }
        } finally {
            HandoffEngine._isProcessing = false
        }
    },

    // ── Blocker Management ────────────────────────────────────────────────────
    /**
     * Resolves the linked operational blocker if one exists.
     * @param {GlideRecord} handoffGr
     * @param {string} resolutionNotes
     */
    resolveLinkedBlocker: function(handoffGr, resolutionNotes) {
        var blockerSysId = handoffGr.getValue('linked_blocker')
        var handoffSysId = handoffGr.getUniqueValue()
        var encId = handoffGr.getValue('encounter')

        if (blockerSysId) {
            var blk = new GlideRecord('x_caresetu_ai_blocker')
            if (blk.get(blockerSysId)) {
                if (blk.getValue('status') !== 'resolved') {
                    blk.setValue('status', 'resolved')
                    blk.setValue('resolution_time', new GlideDateTime().getValue())
                    if (resolutionNotes) blk.setValue('resolution_notes', resolutionNotes)
                    blk.update()
                    gs.info('HandoffEngine: resolved linked blocker ' + blockerSysId + ' for handoff ' + handoffSysId)
                }
            }
            handoffGr.setValue('linked_blocker', '')
        }

        // Also resolve any orphaned active blocker mentioning this handoff
        if (handoffSysId && encId) {
            var orphanBlk = new GlideRecord('x_caresetu_ai_blocker')
            orphanBlk.addQuery('encounter', encId)
            orphanBlk.addQuery('category', 'handoff')
            orphanBlk.addQuery('status', 'IN', 'open,in_progress,escalated')
            orphanBlk.addQuery('description', 'CONTAINS', handoffSysId)
            orphanBlk.query()
            while (orphanBlk.next()) {
                orphanBlk.setValue('status', 'resolved')
                orphanBlk.setValue('resolution_time', new GlideDateTime().getValue())
                if (resolutionNotes) orphanBlk.setValue('resolution_notes', resolutionNotes)
                orphanBlk.update()
                gs.info('HandoffEngine: resolved matching blocker ' + orphanBlk.getUniqueValue() + ' for handoff ' + handoffSysId)
            }
        }
    },

    /**
     * Idempotently ensures an operational blocker exists for an overdue/escalated handoff.
     * @param {GlideRecord} handoffGr
     * @param {string} description
     */
    _ensureBlockerExists: function(handoffGr, description) {
        var existingBlockerId = handoffGr.getValue('linked_blocker')
        if (existingBlockerId) {
            var existingBlk = new GlideRecord('x_caresetu_ai_blocker')
            if (existingBlk.get(existingBlockerId) && existingBlk.getValue('status') !== 'resolved') {
                // Already has an active linked blocker, don't create duplicate
                return
            }
        }

        var encId = handoffGr.getValue('encounter')
        var handoffSysId = handoffGr.getUniqueValue()

        // Guard against duplicate active blockers for this handoff
        if (encId) {
            var blkCheck = new GlideRecord('x_caresetu_ai_blocker')
            blkCheck.addQuery('encounter', encId)
            blkCheck.addQuery('category', 'handoff')
            blkCheck.addQuery('status', 'IN', 'open,in_progress,escalated')
            if (handoffSysId) {
                blkCheck.addQuery('description', 'CONTAINS', handoffSysId)
            }
            blkCheck.query()
            if (blkCheck.next()) {
                handoffGr.setValue('linked_blocker', blkCheck.getUniqueValue())
                return
            }
        }

        // Create new operational blocker
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        blk.initialize()
        blk.setValue('encounter', encId)
        blk.setValue('category', 'handoff')
        blk.setValue('department', handoffGr.getValue('receiving_department') || 'Nursing')
        blk.setValue('status', 'escalated')
        blk.setValue('estimated_delay_minutes', 15)

        var desc = description || ('Unacknowledged handoff: ' + (handoffGr.getValue('summary') || 'Transfer'))
        if (handoffSysId && desc.indexOf(handoffSysId) === -1) {
            desc = '[' + handoffSysId + '] ' + desc
        }
        blk.setValue('description', desc)

        var newBlkId = blk.insert()
        if (newBlkId) {
            handoffGr.setValue('linked_blocker', newBlkId)
            gs.info('HandoffEngine: created blocker ' + newBlkId + ' for handoff ' + handoffSysId)
        }
    },

    // ── Encounter Synchronization ─────────────────────────────────────────────
    /**
     * Synchronizes encounter.unack_handoffs to match the exact count of active,
     * unacknowledged handoffs (status = pending_acknowledgment or escalated).
     * @param {string} encSysId
     * @returns {number} The updated count
     */
    syncEncounterUnackCount: function(encSysId) {
        if (!encSysId) return 0

        var agg = new GlideAggregate('x_caresetu_ai_handoff')
        agg.addQuery('encounter', encSysId)
        agg.addQuery('status', 'IN', [this.STATUSES.PENDING_ACK, this.STATUSES.ESCALATED].join(','))
        agg.addAggregate('COUNT')
        agg.query()

        var count = 0
        if (agg.next()) {
            count = parseInt(agg.getAggregate('COUNT'), 10) || 0
        }

        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (enc.get(encSysId)) {
            var currentCount = parseInt(enc.getValue('unack_handoffs'), 10) || 0
            if (currentCount !== count) {
                enc.setValue('unack_handoffs', count)
                enc.update()
                gs.info('HandoffEngine: synced encounter ' + enc.getValue('number') + ' unack_handoffs to ' + count)
            }
        }

        return count
    },

    // ── Helper methods ────────────────────────────────────────────────────────
    validateTransition: function(fromStatus, toStatus) {
        var allowed = this.VALID_TRANSITIONS[fromStatus]
        if (!allowed) return { valid: false, error: 'Unknown current status: ' + fromStatus }
        for (var i = 0; i < allowed.length; i++) {
            if (allowed[i] === toStatus) return { valid: true }
        }
        return {
            valid: false,
            error: 'Transition from "' + fromStatus + '" to "' + toStatus + '" is not permitted.',
        }
    },

    _appendNotes: function(gr, noteText) {
        var existing = gr.getValue('resolution_notes') || ''
        gr.setValue('resolution_notes', existing ? existing + '\n' + noteText : noteText)
    },

    type: 'HandoffEngine'
}
