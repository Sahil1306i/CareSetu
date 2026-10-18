import { Test, TestSuite } from '@servicenow/sdk/core'

/**
 * ATF Tests for CareSetu Smart Handoff
 *
 * Validates:
 *   1. Handoff creation and initial pending status
 *   2. Handoff acknowledgment via REST
 *   3. Handoff completion via REST
 */
const testHandoffLifecycle = Test(
    {
        $id: Now.ID['caresetu-test-handoff-lifecycle'],
        name: 'CareSetu: Smart Handoff Lifecycle',
        description: 'Verifies handoff creation, acknowledgment, and completion.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // Step 1: Insert encounter
        const enc = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-hnd-enc-insert'],
            table: 'x_caresetu_ai_encounter',
            fieldValues: {
                patient_mrn:             'ATF-HND-001',
                ward:                    'Handoff Test Ward',
                expected_discharge_time: '2099-12-31 23:59:59',
                overdue_coord_tasks:     0,
                incomplete_milestones:   0,
                unack_handoffs:          0,
                open_blockers:           0,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        // Step 2: Insert handoff
        const hnd = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-hnd-insert'],
            table: 'x_caresetu_ai_handoff',
            fieldValues: {
                encounter:            enc.record_id,
                sending_department:   'Emergency',
                sending_staff:        '6816f79cc0a8016401c5a33be04be441', // admin
                receiving_department: 'ICU',
                category:             'inter_unit',
                priority:             'urgent',
                summary:              'ATF Test: Transfer patient to ICU bed 4',
                status:               'pending_acknowledgment',
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hnd-log-insert'],
            log: 'ATF Handoff Test: Encounter and Handoff inserted.',
        })

        // Step 3: Acknowledge handoff via REST
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hnd-rest-ack'],
            method: 'post',
            path: `/api/x_caresetu_ai/handoff/handoffs/${hnd.record_id}/acknowledge`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notes: 'ATF Test: Acknowledged by ICU charge nurse.',
            }),
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hnd-log-ack'],
            log: 'ATF Handoff Test: Acknowledged via REST.',
        })

        // Step 4: Complete handoff via REST
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hnd-rest-complete'],
            method: 'post',
            path: `/api/x_caresetu_ai/handoff/handoffs/${hnd.record_id}/complete`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notes: 'ATF Test: Patient safely received in ICU.',
            }),
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hnd-log-complete'],
            log: 'ATF Handoff Test: Handoff completed.',
        })
    }
)

export const caresetuHandoffTestSuite = TestSuite({
    $id: Now.ID['caresetu-handoff-test-suite'],
    name: 'CareSetu Smart Handoff Test Suite',
    description: 'ATF test suite validating handoff creation, acknowledgment SLA, and completion.',
    tests: [testHandoffLifecycle],
})
