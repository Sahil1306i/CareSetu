import {
    Table,
    StringColumn,
    IntegerColumn,
    ReferenceColumn,
    DateTimeColumn,
} from '@servicenow/sdk/core'

/**
 * Patient Encounter table — x_caresetu_ai_encounter
 *
 * Extends the platform 'task' table to inherit: number (auto), state, priority,
 * assigned_to, short_description, description, work_notes, sys_created_on, etc.
 *
 * Stores the five operational coordination signals used for risk scoring.
 * Contains NO clinical data: no diagnosis, no vitals, no comorbidities.
 */
export const x_caresetu_ai_encounter = Table({
    name: 'x_caresetu_ai_encounter',
    label: 'Patient Encounter',
    extends: 'task',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'ENC', numberOfDigits: 7, number: 1000001 },
    schema: {
        // ── Patient identity (operational, not clinical) ──────────────────────
        patient_mrn: StringColumn({
            label: 'Patient MRN',
            mandatory: true,
            maxLength: 40,
        }),

        ward: StringColumn({
            label: 'Ward / Unit',
            maxLength: 80,
        }),

        // ── Discharge timing ──────────────────────────────────────────────────
        // expected_discharge_time — clinical target, used by OperationalRiskEngine for risk scoring.
        expected_discharge_time: DateTimeColumn({
            label: 'Expected Discharge Time',
            // Optional — absence triggers a data quality warning at scoring time,
            // but does NOT contribute to the risk score.
        }),

        // promised_discharge_time — time communicated to patient/family.
        // Used by DischargePredictionEngine as the baseline for delay calculation.
        // Defaults to expected_discharge_time if not set.
        promised_discharge_time: DateTimeColumn({
            label: 'Promised Discharge Time',
        }),

        actual_discharge_time: DateTimeColumn({
            label: 'Actual Discharge Time',
        }),

        // ── Bed assignment ────────────────────────────────────────────────────
        bed_number: StringColumn({
            label: 'Bed Number',
            maxLength: 20,
        }),

        // ── Operational coordination signals ──────────────────────────────────
        // These are the ONLY inputs to the risk scoring algorithm.
        // Updated by care coordinators as tasks/milestones/handoffs change.

        overdue_coord_tasks: IntegerColumn({
            label: 'Overdue Coordination Tasks',
            default: '0',
        }),

        incomplete_milestones: IntegerColumn({
            label: 'Incomplete Discharge Milestones',
            default: '0',
        }),

        unack_handoffs: IntegerColumn({
            label: 'Unacknowledged Handoffs',
            default: '0',
        }),

        open_blockers: IntegerColumn({
            label: 'Equipment / Workflow Blockers',
            default: '0',
        }),

        // ── Responsible parties ───────────────────────────────────────────────
        charge_nurse: ReferenceColumn({
            label: 'Charge Nurse',
            referenceTable: 'sys_user',
        }),
    },
})
