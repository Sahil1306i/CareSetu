import { Acl } from '@servicenow/sdk/core'
import { coordinatorRole, chargeNurseRole } from '../roles/caresetu-roles.now'

// ── Patient Encounter ACLs ────────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-encounter-read'],
    type: 'record',
    table: 'x_caresetu_ai_encounter',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-encounter-write'],
    type: 'record',
    table: 'x_caresetu_ai_encounter',
    operation: 'write',
    roles: [coordinatorRole],
})

// ── Discharge Risk Score ACLs ─────────────────────────────────────────────────
// charge_nurse includes coordinator, so this also covers coordinators.
Acl({
    $id: Now.ID['caresetu-acl-risk-score-read'],
    type: 'record',
    table: 'x_caresetu_ai_risk_score',
    operation: 'read',
    roles: [chargeNurseRole],
})

// ── Escalation Task ACLs ──────────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-escalation-read'],
    type: 'record',
    table: 'x_caresetu_ai_escalation',
    operation: 'read',
    roles: [chargeNurseRole],
})

Acl({
    $id: Now.ID['caresetu-acl-escalation-write'],
    type: 'record',
    table: 'x_caresetu_ai_escalation',
    operation: 'write',
    roles: [chargeNurseRole],
})

// ── Operational Blocker ACLs ──────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-blocker-read'],
    type: 'record',
    table: 'x_caresetu_ai_blocker',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-blocker-write'],
    type: 'record',
    table: 'x_caresetu_ai_blocker',
    operation: 'write',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-blocker-create'],
    type: 'record',
    table: 'x_caresetu_ai_blocker',
    operation: 'create',
    roles: [coordinatorRole],
})

// ── Discharge Prediction ACLs ─────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-prediction-read'],
    type: 'record',
    table: 'x_caresetu_ai_discharge_prediction',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-prediction-write'],
    type: 'record',
    table: 'x_caresetu_ai_discharge_prediction',
    operation: 'write',
    roles: [coordinatorRole],
})

// ── TPA / Insurance Case ACLs ────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-tpa-case-read'],
    type: 'record',
    table: 'x_caresetu_ai_tpa_case',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-tpa-case-write'],
    type: 'record',
    table: 'x_caresetu_ai_tpa_case',
    operation: 'write',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-tpa-case-create'],
    type: 'record',
    table: 'x_caresetu_ai_tpa_case',
    operation: 'create',
    roles: [coordinatorRole],
})

// ── Smart Handoff ACLs ────────────────────────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-handoff-read'],
    type: 'record',
    table: 'x_caresetu_ai_handoff',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-handoff-write'],
    type: 'record',
    table: 'x_caresetu_ai_handoff',
    operation: 'write',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-handoff-create'],
    type: 'record',
    table: 'x_caresetu_ai_handoff',
    operation: 'create',
    roles: [coordinatorRole],
})

// ── Action Request ACLs (Fix It For Me) ──────────────────────────────────────
Acl({
    $id: Now.ID['caresetu-acl-action-request-read'],
    type: 'record',
    table: 'x_caresetu_ai_action_request',
    operation: 'read',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-action-request-write'],
    type: 'record',
    table: 'x_caresetu_ai_action_request',
    operation: 'write',
    roles: [coordinatorRole],
})

Acl({
    $id: Now.ID['caresetu-acl-action-request-create'],
    type: 'record',
    table: 'x_caresetu_ai_action_request',
    operation: 'create',
    roles: [coordinatorRole],
})

