(function process(request, response) {
    /**
     * POST /encounters/{sys_id}/tpa-cases
     *
     * Creates a new TPA/insurance authorization case for the encounter.
     *
     * Required body: { payer_name, authorization_type }
     * Optional body: { auth_reference_number, requested_amount, assigned_owner,
     *                  work_notes, submission_time }
     *
     * After creation, TpaChaseEngine schedules the first follow-up deadline.
     * If payer_name is missing, returns 400.
     * authorization_type must be one of: pre_auth, cashless, final_bill.
     *
     * Response: 201 with new case summary.
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

    // ── Required field validation ─────────────────────────────────────────────
    if (!body.payer_name) {
        response.setStatus(400)
        response.setBody({ error: 'payer_name is required.' })
        return
    }

    var validTypes = { pre_auth: true, cashless: true, final_bill: true }
    var authType = body.authorization_type || 'cashless'
    if (!validTypes[authType]) {
        response.setStatus(400)
        response.setBody({ error: 'authorization_type must be one of: pre_auth, cashless, final_bill.' })
        return
    }

    // ── Create the case record ────────────────────────────────────────────────
    var gr = new GlideRecord('x_caresetu_ai_tpa_case')
    gr.initialize()
    gr.setValue('encounter',             encSysId)
    gr.setValue('payer_name',            body.payer_name)
    gr.setValue('authorization_type',    authType)
    gr.setValue('status',                'submitted')
    gr.setValue('followup_count',        0)
    gr.setValue('is_overdue',            'false')

    var now = new GlideDateTime()
    gr.setValue('submission_time', body.submission_time || now.getValue())

    if (body.auth_reference_number) gr.setValue('auth_reference_number', body.auth_reference_number)
    if (body.requested_amount !== undefined) gr.setValue('requested_amount', body.requested_amount)
    if (body.assigned_owner)  gr.setValue('assigned_owner', body.assigned_owner)
    if (body.work_notes)      gr.setValue('work_notes', body.work_notes)

    // Schedule the initial follow-up deadline before insert
    var engine = new x_caresetu_ai.TpaChaseEngine()
    engine.scheduleNextFollowup('', gr)  // Pass gr directly to avoid double-fetch

    var newSysId = gr.insert()

    if (!newSysId) {
        response.setStatus(500)
        response.setBody({ error: 'Failed to create TPA case record.' })
        return
    }

    gs.info('CareSetu TPA API: case created ' + gr.getValue('number') +
            ' for encounter ' + enc.getValue('number') + ' payer=' + body.payer_name)

    response.setStatus(201)
    response.setBody({
        sys_id:               newSysId,
        number:               gr.getValue('number'),
        encounter:            encSysId,
        encounter_number:     enc.getValue('number'),
        payer_name:           body.payer_name,
        authorization_type:   authType,
        status:               'submitted',
        followup_count:       0,
        next_followup_due:    gr.getValue('next_followup_due'),
        submission_time:      gr.getValue('submission_time'),
        message:              'TPA case created. Follow-up deadline scheduled.',
    })
})(request, response)
