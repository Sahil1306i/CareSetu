(function executeRule(current, previous) {
    /**
     * CareSetu: Async Discharge Prediction Trigger
     *
     * Invokes DischargePredictionEngine.predictDischarge() after any
     * encounter insert or update.
     *
     * Safety notes:
     *   - ASYNC rule — runs after the save, does not block the transaction.
     *   - DischargePredictionEngine writes ONLY to x_caresetu_ai_discharge_prediction.
     *   - It never updates the encounter record — no recursive BR loop.
     */
    var engine = new x_caresetu_ai.DischargePredictionEngine()
    engine.predictDischarge(current.getUniqueValue())
})(current, previous)
