(function process(request, response) {
    /**
     * PATCH /tpa-cases/{sys_id}
     *
     * Updates a TPA/insurance authorization case.
     * Allowed body fields: status, auth_reference_number, requested_amount,
     *                      approved_amount, assigned_owner, work_notes
     *
     * Business rules enforced:
     *   - Server-side status transition validation via TpaChaseEngine
     *   - If transitioning to terminal status (approved, rejected, closed):
     *     automatically resolves linked blocker and clears next_followup_due
     *   - If work_notes provided, timestamps and appends to existing notes
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

    var body = {}
    try {
        body = JSON.parse(request.body.dataString || '{}')
    } catch (e) {
        response.setStatus(400)
        response.setBody({ error: 'Invalid JSON body: ' + e.message })
        return
    }

    var engine = new TpaChaseEngine()
    var updated = []
    var currentStatus = gr.getValue('status')

    // Validate status transition if requested
    if (body.hasOwnProperty('status') && body.status !== currentStatus) {
        var transitionCheck = engine.validateTransition(currentStatus, body.status)
        if (!transitionCheck.valid) {
            response.setStatus(422)
            response.setBody({
                error: transitionCheck.error,
                current_status: currentStatus,
                requested_status: body.status,
            })
            return
        }

        gr.setValue('status', body.status)
        updated.push('status')

        // If moving to terminal status, resolve linked blocker
        if (engine._isTerminal(body.status)) {
            engine.resolveLinkedBlocker(caseSysId, body.work_notes || ('TPA case ' + body.status))
            gr.setValue('next_followup_due', '')
            gr.setValue('is_overdue', 'false')
            updated.push('next_followup_due', 'is_overdue')
        } else {
            // Re-schedule follow up if moving between active states
            engine.scheduleNextFollowup(caseSysId, gr)
            updated.push('next_followup_due')
        }
    }

    // Other allowed fields
    if (body.hasOwnProperty('auth_reference_number')) {
        gr.setValue('auth_reference_number', body.auth_reference_number)
        updated.push('auth_reference_number')
    }

    if (body.hasOwnProperty('requested_amount')) {
        gr.setValue('requested_amount', body.requested_amount)
        updated.push('requested_amount')
    }

    if (body.hasOwnProperty('approved_amount')) {
        gr.setValue('approved_amount', body.approved_amount)
        updated.push('approved_amount')
    }

    if (body.hasOwnProperty('assigned_owner')) {
        gr.setValue('assigned_owner', body.assigned_owner)
        updated.push('assigned_owner')
    }

    if (body.hasOwnProperty('work_notes') && body.work_notes) {
        var existingNotes = gr.getValue('work_notes') || ''
        var stamp = '[' + new GlideDateTime().getDisplayValue() + '] Note: ' + body.work_notes
        gr.setValue('work_notes', existingNotes ? existingNotes + '\n' + stamp : stamp)
        updated.push('work_notes')
    }

    if (updated.length === 0) {
        response.setStatus(400)
        response.setBody({ error: 'No valid updatable fields provided.' })
        return
    }

    gr.update()

    gs.info('CareSetu TPA API: updated case ' + gr.getValue('number') + ' fields: ' + updated.join(', '))

    response.setStatus(200)
    response.setBody({
        sys_id:                caseSysId,
        number:                gr.getValue('number'),
        status:                gr.getValue('status'),
        status_label:          gr.getDisplayValue('status'),
        next_followup_due:     gr.getValue('next_followup_due'),
        is_overdue:            gr.getValue('is_overdue') === 'true' || gr.getValue('is_overdue') === '1',
        auth_reference_number: gr.getValue('auth_reference_number'),
        updated:               updated,
        message:               'TPA case updated successfully.',
    })
})(request, response)
