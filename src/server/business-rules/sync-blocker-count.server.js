(function executeRule(current, previous) {
    /**
     * CareSetu: Sync Blocker Count + Re-predict
     *
     * When a blocker record is inserted or updated:
     *
     * 1. Count all active (open / in_progress / escalated) blocker records
     *    for the parent encounter and write that count back to
     *    encounter.open_blockers. This keeps the OperationalRiskEngine's
     *    signal accurate without manual field maintenance.
     *
     * 2. Invoke DischargePredictionEngine to recompute the discharge
     *    prediction using the updated blocker records.
     *
     * Safety notes:
     *   - ASYNC rule — does not block the blocker save.
     *   - Writing to encounter.open_blockers will trigger the encounter
     *     BRs (risk scoring + prediction), which is desired — a blocker
     *     change should immediately propagate through the full pipeline.
     *   - No loop: encounter BRs do not write to x_caresetu_ai_blocker.
     */
    function syncEncounter(encSysId) {
        if (!encSysId) return

        // ── Step 1: Recount active blockers ──────────────────────────────────
        var activeCount = new GlideAggregate('x_caresetu_ai_blocker')
        activeCount.addQuery('encounter', encSysId)
        activeCount.addQuery('status', 'IN', 'open,in_progress,escalated')
        activeCount.addAggregate('COUNT')
        activeCount.query()

        var newCount = 0
        if (activeCount.next()) {
            newCount = parseInt(activeCount.getAggregate('COUNT'), 10) || 0
        }

        // ── Step 2: Update encounter.open_blockers ────────────────────────────
        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (enc.get(encSysId)) {
            var currentCount = parseInt(enc.getValue('open_blockers'), 10) || 0
            if (currentCount !== newCount) {
                enc.setValue('open_blockers', newCount)
                enc.update()
                gs.info('CareSetu sync-blocker-count: encounter ' + enc.getValue('number') +
                        ' open_blockers synced from ' + currentCount + ' to ' + newCount)
            }
        }

        // ── Step 3: Re-predict discharge ─────────────────────────────────────
        var engine = new x_caresetu_ai.DischargePredictionEngine()
        engine.predictDischarge(encSysId)
    }

    var currEnc = current ? current.getValue('encounter') : null
    var prevEnc = previous ? previous.getValue('encounter') : null

    if (currEnc) {
        syncEncounter(currEnc)
    }
    if (prevEnc && prevEnc !== currEnc) {
        syncEncounter(prevEnc)
    }
})(current, previous)
