(function process(request, response) {
    /**
     * POST /ai/query
     *
     * Queries the AI Care Coordinator.
     * Delegates to AICoordinatorEngine Script Include.
     *
     * Request body (JSON):
     *   { "query": string, "encounter_number"?: string }
     *
     * Response shape (200):
     *   { "success": boolean, "query_type": string, "response": string, "source": string, "encounter"?: string }
     */
    try {
        var body = request.body.data || {}
        if (typeof body === 'string') {
            try { body = JSON.parse(body) } catch (_) { body = {} }
        }

        var query = body.query || ''
        var encounterNumber = body.encounter_number || ''

        if (!query) {
            response.setStatus(400)
            response.setBody({
                success: false,
                error: 'The "query" field is required in request body.'
            })
            return
        }

        var engine = new x_caresetu_ai.AICoordinatorEngine()
        var result = engine.answerQuery(query, encounterNumber)

        response.setStatus(200)
        response.setBody(result)
    } catch (e) {
        gs.error('CareSetu AI Query REST API error: ' + e.message)
        response.setStatus(500)
        response.setBody({
            success: false,
            error: 'AI coordinator query processing failed: ' + e.message
        })
    }
})(request, response)
