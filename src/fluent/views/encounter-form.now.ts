import { Form, Formatter, default_view } from '@servicenow/sdk/core'

/**
 * CareSetu AI — Patient Encounter Form (default view)
 *
 * Sections:
 *   1. Encounter Details    — identity + timing fields (two-column)
 *   2. CareSetu Coordination Risk — the five signal fields + inline risk score list
 *   3. Escalation Status    — inline escalation task list
 *   4. Activity             — Activities_Filtered formatter
 *   5. Notes                — work_notes + description
 *
 * All field names verified against live instance sys_dictionary.
 * No scoring engine, BRs, REST API, Flow, ACLs, or tables are changed.
 *
 * Risk score and escalation data (risk_score, risk_tier, explanation,
 * data_quality_warning) live on x_caresetu_ai_risk_score and
 * x_caresetu_ai_escalation respectively. They are surfaced via inline
 * related lists in Sections 2 and 3 — the only correct way to show
 * cross-table fields on a Form() in the Fluent SDK.
 */
Form({
    table: 'x_caresetu_ai_encounter',
    view: default_view,
    sections: [

        // ── Section 1: Encounter Details ──────────────────────────────────────
        {
            caption: 'Encounter Details',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'number',                  type: 'table_field' },
                        { field: 'patient_mrn',             type: 'table_field' },
                        { field: 'ward',                    type: 'table_field' },
                        { field: 'charge_nurse',            type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'state',                   type: 'table_field' },
                        { field: 'priority',                type: 'table_field' },
                        { field: 'expected_discharge_time', type: 'table_field' },
                        { field: 'actual_discharge_time',   type: 'table_field' },
                    ],
                },
            ],
        },

        // ── Section 2: CareSetu Coordination Risk ─────────────────────────────
        // The five operational signals that drive the deterministic score.
        {
            caption: 'CareSetu Coordination Risk',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'overdue_coord_tasks',   type: 'table_field' },
                        { field: 'incomplete_milestones', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'unack_handoffs', type: 'table_field' },
                        { field: 'open_blockers',  type: 'table_field' },
                    ],
                },
            ],
        },

        // ── Section 2b: Discharge Risk Scores ────────────────────────────────
        // Embedded list must be in its own dedicated section (form-layout-guide rule).
        // Columns configured in risk-score-list.now.ts (default_view List()).
        // Shows: risk_score, risk_tier, explanation, data_quality_warning, scored_at.
        {
            caption: 'Discharge Risk Scores',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type:     'list',
                            listType: '12M',
                            listRef:  'x_caresetu_ai_risk_score.encounter',
                        },
                    ],
                },
            ],
        },

        // ── Section 3: Escalation Status ─────────────────────────────────────
        // Inline related list: x_caresetu_ai_escalation.encounter
        // Columns configured in escalation-list.now.ts (default_view List())
        {
            caption: 'Escalation Status',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type:     'list',
                            listType: '12M',
                            listRef:  'x_caresetu_ai_escalation.encounter',
                        },
                    ],
                },
            ],
        },

        // ── Section 4: Activity ───────────────────────────────────────────────
        // Use Formatter.Activities_Filtered constant (not a raw string).
        // This formatter already exists on all instances — no Record needed.
        {
            caption: 'Activity',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type:         'formatter',
                            formatterRef: Formatter.Activities_Filtered,
                        },
                    ],
                },
            ],
        },

        // ── Section 5: Notes ──────────────────────────────────────────────────
        {
            caption: 'Notes',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        { field: 'work_notes',  type: 'table_field' },
                        { field: 'description', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
