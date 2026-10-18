(function process(request, response) {
    /**
     * GET /tpa-cases/{sys_id}
     *
     * Returns full detail for a single TPA case.
     * Response: case object with all fields.
     */
    var caseSysId = request.pathParams.sys_id
    if (!caseSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
        return
    }

    var gr = new GlideRecord('x_caresetu_ai_tpa_case')
    if (!gr.get(caseSysId)) {
        response.setStatus(404)
        response.setBody({ error: 'TPA case not found: ' + caseSysId })
        return
    }

    response.setStatus(200)
    response.setBody({
        sys_id:                   gr.getUniqueValue(),
        number:                   gr.getValue('number'),
        encounter:                gr.getValue('encounter'),
        encounter_number:         gr.getDisplayValue('encounter'),
        payer_name:               gr.getValue('payer_name'),
        authorization_type:       gr.getValue('authorization_type'),
        authorization_type_label: gr.getDisplayValue('authorization_type'),
        auth_reference_number:    gr.getValue('auth_reference_number'),
        status:                   gr.getValue('status'),
        status_label:             gr.getDisplayValue('status'),
        submission_time:          gr.getValue('submission_time'),
        last_followup_time:       gr.getValue('last_followup_time'),
        next_followup_due:        gr.getValue('next_followup_due'),
        followup_count:           parseInt(gr.getValue('followup_count'), 10) || 0,
        is_overdue:               gr.getValue('is_overdue') === 'true' || gr.getValue('is_overdue') === '1',
        requested_amount:         gr.getValue('requested_amount') ? parseFloat(gr.getValue('requested_amount')) : null,
        approved_amount:          gr.getValue('approved_amount') ? parseFloat(gr.getValue('approved_amount')) : null,
        assigned_owner:           gr.getValue('assigned_owner'),
        assigned_owner_name:      gr.getDisplayValue('assigned_owner'),
        linked_blocker:           gr.getValue('linked_blocker'),
        linked_blocker_number:    gr.getDisplayValue('linked_blocker'),
        work_notes:               gr.getValue('work_notes'),
        sys_created_on:           gr.getValue('sys_created_on'),
        sys_updated_on:           gr.getValue('sys_updated_on'),
    })
})(request, response)
