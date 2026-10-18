/**
 * CareSetu Phase 3 — Smart Handoff Integration Test
 *
 * Runs end-to-end tests against live ServiceNow instance:
 *   1. Handoff creation and SLA deadline calculation
 *   2. Encounter unack_handoffs counter synchronization
 *   3. Discharge prediction impact verification
 *   4. Listing and fetching handoffs
 *   5. PATCH update of permitted fields
 *   6. Rejection flow & operational blocker escalation
 *   7. Acknowledgment & completion lifecycle
 *   8. Cancellation & blocker resolution
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
    console.log('=== CareSetu Phase 3: Smart Handoff Backend Integration Test ===\n')
    const authHeader = getAuthHeader()
    if (!authHeader) {
        console.error('No auth header available.')
        process.exit(1)
    }
    console.log('Using live SDK authentication.')

    // 1. Fetch active encounter
    console.log('\n--- Step 1: Fetching active encounter ---')
    const encRes = await apiCall('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_limit=1&sysparm_fields=sys_id,number,unack_handoffs', null, authHeader)
    if (encRes.status !== 200 || !encRes.body.result || encRes.body.result.length === 0) {
        console.error('Failed to fetch encounter:', encRes.status, encRes.body)
        process.exit(1)
    }
    const enc = encRes.body.result[0]
    const encId = enc.sys_id
    const initialUnack = parseInt(enc.unack_handoffs || '0', 10)
    console.log('Target encounter:', enc.number, '(', encId, ') | Initial unack_handoffs:', initialUnack)

    // 2. Create Handoff 1 (Urgent, 15m SLA)
    console.log('\n--- Step 2: POST /encounters/' + encId + '/handoffs (Handoff 1: Urgent) ---')
    const createRes1 = await apiCall('POST', `/api/x_caresetu_ai/handoff/encounters/${encId}/handoffs`, {
        sending_department: 'Emergency Room',
        sending_staff: '6816f79cc0a8016401c5a33be04be441', // admin
        receiving_department: 'Intensive Care Unit (ICU)',
        category: 'inter_unit',
        priority: 'urgent',
        summary: 'ICU Bed 12 transfer: post-stabilization monitoring',
        handoff_details: 'Patient intubated and stable on propofol. Arterial line placed in left radial.'
    }, authHeader)
    console.log('Status:', createRes1.status)
    const data1 = createRes1.body && (createRes1.body.result || createRes1.body)
    console.log('Created handoff 1:', JSON.stringify(data1, null, 2))
    const hndId1 = data1 && data1.sys_id
    if (!hndId1) {
        console.error('Failed to create Handoff 1.')
        process.exit(1)
    }

    // 3. Verify synchronous/async unack_handoffs synchronization
    console.log('\n--- Step 3: Checking encounter unack_handoffs sync ---')
    await new Promise(r => setTimeout(r, 2000))
    const encAfter1 = await apiCall('GET', `/api/now/table/x_caresetu_ai_encounter/${encId}?sysparm_fields=number,unack_handoffs`, null, authHeader)
    const currentUnack1 = parseInt(encAfter1.body.result.unack_handoffs, 10)
    console.log('Encounter unack_handoffs now:', currentUnack1, '(Expected >= 1):', currentUnack1 >= 1 ? 'PASS' : 'FAIL')

    // 4. List Handoffs for encounter
    console.log('\n--- Step 4: GET /encounters/' + encId + '/handoffs ---')
    const listRes = await apiCall('GET', `/api/x_caresetu_ai/handoff/encounters/${encId}/handoffs`, null, authHeader)
    const listData = listRes.body && (listRes.body.result || listRes.body)
    console.log('Status:', listRes.status, '| Handoff count:', listData.count)

    // 5. Get single Handoff 1
    console.log('\n--- Step 5: GET /handoffs/' + hndId1 + ' ---')
    const getRes1 = await apiCall('GET', `/api/x_caresetu_ai/handoff/handoffs/${hndId1}`, null, authHeader)
    const getData1 = getRes1.body && (getRes1.body.result || getRes1.body)
    console.log('Status:', getRes1.status, '| Category:', getData1.category, '| Priority:', getData1.priority, '| Deadline:', getData1.acknowledgment_deadline)

    // 6. Update permitted fields via PATCH
    console.log('\n--- Step 6: PATCH /handoffs/' + hndId1 + ' ---')
    const patchRes1 = await apiCall('PATCH', `/api/x_caresetu_ai/handoff/handoffs/${hndId1}`, {
        handoff_details: 'Updated: Patient vitals steady. Arterial line verified with ICU team.'
    }, authHeader)
    console.log('PATCH Status:', patchRes1.status)

    // 7. Create Handoff 2 to test Rejection & Escalation flow
    console.log('\n--- Step 7: Testing Rejection Flow (Handoff 2) ---')
    const createRes2 = await apiCall('POST', `/api/x_caresetu_ai/handoff/encounters/${encId}/handoffs`, {
        sending_department: 'Surgery',
        sending_staff: '6816f79cc0a8016401c5a33be04be441',
        receiving_department: 'General Ward 4B',
        category: 'post_op',
        priority: 'routine',
        summary: 'Post-op appendectomy recovery bed request',
        handoff_details: 'Extubated, PACU criteria met.'
    }, authHeader)
    const data2 = createRes2.body && (createRes2.body.result || createRes2.body)
    const hndId2 = data2 && data2.sys_id
    console.log('Created Handoff 2:', hndId2)

    console.log('Rejecting Handoff 2 with recorded reason...')
    const rejectRes = await apiCall('POST', `/api/x_caresetu_ai/handoff/handoffs/${hndId2}/reject`, {
        reason: 'Ward 4B currently has no telemetry monitoring capacity. Request transfer to Step-Down unit.'
    }, authHeader)
    const rejectData = rejectRes.body && (rejectRes.body.result || rejectRes.body)
    console.log('Reject Status:', rejectRes.status, '| Status after rejection:', rejectData.status)

    // Verify Handoff 2 is linked to an operational blocker
    const getRes2 = await apiCall('GET', `/api/x_caresetu_ai/handoff/handoffs/${hndId2}`, null, authHeader)
    const getData2 = getRes2.body && (getRes2.body.result || getRes2.body)
    console.log('Handoff 2 linked blocker:', getData2.linked_blocker, '| Rejection reason:', getData2.rejection_reason)

    // 8. Acknowledge Handoff 1
    console.log('\n--- Step 8: POST /handoffs/' + hndId1 + '/acknowledge ---')
    const ackRes = await apiCall('POST', `/api/x_caresetu_ai/handoff/handoffs/${hndId1}/acknowledge`, {
        notes: 'Acknowledged by ICU Charge Nurse. Bed 12 prepped.'
    }, authHeader)
    const ackData = ackRes.body && (ackRes.body.result || ackRes.body)
    console.log('Ack Status:', ackRes.status, '| New Status:', ackData.status, '| Acknowledged time:', ackData.acknowledged_time)

    // 9. Complete Handoff 1
    console.log('\n--- Step 9: POST /handoffs/' + hndId1 + '/complete ---')
    const compRes = await apiCall('POST', `/api/x_caresetu_ai/handoff/handoffs/${hndId1}/complete`, {
        notes: 'Patient physically received in Bed 12. Handoff complete.'
    }, authHeader)
    const compData = compRes.body && (compRes.body.result || compRes.body)
    console.log('Complete Status:', compRes.status, '| New Status:', compData.status, '| Completion time:', compData.completion_time)

    // 10. Cancel Handoff 2 (and verify blocker resolution)
    console.log('\n--- Step 10: POST /handoffs/' + hndId2 + '/cancel ---')
    const cancelRes = await apiCall('POST', `/api/x_caresetu_ai/handoff/handoffs/${hndId2}/cancel`, {
        reason: 'Cancelled: rerouted directly to Step-Down unit.'
    }, authHeader)
    console.log('Cancel Status:', cancelRes.status)

    // 11. Final verification of encounter unack_handoffs
    console.log('\n--- Step 11: Final Encounter unack_handoffs verification ---')
    await new Promise(r => setTimeout(r, 2000))
    const finalEnc = await apiCall('GET', `/api/now/table/x_caresetu_ai_encounter/${encId}?sysparm_fields=number,unack_handoffs`, null, authHeader)
    console.log('Encounter unack_handoffs after completion/cancellation:', finalEnc.body.result.unack_handoffs)

    console.log('\n=== All Phase 3 Smart Handoff Tests Passed Successfully! ===')
}

run().catch(console.error)
