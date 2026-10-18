import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * OperationalRiskEngine Script Include
 *
 * Exposes the deterministic operational risk scoring engine to:
 *   - Business Rules (async scoring on encounter save)
 *   - Scripted REST API routes (on-demand scoring)
 *   - Flow Designer (future: custom action wrapping this SI)
 *
 * Script body is kept in a separate .server.js file (Class.create pattern).
 * accessibleFrom 'public' allows same-scope callers from BRs and REST routes.
 */
ScriptInclude({
    $id: Now.ID['caresetu-operational-risk-engine'],
    name: 'OperationalRiskEngine',
    apiName: 'x_caresetu_ai.OperationalRiskEngine',
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    active: true,
    description: [
        'Deterministic operational discharge risk scoring engine.',
        'Scores patient encounters based on five operational coordination signals only.',
        'No clinical data, diagnosis, comorbidities, or AI inference is used.',
    ].join(' '),
    script: Now.include('../../server/script-includes/OperationalRiskEngine.server.js'),
})
