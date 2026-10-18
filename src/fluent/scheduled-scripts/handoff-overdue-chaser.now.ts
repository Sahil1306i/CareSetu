import { ScheduledScript } from '@servicenow/sdk/core'

/**
 * Smart Handoff Overdue Chaser — Scheduled Script
 *
 * Runs periodically (every 1 minute). Calls HandoffEngine.processOverdueHandoffs() to:
 *   - Promptly detect active unacknowledged handoffs whose acknowledgment_deadline has passed
 *     (Critical: 5m, Urgent: 15m, Routine: 30m SLAs).
 *   - Mark them overdue (is_overdue = true, status = escalated).
 *   - Idempotently create an operational blocker (category = handoff) if none exists.
 *   - Never creates duplicate blockers or alerts on repeated sweeps.
 */
export const handoffOverdueChaser = ScheduledScript({
    $id: Now.ID['caresetu-handoff-overdue-chaser'],
    name: 'CareSetu: Smart Handoff Overdue Chaser',
    active: true,
    frequency: 'periodically',
    executionInterval: { minutes: 1 },
    script: Now.include('../../server/scheduled-scripts/handoff-overdue-chaser.server.js'),
})
