import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Async Business Rule: Sync Handoff Count
 *
 * Fires after insert, update, or delete on x_caresetu_ai_handoff.
 * Synchronizes encounter.unack_handoffs to match the exact count of active,
 * unacknowledged handoffs (status: pending_acknowledgment or escalated).
 *
 * Recursion safety:
 *   Writes to encounter.unack_handoffs.
 *   This automatically cascades to compute-risk-async and predict-discharge-async.
 *   Those BRs do not modify handoff records. No infinite loop.
 */
BusinessRule({
    $id: Now.ID['caresetu-sync-handoff-count'],
    name: 'CareSetu: Sync Handoff Count',
    table: 'x_caresetu_ai_handoff',
    when: 'async',
    action: ['insert', 'update', 'delete'],
    active: true,
    order: 100,
    description: 'After any handoff change: syncs encounter.unack_handoffs to the live active unacknowledged count.',
    script: Now.include('../../server/business-rules/sync-handoff-count.server.js'),
})
