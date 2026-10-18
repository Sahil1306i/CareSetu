const https = require('https')
const { execSync } = require('child_process')

const HOST = 'act-hck-4161-0029.lab.service-now.com'

function getAuthHeader() {
    const out = execSync('npx @servicenow/sdk auth --print --format headers', { encoding: 'utf-8' })
    const line = out.trim().split('\n').find(l => l.toLowerCase().startsWith('authorization:'))
    return line ? line.trim() : null
}

function apiCall(method, urlPath, body, authHeader) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : ''
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        if (authHeader) {
            const parts = authHeader.split(': ')
            headers[parts[0]] = parts[1]
        }
        if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr)

        const req = https.request({ hostname: HOST, path: urlPath, method, headers }, res => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
                catch (_) { resolve({ status: res.statusCode, body: data }) }
            })
        })
        req.on('error', reject)
        if (bodyStr) req.write(bodyStr)
        req.end()
    })
}

async function main() {
    const authHeader = getAuthHeader()
    console.log('======================================================================')
    console.log('CareSetu AI — Phase 3.2 Comprehensive Regression & Integrity Validation')
    console.log('======================================================================')

    const enc7Id = '8471c7d719a303107f44b568fd251413'  // ENC1000007
    const enc10Id = '4ac253df192703107f44b568fd251482' // ENC1000010

    // ──────────────────────────────────────────────────────────────────────────
    // 1. HOSPITAL-WIDE DISCHARGE PRIORITIZATION BRIEFING
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 1] Hospital-Wide Prioritization Query:')
    const briefingRes = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'What should I prioritize right now?' },
        authHeader
    )
    console.log('Status:', briefingRes.status)
    const briefingText = briefingRes.body.result && briefingRes.body.result.response
    console.log('Briefing Response:\n', briefingText)

    // Verify key fields in briefing
    const hasExecutiveSummary = briefingText.includes('Operational Executive Summary')
    const hasEscalationsInSummary = briefingText.includes('escalation task(s) active')
    const hasTpaInSummary = briefingText.includes('pending TPA / insurance authorization case(s)')
    const hasOverdueInSummary = briefingText.includes('overdue')
    console.log('Validation: Executive summary contains active escalations:', hasEscalationsInSummary)
    console.log('Validation: Executive summary contains pending TPA cases:', hasTpaInSummary)
    console.log('Validation: Executive summary contains overdue handoffs:', hasOverdueInSummary)

    // ──────────────────────────────────────────────────────────────────────────
    // 2. ENCOUNTER-SPECIFIC EXPLANATION: ENC1000007
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 2] Encounter Risk Explanation: ENC1000007:')
    const enc7Res = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'Explain the discharge risk for ENC1000007.' },
        authHeader
    )
    console.log('Status:', enc7Res.status)
    const enc7Text = enc7Res.body.result && enc7Res.body.result.response
    console.log('ENC1000007 Response:\n', enc7Text)

    // ──────────────────────────────────────────────────────────────────────────
    // 3. ENCOUNTER-SPECIFIC EXPLANATION: ENC1000010
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 3] Encounter Risk Explanation: ENC1000010:')
    const enc10Res = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'Explain the discharge risk for ENC1000010.' },
        authHeader
    )
    console.log('Status:', enc10Res.status)
    const enc10Text = enc10Res.body.result && enc10Res.body.result.response
    console.log('ENC1000010 Response:\n', enc10Text)

    // Verify comparison section in both
    console.log('Validation: ENC1000007 includes baseline comparison:', enc7Text.includes('Operational State Comparison vs. Scoring Baseline'))
    console.log('Validation: ENC1000010 includes baseline comparison:', enc10Text.includes('Operational State Comparison vs. Scoring Baseline'))

    // ──────────────────────────────────────────────────────────────────────────
    // 4. BLOCKER AND HANDOFF COUNT SYNCHRONIZATION
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 4] Blocker and Handoff Count Synchronization:')
    const encs = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_encounter?sysparm_fields=sys_id,number,open_blockers,unack_handoffs,overdue_coord_tasks,incomplete_milestones',
        null,
        authHeader
    )
    const encList = encs.body.result || []
    let allCountersMatch = true
    for (const e of encList) {
        const blkRes = await apiCall('GET', `/api/now/table/x_caresetu_ai_blocker?sysparm_query=encounter=${e.sys_id}^statusINopen,in_progress,escalated`, null, authHeader)
        const liveBlk = (blkRes.body.result || []).length
        const hndRes = await apiCall('GET', `/api/now/table/x_caresetu_ai_handoff?sysparm_query=encounter=${e.sys_id}^statusINpending_acknowledgment,escalated`, null, authHeader)
        const liveHnd = (hndRes.body.result || []).length

        const storedBlk = parseInt(e.open_blockers, 10) || 0
        const storedHnd = parseInt(e.unack_handoffs, 10) || 0

        const blkMatch = storedBlk === liveBlk
        const hndMatch = storedHnd === liveHnd
        if (!blkMatch || !hndMatch) allCountersMatch = false

        console.log(`[${e.number}] open_blockers: stored=${storedBlk} live=${liveBlk} (${blkMatch ? 'MATCH' : 'MISMATCH'}) | unack_handoffs: stored=${storedHnd} live=${liveHnd} (${hndMatch ? 'MATCH' : 'MISMATCH'})`)
    }
    console.log('All encounter counters perfectly synchronized with live child records:', allCountersMatch)

    // ──────────────────────────────────────────────────────────────────────────
    // 5. REST API: GET /encounters/{id}/blockers
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 5] REST API: GET /encounters/{id}/blockers:')
    const getBlkRes = await apiCall(
        'GET',
        `/api/x_caresetu_ai/discharge_prediction/encounters/${enc7Id}/blockers`,
        null,
        authHeader
    )
    console.log('Status:', getBlkRes.status)
    const blkResult = getBlkRes.body.result || getBlkRes.body
    console.log('Returned blocker count:', blkResult.count)
    console.log('Blocker numbers:', (blkResult.blockers || []).map(b => `${b.number} (${b.category}, status:${b.status})`))

    // ──────────────────────────────────────────────────────────────────────────
    // 6. RESCORE AND ESCALATION SYNCHRONIZATION
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 6] Rescore and Escalation Synchronization on ENC1000007:')
    const rescore7 = await apiCall(
        'POST',
        `/api/x_caresetu_ai/operational_risk/encounters/${enc7Id}/score`,
        null,
        authHeader
    )
    console.log('Rescore Status:', rescore7.status)
    const rescoreResult = rescore7.body.result || rescore7.body
    console.log('Rescored score:', rescoreResult.risk_score, 'tier:', rescoreResult.risk_tier)
    console.log('Explanation:', rescoreResult.explanation)

    const escCheck = await apiCall(
        'GET',
        `/api/now/table/x_caresetu_ai_escalation?sysparm_query=encounter=${enc7Id}&sysparm_fields=sys_id,number,escalation_status,priority,risk_score,risk_tier,reason,sys_updated_on`,
        null,
        authHeader
    )
    const escList = escCheck.body.result || []
    console.log(`Total active escalations on ENC1000007: ${escList.length} (must be exactly 1)`)
    for (const esc of escList) {
        console.log(`  ${esc.number}: status=${esc.escalation_status} tier=${esc.risk_tier} score=${esc.risk_score} priority=${esc.priority}`)
        console.log(`  Reason: ${esc.reason}`)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 7. TPA CASES & FOLLOW-UP RECORDING
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 7] TPA Case Lifecycle & Follow-up Recording:')
    // Query TPA cases via Table API to find an active case
    const tpaTableRes = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_tpa_case?sysparm_fields=sys_id,encounter,number,payer_name,status,is_overdue&sysparm_query=statusINsubmitted,pending_documents,under_review,escalated',
        null,
        authHeader
    )
    const activeTpaCases = tpaTableRes.body.result || []
    console.log(`Active TPA cases in instance: ${activeTpaCases.length}`)
    if (activeTpaCases.length > 0) {
        const testCase = activeTpaCases[0]
        const testCaseEnc = typeof testCase.encounter === 'object' ? testCase.encounter.value : testCase.encounter
        // Call GET /encounters/{id}/tpa-cases
        const listTpaRes = await apiCall(
            'GET',
            `/api/x_caresetu_ai/tpa/encounters/${testCaseEnc}/tpa-cases`,
            null,
            authHeader
        )
        console.log(`GET /tpa/encounters/{id}/tpa-cases Status:`, listTpaRes.status)
        const listTpaData = listTpaRes.body.result || listTpaRes.body
        console.log(`Cases returned for encounter:`, listTpaData.count)

        console.log(`Testing follow-up recording on case: ${testCase.sys_id} (${testCase.payer_name}, status: ${testCase.status})`)
        const followupRes = await apiCall(
            'POST',
            `/api/x_caresetu_ai/tpa/tpa-cases/${testCase.sys_id}/followup`,
            { notes: 'Automated regression test verification follow-up call completed with payer representative.' },
            authHeader
        )
        console.log('Follow-up status:', followupRes.status)
        const fuData = followupRes.body.result || followupRes.body
        console.log('Follow-up result:', JSON.stringify(fuData))
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 8. HANDOFF LIFECYCLE & LIST API
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 8] Handoff List REST API:')
    const handoffListRes = await apiCall(
        'GET',
        `/api/x_caresetu_ai/handoff/encounters/${enc7Id}/handoffs`,
        null,
        authHeader
    )
    console.log('GET /handoff/encounters/{id}/handoffs Status:', handoffListRes.status)
    const handoffData = handoffListRes.body.result || handoffListRes.body
    console.log('Handoff count for ENC1000007:', handoffData.count)
    console.log('Handoffs:', (handoffData.handoffs || []).map(h => `${h.number} (${h.priority}, status:${h.status})`))

    // ──────────────────────────────────────────────────────────────────────────
    // 9. HIGH RISK ENCOUNTERS REST API
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 9] High Risk Encounters REST API:')
    const hrRes = await apiCall(
        'GET',
        '/api/x_caresetu_ai/operational_risk/encounters/high-risk',
        null,
        authHeader
    )
    console.log('GET /encounters/high-risk Status:', hrRes.status)
    const hrData = hrRes.body.result || hrRes.body
    console.log('High risk encounters count:', hrData.count)
    for (const h of hrData.results || []) {
        console.log(`  ${h.encounter_number} (${h.ward}): score=${h.risk_score} [${h.risk_tier}] scored_at=${h.scored_at}`)
    }

    console.log('\n======================================================================')
    console.log('Phase 3.2 Regression Suite Completed Successfully!')
    console.log('======================================================================')
}

main().catch(console.error)
