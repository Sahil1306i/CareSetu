/**
 * OperationalRiskEngine — CareSetu AI
 *
 * Deterministic, rule-based operational discharge risk scoring engine.
 *
 * IMPORTANT:
 * - This is a Script Include using Class.create().
 * - Do NOT import from @servicenow/glide — Glide APIs are auto-available in this context.
 * - Scoring is STRICTLY OPERATIONAL: no clinical data, no diagnosis, no AI/LLM inference.
 * - The score and explanation are fully deterministic from the five coordination signals.
 *
 * Scoring rules:
 *   +40 discharge already past due
 *   +25 discharge within 60 minutes
 *   +15 discharge within 3 hours
 *   +10/task overdue coordination tasks (capped at +30)
 *   +8/milestone incomplete milestones (capped at +24)
 *   +10/handoff unacknowledged handoffs (capped at +20)
 *   +15/blocker open operational blockers (capped at +30)
 *
 * Missing expected_discharge_time → data quality WARNING only, zero score contribution.
 *
 * Tiers: Normal (0–39), Medium (40–59), High (60–79), Critical (80–100)
 */
var OperationalRiskEngine = Class.create()
OperationalRiskEngine.prototype = {
    initialize: function() {},

    // ── Public entry point ────────────────────────────────────────────────────
    /**
     * Score a patient encounter by sys_id.
     * Creates a risk score record and, for high/critical tiers, an escalation task.
     * Does NOT update the encounter record (prevents recursive BR trigger).
     *
     * @param {string} encSysId - sys_id of x_caresetu_ai_encounter record
     */
    scoreEncounter: function(encSysId) {
        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (!enc.get(encSysId)) {
            gs.error('OperationalRiskEngine: encounter not found — ' + encSysId)
            return
        }

        var signals = this._readSignals(enc)
        var result  = this._applyRules(signals)

        this._archivePreviousScores(encSysId)
        var scoreSysId = this._writeScore(encSysId, result)

        this._syncEscalation(enc, result)

        gs.info('OperationalRiskEngine: scored encounter ' + enc.getValue('number') +
                ' → score=' + result.score + ' tier=' + result.tier)
    },

    // ── Signal extraction ─────────────────────────────────────────────────────
    /**
     * Read the five operational coordination signals from the encounter record.
     * minutesRemaining is null when expected_discharge_time is not set.
     */
    _readSignals: function(enc) {
        var expectedRaw      = enc.getValue('expected_discharge_time')
        var minutesRemaining = null   // null = no discharge time set

        if (expectedRaw) {
            // Use getNumericValue() directly on GlideDateTime instances.
            // This returns epoch milliseconds reliably in all contexts including scoped apps.
            // GlideDateTime.subtract() returns a GlideDuration whose getNumericValue()
            // is NOT reliable in scoped apps — do not use it for arithmetic.
            //
            // setDisplayValue() parses the stored DateTime string respecting the
            // instance timezone, which matches how the value was entered.
            // minutesRemaining: positive = still in future, negative = past-due.
            var expected   = new GlideDateTime()
            expected.setDisplayValue(enc.getDisplayValue('expected_discharge_time'))
            var now        = new GlideDateTime()
            var nowMs      = now.getNumericValue()
            var expectedMs = expected.getNumericValue()
            minutesRemaining = (expectedMs - nowMs) / 60000
        }

        var encSysId = enc.getUniqueValue()
        var openBlockers = parseInt(enc.getValue('open_blockers'), 10) || 0
        var unackHandoffs = parseInt(enc.getValue('unack_handoffs'), 10) || 0

        // Synchronize live counts from child tables if available
        var blk = new GlideAggregate('x_caresetu_ai_blocker')
        if (blk.isValid()) {
            blk.addQuery('encounter', encSysId)
            blk.addQuery('status', 'IN', 'open,in_progress,escalated')
            blk.addAggregate('COUNT')
            blk.query()
            if (blk.next()) {
                openBlockers = parseInt(blk.getAggregate('COUNT'), 10) || 0
            }
        }

        var hnd = new GlideAggregate('x_caresetu_ai_handoff')
        if (hnd.isValid()) {
            hnd.addQuery('encounter', encSysId)
            hnd.addQuery('status', 'IN', 'pending_acknowledgment,escalated')
            hnd.addAggregate('COUNT')
            hnd.query()
            if (hnd.next()) {
                unackHandoffs = parseInt(hnd.getAggregate('COUNT'), 10) || 0
            }
        }

        return {
            minutesRemaining:     minutesRemaining,
            overdueCoordTasks:    parseInt(enc.getValue('overdue_coord_tasks'), 10)   || 0,
            incompleteMilestones: parseInt(enc.getValue('incomplete_milestones'), 10) || 0,
            unackHandoffs:        unackHandoffs,
            openBlockers:         openBlockers,
            chargNurseSysId:      enc.getValue('charge_nurse'),
            encNumber:            enc.getValue('number'),
        }
    },

    // ── Deterministic scoring rules ───────────────────────────────────────────
    /**
     * Apply the seven scoring rules and one data-quality warning.
     * Returns: { score, tier, explanation, dataQualityWarning }
     */
    _applyRules: function(s) {
        var score    = 0
        var reasons  = []
        var warnings = []

        // Rule 0 — Missing expected discharge time (WARNING ONLY — no score contribution)
        if (s.minutesRemaining === null) {
            warnings.push('Expected discharge time has not been set for this encounter.')
        }
        // Rule 1 — Discharge time already passed
        else if (s.minutesRemaining < 0) {
            score += 40
            reasons.push('Discharge time has already passed.')
        }
        // Rule 2 — Discharge due within 60 minutes
        else if (s.minutesRemaining < 60) {
            score += 25
            reasons.push('Discharge is due in under 60 minutes.')
        }
        // Rule 3 — Discharge due within 3 hours
        else if (s.minutesRemaining < 180) {
            score += 15
            reasons.push('Discharge is due in under 3 hours.')
        }

        // Rule 4 — Overdue coordination tasks: +10 each, capped at +30
        if (s.overdueCoordTasks > 0) {
            var taskPts = Math.min(s.overdueCoordTasks * 10, 30)
            score += taskPts
            reasons.push(s.overdueCoordTasks + ' overdue coordination task(s) require resolution.')
        }

        // Rule 5 — Incomplete required milestones: +8 each, capped at +24
        if (s.incompleteMilestones > 0) {
            var milestonePts = Math.min(s.incompleteMilestones * 8, 24)
            score += milestonePts
            reasons.push(s.incompleteMilestones + ' required discharge milestone(s) are not completed.')
        }

        // Rule 6 — Unacknowledged handoffs: +10 each, capped at +20
        if (s.unackHandoffs > 0) {
            var handoffPts = Math.min(s.unackHandoffs * 10, 20)
            score += handoffPts
            reasons.push(s.unackHandoffs + ' care handoff(s) are pending acknowledgement.')
        }

        // Rule 7 — Operational blockers: +15 each, capped at +30
        if (s.openBlockers > 0) {
            var blockerPts = Math.min(s.openBlockers * 15, 30)
            score += blockerPts
            reasons.push(s.openBlockers + ' equipment or workflow blocker(s) are unresolved.')
        }

        // Clamp score to 0–100
        score = Math.min(Math.max(score, 0), 100)

        // Determine tier
        var tier = score >= 80 ? 'critical'
                 : score >= 60 ? 'high'
                 : score >= 40 ? 'medium'
                 :               'normal'

        var explanation = reasons.length > 0
            ? reasons.join(' ')
            : 'No operational risk factors are currently present for this encounter.'

        var dataQualityWarning = warnings.join(' ')

        return {
            score:              score,
            tier:               tier,
            explanation:        explanation,
            dataQualityWarning: dataQualityWarning,
        }
    },

    // ── Persistence helpers ───────────────────────────────────────────────────
    /**
     * Mark all existing latest scores for this encounter as not-latest.
     * Maintains a clean history with one current score.
     */
    _archivePreviousScores: function(encSysId) {
        var prev = new GlideRecord('x_caresetu_ai_risk_score')
        prev.addQuery('encounter', encSysId)
        prev.addQuery('is_latest', true)
        prev.query()
        while (prev.next()) {
            prev.setValue('is_latest', false)
            prev.update()
        }
    },

    /**
     * Insert the new risk score record.
     * Returns the sys_id of the inserted record.
     */
    _writeScore: function(encSysId, result) {
        var rec = new GlideRecord('x_caresetu_ai_risk_score')
        rec.initialize()
        rec.setValue('encounter',             encSysId)
        rec.setValue('risk_score',            result.score)
        rec.setValue('risk_tier',             result.tier)
        rec.setValue('explanation',           result.explanation)
        rec.setValue('data_quality_warning',  result.dataQualityWarning)
        rec.setValue('is_latest',             true)
        rec.setValue('scored_at',             new GlideDateTime().getValue())
        return rec.insert()
    },

    /**
     * Synchronize or create CareSetu escalation tasks for an encounter.
     *
     * Policy:
     * 1. Active escalations have escalation_status IN ('open', 'acknowledged').
     * 2. If an active escalation exists:
     *    - Synchronize risk_score, risk_tier, reason, description, and short_description
     *      with the latest risk score result, eliminating any stale timing conditions.
     *    - Update priority based on current risk tier (critical=1, high=2, medium=3, normal=4).
     *    - Audit any changes to work_notes preserving full chronological context.
     *    - NEVER silently close or resolve an escalation simply because risk score or tier decreased;
     *      escalations require deliberate coordinator resolution.
     * 3. If NO active escalation exists:
     *    - Create an escalation task ONLY IF current tier is 'high' or 'critical'.
     *    - Sets initial fields, priority, assigns to charge nurse, and logs creation note.
     * 4. Idempotent: multiple calls for the same risk state perform no duplicate writes or inserts.
     */
    _syncEscalation: function(enc, result) {
        var encSysId = enc.getUniqueValue()
        var encNum   = enc.getValue('number')

        var esc = new GlideRecord('x_caresetu_ai_escalation')
        esc.addQuery('encounter', encSysId)
        esc.addQuery('escalation_status', 'IN', 'open,acknowledged')
        esc.orderByDesc('sys_created_on')
        esc.query()

        if (esc.next()) {
            var oldScore  = esc.getValue('risk_score')
            var oldTier   = esc.getValue('risk_tier')
            var oldReason = esc.getValue('reason')

            var scoreChanged  = (oldScore != result.score)
            var tierChanged   = (oldTier !== result.tier)
            var reasonChanged = (oldReason !== result.explanation)

            if (scoreChanged || tierChanged || reasonChanged) {
                esc.setValue('risk_score',        result.score)
                esc.setValue('risk_tier',         result.tier)
                esc.setValue('reason',            result.explanation)
                esc.setValue('description',       result.explanation)
                esc.setValue('short_description',
                    'Discharge risk escalation: ' + encNum + ' [' + result.tier.toUpperCase() + ']')

                var priority = result.tier === 'critical' ? 1
                             : result.tier === 'high'     ? 2
                             : result.tier === 'medium'   ? 3
                             :                              4
                esc.setValue('priority', priority)

                var oldTierDisplay = oldTier ? oldTier.toUpperCase() : 'UNKNOWN'
                var newTierDisplay = result.tier.toUpperCase()
                var auditNote = 'Operational risk rescored: ' + oldScore + ' (' + oldTierDisplay + ') → ' +
                                result.score + ' (' + newTierDisplay + ').\n' +
                                'Updated operational explanation: ' + result.explanation

                if (result.tier !== 'high' && result.tier !== 'critical') {
                    auditNote += '\n[Policy Notice] Operational risk tier is now below escalation threshold (' +
                                 result.tier + '). Escalation remains open for clinical coordinator review and resolution.'
                }

                esc.work_notes = auditNote
                esc.update()

                gs.info('OperationalRiskEngine: synchronized active escalation ' + esc.getValue('number') +
                        ' for encounter ' + encNum + ' (score: ' + oldScore + ' → ' + result.score +
                        ', tier: ' + oldTier + ' → ' + result.tier + ')')
            } else {
                gs.info('OperationalRiskEngine: active escalation ' + esc.getValue('number') +
                        ' for encounter ' + encNum + ' is already up to date.')
            }

            // Suppress and sync any stray duplicate active escalations if they exist
            while (esc.next()) {
                gs.warn('OperationalRiskEngine: duplicate active escalation detected ' + esc.getValue('number') +
                        ' for encounter ' + encNum + ' — synchronizing.')
                esc.setValue('risk_score',  result.score)
                esc.setValue('risk_tier',   result.tier)
                esc.setValue('reason',      result.explanation)
                esc.update()
            }
            return
        }

        // No active escalation exists — only create if high or critical
        if (result.tier === 'high' || result.tier === 'critical') {
            var newEsc = new GlideRecord('x_caresetu_ai_escalation')
            newEsc.initialize()
            newEsc.setValue('encounter',           encSysId)
            newEsc.setValue('risk_score',          result.score)
            newEsc.setValue('risk_tier',           result.tier)
            newEsc.setValue('reason',              result.explanation)
            newEsc.setValue('escalation_status',   'open')
            newEsc.setValue('short_description',
                'Discharge risk escalation: ' + encNum + ' [' + result.tier.toUpperCase() + ']')
            newEsc.setValue('description',         result.explanation)
            newEsc.setValue('priority',            result.tier === 'critical' ? 1 : 2)
            newEsc.setValue('assigned_to',         enc.getValue('charge_nurse'))
            newEsc.work_notes = 'Initial operational risk escalation created: score ' +
                                result.score + ' (' + result.tier.toUpperCase() + ').\n' +
                                'Explanation: ' + result.explanation
            var newEscId = newEsc.insert()

            gs.info('OperationalRiskEngine: escalation task created for encounter ' +
                    encNum + ' [' + result.tier + '], sys_id=' + newEscId)
        }
    },

    _createEscalationTask: function(enc, result) {
        return this._syncEscalation(enc, result)
    },

    type: 'OperationalRiskEngine',
}
