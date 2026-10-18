(function () {
    /**
     * CareSetu: TPA Follow-Up Chaser
     *
     * Hourly scheduled script. Calls TpaChaseEngine.processOverdueCases().
     *
     * What it does:
     *   - Queries all active TPA cases where next_followup_due <= now().
     *   - Marks each overdue case (is_overdue = true).
     *   - Ensures exactly one active TPA blocker per overdue encounter.
     *     (Idempotent — will NOT create duplicate blockers on re-run.)
     *   - Blocker insert/update triggers the existing sync-blocker-count BR,
     *     which re-runs DischargePredictionEngine automatically.
     *
     * No external service calls. No clinical data. Pure operational records.
     */
    try {
        var engine = new x_caresetu_ai.TpaChaseEngine()
        var result = engine.processOverdueCases()
        gs.info('CareSetu TPA Chaser: complete. processed=' + result.processed +
                ' blocked=' + result.blocked + ' errors=' + result.errors)
    } catch (e) {
        gs.error('CareSetu TPA Chaser: unhandled error — ' + e.message)
    }
})()
