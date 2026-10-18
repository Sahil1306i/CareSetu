import {
    Table,
    FloatColumn,
    StringColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
} from '@servicenow/sdk/core'

/**
 * Discharge Risk Score table — x_caresetu_ai_risk_score
 *
 * One record per scoring run. A new record is inserted on every score computation;
 * previous records are archived (is_latest = false).
 * The current active score always has is_latest = true.
 *
 * The explanation field is a deterministic, rule-derived human-readable string.
 * No AI/LLM is used to generate the explanation.
 *
 * The data_quality_warning field is populated when expected_discharge_time is missing.
 * A warning does NOT affect the risk_score or risk_tier.
 */
export const x_caresetu_ai_risk_score = Table({
    name: 'x_caresetu_ai_risk_score',
    label: 'Discharge Risk Score',
    display: 'encounter',
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        risk_score: FloatColumn({
            label: 'Operational Risk Score (0–100)',
            mandatory: true,
        }),

        risk_tier: StringColumn({
            label: 'Risk Tier',
            choices: {
                normal:   'Normal',
                medium:   'Medium',
                high:     'High',
                critical: 'Critical',
            },
        }),

        // Deterministic, rule-derived. Each fired rule contributes one sentence.
        explanation: StringColumn({
            label: 'Explanation',
            maxLength: 4000,
        }),

        // Populated when expected_discharge_time is null.
        // Does not change risk_score or risk_tier.
        data_quality_warning: StringColumn({
            label: 'Data Quality Warning',
            maxLength: 1000,
        }),

        is_latest: BooleanColumn({
            label: 'Is Latest Score',
            default: 'true',
        }),

        scored_at: DateTimeColumn({
            label: 'Scored At',
        }),
    },
})
