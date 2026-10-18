(function process(request, response) {
    /**
     * POST /handoffs/{sys_id}/acknowledge
     *
     * Acknowledges responsibility for the handoff.
     * Request body:
     *   - staff_sys_id (optional: user accepting handoff)
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

    var staffSysId = body.staff_sys_id || gs.getUserID()
    var notes = body.notes || ''

    var engine = new x_caresetu_ai.HandoffEngine()
    var result = engine.acknowledgeHandoff(handoffSysId, staffSysId, notes)

    if (!result.success) {
        response.setStatus(400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(200)
    response.setBody({
        sys_id:            handoffSysId,
        status:            result.status,
        acknowledged_time: result.acknowledged_time,
        message:           'Handoff acknowledged. Active status recorded and blockers cleared.',
    })
})(request, response)
