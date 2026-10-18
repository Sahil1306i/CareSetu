(function process(request, response) {
    /**
     * GET /handoffs/{sys_id}
     *
     * Returns the full record for a single handoff.
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

    response.setStatus(200)
    response.setBody({
        sys_id:                  gr.getUniqueValue(),
        number:                  gr.getValue('number'),
        encounter:               gr.getValue('encounter'),
        encounter_number:        gr.getDisplayValue('encounter'),
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
        resolution_notes:        gr.getValue('resolution_notes'),
        linked_blocker:          gr.getValue('linked_blocker'),
        linked_blocker_number:   gr.getDisplayValue('linked_blocker'),
        sys_created_on:          gr.getValue('sys_created_on'),
        sys_updated_on:          gr.getValue('sys_updated_on'),
    })
})(request, response)
