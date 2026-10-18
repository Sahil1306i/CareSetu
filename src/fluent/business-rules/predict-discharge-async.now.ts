import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Async Business Rule: Predict Discharge After Encounter Save
 *
 * Fires AFTER every insert or update on x_caresetu_ai_encounter.
 * Invokes DischargePredictionEngine to recompute the discharge prediction.
 *
 * Order 210 — runs AFTER the risk scoring BR (order 200) so both run on each save.
 * Async — does not block the encounter save transaction.
 *
 * Recursion safety:
 *   DischargePredictionEngine writes ONLY to x_caresetu_ai_discharge_prediction.
 *   It never updates the encounter record. No loop risk.
 */
BusinessRule({
    $id: Now.ID['caresetu-predict-discharge-async'],
    name: 'CareSetu: Predict Discharge Time',
    table: 'x_caresetu_ai_encounter',
    when: 'async',
    action: ['insert', 'update'],
    active: true,
    order: 210,
    description: 'Asynchronously computes the predicted discharge time after any encounter save. Delegates to DischargePredictionEngine Script Include.',
    script: Now.include('../../server/business-rules/predict-discharge-async.server.js'),
})
