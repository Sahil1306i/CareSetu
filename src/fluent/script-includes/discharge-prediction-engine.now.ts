import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * DischargePredictionEngine Script Include
 *
 * Deterministic, transparent discharge delay predictor.
 *
 * Prediction formula:
 *   predicted_discharge = promised_discharge (or expected_discharge as fallback)
 *     + SUM(estimated_delay_minutes for all open blockers)
 *     + overdue_coord_tasks * COORD_TASK_DELAY_MINUTES
 *     + unack_handoffs * HANDOFF_DELAY_MINUTES
 *     + incomplete_milestones * MILESTONE_DELAY_MINUTES
 *
 * Each category has a default delay estimate used when no blocker record exists.
 * When individual blocker records exist, their estimated_delay_minutes is used.
 *
 * Algorithm is intentionally simple and replaceable — all constants are named.
 *
 * Writes to x_caresetu_ai_discharge_prediction (latest-flag pattern).
 * Does NOT write to x_caresetu_ai_encounter (avoids triggering scoring BR loop).
 * Does NOT call any ML service.
 *
 * Called by:
 *   - predict-discharge-async.server.js Business Rule (after encounter insert/update)
 *   - sync-blocker-count.server.js Business Rule (after blocker insert/update)
 *   - discharge-prediction-api REST routes (on-demand via frontend)
 */
ScriptInclude({
    $id: Now.ID['caresetu-discharge-prediction-engine'],
    name: 'DischargePredictionEngine',
    apiName: 'x_caresetu_ai.DischargePredictionEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: [
        'Deterministic operational discharge delay predictor.',
        'Computes predicted discharge time from promised/expected discharge time',
        'plus delays contributed by open blockers, overdue tasks, handoffs, and milestones.',
        'No ML, no clinical data.',
    ].join(' '),
    script: Now.include('../../server/script-includes/DischargePredictionEngine.server.js'),
})
