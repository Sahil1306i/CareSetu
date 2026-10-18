import { ScheduledScript } from '@servicenow/sdk/core'

/**
 * TPA Follow-Up Chaser — Scheduled Script
 *
 * Runs hourly. Calls TpaChaseEngine.processOverdueCases() to:
 *   - Detect TPA cases whose next_followup_due has passed.
 *   - Mark them overdue.
 *   - Ensure exactly one active TPA blocker exists per overdue case
 *     (idempotent — repeated runs do not create duplicate blockers).
 *
 * The blocker creation/update triggers the existing sync-blocker-count
 * Business Rule, which cascades into DischargePredictionEngine.
 *
 * No external systems are contacted. All actions are internal record updates.
 */
ScheduledScript({
    $id: Now.ID['caresetu-tpa-followup-chaser'],
    name: 'CareSetu: TPA Follow-Up Chaser',
    active: true,
    frequency: 'periodically',
    executionInterval: { hours: 1 },
    script: Now.include('../../server/scheduled-scripts/tpa-followup-chaser.server.js'),
})
