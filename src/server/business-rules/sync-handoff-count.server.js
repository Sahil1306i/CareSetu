(function executeRule(current, previous) {
    /**
     * CareSetu: Sync Handoff Count
     *
     * Asynchronously counts all active, unacknowledged handoffs for the parent encounter
     * and updates encounter.unack_handoffs.
     * This ensures OperationalRiskEngine and DischargePredictionEngine always have
     * the real-time handoff state.
     */
    var encSysId = current.getValue('encounter') || (previous && previous.getValue('encounter'))
    if (!encSysId) {
        gs.warn('CareSetu sync-handoff-count: no encounter reference on handoff record')
        return
    }

    var engine = new x_caresetu_ai.HandoffEngine()
    engine.syncEncounterUnackCount(encSysId)
})(current, previous)
