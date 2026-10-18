(function process(request, response) {
    /**
     * POST /encounters/{sys_id}/predict
     * Synchronously re-runs DischargePredictionEngine and returns the result.
     * Used by the frontend "refresh prediction" action.
     */
    var encSysId = request.pathParams.sys_id
    if (!encSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
        return
    }

    var enc = new GlideRecord('x_caresetu_ai_encounter')
    if (!enc.get(encSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Encounter not found: ' + encSysId })
        return
    }

    var engine = new x_caresetu_ai.DischargePredictionEngine()
    engine.predictDischarge(encSysId)

    // Read back the freshly written prediction
    var pred = new GlideRecord('x_caresetu_ai_discharge_prediction')
    pred.addQuery('encounter', encSysId)
    pred.addQuery('is_latest', 'true')
    pred.orderByDesc('predicted_at')
    pred.setLimit(1)
    pred.query()

    if (!pred.next()) {
        response.setStatus(200)
        response.setBody({ encounter: encSysId, message: 'Prediction computed but result not available. Table may still be deploying.' })
        return
    }

    var breakdownRaw = pred.getValue('prediction_breakdown') || '[]'
    var breakdown    = []
    try { breakdown = JSON.parse(breakdownRaw) } catch(e) {}

    response.setStatus(200)
    response.setBody({
        encounter:               encSysId,
        encounter_number:        enc.getValue('number'),
        promised_discharge_time: pred.getDisplayValue('promised_discharge_time'),
        predicted_discharge_time:pred.getDisplayValue('predicted_discharge_time'),
        predicted_delay_minutes: parseInt(pred.getValue('predicted_delay_minutes'), 10) || 0,
        breakdown:               breakdown,
        explanation:             pred.getValue('explanation'),
        predicted_at:            pred.getDisplayValue('predicted_at'),
        sys_id:                  pred.getUniqueValue(),
    })
})(request, response)
