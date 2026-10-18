import { List, default_view } from '@servicenow/sdk/core'

/**
 * Discharge Risk Score — default view List column configuration
 *
 * Defines which columns appear when the x_caresetu_ai_risk_score table
 * is shown as a related list on the Patient Encounter form (Section 2).
 *
 * Column order (left to right):
 *   risk_score          — the 0–100 deterministic score
 *   risk_tier           — Normal / Medium / High / Critical
 *   explanation         — rule-derived human-readable explanation
 *   data_quality_warning — populated when expected_discharge_time is missing
 *   scored_at           — timestamp of this scoring run
 *   is_latest           — flag indicating the current score (filter hint)
 *
 * Field names verified against live instance sys_dictionary.
 */
List({
    table: 'x_caresetu_ai_risk_score',
    view: default_view,
    columns: [
        { element: 'risk_score'           },
        { element: 'risk_tier'            },
        { element: 'explanation'          },
        { element: 'data_quality_warning' },
        { element: 'scored_at'            },
        { element: 'is_latest'            },
    ],
})
