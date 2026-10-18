import { RestApi } from '@servicenow/sdk/core'

/**
 * CareSetu Smart Handoff REST API
 *
 * Base URL: /api/x_caresetu_ai/handoff/
 *
 * Routes:
 *   GET    /encounters/{sys_id}/handoffs     → list-handoffs.server.js
 *   POST   /encounters/{sys_id}/handoffs     → create-handoff.server.js
 *   GET    /handoffs/{sys_id}                → get-handoff.server.js
 *   POST   /handoffs/{sys_id}/acknowledge    → acknowledge-handoff.server.js
 *   POST   /handoffs/{sys_id}/reject         → reject-handoff.server.js
 *   POST   /handoffs/{sys_id}/complete       → complete-handoff.server.js
 *   POST   /handoffs/{sys_id}/cancel         → cancel-handoff.server.js
 *   PATCH  /handoffs/{sys_id}                → update-handoff.server.js
 */
RestApi({
    $id: Now.ID['caresetu-handoff-api'],
    name: 'CareSetu Smart Handoff API',
    serviceId: 'handoff',
    shortDescription: 'Manage clinical and operational handoffs, track acknowledgment SLAs, and enforce closed-loop accountability.',
    consumes: 'application/json',
    versions: [
        {
            $id: Now.ID['caresetu-handoff-api-v1'],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],
    routes: [
        {
            $id: Now.ID['caresetu-handoff-list-route'],
            name: 'List Handoffs for Encounter',
            version: 1,
            method: 'GET',
            path: '/encounters/{sys_id}/handoffs',
            shortDescription: 'Returns all handoffs for an encounter with optional status filtering.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/list-handoffs.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-create-route'],
            name: 'Create Handoff',
            version: 1,
            method: 'POST',
            path: '/encounters/{sys_id}/handoffs',
            shortDescription: 'Creates a new handoff and schedules the SLA acknowledgment deadline.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/create-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-get-route'],
            name: 'Get Handoff',
            version: 1,
            method: 'GET',
            path: '/handoffs/{sys_id}',
            shortDescription: 'Retrieves full details for a single handoff record.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-ack-route'],
            name: 'Acknowledge Handoff',
            version: 1,
            method: 'POST',
            path: '/handoffs/{sys_id}/acknowledge',
            shortDescription: 'Acknowledges receipt and responsibility of a handoff, clearing overdue state and linked blockers.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/acknowledge-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-reject-route'],
            name: 'Reject Handoff',
            version: 1,
            method: 'POST',
            path: '/handoffs/{sys_id}/reject',
            shortDescription: 'Rejects a handoff with mandatory reason and escalates to coordination blockers.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/reject-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-complete-route'],
            name: 'Complete Handoff',
            version: 1,
            method: 'POST',
            path: '/handoffs/{sys_id}/complete',
            shortDescription: 'Marks an acknowledged or in-progress handoff as completed.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/complete-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-cancel-route'],
            name: 'Cancel Handoff',
            version: 1,
            method: 'POST',
            path: '/handoffs/{sys_id}/cancel',
            shortDescription: 'Cancels a handoff and resolves any linked blockers.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/cancel-handoff.server.js'),
        },
        {
            $id: Now.ID['caresetu-handoff-update-route'],
            name: 'Update Handoff',
            version: 1,
            method: 'PATCH',
            path: '/handoffs/{sys_id}',
            shortDescription: 'Updates permitted fields on an existing handoff record.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/update-handoff.server.js'),
        },
    ],
})
