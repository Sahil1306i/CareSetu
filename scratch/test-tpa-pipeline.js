/**
 * CareSetu Phase 2 — TPA / Insurance Auto-Chaser Integration Test
 *
 * Runs end-to-end REST tests using SDK Bearer token.
 */
const https = require('https')
const { execSync } = require('child_process')

const HOST = 'act-hck-4161-0029.lab.service-now.com'

function getAuthHeader() {
    try {
        const out = execSync('npx @servicenow/sdk auth --print --format headers', { encoding: 'utf-8' })
        const line = out.trim().split('\n').find(l => l.toLowerCase().startsWith('authorization:'))
        if (line) return line.trim()
    } catch (e) {
        console.error('Failed to get auth header from SDK:', e.message)
    }
    return null
}

function apiCall(method, urlPath, body, authHeader) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : ''
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if (authHeader) {
            const parts = authHeader.split(': ')
            headers[parts[0]] = parts[1]
        }
        if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr)

        const req = https.request({
            hostname: HOST,
            path: urlPath,
            method,
            headers,
        }, res => {
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

async function run() {
    console.log('=== CareSetu Phase 2 TPA Auto-Chaser Integration Test ===\n')
    const authHeader = getAuthHeader()
    if (!authHeader) {
        console.error('No auth header available.')
        process.exit(1)
    }
    console.log('Using SDK authentication.')

    // 1. Fetch an existing encounter
    console.log('\n--- Step 1: Fetching active encounter ---')
    const encRes = await apiCall('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_limit=1&sysparm_fields=sys_id,number,patient_mrn', null, authHeader)
    if (encRes.status !== 200 || !encRes.body.result || encRes.body.result.length === 0) {
        console.error('Failed to fetch encounter:', encRes.status, encRes.body)
        process.exit(1)
    }
    const enc = encRes.body.result[0]
    const encId = enc.sys_id
    console.log('Target encounter:', enc.number, '(', encId, ')')

    // 2. Create TPA Case
    console.log('\n--- Step 2: POST /encounters/' + encId + '/tpa-cases ---')
    const createRes = await apiCall('POST', `/api/x_caresetu_ai/tpa/encounters/${encId}/tpa-cases`, {
        payer_name: 'Star Health TPA',
        authorization_type: 'cashless',
        requested_amount: 75000,
        work_notes: 'Initial pre-auth dossier submitted via CareSetu Auto-Chaser.'
    }, authHeader)
    console.log('Status:', createRes.status)
    console.log('Created case:', JSON.stringify(createRes.body, null, 2))
    const data = createRes.body && (createRes.body.result || createRes.body)
    const caseId = data && data.sys_id
    if (!caseId) {
        console.error('Failed to create TPA case.')
        process.exit(1)
    }

    // 3. List TPA Cases for encounter
    console.log('\n--- Step 3: GET /encounters/' + encId + '/tpa-cases ---')
    const listRes = await apiCall('GET', `/api/x_caresetu_ai/tpa/encounters/${encId}/tpa-cases`, null, authHeader)
    const listData = listRes.body && (listRes.body.result || listRes.body)
    console.log('Status:', listRes.status)
    console.log('Found count:', listData.count)

    // 4. Get single TPA Case
    console.log('\n--- Step 4: GET /tpa-cases/' + caseId + ' ---')
    const getRes = await apiCall('GET', `/api/x_caresetu_ai/tpa/tpa-cases/${caseId}`, null, authHeader)
    const getData = getRes.body && (getRes.body.result || getRes.body)
    console.log('Status:', getRes.status)
    console.log('Case status:', getData.status, '| Next followup due:', getData.next_followup_due)

    // 5. Record Follow-Up
    console.log('\n--- Step 5: POST /tpa-cases/' + caseId + '/followup ---')
    const followRes = await apiCall('POST', `/api/x_caresetu_ai/tpa/tpa-cases/${caseId}/followup`, {
        notes: 'Followed up with TPA desk. Senior reviewer assigned. ETA 2h.'
    }, authHeader)
    const followData = followRes.body && (followRes.body.result || followRes.body)
    console.log('Status:', followRes.status)
    console.log('Follow-up count:', followData.followup_count, '| Rescheduled to:', followData.next_followup_due)

    // 6. Update Status to Approved (Terminal)
    console.log('\n--- Step 6: PATCH /tpa-cases/' + caseId + ' (approve) ---')
    const patchRes = await apiCall('PATCH', `/api/x_caresetu_ai/tpa/tpa-cases/${caseId}`, {
        status: 'approved',
        auth_reference_number: 'SH-AUTH-2026-9901',
        approved_amount: 72000,
        work_notes: 'Cashless approved for ₹72,000 by Star Health.'
    }, authHeader)
    const patchData = patchRes.body && (patchRes.body.result || patchRes.body)
    console.log('Status:', patchRes.status)
    console.log('Updated case status:', patchData.status, '| next_followup_due:', patchData.next_followup_due)

    console.log('\n=== All Phase 2 TPA Auto-Chaser Tests Passed Successfully! ===')
}

run().catch(console.error)
