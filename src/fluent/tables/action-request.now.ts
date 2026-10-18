import {
    Table,
    StringColumn,
    ReferenceColumn,
    DateTimeColumn,
    MultiLineTextColumn,
} from '@servicenow/sdk/core'

/**
 * CareSetu Action Request Table — x_caresetu_ai_action_request
 *
 * Implements the human-approved operational action system ("Fix It For Me").
 *
 * Grounding & Safety Principles:
 * - A proposal is read-only until approved by an authorized human coordinator.
 * - Actions NEVER execute automatically solely based on AI suggestion.
 * - Every proposal, approval, rejection, and execution is auditable with strict role enforcement.
 * - Enforces server-side parameter validation and state verification at execution time.
 * - Strict allowlist of executable action types: reassign_blocker, escalate_blocker, record_tpa_followup.
 * - Does not store patient clinical data or patient names; strictly operational.
 */
export const x_caresetu_ai_action_request = Table({
    name: 'x_caresetu_ai_action_request',
    label: 'CareSetu Action Request',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'ACT', numberOfDigits: 7, number: 1000001 },
    schema: {
        // ── Encounter Association ─────────────────────────────────────────────
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // ── Action Type & Lifecycle Status ────────────────────────────────────
        action_type: StringColumn({
            label: 'Action Type',
            mandatory: true,
            choices: {
                reassign_blocker:    'Reassign Operational Blocker',
                escalate_blocker:    'Escalate Overdue Blocker',
                record_tpa_followup: 'Record TPA Follow-Up',
            },
        }),

        status: StringColumn({
            label: 'Status',
            mandatory: true,
            default: 'pending_approval',
            choices: {
                pending_approval: 'Pending Approval',
                approved:         'Approved',
                rejected:         'Rejected',
                executing:        'Executing',
                completed:        'Completed',
                failed:           'Failed',
                expired:          'Expired',
            },
        }),

        // ── Action Summary & Evidence Rationale ───────────────────────────────
        title: StringColumn({
            label: 'Action Title',
            maxLength: 255,
            mandatory: true,
        }),

        rationale: MultiLineTextColumn({
            label: 'Operational Rationale',
            maxLength: 4000,
            mandatory: true,
        }),

        // ── Target Entity ─────────────────────────────────────────────────────
        target_table: StringColumn({
            label: 'Target Table',
            maxLength: 80,
            mandatory: true,
        }),

        target_record: StringColumn({
            label: 'Target Record Sys ID',
            maxLength: 32,
            mandatory: true,
        }),

        // ── Parameters & State Snapshots (JSON) ───────────────────────────────
        proposed_parameters: MultiLineTextColumn({
            label: 'Proposed Parameters (JSON)',
            maxLength: 4000,
        }),

        snapshot_state: MultiLineTextColumn({
            label: 'Snapshot State at Proposal (JSON)',
            maxLength: 4000,
        }),

        // ── Actors & Accountability ───────────────────────────────────────────
        proposed_by: ReferenceColumn({
            label: 'Proposed By',
            referenceTable: 'sys_user',
        }),

        approved_by: ReferenceColumn({
            label: 'Approved By',
            referenceTable: 'sys_user',
        }),

        executed_by: ReferenceColumn({
            label: 'Executed By',
            referenceTable: 'sys_user',
        }),

        // ── Timestamps ────────────────────────────────────────────────────────
        approval_time: DateTimeColumn({
            label: 'Approval Timestamp',
        }),

        execution_time: DateTimeColumn({
            label: 'Execution Timestamp',
        }),

        // ── Results & Audit ───────────────────────────────────────────────────
        execution_result: MultiLineTextColumn({
            label: 'Execution Result (JSON)',
            maxLength: 4000,
        }),

        rejection_reason: MultiLineTextColumn({
            label: 'Rejection Reason',
            maxLength: 1000,
        }),

        failure_reason: MultiLineTextColumn({
            label: 'Failure Reason',
            maxLength: 1000,
        }),

        idempotency_key: StringColumn({
            label: 'Idempotency Key',
            maxLength: 120,
        }),
    },
})
