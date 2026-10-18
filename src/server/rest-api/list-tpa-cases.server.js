(function process(request, response) {
    /**
     * GET /encounters/{sys_id}/tpa-cases
     *
     * Returns all TPA/insurance cases for the encounter.
     * Optional query param: ?status=submitted,under_review (comma-separated filter)
     *
     * Response: { count, cases: [...] }
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

    var statusFilter = (request.queryParams && request.queryParams.status) ? request.queryParams.status : null

    var gr = new GlideRecord('x_caresetu_ai_tpa_case')
    gr.addQuery('encounter', encSysId)
    if (statusFilter) {
        gr.addQuery('status', 'IN', statusFilter)
    }
    gr.orderByDesc('sys_created_on')
    gr.query()

    var cases = []
    while (gr.next()) {
        cases.push({
            sys_id:                gr.getUniqueValue(),
            number:                gr.getValue('number'),
            encounter:             encSysId,
            payer_name:            gr.getValue('payer_name'),
            authorization_type:    gr.getValue('authorization_type'),
            authorization_type_label: gr.getDisplayValue('authorization_type'),
            auth_reference_number: gr.getValue('auth_reference_number'),
            status:                gr.getValue('status'),
            status_label:          gr.getDisplayValue('status'),
            submission_time:       gr.getValue('submission_time'),
            last_followup_time:    gr.getValue('last_followup_time'),
            next_followup_due:     gr.getValue('next_followup_due'),
            followup_count:        parseInt(gr.getValue('followup_count'), 10) || 0,
            is_overdue:            gr.getValue('is_overdue') === 'true' || gr.getValue('is_overdue') === '1',
            requested_amount:      gr.getValue('requested_amount') ? parseFloat(gr.getValue('requested_amount')) : null,
            approved_amount:       gr.getValue('approved_amount') ? parseFloat(gr.getValue('approved_amount')) : null,
            assigned_owner:        gr.getValue('assigned_owner'),
            assigned_owner_name:   gr.getDisplayValue('assigned_owner'),
            linked_blocker:        gr.getValue('linked_blocker'),
            work_notes:            gr.getValue('work_notes'),
            sys_created_on:        gr.getValue('sys_created_on'),
            sys_updated_on:        gr.getValue('sys_updated_on'),
        })
    }

    response.setStatus(200)
    response.setBody({ count: cases.length, cases: cases })
})(request, response)
