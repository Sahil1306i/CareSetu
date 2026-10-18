import { RestApi } from '@servicenow/sdk/core'

/**
 * CareSetu Operational Actions API — x_caresetu_ai/actions
 *
 * Implements the human-approved operational action system ("Fix It For Me").
 * Provides secured REST endpoints to propose, list, inspect, approve, reject,
 * and retrieve execution results for operational actions.
 *
 * Enforces authentication and server-side authorization.
 */
export const actionsApi = RestApi({
    $id: Now.ID['caresetu-actions-api'],
    name: 'CareSetu Operational Actions API',
    serviceId: 'actions',
    shortDescription: 'Manage human-approved operational actions and execution for CareSetu AI Fix-It-For-Me.',
    consumes: 'application/json',
    versions: [
        {
            $id: Now.ID['caresetu-actions-api-v1'],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],
    routes: [
        {
            $id: Now.ID['caresetu-action-propose-route'],
            name: 'Propose Action',
            version: 1,
            method: 'POST',
            path: '/propose',
            shortDescription: 'Proposes an operational action request in pending_approval state without modifying target records.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/propose-action.server.js'),
        },
        {
            $id: Now.ID['caresetu-action-list-route'],
            name: 'List Action Requests',
            version: 1,
            method: 'GET',
            path: '/requests',
            shortDescription: 'Returns a list of action requests with optional status, encounter, or action_type filtering.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/list-action-requests.server.js'),
        },
        {
            $id: Now.ID['caresetu-action-get-route'],
            name: 'Get Action Request Detail',
            version: 1,
            method: 'GET',
            path: '/requests/{sys_id}',
            shortDescription: 'Retrieves an action request including proposed parameters, snapshot state, and audit history.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-action-request.server.js'),
        },
        {
            $id: Now.ID['caresetu-action-approve-route'],
            name: 'Approve and Execute Action',
            version: 1,
            method: 'POST',
            path: '/requests/{sys_id}/approve',
            shortDescription: 'Approves and executes a proposed action request after verifying human authorization and target state.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/approve-action-request.server.js'),
        },
        {
            $id: Now.ID['caresetu-action-reject-route'],
            name: 'Reject Action Request',
            version: 1,
            method: 'POST',
            path: '/requests/{sys_id}/reject',
            shortDescription: 'Rejects an action request with an auditable reason; target record remains untouched.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/reject-action-request.server.js'),
        },
        {
            $id: Now.ID['caresetu-action-result-route'],
            name: 'Get Action Execution Result',
            version: 1,
            method: 'GET',
            path: '/requests/{sys_id}/result',
            shortDescription: 'Retrieves the verified execution result of an action request.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-action-result.server.js'),
        },
    ],
})
