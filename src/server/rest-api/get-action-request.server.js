(function process(request, response) {
    /**
     * GET /api/x_caresetu_ai/actions/requests/{sys_id}
     *
     * Retrieves a single action request with parameters, snapshot, and audit details.
     */
    try {
        var sysId = request.pathParams.sys_id
        if (!sysId) {
            response.setStatus(400)
            response.setBody({ success: false, error: 'sys_id path parameter is required.' })
            return
        }

        var engine = new x_caresetu_ai.ActionExecutionEngine()
        var detail = engine.getRequest(sysId)

        if (!detail) {
            response.setStatus(404)
            response.setBody({ success: false, error: 'Action request not found: ' + sysId })
            return
        }

        response.setStatus(200)
        response.setBody({ success: true, request: detail })
    } catch (e) {
        gs.error('CareSetu get-action-request API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error getting action request: ' + e.message })
    }
})(request, response)
