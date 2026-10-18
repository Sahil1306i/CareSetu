(function process(request, response) {
    /**
     * POST /tpa-cases/{sys_id}/followup
     *
     * Records an operational follow-up action on a TPA case.
     * Increments follow-up count, updates last follow-up timestamp,
     * appends staff notes, clears overdue flag, and computes the next follow-up deadline.
     *
     * Request body:
     *   { "notes": "Contacted MediAssist desk; approval letter promised in 2 hours." }
     */
    var caseSysId = request.pathParams.sys_id
    if (!caseSysId) {
        response.setStatus(400)
        response.setBody({ error: 'sys_id path parameter is required' })
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

    var notes = body.notes || ''
    var engine = new TpaChaseEngine()
    var result = engine.recordFollowup(caseSysId, notes)

    if (!result.success) {
        response.setStatus(400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(200)
    response.setBody({
        sys_id:            caseSysId,
        followup_count:    result.followup_count,
        next_followup_due: result.next_followup_due,
        message:           'Follow-up recorded successfully. Next deadline scheduled.',
    })
})(request, response)
