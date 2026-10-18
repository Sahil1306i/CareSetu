import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * TpaChaseEngine Script Include
 *
 * Operational follow-up logic for TPA/insurance authorization cases.
 *
 * Responsibilities:
 *   1. scheduleNextFollowup(caseSysId)
 *      Computes and writes next_followup_due based on configurable interval.
 *      Called after every follow-up action or case creation.
 *
 *   2. processOverdueCases()
 *      Called by the hourly scheduled script.
 *      - Detects cases where next_followup_due < now() and status is active.
 *      - Marks is_overdue = true.
 *      - Ensures exactly one active TPA blocker exists for the encounter.
 *        (Idempotent: does not create duplicate blockers on repeated runs.)
 *
 *   3. recordFollowup(caseSysId, notes)
 *      - Updates last_followup_time = now().
 *      - Increments followup_count.
 *      - Appends note to work_notes.
 *      - Calls scheduleNextFollowup().
 *      - Clears is_overdue flag (staff has followed up).
 *
 *   4. resolveLinkedBlocker(caseSysId, resolutionNotes)
 *      - Sets linked blocker status to 'resolved'.
 *      - Clears linked_blocker reference on the case.
 *      - Triggers prediction refresh through the existing sync-blocker-count BR.
 *
 * Configuration property: x_caresetu_ai.tpa.followup_interval_hours (default: 4)
 *
 * Does NOT:
 *   - Contact external systems or send messages.
 *   - Modify risk scoring logic.
 *   - Create more than one active blocker per TPA case.
 */
ScriptInclude({
    $id: Now.ID['caresetu-tpa-chase-engine'],
    name: 'TpaChaseEngine',
    apiName: 'x_caresetu_ai.TpaChaseEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: [
        'Operational follow-up engine for TPA/insurance authorization cases.',
        'Manages follow-up deadlines, overdue detection, and blocker synchronization.',
        'Called by the tpa-followup-chaser scheduled script and TPA REST API.',
        'Does not contact external systems or modify risk scoring.',
    ].join(' '),
    script: Now.include('../../server/script-includes/TpaChaseEngine.server.js'),
})
