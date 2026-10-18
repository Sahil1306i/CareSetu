import { RestApi } from '@servicenow/sdk/core'

/**
 * CareSetu Operational Risk REST API
 *
 * Base URL: /api/x_caresetu_ai/operational_risk/v1/
 *
 * Routes:
 *   GET  /encounters/high-risk         → high-risk-encounters.server.js
 *   POST /encounters/{sys_id}/score    → score-encounter.server.js
 *   GET  /encounters/{sys_id}/escalations → get-escalations.server.js
 *
 * All routes require authentication and enforce ACLs.
 * No clinical data is returned by any route.
 */
RestApi({
    $id: Now.ID['caresetu-operational-risk-api'],
    name: 'CareSetu Operational Risk API',
    serviceId: 'operational_risk',
    shortDescription: 'Retrieve high-risk encounters, trigger on-demand scoring, and query escalation tasks.',
    consumes: 'application/json',
    versions: [
        {
            $id: Now.ID['caresetu-api-v1'],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],
    routes: [
        {
            $id: Now.ID['caresetu-api-get-high-risk'],
            name: 'Get High-Risk Encounters',
            version: 1,
            method: 'GET',
            path: '/encounters/high-risk',
            shortDescription: 'Returns encounters whose latest risk_tier is high or critical.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/high-risk-encounters.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-post-score'],
            name: 'Score Encounter',
            version: 1,
            method: 'POST',
            path: '/encounters/{sys_id}/score',
            shortDescription: 'Synchronously scores a specific encounter using OperationalRiskEngine.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/score-encounter.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-get-escalations'],
            name: 'Get Encounter Escalations',
            version: 1,
            method: 'GET',
            path: '/encounters/{sys_id}/escalations',
            shortDescription: 'Returns all escalation tasks for a specific encounter. Used by ATF tests.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-escalations.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-ai-query'],
            name: 'AI Care Coordinator Query',
            version: 1,
            method: 'POST',
            path: '/ai/query',
            shortDescription: 'Queries the AI Care Coordinator using Now Assist and authoritative live operational coordination data.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/ai-query.server.js'),
        },
    ],
})
