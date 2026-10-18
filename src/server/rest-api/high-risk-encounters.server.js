(function process(request, response) {
    /**
     * GET /encounters/high-risk
     *
     * Returns all patient encounters whose latest risk score has a tier
     * of 'high' or 'critical', ordered by risk score descending.
     *
     * Response shape:
     *   { count: number, results: Array<{ score_sys_id, encounter_sys_id,
     *     encounter_number, ward, risk_score, risk_tier, explanation,
     *     data_quality_warning, scored_at }> }
     */
    var results = []

    var gr = new GlideRecord('x_caresetu_ai_risk_score')
    gr.addQuery('is_latest', true)
    gr.addQuery('risk_tier', 'IN', 'high,critical')
    gr.orderByDesc('risk_score')
    gr.setLimit(200)
    gr.query()

    while (gr.next()) {
        results.push({
            score_sys_id:         gr.getUniqueValue(),
            encounter_sys_id:     gr.getValue('encounter'),
            encounter_number:     gr.getDisplayValue('encounter.number'),
            ward:                 gr.getDisplayValue('encounter.ward'),
            risk_score:           parseFloat(gr.getValue('risk_score')),
            risk_tier:            gr.getValue('risk_tier'),
            explanation:          gr.getValue('explanation'),
            data_quality_warning: gr.getValue('data_quality_warning') || '',
            scored_at:            gr.getDisplayValue('scored_at'),
        })
    }

    response.setBody({ count: results.length, results: results })
})(request, response)
