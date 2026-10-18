(function process(request, response) {
    /**
     * GET /api/x_caresetu_ai/actions/requests
     *
     * List action requests with optional status, encounter, or action_type filtering.
     * Query params:
     *   ?status=pending_approval,approved
     *   ?encounter={encounter_sys_id}
     *   ?action_type=reassign_blocker
     *   ?limit=50
     */
    try {
        var queryParams = request.queryParams || {}
        var filters = {
            status: queryParams.status ? (Array.isArray(queryParams.status) ? queryParams.status[0] : queryParams.status) : null,
            encounter: queryParams.encounter ? (Array.isArray(queryParams.encounter) ? queryParams.encounter[0] : queryParams.encounter) : null,
            action_type: queryParams.action_type ? (Array.isArray(queryParams.action_type) ? queryParams.action_type[0] : queryParams.action_type) : null,
            limit: queryParams.limit ? (Array.isArray(queryParams.limit) ? queryParams.limit[0] : queryParams.limit) : 50,
        }

        var engine = new x_caresetu_ai.ActionExecutionEngine()
        var result = engine.listRequests(filters)

        response.setStatus(200)
        response.setBody(result)
    } catch (e) {
        gs.error('CareSetu list-action-requests API error: ' + e.message)
        response.setStatus(500)
        response.setBody({ success: false, error: 'Internal error listing action requests: ' + e.message })
    }
})(request, response)
