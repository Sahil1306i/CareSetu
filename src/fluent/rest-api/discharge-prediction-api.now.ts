import { RestApi } from '@servicenow/sdk/core'

/**
 * CareSetu Discharge Prediction REST API
 *
 * Base URL: /api/x_caresetu_ai/discharge_prediction/v1/
 *
 * Routes:
 *   GET  /encounters/{sys_id}/prediction    → get-discharge-prediction.server.js
 *   POST /encounters/{sys_id}/predict       → run-discharge-prediction.server.js
 *   GET  /encounters/{sys_id}/blockers      → get-blockers.server.js
 *   POST /encounters/{sys_id}/blockers      → create-blocker.server.js
 *   PATCH /blockers/{sys_id}               → update-blocker.server.js
 *
 * Used by the Command Center frontend for:
 *   - Encounter 360 predictor display
 *   - Blocker list with inline resolution
 *   - Fix-It-For-Me action (future phase)
 */
RestApi({
    $id: Now.ID['caresetu-discharge-prediction-api'],
    name: 'CareSetu Discharge Prediction API',
    serviceId: 'discharge_prediction',
    shortDescription: 'Retrieve and compute discharge predictions and manage operational blockers.',
    consumes: 'application/json',
    versions: [
        {
            $id: Now.ID['caresetu-prediction-api-v1'],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],
    routes: [
        {
            $id: Now.ID['caresetu-api-get-prediction'],
            name: 'Get Discharge Prediction',
            version: 1,
            method: 'GET',
            path: '/encounters/{sys_id}/prediction',
            shortDescription: 'Returns the latest discharge prediction for a specific encounter.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-discharge-prediction.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-post-predict'],
            name: 'Run Discharge Prediction',
            version: 1,
            method: 'POST',
            path: '/encounters/{sys_id}/predict',
            shortDescription: 'Synchronously re-runs DischargePredictionEngine and returns the updated prediction.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/run-discharge-prediction.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-get-blockers'],
            name: 'Get Encounter Blockers',
            version: 1,
            method: 'GET',
            path: '/encounters/{sys_id}/blockers',
            shortDescription: 'Returns all active operational blockers for a specific encounter.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/get-blockers.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-create-blocker'],
            name: 'Create Encounter Blocker',
            version: 1,
            method: 'POST',
            path: '/encounters/{sys_id}/blockers',
            shortDescription: 'Creates a new operational blocker for the specified encounter.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/create-blocker.server.js'),
        },
        {
            $id: Now.ID['caresetu-api-update-blocker'],
            name: 'Update Blocker',
            version: 1,
            method: 'PATCH',
            path: '/blockers/{sys_id}',
            shortDescription: 'Updates a blocker record (status, resolution notes). Used by Fix-It-For-Me.',
            authentication: true,
            authorization: true,
            script: Now.include('../../server/rest-api/update-blocker.server.js'),
        },
    ],
})
