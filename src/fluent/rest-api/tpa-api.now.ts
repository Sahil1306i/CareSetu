import { RestApi } from '@servicenow/sdk/core'

/**
 * CareSetu TPA / Insurance Case REST API
 *
 * Base URL: /api/x_caresetu_ai/tpa/v1/
 *
 * Routes:
 *   GET    /encounters/{sys_id}/tpa-cases         → list-tpa-cases.server.js
 *   POST   /encounters/{sys_id}/tpa-cases         → create-tpa-case.server.js
 *   GET    /tpa-cases/{sys_id}                    → get-tpa-case.server.js
 *   PATCH  /tpa-cases/{sys_id}                    → update-tpa-case.server.js
 *   POST   /tpa-cases/{sys_id}/followup           → record-tpa-followup.server.js
 *
 * All routes require authentication and enforce server-side authorization
 * via existing application roles (x_caresetu_ai.coordinator minimum).
 */
RestApi({
    $id: Now.ID['caresetu-tpa-api'],
    name: 'CareSetu TPA / Insurance Case API',
    serviceId: 'tpa',
    shortDescription: 'Manage TPA/insurance authorization cases and follow-up actions for discharge coordination.',
    consumes: 'application/json',
    versions: [
        {
            $id: Now.ID['caresetu-tpa-api-v1'],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],
    routes: [
        {
            $id: Now.ID['caresetu-tpa-list-cases'],
            name: 'List TPA Cases for Encounter',
            version: 1,
            method: 'GET',
            path: '/encounters/{sys_id}/tpa-cases',
            shortDescription: 'Returns all TPA/insurance cases for the specified encounter.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/list-tpa-cases.server.js'),
        },
        {
            $id: Now.ID['caresetu-tpa-create-case'],
            name: 'Create TPA Case',
            version: 1,
            method: 'POST',
            path: '/encounters/{sys_id}/tpa-cases',
            shortDescription: 'Creates a new TPA/insurance authorization case for the encounter.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/create-tpa-case.server.js'),
        },
        {
            $id: Now.ID['caresetu-tpa-get-case'],
            name: 'Get TPA Case',
            version: 1,
            method: 'GET',
            path: '/tpa-cases/{sys_id}',
            shortDescription: 'Retrieves a single TPA/insurance case by sys_id.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-tpa-case.server.js'),
        },
        {
            $id: Now.ID['caresetu-tpa-update-case'],
            name: 'Update TPA Case',
            version: 1,
            method: 'PATCH',
            path: '/tpa-cases/{sys_id}',
            shortDescription: 'Updates a TPA case (status, amounts, notes, reference number). Resolves linked blocker on terminal statuses.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/update-tpa-case.server.js'),
        },
        {
            $id: Now.ID['caresetu-tpa-record-followup'],
            name: 'Record TPA Follow-Up',
            version: 1,
            method: 'POST',
            path: '/tpa-cases/{sys_id}/followup',
            shortDescription: 'Records a follow-up action on a TPA case: timestamps, increments count, appends notes, schedules next deadline.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/record-tpa-followup.server.js'),
        },
    ],
})
