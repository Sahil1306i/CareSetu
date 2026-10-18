(function executeRule(current, previous) {
    /**
     * CareSetu: Async Operational Risk Computation
     *
     * Invokes OperationalRiskEngine.scoreEncounter() after any encounter insert or update.
     *
     * Safety notes:
     *   - This is an ASYNC rule — runs after the save, does not block the transaction.
     *   - OperationalRiskEngine does NOT update the encounter record, preventing recursion.
     *   - The engine writes to x_caresetu_ai_risk_score (different table) — no BR loop risk.
     */
    var engine = new x_caresetu_ai.OperationalRiskEngine()
    engine.scoreEncounter(current.getUniqueValue())
})(current, previous)
