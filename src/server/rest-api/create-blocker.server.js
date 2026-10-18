(function process(request, response) {
    /**
     * POST /encounters/{sys_id}/blockers
     * Creates a new operational blocker record for the encounter.
     * Required body: { category }
     * Optional body: { department, description, estimated_delay_minutes, target_resolution_time }
     *
     * After insert, the sync-blocker-count BR will automatically:
     *   - Recount and update encounter.open_blockers
     *   - Re-run DischargePredictionEngine
     */
    var encSysId = request.pathParams.sys_id
    if (!encSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
        return
    }

    var enc = new GlideRecord('x_caresetu_ai_encounter')
    if (!enc.get(encSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Encounter not found: ' + encSysId })
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

    if (!body.category) {
        response.setStatus(400)
        response.setBody({ error: 'category is required. Valid values: tpa, pharmacy, handoff, transport, equipment, documentation, coordination, other' })
        return
    }

    var blk = new GlideRecord('x_caresetu_ai_blocker')
    blk.initialize()
    blk.setValue('encounter',               encSysId)
    blk.setValue('category',                body.category)
    blk.setValue('status',                  'open')
    blk.setValue('department',              body.department              || '')
    blk.setValue('description',             body.description             || '')
    blk.setValue('estimated_delay_minutes', body.estimated_delay_minutes || 0)
    if (body.target_resolution_time) {
        blk.setValue('target_resolution_time', body.target_resolution_time)
    }

    var newSysId = blk.insert()

    if (!newSysId) {
        response.setStatus(500)
        response.setBody({ error: 'Failed to insert blocker record.' })
        return
    }

    gs.info('CareSetu API: blocker created for encounter ' + enc.getValue('number') +
            ' category=' + body.category + ' sys_id=' + newSysId)

    response.setStatus(201)
    response.setBody({
        sys_id:           newSysId,
        encounter:        encSysId,
        encounter_number: enc.getValue('number'),
        category:         body.category,
        status:           'open',
        message:          'Blocker created. open_blockers counter and discharge prediction will update asynchronously.',
    })
})(request, response)
