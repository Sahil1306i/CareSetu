import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Async Business Rule: Sync Blocker Count + Re-predict on Blocker Change
 *
 * Fires AFTER every insert or update on x_caresetu_ai_blocker.
 * Does two things:
 *   1. Resyncs encounter.open_blockers (integer) to the live count of
 *      active blocker records. This preserves backward compatibility with
 *      the OperationalRiskEngine which reads the integer counter.
 *   2. Triggers DischargePredictionEngine to recompute the discharge prediction
 *      incorporating the updated blocker records.
 *
 * Order 100 — only BR on this table, order is arbitrary.
 *
 * Recursion safety:
 *   This BR writes to x_caresetu_ai_encounter (to sync the counter).
 *   That encounter write triggers compute-risk-async (order 200) and
 *   predict-discharge-async (order 210) on the encounter table.
 *   Those BRs do NOT write back to x_caresetu_ai_blocker. No loop.
 */
BusinessRule({
    $id: Now.ID['caresetu-sync-blocker-count'],
    name: 'CareSetu: Sync Blocker Count and Re-predict',
    table: 'x_caresetu_ai_blocker',
    when: 'async',
    action: ['insert', 'update', 'delete'],
    active: true,
    order: 100,
    description: 'After any blocker record change: syncs encounter.open_blockers to the live active count, then triggers discharge re-prediction.',
    script: Now.include('../../server/business-rules/sync-blocker-count.server.js'),
})
