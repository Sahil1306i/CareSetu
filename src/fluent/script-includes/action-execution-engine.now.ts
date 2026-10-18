import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * ActionExecutionEngine Script Include
 *
 * Implements the human-approved operational action system ("Fix It For Me").
 * Provides proposal creation, approval authorization, execution handlers for
 * blocker reassignment, blocker escalation, and TPA follow-up recording.
 */
export const actionExecutionEngine = ScriptInclude({
    $id: Now.ID['caresetu-action-execution-engine'],
    name: 'ActionExecutionEngine',
    apiName: 'x_caresetu_ai.ActionExecutionEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: 'Human-approved operational action execution engine enforcing human approval, server-side authorization, and idempotent execution.',
    script: Now.include('../../server/script-includes/ActionExecutionEngine.server.js'),
})
