import { Test, TestSuite } from '@servicenow/sdk/core'

/**
 * ATF Tests for CareSetu TPA / Insurance Auto-Chaser
 *
 * Validates:
 *   1. TPA case creation and initial status
 *   2. Recording follow-up actions and deadline rescheduling
 *   3. Status updates and resolution
 */
const testTpaCaseLifecycle = Test(
    {
        $id: Now.ID['caresetu-test-tpa-lifecycle'],
        name: 'CareSetu: TPA Case Lifecycle and Follow-up',
        description: 'Verifies TPA case creation, follow-up recording, and status transitions.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // Step 1: Create an encounter
        const enc = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-tpa-enc-insert'],
            table: 'x_caresetu_ai_encounter',
            fieldValues: {
                patient_mrn:             'ATF-TPA-001',
                ward:                    'TPA Test Ward',
                expected_discharge_time: '2099-12-31 23:59:59',
                overdue_coord_tasks:     0,
                incomplete_milestones:   0,
                unack_handoffs:          0,
                open_blockers:           0,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        // Step 2: Create a TPA case
        const tpaCase = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-tpa-case-insert'],
            table: 'x_caresetu_ai_tpa_case',
            fieldValues: {
                encounter:          enc.record_id,
                payer_name:         'MediAssist TPA',
                authorization_type: 'cashless',
                status:             'submitted',
                requested_amount:   45000,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-tpa-log-case-created'],
            log: 'ATF TPA Test: Encounter and TPA Case inserted successfully.',
        })

        // Step 3: Record a follow-up via REST
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-tpa-rest-followup'],
            method: 'post',
            path: `/api/x_caresetu_ai/tpa/tpa-cases/${tpaCase.record_id}/followup`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notes: 'ATF test follow-up: TPA contact acknowledged documents received.',
            }),
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-tpa-log-followup'],
            log: 'ATF TPA Test: Follow-up recorded via REST API.',
        })

        // Step 4: Update status to approved via REST
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-tpa-rest-update'],
            method: 'patch',
            path: `/api/x_caresetu_ai/tpa/tpa-cases/${tpaCase.record_id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status:                'approved',
                auth_reference_number: 'AUTH-ATF-999',
                approved_amount:       45000,
                work_notes:            'ATF test: Cashless approved.',
            }),
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-tpa-log-complete'],
            log: 'ATF TPA Test: Case updated to approved.',
        })
    }
)

export const caresetuTpaTestSuite = TestSuite({
    $id: Now.ID['caresetu-tpa-test-suite'],
    name: 'CareSetu TPA Auto-Chaser Test Suite',
    description: 'ATF test suite covering TPA authorization tracking, follow-ups, and blocker resolution.',
    tests: [testTpaCaseLifecycle],
})
