/**
 * DischargePredictionEngine — CareSetu AI
 *
 * Deterministic discharge delay predictor.
 *
 * IMPORTANT:
 * - Do NOT import from @servicenow/glide — Glide APIs are auto-available.
 * - Algorithm is STRICTLY OPERATIONAL: no clinical data, no AI/LLM inference.
 * - Does NOT write to x_caresetu_ai_encounter (avoids triggering BR loop).
 *
 * Constants — default delay per signal type (minutes):
 *   Used when the encounter has no individual blocker records for that category.
 *   These are the "typical" delays seen in the hospital operational context.
 */
var DischargePredictionEngine = Class.create()
DischargePredictionEngine.prototype = {
    initialize: function() {},

    // ── Delay constants ───────────────────────────────────────────────────────
    // Default delay per signal when no specific blocker record is available.
    // Intentionally transparent and easy to tune.
    CATEGORY_DEFAULT_DELAY: {
        tpa:           45,  // TPA/Insurance auth typically takes 45 min
        pharmacy:      20,  // Pharmacy discharge meds typically 20 min
        handoff:       15,  // Handoff acknowledgement typically 15 min
        transport:     30,  // Transport arrangement typically 30 min
        equipment:     25,  // Equipment sourcing typically 25 min
        documentation: 15,  // Documentation completion typically 15 min
        coordination:  20,  // Coordination task resolution typically 20 min
        other:         20,  // Unknown blocker type, use 20 min
    },
    COORD_TASK_DELAY_MINUTES:   15, // Per overdue coordination task
    HANDOFF_DELAY_MINUTES:      15, // Per unacknowledged handoff
    MILESTONE_DELAY_MINUTES:    10, // Per incomplete discharge milestone

    // ── Public entry point ────────────────────────────────────────────────────
    /**
     * Compute and persist the discharge prediction for an encounter.
     * @param {string} encSysId - sys_id of x_caresetu_ai_encounter
     */
    predictDischarge: function(encSysId) {
        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (!enc.get(encSysId)) {
            gs.error('DischargePredictionEngine: encounter not found — ' + encSysId)
            return
        }

        var prediction = this._computePrediction(enc)
        this._archivePreviousPredictions(encSysId)
        this._writePrediction(encSysId, prediction)

        gs.info('DischargePredictionEngine: predicted for ' + enc.getValue('number') +
                ' → delay=' + prediction.total_delay_minutes + 'min' +
                ' predicted=' + prediction.predicted_discharge_time)
    },

    /**
     * Compute the prediction without persisting.
     * Returns raw prediction object for REST API/UI use.
     * @param {string} encSysId
     * @returns {object} prediction result
     */
    computeOnly: function(encSysId) {
        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (!enc.get(encSysId)) {
            return { error: 'Encounter not found: ' + encSysId }
        }
        return this._computePrediction(enc)
    },

    // ── Core prediction logic ─────────────────────────────────────────────────
    /**
     * Compute the discharge prediction from encounter + open blockers.
     * Returns { promised_discharge_time, predicted_discharge_time,
     *           total_delay_minutes, breakdown, explanation }
     */
    _computePrediction: function(enc) {
        // ── Step 1: Resolve baseline (promised or expected) ──────────────────
        var promisedRaw = enc.getValue('promised_discharge_time')
        var expectedRaw = enc.getValue('expected_discharge_time')

        // Use promised if available, fall back to expected
        var baselineRaw = promisedRaw || expectedRaw
        var baselineMs  = null
        var baselineDisplay = 'Not set'

        if (baselineRaw) {
            var baseline = new GlideDateTime()
            baseline.setDisplayValue(enc.getDisplayValue(promisedRaw
                ? 'promised_discharge_time'
                : 'expected_discharge_time'))
            baselineMs      = baseline.getNumericValue()
            baselineDisplay = baseline.getDisplayValue()
        }

        // ── Step 2: Collect delay breakdown ──────────────────────────────────
        var breakdown = []
        var totalDelay = 0

        // 2a: Active blocker records (individual, category-specific)
        var blockerCategorySeen = {}
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        if (blk.isValid()) {
            blk.addQuery('encounter', enc.getUniqueValue())
            blk.addQuery('status', 'IN', 'open,in_progress,escalated')
            blk.query()
            while (blk.next()) {
                var cat = blk.getValue('category') || 'other'
                var catLabel = blk.getDisplayValue('category') || 'Other'
                var delayMin = parseInt(blk.getValue('estimated_delay_minutes'), 10) || 0

                // If the blocker has no delay estimate, use category default
                if (delayMin === 0) {
                    delayMin = this.CATEGORY_DEFAULT_DELAY[cat] || this.CATEGORY_DEFAULT_DELAY['other']
                    blk.setValue('estimated_delay_minutes', delayMin)
                    blk.update()
                }

                totalDelay += delayMin
                blockerCategorySeen[cat] = true
                breakdown.push({ category: cat, label: catLabel, delay_minutes: delayMin, source: 'blocker_record' })
            }
        }

        // 2b: Coordination signals (overdue tasks, handoffs, milestones)
        //     Only add if not already covered by a blocker record for that category
        var overdueCoordTasks    = parseInt(enc.getValue('overdue_coord_tasks'), 10)    || 0
        var unackHandoffs        = parseInt(enc.getValue('unack_handoffs'), 10)         || 0
        var incompleteMilestones = parseInt(enc.getValue('incomplete_milestones'), 10)  || 0

        if (overdueCoordTasks > 0 && !blockerCategorySeen['coordination']) {
            var coordDelay = overdueCoordTasks * this.COORD_TASK_DELAY_MINUTES
            totalDelay += coordDelay
            breakdown.push({
                category: 'coordination',
                label: 'Coordination Tasks (' + overdueCoordTasks + ' overdue)',
                delay_minutes: coordDelay,
                source: 'signal',
            })
        }

        if (unackHandoffs > 0 && !blockerCategorySeen['handoff']) {
            var handoffDelay = unackHandoffs * this.HANDOFF_DELAY_MINUTES
            totalDelay += handoffDelay
            breakdown.push({
                category: 'handoff',
                label: 'Handoffs (' + unackHandoffs + ' unacknowledged)',
                delay_minutes: handoffDelay,
                source: 'signal',
            })
        }

        if (incompleteMilestones > 0) {
            var milestoneDelay = incompleteMilestones * this.MILESTONE_DELAY_MINUTES
            totalDelay += milestoneDelay
            breakdown.push({
                category: 'documentation',
                label: 'Discharge Milestones (' + incompleteMilestones + ' incomplete)',
                delay_minutes: milestoneDelay,
                source: 'signal',
            })
        }

        // Sort breakdown by delay descending (largest contributor first)
        breakdown.sort(function(a, b) { return b.delay_minutes - a.delay_minutes })

        // ── Step 3: Compute predicted time ────────────────────────────────────
        var predictedDisplay = 'Unknown'
        var predictedMs = null

        if (baselineMs !== null) {
            predictedMs = baselineMs + totalDelay * 60000
            var predictedGdt = new GlideDateTime()
            predictedGdt.setNumericValue(predictedMs)
            predictedDisplay = predictedGdt.getDisplayValue()
        }

        // ── Step 4: Build explanation ─────────────────────────────────────────
        var explanationParts = []
        if (baselineMs === null) {
            explanationParts.push('No promised or expected discharge time is set. Prediction requires a baseline discharge time.')
        } else if (totalDelay === 0) {
            explanationParts.push('No active blockers or overdue signals. Discharge is predicted on time.')
        } else {
            explanationParts.push('Total predicted delay: ' + totalDelay + ' minutes.')
            for (var i = 0; i < breakdown.length; i++) {
                explanationParts.push(breakdown[i].label + ': +' + breakdown[i].delay_minutes + 'm')
            }
        }

        return {
            promised_discharge_time:  baselineDisplay,
            predicted_discharge_time: predictedDisplay,
            total_delay_minutes:      totalDelay,
            breakdown:                breakdown,
            explanation:              explanationParts.join(' | '),
            has_baseline:             baselineMs !== null,
        }
    },

    // ── Persistence helpers ───────────────────────────────────────────────────
    _archivePreviousPredictions: function(encSysId) {
        var prev = new GlideRecord('x_caresetu_ai_discharge_prediction')
        if (!prev.isValid()) return
        prev.addQuery('encounter', encSysId)
        prev.addQuery('is_latest', 'true')
        prev.query()
        while (prev.next()) {
            prev.setValue('is_latest', 'false')
            prev.update()
        }
    },

    _writePrediction: function(encSysId, prediction) {
        var pred = new GlideRecord('x_caresetu_ai_discharge_prediction')
        if (!pred.isValid()) {
            gs.warn('DischargePredictionEngine: x_caresetu_ai_discharge_prediction not found — skipping write.')
            return
        }
        pred.initialize()
        pred.setValue('encounter',                encSysId)
        pred.setValue('promised_discharge_time',  prediction.promised_discharge_time !== 'Not set' ? prediction.promised_discharge_time : '')
        pred.setValue('predicted_discharge_time', prediction.predicted_discharge_time !== 'Unknown' ? prediction.predicted_discharge_time : '')
        pred.setValue('predicted_delay_minutes',  prediction.total_delay_minutes)
        pred.setValue('prediction_breakdown',     JSON.stringify(prediction.breakdown))
        pred.setValue('explanation',              prediction.explanation)
        pred.setValue('is_latest',               'true')
        pred.setValue('predicted_at',            new GlideDateTime().getValue())
        pred.insert()
    },

    type: 'DischargePredictionEngine',
}
