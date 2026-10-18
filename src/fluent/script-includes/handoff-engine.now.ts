import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * HandoffEngine Script Include
 *
 * Operational closed-loop logic for smart handoffs:
 *   - SLA deadline calculation by priority
 *   - Acknowledgment, rejection, completion, and cancellation
 *   - Overdue SLA detection and automated escalation
 *   - Idempotent operational blocker synchronization
 *   - Synchronization of encounter.unack_handoffs counter
 */
export const handoffEngine = ScriptInclude({
    $id: Now.ID['caresetu-handoff-engine'],
    name: 'HandoffEngine',
    apiName: 'x_caresetu_ai.HandoffEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: 'Manages closed-loop clinical and operational handoff lifecycle, SLA tracking, and blocker synchronization.',
    script: Now.include('../../server/script-includes/HandoffEngine.server.js'),
})
