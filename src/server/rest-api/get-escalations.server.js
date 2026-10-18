(function process(request, response) {
    /**
     * GET /encounters/{sys_id}/escalations
     *
     * Returns all escalation task records for a specific encounter.
     * Used by ATF tests to assert escalation presence/absence.
     *
     * Path params: sys_id — sys_id of the x_caresetu_ai_encounter record.
     *
     * Response shape (200):
     *   { count: number, escalations: Array<{ escalation_sys_id, encounter,
     *     number, risk_score, risk_tier, reason, escalation_status, created_at }> }
     *
     * Response shape (400): { error: string }
     */
    var sysId = request.pathParams.sys_id

    if (!sysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required.' })
        return
    }

    var results = []

    var gr = new GlideRecord('x_caresetu_ai_escalation')
    gr.addQuery('encounter', sysId)
    gr.orderByDesc('sys_created_on')
    gr.query()

    while (gr.next()) {
        results.push({
            escalation_sys_id: gr.getUniqueValue(),
            encounter:         gr.getValue('encounter'),
            number:            gr.getValue('number'),
            risk_score:        parseFloat(gr.getValue('risk_score')),
            risk_tier:         gr.getValue('risk_tier'),
            reason:            gr.getValue('reason'),
            escalation_status: gr.getValue('escalation_status'),
            created_at:        gr.getDisplayValue('sys_created_on'),
            assigned_to:       gr.getDisplayValue('assigned_to'),
        })
    }

    response.setBody({ count: results.length, escalations: results })
})(request, response)
