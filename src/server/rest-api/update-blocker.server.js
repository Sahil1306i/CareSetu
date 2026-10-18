(function process(request, response) {
    /**
     * PATCH /blockers/{sys_id}
     * Updates a blocker's status, resolution notes, or delay estimate.
     * Used by: Fix-It-For-Me (resolve/escalate), manual resolution.
     *
     * Allowed body fields: status, resolution_notes, estimated_delay_minutes,
     *                       department, description, target_resolution_time
     *
     * When status → 'resolved', sets resolution_time to now.
     * After update, sync-blocker-count BR fires to recount and re-predict.
     */
    var blkSysId = request.pathParams.sys_id
    if (!blkSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
        return
    }

    var blk = new GlideRecord('x_caresetu_ai_blocker')
    if (!blk.isValid()) {
        response.setStatus(503)
        response.setBody({ error: 'Blocker table not available.' })
        return
    }

    if (!blk.get(blkSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Blocker not found: ' + blkSysId })
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

    var ALLOWED = ['status', 'resolution_notes', 'estimated_delay_minutes',
                   'department', 'description', 'target_resolution_time']

    var updated = []
    for (var i = 0; i < ALLOWED.length; i++) {
        var field = ALLOWED[i]
        if (body.hasOwnProperty(field)) {
            blk.setValue(field, body[field])
            updated.push(field)
        }
    }

    // Auto-set resolution_time when marking resolved
    if (body.status === 'resolved' && !blk.getValue('resolution_time')) {
        blk.setValue('resolution_time', new GlideDateTime().getValue())
        updated.push('resolution_time')
    }

    if (updated.length === 0) {
        response.setStatus(400)
        response.setBody({ error: 'No updatable fields provided. Allowed: ' + ALLOWED.join(', ') })
        return
    }

    blk.update()

    gs.info('CareSetu API: blocker ' + blkSysId + ' updated fields: ' + updated.join(', '))

    response.setStatus(200)
    response.setBody({
        sys_id:    blkSysId,
        encounter: blk.getValue('encounter'),
        status:    blk.getValue('status'),
        updated:   updated,
        message:   'Blocker updated. open_blockers counter and discharge prediction will update asynchronously.',
    })
})(request, response)
