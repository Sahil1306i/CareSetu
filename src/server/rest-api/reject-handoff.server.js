(function process(request, response) {
    /**
     * POST /handoffs/{sys_id}/reject
     *
     * Rejects an unacknowledged handoff with mandatory reason.
     * Escalates handoff and flags operational blocker.
     * Request body:
     *   - reason (required)
     *   - staff_sys_id (optional)
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

    if (!body.reason) {
        response.setStatus(400)
        response.setBody({ error: 'reason is required to reject a handoff.' })
        return
    }

    var staffSysId = body.staff_sys_id || gs.getUserID()

    var engine = new x_caresetu_ai.HandoffEngine()
    var result = engine.rejectHandoff(handoffSysId, staffSysId, body.reason)

    if (!result.success) {
        response.setStatus(400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(200)
    response.setBody({
        sys_id:           handoffSysId,
        status:           result.status,
        rejection_reason: result.rejection_reason,
        message:          'Handoff rejected and escalated to coordination blockers.',
    })
})(request, response)
