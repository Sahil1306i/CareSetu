import {
    Table,
    StringColumn,
    FloatColumn,
    IntegerColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
    MultiLineTextColumn,
} from '@servicenow/sdk/core'

/**
 * TPA / Insurance Case table — x_caresetu_ai_tpa_case
 *
 * Tracks pending cashless approvals and insurance authorizations that may
 * block patient discharge. One record per authorization request per encounter.
 *
 * Integration points:
 *   - linked_blocker → x_caresetu_ai_blocker (category='tpa')
 *     One active blocker per unresolved TPA case.
 *   - TpaChaseEngine maintains the linked_blocker: creates it on overdue,
 *     resolves it when the case is approved/closed.
 *   - DischargePredictionEngine reads the blocker to compute delay.
 *   - Scheduled script 'tpa-followup-chaser' runs hourly to detect overdue cases.
 *
 * Does NOT store clinical information. Amounts are operational billing figures
 * (pre-auth amounts), not medical records.
 *
 * Status lifecycle:
 *   submitted → under_review → approved (clears blocker)
 *                           → rejected   (clears blocker, needs manual follow-up)
 *              → pending_documents       (team must gather and resubmit)
 *              → escalated               (blocker marked escalated)
 *              → closed                  (clears blocker, any terminal reason)
 */
export const x_caresetu_ai_tpa_case = Table({
    name: 'x_caresetu_ai_tpa_case',
    label: 'TPA / Insurance Case',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'TPA', numberOfDigits: 7, number: 1000001 },
    schema: {
        // ── Core identity ──────────────────────────────────────────────────────
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // ── Payer / authorization identity ────────────────────────────────────
        payer_name: StringColumn({
            label: 'Payer / TPA Name',
            mandatory: true,
            maxLength: 200,
        }),

        authorization_type: StringColumn({
            label: 'Authorization Type',
            mandatory: true,
            choices: {
                pre_auth:   'Pre-Authorization',
                cashless:   'Cashless Approval',
                final_bill: 'Final-Bill Authorization',
            },
            default: 'cashless',
        }),

        // Insurer-returned reference / approval number. Empty until received.
        auth_reference_number: StringColumn({
            label: 'Authorization / Reference Number',
            maxLength: 100,
        }),

        // ── Status lifecycle ──────────────────────────────────────────────────
        status: StringColumn({
            label: 'Status',
            mandatory: true,
            choices: {
                submitted:          'Submitted',
                pending_documents:  'Pending Documents',
                under_review:       'Under Review',
                approved:           'Approved',
                rejected:           'Rejected',
                escalated:          'Escalated',
                closed:             'Closed',
            },
            default: 'submitted',
        }),

        // ── Timing ────────────────────────────────────────────────────────────
        // Submission time defaults to record creation time in TpaChaseEngine.
        submission_time: DateTimeColumn({
            label: 'Submission Time',
        }),

        last_followup_time: DateTimeColumn({
            label: 'Last Follow-Up Time',
        }),

        // Computed by TpaChaseEngine.scheduleNextFollowup().
        // Cleared (null) when case is approved/rejected/closed.
        next_followup_due: DateTimeColumn({
            label: 'Next Follow-Up Due',
        }),

        followup_count: IntegerColumn({
            label: 'Follow-Up Count',
            default: '0',
        }),

        is_overdue: BooleanColumn({
            label: 'Overdue',
            default: 'false',
        }),

        // ── Amounts (operational billing, not clinical) ───────────────────────
        requested_amount: FloatColumn({
            label: 'Requested Amount (₹)',
        }),

        approved_amount: FloatColumn({
            label: 'Approved Amount (₹)',
        }),

        // ── Ownership and escalation ──────────────────────────────────────────
        assigned_owner: ReferenceColumn({
            label: 'Assigned Owner',
            referenceTable: 'sys_user',
        }),

        // ── Linked operational blocker ────────────────────────────────────────
        // Set by TpaChaseEngine when an unresolved case creates/updates a blocker.
        // Cleared when the blocker is resolved (case approved/closed).
        // At most ONE active linked blocker per TPA case.
        linked_blocker: ReferenceColumn({
            label: 'Linked Blocker',
            referenceTable: 'x_caresetu_ai_blocker',
        }),

        // ── Operational notes ─────────────────────────────────────────────────
        // Internal work log. Append-only in practice (staff notes per follow-up).
        work_notes: MultiLineTextColumn({
            label: 'Work Notes',
            maxLength: 8000,
        }),
    },
})
