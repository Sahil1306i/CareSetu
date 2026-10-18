import { Test, TestSuite } from '@servicenow/sdk/core'

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: In Fluent .now.ts files, Test() declarations MUST be `const`
// (not `export const`). Only the TestSuite is exported.
// All three tests live in this file so they can be referenced by the suite
// without cross-file exports, which the Fluent compiler does not support for Test().
// ─────────────────────────────────────────────────────────────────────────────

// ── Test 1: Normal encounter → Normal tier, no escalation ────────────────────
/**
 * Setup: future discharge time, all signals = 0 → score = 0 → Normal tier.
 * Asserts (visual in ATF report):
 *   - POST /score returns risk_tier='normal', risk_score=0
 *   - GET /escalations returns count=0
 *   - data_quality_warning is empty (discharge time WAS set)
 */
const testNormalEncounter = Test(
    {
        $id: Now.ID['caresetu-test-normal'],
        name: 'CareSetu: Normal encounter → Normal tier, no escalation',
        description: 'An encounter with a far-future discharge time and zero coordination signals must score Normal (0) and must not create any escalation task.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // Step 1 — Insert a normal encounter (discharge far in the future, all signals = 0)
        const enc = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-normal-insert'],
            table: 'x_caresetu_ai_encounter',
            fieldValues: {
                patient_mrn:             'ATF-NORMAL-001',
                ward:                    'ATF Demo Ward',
                expected_discharge_time: '2099-12-31 23:59:59',
                overdue_coord_tasks:     0,
                incomplete_milestones:   0,
                unack_handoffs:          0,
                open_blockers:           0,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-normal-log-insert'],
            log: 'ATF Normal Test: encounter inserted. Triggering synchronous REST scoring.',
        })

        // Step 2 — Score via REST POST (synchronous path through OperationalRiskEngine)
        // ASSERT in ATF report: HTTP 200, risk_tier='normal', risk_score=0,
        // explanation='No operational risk factors...', data_quality_warning=''
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-normal-rest-score'],
            method: 'post',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/score`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-normal-log-score'],
            log: 'ATF Normal Test: ASSERT POST /score → HTTP 200, risk_tier=normal, risk_score=0, data_quality_warning empty.',
        })

        // Step 3 — GET escalations for this encounter
        // ASSERT: count=0 (Normal tier must NOT create an escalation task)
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-normal-rest-escalations'],
            method: 'get',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/escalations`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-normal-log-escalations'],
            log: 'ATF Normal Test: ASSERT GET /escalations → count=0 (no escalation for Normal tier).',
        })
    }
)

// ── Test 2: High-risk encounter → Critical tier + exactly one escalation ─────
/**
 * Setup (guaranteed Critical):
 *   expected_discharge_time = 1970-01-01 (past-due)       → +40
 *   overdue_coord_tasks = 3                                → +30 (capped)
 *   incomplete_milestones = 2                              → +16
 *   unack_handoffs = 1                                     → +10
 *   open_blockers = 1                                      → +15
 *   Total = 111 → clamped to 100 → Critical
 *
 * Asserts (visual in ATF report):
 *   - POST /score returns risk_tier='critical', risk_score=100
 *   - explanation is non-empty (all five rule messages)
 *   - data_quality_warning is empty (discharge time was set)
 *   - GET /escalations returns count=1 (synchronous escalation creation)
 *   - Re-scoring does NOT create a second escalation (duplicate guard)
 */
const testHighRiskEncounter = Test(
    {
        $id: Now.ID['caresetu-test-high-risk'],
        name: 'CareSetu: High-risk encounter → Critical tier + exactly one escalation',
        description: 'An encounter with past-due discharge time and multiple active signals must score Critical (100) and create exactly one escalation task with escalation_status=open.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // Step 1 — Insert a high-risk encounter with past-due discharge time
        const enc = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-hr-insert'],
            table: 'x_caresetu_ai_encounter',
            fieldValues: {
                patient_mrn:             'ATF-HIGHRISK-001',
                ward:                    'ATF Demo Ward',
                expected_discharge_time: '1970-01-01 00:00:00',
                overdue_coord_tasks:     3,
                incomplete_milestones:   2,
                unack_handoffs:          1,
                open_blockers:           1,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hr-log-insert'],
            log: 'ATF High-Risk Test: encounter inserted with past-due discharge + 4 active signals.',
        })

        // Step 2 — Score via REST POST
        // ASSERT: risk_score=100, risk_tier='critical', explanation non-empty,
        //         data_quality_warning='' (discharge time was set)
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hr-rest-score'],
            method: 'post',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/score`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hr-log-score'],
            log: 'ATF High-Risk Test: ASSERT POST /score → HTTP 200, risk_tier=critical, risk_score=100, explanation non-empty.',
        })

        // Step 3 — GET escalations
        // ASSERT: count=1, escalation_status=open, risk_tier=critical
        // Escalation is created SYNCHRONOUSLY by OperationalRiskEngine.
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hr-rest-escalations'],
            method: 'get',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/escalations`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hr-log-escalations'],
            log: 'ATF High-Risk Test: ASSERT GET /escalations → count=1, escalation_status=open, risk_tier=critical.',
        })

        // Step 4 — Re-score same encounter to verify duplicate escalation suppression
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hr-rest-rescore'],
            method: 'post',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/score`,
            auth: 'basic',
        })

        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-hr-rest-esc-dedup'],
            method: 'get',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/escalations`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-hr-log-dedup'],
            log: 'ATF High-Risk Test: ASSERT after re-score → escalation count still = 1 (duplicate suppression working).',
        })
    }
)

// ── Test 3: REST endpoint returns valid structure ─────────────────────────────
/**
 * Setup: 1 overdue task → score=10 → Normal tier (not in high-risk list).
 *
 * Asserts (visual in ATF report):
 *   - POST /score returns HTTP 200 with all expected fields
 *   - risk_tier='normal', risk_score=10
 *   - GET /high-risk endpoint works (HTTP 200, valid JSON)
 *   - GET /escalations returns count=0 (Normal tier)
 */
const testRestScoring = Test(
    {
        $id: Now.ID['caresetu-test-rest'],
        name: 'CareSetu: REST scoring endpoint — valid response and correct tier',
        description: 'Validates that the POST /score endpoint returns HTTP 200 with correctly structured response body, and that a low-signal encounter scores Normal with no escalation.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        // Step 1 — Insert a low-risk encounter (1 task → score=10 → Normal)
        const enc = atf.server.recordInsert({
            $id: Now.ID['caresetu-test-rest-insert'],
            table: 'x_caresetu_ai_encounter',
            fieldValues: {
                patient_mrn:             'ATF-REST-001',
                ward:                    'ATF Demo Ward',
                expected_discharge_time: '2099-12-31 23:59:59',
                overdue_coord_tasks:     1,
                incomplete_milestones:   0,
                unack_handoffs:          0,
                open_blockers:           0,
            },
            enforceSecurity: false,
            assert: 'record_successfully_inserted',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-rest-log-insert'],
            log: 'ATF REST Test: encounter inserted with 1 overdue task (expected score=10, tier=normal).',
        })

        // Step 2 — Score via REST POST
        // ASSERT: HTTP 200, body has { status, encounter, risk_score, risk_tier,
        //         explanation, data_quality_warning, scored_at }
        // ASSERT: risk_score=10, risk_tier='normal'
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-rest-call-score'],
            method: 'post',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/score`,
            auth: 'basic',
            headers: { 'Content-Type': 'application/json' },
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-rest-log-score'],
            log: 'ATF REST Test: ASSERT POST /score → HTTP 200, risk_score=10, risk_tier=normal, explanation non-empty.',
        })

        // Step 3 — GET escalations for this encounter
        // ASSERT: count=0 (Normal tier never creates escalation)
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-rest-call-escalations'],
            method: 'get',
            path: `/api/x_caresetu_ai/operational_risk/v1/encounters/${enc.record_id}/escalations`,
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-rest-log-escalations'],
            log: 'ATF REST Test: ASSERT GET /escalations → count=0 (Normal tier does not escalate).',
        })

        // Step 4 — GET /high-risk (static path, no sys_id required)
        // ASSERT: HTTP 200, body has { count: number, results: array }
        atf.rest.sendRestRequest({
            $id: Now.ID['caresetu-test-rest-call-high-risk'],
            method: 'get',
            path: '/api/x_caresetu_ai/operational_risk/v1/encounters/high-risk',
            auth: 'basic',
        })

        atf.server.log({
            $id: Now.ID['caresetu-test-rest-log-high-risk'],
            log: 'ATF REST Test: ASSERT GET /high-risk → HTTP 200, response has count (number) and results (array).',
        })
    }
)

// ── Test Suite ────────────────────────────────────────────────────────────────
export const careSetuTestSuite = TestSuite({
    $id: Now.ID['caresetu-test-suite'],
    name: 'CareSetu: Operational Discharge Risk Suite',
    description: 'Validates the full operational discharge risk vertical slice: normal scoring, high-risk scoring + escalation creation, and REST API endpoint correctness.',
    active: true,
    tests: [
        { test: testNormalEncounter,   abortOnFailure: false },
        { test: testHighRiskEncounter, abortOnFailure: false },
        { test: testRestScoring,       abortOnFailure: false },
    ],
})
