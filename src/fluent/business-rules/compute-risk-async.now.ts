import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Async Business Rule: Compute Operational Risk
 *
 * Fires AFTER every insert or update on x_caresetu_ai_encounter.
 * Delegates all scoring logic to OperationalRiskEngine Script Include.
 *
 * Recursion safety:
 *   OperationalRiskEngine writes to x_caresetu_ai_risk_score and
 *   x_caresetu_ai_escalation — it never updates the encounter itself.
 *   This BR therefore cannot trigger a recursive loop.
 *
 * Order 200 ensures the before-validation BR (order 100) always runs first.
 */
BusinessRule({
    $id: Now.ID['caresetu-compute-risk-async'],
    name: 'CareSetu: Compute Operational Discharge Risk',
    table: 'x_caresetu_ai_encounter',
    when: 'async',
    action: ['insert', 'update'],
    active: true,
    order: 200,
    description: 'Asynchronously computes the operational discharge risk score after any encounter save. Delegates to OperationalRiskEngine Script Include.',
    script: Now.include('../../server/business-rules/compute-risk-async.server.js'),
})
