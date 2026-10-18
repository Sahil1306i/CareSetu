(function process(request, response) {
    /**
     * GET /encounters/{sys_id}/blockers
     * Returns all operational blocker records for the specified encounter.
     * Default: all non-resolved blockers. Pass ?include_resolved=true for all.
     */
    var encSysId        = request.pathParams.sys_id
    var includeResolved = request.queryParams.include_resolved === 'true'

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

    var blk = new GlideRecord('x_caresetu_ai_blocker')
    if (!blk.isValid()) {
        response.setStatus(503)
        response.setBody({ error: 'Blocker table not available. Deploy may be pending.' })
        return
    }

    blk.addQuery('encounter', encSysId)
    if (!includeResolved) {
        blk.addQuery('status', 'IN', 'open,in_progress,escalated')
    }
    blk.orderBy('category')
    blk.query()

    var blockers = []
    while (blk.next()) {
        blockers.push({
            sys_id:                  blk.getUniqueValue(),
            number:                  blk.getValue('number'),
            category:                blk.getValue('category'),
            category_label:          blk.getDisplayValue('category'),
            department:              blk.getValue('department'),
            owner:                   blk.getDisplayValue('owner'),
            owner_sys_id:            blk.getValue('owner'),
            status:                  blk.getValue('status'),
            status_label:            blk.getDisplayValue('status'),
            is_overdue:              blk.getValue('is_overdue') === 'true',
            estimated_delay_minutes: parseInt(blk.getValue('estimated_delay_minutes'), 10) || 0,
            target_resolution_time:  blk.getDisplayValue('target_resolution_time'),
            resolution_time:         blk.getDisplayValue('resolution_time'),
            description:             blk.getValue('description'),
            resolution_notes:        blk.getValue('resolution_notes'),
            sys_created_on:          blk.getDisplayValue('sys_created_on'),
            sys_updated_on:          blk.getDisplayValue('sys_updated_on'),
        })
    }

    response.setStatus(200)
    response.setBody({
        encounter:        encSysId,
        encounter_number: enc.getValue('number'),
        count:            blockers.length,
        blockers:         blockers,
    })
})(request, response)
