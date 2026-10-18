import {
    Table,
    StringColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
    MultiLineTextColumn,
} from '@servicenow/sdk/core'

/**
 * CareSetu AI — Smart Handoff Table (x_caresetu_ai_handoff)
 *
 * Tracks clinical & operational handoffs across nursing shifts and hospital departments.
 * Provides closed-loop accountability to eliminate delayed or lost patient handoffs
 * during discharge coordination and transfer workflows.
 *
 * Status Lifecycle:
 *   pending_acknowledgment → acknowledged → in_progress → completed
 *                          → escalated (if acknowledgment SLA breaches)
 *                          → cancelled
 *
 * Closed-Loop Integration:
 *   - Synchronizes encounter.unack_handoffs to reflect active pending handoffs.
 *   - Auto-escalates overdue handoffs into operational blockers (category='handoff').
 *   - Resolves linked blockers when handoff is acknowledged, completed, or cancelled.
 */
export const x_caresetu_ai_handoff = Table({
    name: 'x_caresetu_ai_handoff',
    label: 'Care Handoff',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'HND', numberOfDigits: 7, number: 1000001 },
    schema: {
        // ── Core Identity ──────────────────────────────────────────────────────
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // ── Sender Information ────────────────────────────────────────────────
        sending_department: StringColumn({
            label: 'Sending Department',
            mandatory: true,
            maxLength: 100,
        }),

        sending_staff: ReferenceColumn({
            label: 'Sending Staff',
            referenceTable: 'sys_user',
            mandatory: true,
        }),

        // ── Recipient Information ─────────────────────────────────────────────
        receiving_department: StringColumn({
            label: 'Receiving Department',
            mandatory: true,
            maxLength: 100,
        }),

        receiving_staff: ReferenceColumn({
            label: 'Receiving Staff',
            referenceTable: 'sys_user',
        }),

        // ── Classification & Priority ─────────────────────────────────────────
        category: StringColumn({
            label: 'Category',
            mandatory: true,
            choices: {
                shift_change:   'Shift Change',
                inter_unit:     'Inter-Unit Transfer',
                post_op:        'Post-Operative',
                discharge_prep: 'Discharge Preparation',
                procedure:      'Diagnostic / Procedure Transfer',
            },
            default: 'shift_change',
        }),

        priority: StringColumn({
            label: 'Priority',
            mandatory: true,
            choices: {
                routine:  'Routine (30m SLA)',
                urgent:   'Urgent (15m SLA)',
                critical: 'Critical (5m SLA)',
            },
            default: 'routine',
        }),

        summary: StringColumn({
            label: 'Handoff Summary',
            mandatory: true,
            maxLength: 255,
        }),

        handoff_details: MultiLineTextColumn({
            label: 'Operational Handoff Details',
            maxLength: 4000,
        }),

        // ── Status Lifecycle ──────────────────────────────────────────────────
        status: StringColumn({
            label: 'Status',
            mandatory: true,
            choices: {
                pending_acknowledgment: 'Pending Acknowledgment',
                acknowledged:           'Acknowledged',
                in_progress:            'In Progress',
                completed:              'Completed',
                escalated:              'Escalated',
                cancelled:              'Cancelled',
            },
            default: 'pending_acknowledgment',
        }),

        // ── Timing & SLA Tracking ─────────────────────────────────────────────
        creation_time: DateTimeColumn({
            label: 'Creation Time',
        }),

        acknowledgment_deadline: DateTimeColumn({
            label: 'Acknowledgment Deadline',
        }),

        acknowledged_time: DateTimeColumn({
            label: 'Acknowledged Time',
        }),

        completion_time: DateTimeColumn({
            label: 'Completion Time',
        }),

        is_overdue: BooleanColumn({
            label: 'Overdue',
            default: 'false',
        }),

        // ── Accountability & Closure ──────────────────────────────────────────
        rejection_reason: StringColumn({
            label: 'Rejection / Escalation Reason',
            maxLength: 500,
        }),

        resolution_notes: MultiLineTextColumn({
            label: 'Resolution Notes / Audit History',
            maxLength: 4000,
        }),

        linked_blocker: ReferenceColumn({
            label: 'Linked Blocker',
            referenceTable: 'x_caresetu_ai_blocker',
        }),
    },
})
