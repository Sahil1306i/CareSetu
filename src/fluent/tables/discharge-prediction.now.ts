import {
    Table,
    StringColumn,
    IntegerColumn,
    ReferenceColumn,
    DateTimeColumn,
    MultiLineTextColumn,
} from '@servicenow/sdk/core'

/**
 * CareSetu Discharge Prediction table — x_caresetu_ai_discharge_prediction
 *
 * Stores the output of DischargePredictionEngine for a given encounter.
 * One latest record per encounter (is_latest=true pattern, same as risk score).
 *
 * Prediction algorithm (deterministic, transparent, replaceable):
 *   predicted_discharge = promised_discharge
 *     + SUM(estimated_delay_minutes for open blockers)
 *     + overdue_coord_tasks_delay
 *     + unack_handoffs_delay
 *
 * The prediction_breakdown field stores a JSON array of
 * { category, label, delay_minutes } for UI display.
 *
 * Does NOT call any ML service. Fully deterministic from operational signals.
 */
export const x_caresetu_ai_discharge_prediction = Table({
    name: 'x_caresetu_ai_discharge_prediction',
    label: 'CareSetu Discharge Prediction',
    display: 'encounter',
    audit: false,
    allowWebServiceAccess: true,
    schema: {
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // ── Core prediction output ─────────────────────────────────────────────
        promised_discharge_time: DateTimeColumn({
            label: 'Promised Discharge Time',
        }),

        predicted_discharge_time: DateTimeColumn({
            label: 'Predicted Discharge Time',
        }),

        predicted_delay_minutes: IntegerColumn({
            label: 'Predicted Delay (minutes)',
            default: '0',
        }),

        // ── Breakdown ─────────────────────────────────────────────────────────
        // JSON array: [{ "category": "tpa", "label": "TPA / Insurance", "delay_minutes": 45 }, ...]
        // Stored as string; parsed by frontend for display.
        prediction_breakdown: MultiLineTextColumn({
            label: 'Prediction Breakdown (JSON)',
            maxLength: 4000,
        }),

        // ── Explanation ──────────────────────────────────────────────────────
        explanation: MultiLineTextColumn({
            label: 'Prediction Explanation',
            maxLength: 2000,
        }),

        // ── Freshness ────────────────────────────────────────────────────────
        // Latest-flag pattern consistent with x_caresetu_ai_risk_score.
        is_latest: StringColumn({
            label: 'Is Latest',
            default: 'true',
            choices: { true: 'Yes', false: 'No' },
        }),

        predicted_at: DateTimeColumn({
            label: 'Predicted At',
        }),
    },
})
