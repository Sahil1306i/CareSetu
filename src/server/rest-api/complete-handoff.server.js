(function process(request, response) {
    /**
     * POST /handoffs/{sys_id}/complete
     *
     * Marks an acknowledged or in-progress handoff as completed.
     * Request body:
     *   - notes (optional)
     */
    var handoffSysId = request.pathParams.sys_id
    if (!handoffSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required.' })
        return
    }

    var body = {}
    try {
        body = JSON.parse(request.body.dataString || '{}')
    } catch (e) {
        response.setStatus(400)
        response.setBody({ error: 'Invalid JSON body: ' + e.message })
        return
    }

    var engine = new x_caresetu_ai.HandoffEngine()
    var result = engine.completeHandoff(handoffSysId, body.notes)

    if (!result.success) {
        response.setStatus(400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(200)
    response.setBody({
        sys_id:          handoffSysId,
        status:          result.status,
        completion_time: result.completion_time,
        message:         'Handoff marked completed.',
    })
})(request, response)
