(function process(request, response) {
    /**
     * POST /api/x_caresetu_ai/actions/requests/{sys_id}/approve
     *
     * Approves and executes a proposed action request.
     * Enforces human authorization, validates current record state, executes handler,
     * and records execution outcome.
     *
     * Request body (optional JSON):
     *   { "notes"?: string }
     */
    try {
        var sysId = request.pathParams.sys_id
        if (!sysId) {
            response.setStatus(400)
            response.setBody({ success: false, error: 'sys_id path parameter is required.' })
            return
        }

        var body = request.body.data || {}
        if (typeof body === 'string') {
            try { body = JSON.parse(body) } catch (_) { body = {} }
        }

        var notes = body.notes || ''

        var engine = new x_caresetu_ai.ActionExecutionEngine()
        var result = engine.approveAndExecute(sysId, gs.getUserID(), notes)

        if (!result.success) {
            if (result.error && result.error.indexOf('Unauthorized') !== -1) {
                response.setStatus(403)
            } else if (result.error && result.error.indexOf('not found') !== -1) {
                response.setStatus(404)
            } else {
                response.setStatus(422)
            }
            response.setBody(result)
            return
        }

        response.setStatus(200)
        response.setBody(result)
    } catch (e) {
        gs.error('CareSetu approve-action-request API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error approving action request: ' + e.message })
    }
})(request, response)
