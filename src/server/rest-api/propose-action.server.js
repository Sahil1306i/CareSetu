(function process(request, response) {
    /**
     * POST /api/x_caresetu_ai/actions/propose
     *
     * Proposes a human-approved operational action.
     * The proposal is saved in pending_approval state; target record is NOT modified.
     *
     * Request body (JSON):
     *   {
     *     "encounter": string,
     *     "action_type": "reassign_blocker" | "escalate_blocker" | "record_tpa_followup",
     *     "target_table": string,
     *     "target_record": string,
     *     "title"?: string,
     *     "rationale"?: string,
     *     "proposed_parameters"?: object,
     *     "idempotency_key"?: string
     *   }
     *
     * Response shape (201):
     *   { "success": true, "request_id": string, "number": string, "status": "pending_approval", "title": string }
     */
    try {
        var body = request.body.data || {}
        if (typeof body === 'string') {
            try { body = JSON.parse(body) } catch (_) { body = {} }
        }

        if (!body.action_type || !body.encounter || !body.target_table || !body.target_record) {
            response.setStatus(400)
            response.setBody({
                success: false,
                error: 'Required fields: action_type, encounter, target_table, target_record.',
            })
            return
        }

        var engine = new x_caresetu_ai.ActionExecutionEngine()
        var result = engine.proposeAction(body, gs.getUserID())

        if (!result.success) {
            response.setStatus(400)
            response.setBody(result)
            return
        }

        response.setStatus(201)
        response.setBody(result)
    } catch (e) {
        gs.error('CareSetu propose-action API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error proposing action: ' + e.message })
    }
})(request, response)
