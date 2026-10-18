(function process(request, response) {
    /**
     * POST /encounters/{sys_id}/score
     *
     * Synchronously scores a specific encounter on demand.
     * Invokes OperationalRiskEngine.scoreEncounter() and returns
     * the freshly written risk score record.
     *
     * Path params: sys_id — sys_id of the x_caresetu_ai_encounter record.
     *
     * Response shape (200):
     *   { status: 'scored', encounter: string, risk_score: number,
     *     risk_tier: string, explanation: string,
     *     data_quality_warning: string, scored_at: string }
     *
     * Response shape (400): { error: string }
     * Response shape (500): { error: string }
     */
    var sysId = request.pathParams.sys_id

    if (!sysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required.' })
        return
    }

    // Verify encounter exists
    var encCheck = new GlideRecord('x_caresetu_ai_encounter')
    if (!encCheck.get(sysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Encounter not found: ' + sysId })
        return
    }

    try {
        var engine = new x_caresetu_ai.OperationalRiskEngine()
        engine.scoreEncounter(sysId)

        // Read back the freshly written score
        var score = new GlideRecord('x_caresetu_ai_risk_score')
        score.addQuery('encounter', sysId)
        score.addQuery('is_latest', true)
        score.setLimit(1)
        score.query()

        if (score.next()) {
            response.setBody({
                status:               'scored',
                encounter:            sysId,
                risk_score:           parseFloat(score.getValue('risk_score')),
                risk_tier:            score.getValue('risk_tier'),
                explanation:          score.getValue('explanation'),
                data_quality_warning: score.getValue('data_quality_warning') || '',
                scored_at:            score.getDisplayValue('scored_at'),
            })
        } else {
            response.setBody({ status: 'scored', encounter: sysId, risk_score: null })
        }
    } catch (e) {
        gs.error('CareSetu REST score-encounter error: ' + e.message)
        response.setStatus(500)
        response.setBody({ error: 'Scoring failed. Check platform application logs.' })
    }
})(request, response)
