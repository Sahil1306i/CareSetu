(function process(request, response) {
    /**
     * GET /api/x_caresetu_ai/actions/requests/{sys_id}/result
     *
     * Retrieves the verified execution result of an action request.
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
        response.setBody({
            success:          true,
            request_id:       sysId,
            number:           detail.number,
            status:           detail.status,
            action_type:      detail.action_type,
            executed_by:      detail.executed_by,
            execution_time:   detail.execution_time,
            execution_result: detail.execution_result,
            failure_reason:   detail.failure_reason,
        })
    } catch (e) {
        gs.error('CareSetu get-action-result API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error getting action result: ' + e.message })
    }
})(request, response)
