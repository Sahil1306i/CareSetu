/**
 * TpaChaseEngine — CareSetu AI
 *
 * Operational follow-up logic for TPA/insurance authorization cases.
 *
 * Configuration:
 *   x_caresetu_ai.tpa.followup_interval_hours  (default: 4)
 *   x_caresetu_ai.tpa.default_delay_minutes     (default: 60)
 *
 * IMPORTANT:
 *   - Does NOT contact external systems.
 *   - Does NOT modify OperationalRiskEngine or risk score.
 *   - Blocker creation triggers the existing sync-blocker-count BR,
 *     which cascades to DischargePredictionEngine. No direct engine call needed.
 *   - All status transitions validated here on the server side.
 */
var TpaChaseEngine = Class.create()
TpaChaseEngine.prototype = {
    initialize: function() {},

    // ── Constants ─────────────────────────────────────────────────────────────
    // Terminal statuses: case is decided, blocker must be resolved.
    TERMINAL_STATUSES: ['approved', 'rejected', 'closed'],

    // Active (blocking discharge) statuses: case needs attention.
    ACTIVE_STATUSES: ['submitted', 'pending_documents', 'under_review', 'escalated'],

    // Valid status transitions (from → to[]).
    VALID_TRANSITIONS: {
        submitted:         ['pending_documents', 'under_review', 'approved', 'rejected', 'escalated', 'closed'],
        pending_documents: ['submitted', 'under_review', 'rejected', 'escalated', 'closed'],
        under_review:      ['pending_documents', 'approved', 'rejected', 'escalated', 'closed'],
        approved:          ['closed'],
        rejected:          ['submitted', 'closed'],
        escalated:         ['under_review', 'approved', 'rejected', 'closed'],
        closed:            [],
    },

    // ── Follow-up scheduling ──────────────────────────────────────────────────
    /**
     * Compute and persist next_followup_due for an active TPA case.
     * Clears next_followup_due for terminal cases.
     *
     * @param {string} caseSysId - sys_id of x_caresetu_ai_tpa_case
     * @param {GlideRecord} [caseGr]  - optional pre-fetched GlideRecord
     */
    scheduleNextFollowup: function(caseSysId, caseGr) {
        var gr = caseGr
        if (!gr) {
            gr = new GlideRecord('x_caresetu_ai_tpa_case')
            if (!gr.get(caseSysId)) {
                gs.error('TpaChaseEngine.scheduleNextFollowup: case not found — ' + caseSysId)
                return
            }
        }

        var status = gr.getValue('status')
        if (this._isTerminal(status)) {
            // Clear deadline for resolved cases
            gr.setValue('next_followup_due', '')
            gr.setValue('is_overdue', 'false')
            return
        }

        var intervalHours = parseInt(gs.getProperty('x_caresetu_ai.tpa.followup_interval_hours', '4'), 10) || 4
        var now = new GlideDateTime()
        now.addSeconds(intervalHours * 3600)
        gr.setValue('next_followup_due', now.getValue())
    },

    // ── Overdue processing (called by scheduled script) ───────────────────────
    /**
     * Detect and process all overdue TPA cases.
     *
     * For each case where next_followup_due < now() and status is active:
     *   1. Mark is_overdue = true.
     *   2. Ensure exactly one active TPA blocker exists for the encounter.
     *      (Idempotent — uses linked_blocker reference to avoid duplicates.)
     *
     * @returns {object} { processed: number, blocked: number, errors: number }
     */
    processOverdueCases: function() {
        var now = new GlideDateTime()
        var processed = 0, blocked = 0, errors = 0

        var gr = new GlideRecord('x_caresetu_ai_tpa_case')
        gr.addQuery('status', 'IN', this.ACTIVE_STATUSES.join(','))
        gr.addQuery('next_followup_due', '!=', '')
        gr.addQuery('next_followup_due', '<=', now.getValue())
        gr.query()

        while (gr.next()) {
            try {
                gr.setValue('is_overdue', 'true')

                var didBlock = this._ensureBlockerExists(gr)
                if (didBlock) blocked++

                gr.update()
                processed++
                gs.info('TpaChaseEngine: marked overdue — ' + gr.getValue('number'))
            } catch (e) {
                errors++
                gs.error('TpaChaseEngine.processOverdueCases: error on ' + gr.getValue('number') + ' — ' + e.message)
            }
        }

        gs.info('TpaChaseEngine.processOverdueCases: processed=' + processed +
                ' blocked=' + blocked + ' errors=' + errors)
        return { processed: processed, blocked: blocked, errors: errors }
    },

    // ── Follow-up recording ───────────────────────────────────────────────────
    /**
     * Record a manual follow-up action on a TPA case.
     *
     * Updates: last_followup_time, followup_count (+1), work_notes (appended),
     *          is_overdue (cleared), next_followup_due (rescheduled).
     *
     * @param {string} caseSysId
     * @param {string} notes - Staff note for this follow-up
     * @returns {{ success: boolean, next_followup_due: string, followup_count: number, error?: string }}
     */
    recordFollowup: function(caseSysId, notes) {
        var gr = new GlideRecord('x_caresetu_ai_tpa_case')
        if (!gr.get(caseSysId)) {
            return { success: false, error: 'TPA case not found: ' + caseSysId }
        }

        var status = gr.getValue('status')
        if (this._isTerminal(status)) {
            return { success: false, error: 'Cannot record follow-up on a terminal case (status=' + status + ').' }
        }

        var now = new GlideDateTime()
        gr.setValue('last_followup_time', now.getValue())
        gr.setValue('is_overdue', 'false')

        var count = (parseInt(gr.getValue('followup_count'), 10) || 0) + 1
        gr.setValue('followup_count', count)

        if (notes) {
            var existing = gr.getValue('work_notes') || ''
            var stamp    = '[' + now.getDisplayValue() + '] Follow-up #' + count + ': ' + notes
            gr.setValue('work_notes', existing ? existing + '\n' + stamp : stamp)
        }

        this.scheduleNextFollowup(caseSysId, gr)
        gr.update()

        return {
            success:          true,
            followup_count:   count,
            next_followup_due: gr.getValue('next_followup_due'),
        }
    },

    // ── Blocker resolution ────────────────────────────────────────────────────
    /**
     * Resolve the linked blocker when a TPA case reaches a terminal status.
     *
     * Sets blocker status → 'resolved', resolution_time = now(),
     * clears case.linked_blocker reference.
     * The sync-blocker-count BR fires automatically after blocker update,
     * re-running DischargePredictionEngine.
     *
     * @param {string} caseSysId
     * @param {string} resolutionNotes
     * @returns {boolean} true if a blocker was resolved, false if none existed
     */
    resolveLinkedBlocker: function(caseSysId, resolutionNotes) {
        var gr = new GlideRecord('x_caresetu_ai_tpa_case')
        if (!gr.get(caseSysId)) return false

        var blockerSysId = gr.getValue('linked_blocker')
        if (!blockerSysId) return false

        var blk = new GlideRecord('x_caresetu_ai_blocker')
        if (!blk.get(blockerSysId)) {
            // Blocker already deleted or doesn't exist — clean the reference
            gr.setValue('linked_blocker', '')
            gr.update()
            return false
        }

        // Only resolve active blockers; don't touch already-resolved ones
        var blkStatus = blk.getValue('status')
        if (blkStatus !== 'resolved') {
            blk.setValue('status',          'resolved')
            blk.setValue('resolution_time', new GlideDateTime().getValue())
            if (resolutionNotes) {
                blk.setValue('resolution_notes', resolutionNotes)
            }
            blk.update()
            // sync-blocker-count BR fires here automatically → re-predict
            gs.info('TpaChaseEngine: resolved blocker ' + blk.getValue('number') +
                    ' for TPA case ' + gr.getValue('number'))
        }

        // Clear the reference on the case record
        gr.setValue('linked_blocker', '')
        gr.update()
        return true
    },

    // ── Status transition validation ──────────────────────────────────────────
    /**
     * Validate a status transition server-side.
     * @param {string} fromStatus
     * @param {string} toStatus
     * @returns {{ valid: boolean, error?: string }}
     */
    validateTransition: function(fromStatus, toStatus) {
        var allowed = this.VALID_TRANSITIONS[fromStatus]
        if (!allowed) {
            return { valid: false, error: 'Unknown current status: ' + fromStatus }
        }
        for (var i = 0; i < allowed.length; i++) {
            if (allowed[i] === toStatus) return { valid: true }
        }
        return {
            valid: false,
            error: 'Transition from "' + fromStatus + '" to "' + toStatus + '" is not permitted.',
        }
    },

    // ── Private helpers ───────────────────────────────────────────────────────
    _isTerminal: function(status) {
        for (var i = 0; i < this.TERMINAL_STATUSES.length; i++) {
            if (this.TERMINAL_STATUSES[i] === status) return true
        }
        return false
    },

    /**
     * Ensure exactly one active TPA blocker exists for the encounter linked to
     * this TPA case. Uses linked_blocker to avoid duplicates.
     *
     * If a linked blocker already exists and is active — update its target time.
     * If it was resolved externally — create a new one and re-link.
     * If no linked blocker — create one and link it.
     *
     * @param {GlideRecord} caseGr - TPA case GlideRecord (already fetched)
     * @returns {boolean} true if a blocker was created or updated
     */
    _ensureBlockerExists: function(caseGr) {
        var encSysId     = caseGr.getValue('encounter')
        var existingBlkId = caseGr.getValue('linked_blocker')

        // Check if existing linked blocker is still active
        if (existingBlkId) {
            var existing = new GlideRecord('x_caresetu_ai_blocker')
            if (existing.get(existingBlkId)) {
                var existingStatus = existing.getValue('status')
                if (existingStatus === 'open' || existingStatus === 'in_progress' || existingStatus === 'escalated') {
                    // Already have an active blocker — just update target time
                    var targetTime = new GlideDateTime()
                    var delayMin = parseInt(gs.getProperty('x_caresetu_ai.tpa.default_delay_minutes', '60'), 10) || 60
                    targetTime.addSeconds(delayMin * 60)
                    existing.setValue('target_resolution_time', targetTime.getValue())
                    existing.setValue('is_overdue', 'true')
                    existing.update()
                    return false  // Blocker already existed; updated, not created
                }
            }
            // Linked blocker is resolved/not found — create a new one
        }

        // Create a new TPA blocker
        var delayMinutes = parseInt(gs.getProperty('x_caresetu_ai.tpa.default_delay_minutes', '60'), 10) || 60
        var targetResTime = new GlideDateTime()
        targetResTime.addSeconds(delayMinutes * 60)

        var blk = new GlideRecord('x_caresetu_ai_blocker')
        blk.initialize()
        blk.setValue('encounter',                encSysId)
        blk.setValue('category',                 'tpa')
        blk.setValue('status',                   'open')
        blk.setValue('department',               caseGr.getValue('payer_name') || 'Insurance')
        blk.setValue('description',              'TPA/Insurance case overdue: ' +
                                                 caseGr.getValue('number') + ' (' +
                                                 caseGr.getDisplayValue('authorization_type') + ') — ' +
                                                 caseGr.getValue('payer_name'))
        blk.setValue('estimated_delay_minutes',  delayMinutes)
        blk.setValue('target_resolution_time',   targetResTime.getValue())
        blk.setValue('is_overdue',               'true')
        if (caseGr.getValue('assigned_owner')) {
            blk.setValue('owner', caseGr.getValue('assigned_owner'))
        }

        var newBlkId = blk.insert()
        // sync-blocker-count BR fires automatically after insert

        if (newBlkId) {
            caseGr.setValue('linked_blocker', newBlkId)
            gs.info('TpaChaseEngine: created blocker ' + blk.getValue('number') +
                    ' for TPA case ' + caseGr.getValue('number'))
            return true
        }
        return false
    },

    type: 'TpaChaseEngine',
}
