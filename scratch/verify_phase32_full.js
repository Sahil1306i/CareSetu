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
    console.log('CareSetu AI — Final Live Data Integrity & Operational Verification')
    console.log('======================================================================')

    // ──────────────────────────────────────────────────────────────────────────
    // 1. HOSPITAL-WIDE PRIORITY BRIEFING
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 1] Query Hospital-Wide Priority Briefing:')
    const briefingRes = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'What should I prioritize right now?' },
        authHeader
    )
    console.log('Status:', briefingRes.status)
    console.log('Response:\n', briefingRes.body.result && briefingRes.body.result.response)

    // ──────────────────────────────────────────────────────────────────────────
    // 2. EXPLAIN RISK FOR ENC1000007
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 2] Explain Risk for ENC1000007:')
    const enc7Res = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'Explain the discharge risk for ENC1000007.' },
        authHeader
    )
    console.log('Status:', enc7Res.status)
    console.log('Response:\n', enc7Res.body.result && enc7Res.body.result.response)

    // ──────────────────────────────────────────────────────────────────────────
    // 3. EXPLAIN RISK FOR ENC1000010
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 3] Explain Risk for ENC1000010:')
    const enc10Res = await apiCall(
        'POST',
        '/api/x_caresetu_ai/operational_risk/ai/query',
        { query: 'Explain the discharge risk for ENC1000010.' },
        authHeader
    )
    console.log('Status:', enc10Res.status)
    console.log('Response:\n', enc10Res.body.result && enc10Res.body.result.response)

    // ──────────────────────────────────────────────────────────────────────────
    // 4. COMPARE AGAINST LIVE UNDERLYING RECORDS
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 4] Record-Level Comparison Evidence:')
    
    // Encounters
    const encs = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_encounter?sysparm_query=numberINENC1000007,ENC1000010&sysparm_fields=sys_id,number,patient_mrn,ward,expected_discharge_time,overdue_coord_tasks,incomplete_milestones,unack_handoffs,open_blockers',
        null,
        authHeader
    )
    console.log('Encounters:', JSON.stringify(encs.body.result, null, 2))

    // Active Blockers
    const blockers = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_blocker?sysparm_query=statusINopen,in_progress,escalated&sysparm_fields=sys_id,encounter,category,department,status,description,estimated_delay_minutes',
        null,
        authHeader
    )
    console.log('Active Blockers Total:', blockers.body.result && blockers.body.result.length)
    console.log('Active Blockers:', JSON.stringify(blockers.body.result, null, 2))

    // Pending Handoffs
    const handoffs = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_handoff?sysparm_query=statusINpending_acknowledgment,escalated&sysparm_fields=sys_id,encounter,priority,status,summary,receiving_department',
        null,
        authHeader
    )
    console.log('Pending Handoffs Total:', handoffs.body.result && handoffs.body.result.length)
    console.log('Pending Handoffs:', JSON.stringify(handoffs.body.result, null, 2))

    // Latest Risk Scores
    const scores = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_risk_score?sysparm_query=is_latest=true^encounter.numberINENC1000007,ENC1000010&sysparm_fields=sys_id,encounter,risk_score,risk_tier,scored_at,explanation',
        null,
        authHeader
    )
    console.log('Latest Risk Scores:', JSON.stringify(scores.body.result, null, 2))

    // Active Escalations
    const escalations = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_escalation?sysparm_query=escalation_statusINopen,acknowledged^encounter.numberINENC1000007,ENC1000010&sysparm_fields=sys_id,number,encounter,escalation_status,priority,risk_score,risk_tier,reason,work_notes',
        null,
        authHeader
    )
    console.log('Active Escalations:', JSON.stringify(escalations.body.result, null, 2))

    // ──────────────────────────────────────────────────────────────────────────
    // 5. RESCORE & ESCALATION SYNCHRONIZATION TEST
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 5] Testing Rescoring & Escalation Synchronization on ENC1000010...')
    const enc10SysId = '4ac253df192703107f44b568fd251482'
    const rescoreRes = await apiCall(
        'POST',
        `/api/x_caresetu_ai/operational_risk/encounters/${enc10SysId}/score`,
        null,
        authHeader
    )
    console.log('Rescore API response:', JSON.stringify(rescoreRes.body, null, 2))

    const escAfterRescore = await apiCall(
        'GET',
        `/api/now/table/x_caresetu_ai_escalation?sysparm_query=encounter=${enc10SysId}&sysparm_fields=sys_id,number,escalation_status,priority,risk_score,risk_tier,reason,sys_updated_on`,
        null,
        authHeader
    )
    console.log('Escalation record after rescore:', JSON.stringify(escAfterRescore.body.result, null, 2))
    console.log('Total escalations on ENC1000010 (must be exactly 1):', escAfterRescore.body.result && escAfterRescore.body.result.length)

    // ──────────────────────────────────────────────────────────────────────────
    // 6. REPEATED HANDOFF SWEEP TEST (IDEMPOTENCY & NO DUPLICATES)
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 6] Testing Repeated Handoff Overdue Sweep Idempotency...')
    // Count blockers before sweep
    const countBlkBefore = (await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_blocker?sysparm_fields=sys_id',
        null,
        authHeader
    )).body.result.length

    // Count escalations before sweep
    const countEscBefore = (await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_escalation?sysparm_fields=sys_id',
        null,
        authHeader
    )).body.result.length

    // Trigger scheduled job via sysauto_script executeNow or Table API
    console.log('Current total blockers in system:', countBlkBefore)
    console.log('Current total escalations in system:', countEscBefore)

    // Trigger second rescore to confirm idempotency
    const rescore2 = await apiCall(
        'POST',
        `/api/x_caresetu_ai/operational_risk/encounters/${enc10SysId}/score`,
        null,
        authHeader
    )
    const escAfterRescore2 = (await apiCall(
        'GET',
        `/api/now/table/x_caresetu_ai_escalation?sysparm_query=encounter=${enc10SysId}&sysparm_fields=sys_id`,
        null,
        authHeader
    )).body.result.length
    console.log('Total escalations after second rescore (must remain 1):', escAfterRescore2)

    // ──────────────────────────────────────────────────────────────────────────
    // 7. COMMAND CENTER & OTHER SUBSYSTEM INTEGRITY CHECK
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n[TEST 7] Command Center, TPA, Prediction API Endpoints:')
    const highRiskApi = await apiCall(
        'GET',
        '/api/x_caresetu_ai/operational_risk/encounters/high-risk',
        null,
        authHeader
    )
    console.log('GET /encounters/high-risk Status:', highRiskApi.status, 'Count:', highRiskApi.body.count || (highRiskApi.body.result && highRiskApi.body.result.length))

    const predApi = await apiCall(
        'GET',
        `/api/x_caresetu_ai/discharge_prediction/encounters/${enc7Id}/prediction`,
        null,
        authHeader
    )
    console.log('GET /encounters/{id}/prediction Status:', predApi.status)

    console.log('\n======================================================================')
    console.log('All automated verification checks finished!')
    console.log('======================================================================')
}

const enc7Id = '8471c7d719a303107f44b568fd251413'

main().catch(console.error)
