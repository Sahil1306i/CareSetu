(function process(request, response) {
    /**
     * POST /api/x_caresetu_ai/actions/requests/{sys_id}/reject
     *
     * Rejects an action request with an auditable reason.
     * Target record remains untouched.
     *
     * Request body (JSON):
     *   { "reason"?: string }
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

        var reason = body.reason || 'Rejected by operational coordinator.'

        var engine = new x_caresetu_ai.ActionExecutionEngine()
        var result = engine.rejectAction(sysId, gs.getUserID(), reason)

        if (!result.success) {
            response.setStatus(400)
            response.setBody(result)
            return
        }

        response.setStatus(200)
        response.setBody(result)
    } catch (e) {
        gs.error('CareSetu reject-action-request API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error rejecting action request: ' + e.message })
    }
})(request, response)
