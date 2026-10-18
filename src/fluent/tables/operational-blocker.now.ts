import {
    Table,
    StringColumn,
    IntegerColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
    MultiLineTextColumn,
} from '@servicenow/sdk/core'

/**
 * CareSetu Operational Blocker table — x_caresetu_ai_blocker
 *
 * Stores individual operational blockers that are preventing or delaying
 * patient discharge. Replaces the coarse open_blockers integer on the
 * encounter with a rich, actionable record per blocker.
 *
 * Integration points:
 *   - DischargePredictionEngine reads active blockers to compute delay
 *   - BlockerSyncEngine keeps encounter.open_blockers in sync with active count
 *   - Fix-It-For-Me feature operates on individual blocker records
 *   - Frontend Encounter 360 shows the blocker list with actions
 *
 * Does NOT replace x_caresetu_ai_escalation — escalations are outcome records;
 * blockers are cause records. They coexist.
 */
export const x_caresetu_ai_blocker = Table({
    name: 'x_caresetu_ai_blocker',
    label: 'CareSetu Operational Blocker',
    display: 'number',
    audit: true,
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'BLK', numberOfDigits: 7, number: 1000001 },
    schema: {
        // ── Core identity ──────────────────────────────────────────────────────
        encounter: ReferenceColumn({
            label: 'Encounter',
            referenceTable: 'x_caresetu_ai_encounter',
            mandatory: true,
        }),

        // ── Blocker classification ─────────────────────────────────────────────
        // Drives delay estimation and UI grouping.
        category: StringColumn({
            label: 'Category',
            mandatory: true,
            choices: {
                tpa:            'TPA / Insurance',
                pharmacy:       'Pharmacy',
                handoff:        'Handoff',
                transport:      'Transport',
                equipment:      'Equipment',
                documentation:  'Documentation',
                coordination:   'Coordination',
                other:          'Other',
            },
        }),

        department: StringColumn({
            label: 'Department / Team',
            maxLength: 100,
        }),

        owner: ReferenceColumn({
            label: 'Owner',
            referenceTable: 'sys_user',
        }),

        // ── Status lifecycle ──────────────────────────────────────────────────
        // open → in_progress → resolved / escalated
        status: StringColumn({
            label: 'Status',
            choices: {
                open:        'Open',
                in_progress: 'In Progress',
                resolved:    'Resolved',
                escalated:   'Escalated',
            },
            default: 'open',
            mandatory: true,
        }),

        // ── Timing ────────────────────────────────────────────────────────────
        target_resolution_time: DateTimeColumn({
            label: 'Target Resolution Time',
        }),

        resolution_time: DateTimeColumn({
            label: 'Actual Resolution Time',
        }),

        is_overdue: BooleanColumn({
            label: 'Overdue',
            default: 'false',
        }),

        // ── Delay contribution ────────────────────────────────────────────────
        // Estimated minutes this blocker adds to the discharge delay.
        // Set by DischargePredictionEngine based on category defaults and age.
        estimated_delay_minutes: IntegerColumn({
            label: 'Estimated Delay (minutes)',
            default: '0',
        }),

        // ── Description ──────────────────────────────────────────────────────
        description: MultiLineTextColumn({
            label: 'Description',
            maxLength: 2000,
        }),

        resolution_notes: MultiLineTextColumn({
            label: 'Resolution Notes',
            maxLength: 2000,
        }),
    },
})
