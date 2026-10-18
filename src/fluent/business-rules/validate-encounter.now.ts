import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Before Business Rule: Validate Encounter Fields
 *
 * Runs BEFORE insert or update on x_caresetu_ai_encounter.
 * Validates required fields and non-negative signal counts.
 * Aborts the save with a user-visible error on failure.
 *
 * Order 100 ensures this always runs before the async scoring BR (order 200).
 */
BusinessRule({
    $id: Now.ID['caresetu-validate-encounter'],
    name: 'CareSetu: Validate Encounter Before Save',
    table: 'x_caresetu_ai_encounter',
    when: 'before',
    action: ['insert', 'update'],
    active: true,
    order: 100,
    description: 'Validates that patient_mrn is present and all coordination signal counts are non-negative before any encounter insert or update is committed.',
    script: Now.include('../../server/business-rules/validate-encounter.server.js'),
})
