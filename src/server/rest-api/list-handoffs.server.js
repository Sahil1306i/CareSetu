(function process(request, response) {
    /**
     * GET /encounters/{sys_id}/handoffs
     *
     * Returns all handoffs for the specified encounter.
     * Query param: ?status=pending_acknowledgment,escalated (optional comma-separated filter)
     */
    var encSysId = request.pathParams.sys_id
    if (!encSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required.' })
        return
    }

    var enc = new GlideRecord('x_caresetu_ai_encounter')
    if (!enc.get(encSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'Encounter not found: ' + encSysId })
        return
    }

    var gr = new GlideRecord('x_caresetu_ai_handoff')
    gr.addQuery('encounter', encSysId)

    var statusParam = request.queryParams.status
    if (statusParam && statusParam[0]) {
        var statuses = statusParam[0].split(',')
        gr.addQuery('status', 'IN', statuses.join(','))
    }

    gr.orderByDesc('sys_created_on')
    gr.query()

    var handoffs = []
    while (gr.next()) {
        handoffs.push({
            sys_id:                  gr.getUniqueValue(),
            number:                  gr.getValue('number'),
            sending_department:      gr.getValue('sending_department'),
            sending_staff:           gr.getValue('sending_staff'),
            sending_staff_name:      gr.getDisplayValue('sending_staff'),
            receiving_department:    gr.getValue('receiving_department'),
            receiving_staff:         gr.getValue('receiving_staff'),
            receiving_staff_name:    gr.getDisplayValue('receiving_staff'),
            category:                gr.getValue('category'),
            category_label:          gr.getDisplayValue('category'),
            priority:                gr.getValue('priority'),
            priority_label:          gr.getDisplayValue('priority'),
            summary:                 gr.getValue('summary'),
            handoff_details:         gr.getValue('handoff_details'),
            status:                  gr.getValue('status'),
            status_label:            gr.getDisplayValue('status'),
            creation_time:           gr.getValue('creation_time'),
            acknowledgment_deadline: gr.getValue('acknowledgment_deadline'),
            acknowledged_time:       gr.getValue('acknowledged_time'),
            completion_time:         gr.getValue('completion_time'),
            is_overdue:              gr.getValue('is_overdue') === 'true' || gr.getValue('is_overdue') === '1',
            rejection_reason:        gr.getValue('rejection_reason'),
            linked_blocker:          gr.getValue('linked_blocker'),
            linked_blocker_number:   gr.getDisplayValue('linked_blocker'),
            sys_created_on:          gr.getValue('sys_created_on'),
        })
    }

    response.setStatus(200)
    response.setBody({
        encounter:        encSysId,
        encounter_number: enc.getValue('number'),
        count:            handoffs.length,
        handoffs:         handoffs,
    })
})(request, response)
