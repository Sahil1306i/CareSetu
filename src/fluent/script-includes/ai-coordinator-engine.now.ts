import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * AICoordinatorEngine Script Include
 *
 * Operational AI Care Coordinator engine.
 * Serves conversational and operational coordination queries for the AI Care Coordinator panel.
 * Grounded in live records from x_caresetu_ai_encounter, x_caresetu_ai_risk_score,
 * x_caresetu_ai_blocker, x_caresetu_ai_handoff, and x_caresetu_ai_escalation.
 */
export const aiCoordinatorEngine = ScriptInclude({
    $id: Now.ID['caresetu-ai-coordinator-engine'],
    name: 'AICoordinatorEngine',
    apiName: 'x_caresetu_ai.AICoordinatorEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: 'Operational AI Care Coordinator engine supporting live encounter explanations, hospital-wide prioritization, and emergency status.',
    script: Now.include('../../server/script-includes/AICoordinatorEngine.server.js'),
})
