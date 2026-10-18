(function () {
    /**
     * CareSetu: Smart Handoff Overdue Chaser
     *
     * Periodically sweeps active unacknowledged handoffs whose acknowledgment deadline has passed.
     * Escalates breaching handoffs and creates operational blockers.
     */
    try {
        var engine = new x_caresetu_ai.HandoffEngine()
        var result = engine.processOverdueHandoffs()
        gs.info('CareSetu handoff-overdue-chaser finished: processed=' + result.processed +
                ' escalated=' + result.escalated + ' errors=' + result.errors)
    } catch (e) {
        gs.error('CareSetu handoff-overdue-chaser failed: ' + e.message)
    }
})()
