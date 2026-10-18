import {
    Table,
    FloatColumn,
    StringColumn,
    ReferenceColumn,
} from '@servicenow/sdk/core'

/**
 * CareSetu Escalation Task table — x_caresetu_ai_escalation
 *
 * Extends the platform 'task' table to inherit: number (auto-numbered ESC),
 * state, priority, assigned_to, short_description, description,
 * work_notes, sys_created_on, due_date, etc.
 *
 * Created synchronously by OperationalRiskEngine when risk_tier is
 * 'high' or 'critical'. One open escalation per encounter is allowed
 * (duplicate-suppressed by the engine).
 *
 * The escalation_status field tracks the lifecycle of the escalation
 * independently of the task's built-in state field.
 */
export const x_caresetu_ai_escalation = Table({
    name: 'x_caresetu_ai_escalation',
    label: 'CareSetu Escalation Task',
    extends: 'task',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'ESC', numberOfDigits: 7, number: 1000001 },
    schema: {
        // Reference to the triggering encounter
        encounter: ReferenceColumn({
            label: 'Patient Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // Snapshot of the risk score at the time of escalation
        risk_score: FloatColumn({
            label: 'Risk Score at Escalation',
        }),

        // Tier of the operational risk (critical, high, medium, normal)
        risk_tier: StringColumn({
            label: 'Risk Tier',
            choices: {
                critical: 'Critical',
                high:     'High',
                medium:   'Medium',
                normal:   'Normal',
            },
        }),

        // Human-readable explanation from the scoring rules
        reason: StringColumn({
            label: 'Escalation Reason',
            maxLength: 4000,
        }),

        // Escalation workflow status (separate from task state)
        escalation_status: StringColumn({
            label: 'Escalation Status',
            choices: {
                open:         'Open',
                acknowledged: 'Acknowledged',
                resolved:     'Resolved',
            },
            default: 'open',
        }),
    },
})
