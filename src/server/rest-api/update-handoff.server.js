(function process(request, response) {
    /**
     * PATCH /handoffs/{sys_id}
     *
     * Updates permitted fields on a handoff record:
     *   receiving_staff, handoff_details, resolution_notes, summary, priority
     */
    var handoffSysId = request.pathParams.sys_id
    if (!handoffSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required.' })
        return
    }

    var gr = new GlideRecord('x_caresetu_ai_handoff')
    if (!gr.get(handoffSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Handoff record not found: ' + handoffSysId })
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

    var ALLOWED = ['receiving_staff', 'handoff_details', 'resolution_notes', 'summary', 'priority']
    var updated = []

    for (var i = 0; i < ALLOWED.length; i++) {
        var field = ALLOWED[i]
        if (body.hasOwnProperty(field)) {
            gr.setValue(field, body[field])
            updated.push(field)
        }
    }

    if (updated.length === 0) {
        response.setStatus(400)
        response.setBody({ error: 'No updatable fields provided. Allowed: ' + ALLOWED.join(', ') })
        return
    }

    gr.update()

    gs.info('CareSetu Handoff API: updated ' + gr.getValue('number') + ' fields: ' + updated.join(', '))

    response.setStatus(200)
    response.setBody({
        sys_id:  handoffSysId,
        number:  gr.getValue('number'),
        updated: updated,
        message: 'Handoff updated successfully.',
    })
})(request, response)
