(function process(request, response) {
    /**
     * POST /encounters/{sys_id}/handoffs
     *
     * Creates a new handoff for the encounter and schedules the acknowledgment deadline.
     * Body fields:
     *   - sending_department (required)
     *   - sending_staff (required)
     *   - receiving_department (required)
     *   - summary (required)
     *   - receiving_staff (optional)
     *   - category (optional: shift_change, inter_unit, post_op, discharge_prep, procedure)
     *   - priority (optional: routine, urgent, critical)
     *   - handoff_details (optional)
     */
    var encSysId = request.pathParams.sys_id
    if (!encSysId) {
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

    body.encounter = encSysId

    var engine = new x_caresetu_ai.HandoffEngine()
    var result = engine.createHandoff(body)

    if (!result.success) {
        response.setStatus(400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(201)
    response.setBody({
        sys_id:                  result.sys_id,
        number:                  result.number,
        encounter:               encSysId,
        status:                  'pending_acknowledgment',
        acknowledgment_deadline: result.deadline,
        message:                 'Handoff created. Acknowledgment SLA deadline scheduled.',
    })
})(request, response)
