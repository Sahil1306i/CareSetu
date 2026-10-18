import { List, default_view } from '@servicenow/sdk/core'

/**
 * CareSetu Escalation Task — default view List column configuration
 *
 * Defines which columns appear when the x_caresetu_ai_escalation table
 * is shown as a related list on the Patient Encounter form (Section 3).
 *
 * Column order (left to right):
 *   number              — auto-numbered ESC reference (inherited from task)
 *   risk_score          — snapshot of the score that triggered escalation
 *   risk_tier           — High / Critical
 *   reason              — rule-derived escalation reason
 *   escalation_status   — Open / Acknowledged / Resolved
 *   sys_created_on      — when the escalation was created
 *   assigned_to         — charge nurse assigned to this escalation
 *   state               — task state (inherited from task)
 *
 * Field names verified against live instance sys_dictionary.
 */
List({
    table: 'x_caresetu_ai_escalation',
    view: default_view,
    columns: [
        { element: 'number'            },
        { element: 'risk_score'        },
        { element: 'risk_tier'         },
        { element: 'reason'            },
        { element: 'escalation_status' },
        { element: 'sys_created_on'    },
        { element: 'assigned_to'       },
        { element: 'state'             },
    ],
})
