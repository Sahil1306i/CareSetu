(function process(request, response) {
    /**
     * GET /encounters/{sys_id}/prediction
     * Returns the latest discharge prediction for the specified encounter.
     */
    var encSysId = request.pathParams.sys_id
    if (!encSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
        return
    }

    // Verify encounter exists
    var enc = new GlideRecord('x_caresetu_ai_encounter')
    if (!enc.get(encSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Encounter not found: ' + encSysId })
        return
    }

    // Get latest prediction record
    var pred = new GlideRecord('x_caresetu_ai_discharge_prediction')
    if (!pred.isValid()) {
        response.setStatus(503)
        response.setBody({ error: 'Prediction table not available. Deploy may be pending.' })
        return
    }

    pred.addQuery('encounter', encSysId)
    pred.addQuery('is_latest', 'true')
    pred.orderByDesc('predicted_at')
    pred.setLimit(1)
    pred.query()

    if (!pred.next()) {
        // No prediction yet — compute on the fly
        var engine = new x_caresetu_ai.DischargePredictionEngine()
        var result  = engine.computeOnly(encSysId)
        response.setStatus(200)
        response.setBody({
            encounter:               encSysId,
            encounter_number:        enc.getValue('number'),
            promised_discharge_time: result.promised_discharge_time,
            predicted_discharge_time:result.predicted_discharge_time,
            predicted_delay_minutes: result.total_delay_minutes,
            breakdown:               result.breakdown,
            explanation:             result.explanation,
            is_latest:               false,
            predicted_at:            null,
            _computed_on_demand:     true,
        })
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
        is_latest:               true,
        predicted_at:            pred.getDisplayValue('predicted_at'),
        sys_id:                  pred.getUniqueValue(),
    })
})(request, response)
