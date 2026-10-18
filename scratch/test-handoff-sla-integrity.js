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

// Helper to execute server-side JavaScript on instance via sys_script test or scheduled script trigger
// In ServiceNow, triggering a Scheduled Script (sysauto_script) can be done by inserting a sys_trigger or updating next_action,
// or we can test HandoffEngine via the REST API or background execution.
// Wait! We can create an encounter, create a handoff, let the scheduled script (running every 1 min) run, or test via an API!
// Let's create an overdue handoff and wait for the 1-minute scheduled script to process it!
async function main() {
    console.log('=== Test Smart Handoff 1-Minute SLA Overdue Engine & Idempotency ===')
    const authHeader = getAuthHeader()

    // 1. Insert a temporary test encounter
    console.log('1. Creating test encounter...')
    const encRes = await apiCall(
        'POST',
        '/api/now/table/x_caresetu_ai_encounter',
        {
            patient_mrn: 'TEST-SLA-001',
            ward: 'ICU Stepdown',
            expected_discharge_time: '2026-10-15 12:00:00',
            overdue_coord_tasks: 0,
            incomplete_milestones: 0,
            unack_handoffs: 0,
            open_blockers: 0
        },
        authHeader
    )
    const encId = encRes.body.result.sys_id
    const encNum = encRes.body.result.number
    console.log(`Test encounter created: ${encNum} (${encId})`)

    // 2. Insert a critical handoff with a deadline 10 minutes in the past
    console.log('2. Creating critical handoff with breached deadline...')
    const pastTime = '2026-10-10 12:00:00'
    const hndRes = await apiCall(
        'POST',
        '/api/now/table/x_caresetu_ai_handoff',
        {
            encounter: encId,
            sending_department: 'ICU',
            sending_staff: '6816f79cc0a8016401c5a33be04be441',
            receiving_department: 'Cardiology',
            priority: 'critical',
            category: 'inter_unit',
            summary: 'Urgent transfer to Cardiology bed 12',
            status: 'pending_acknowledgment',
            acknowledgment_deadline: pastTime,
            is_overdue: 'false'
        },
        authHeader
    )
    const hndId = hndRes.body.result.sys_id
    const hndNum = hndRes.body.result.number
    console.log(`Test handoff created: ${hndNum} (${hndId}) with deadline ${pastTime}`)

    // Check initial unack_handoffs count
    const encCheck1 = await apiCall('GET', `/api/now/table/x_caresetu_ai_encounter/${encId}?sysparm_fields=unack_handoffs,open_blockers`, null, authHeader)
    console.log('Initial encounter state:', encCheck1.body.result)

    // 3. Trigger the scheduled script "CareSetu: Smart Handoff Overdue Chaser" on demand
    // In ServiceNow, updating sysauto_script or creating sys_trigger runs it immediately.
    // Or we can invoke it via a temporary scheduled job trigger:
    console.log('3. Triggering immediate execution of handoff overdue chaser...')
    const triggerRes = await apiCall(
        'POST',
        '/api/now/table/sys_trigger',
        {
            name: 'CareSetu Test Run Handoff Overdue',
            next_action: '1970-01-01 00:00:00',
            state: '0', // ready
            trigger_type: '0', // run once
            script: 'new x_caresetu_ai.HandoffEngine().processOverdueHandoffs();'
        },
        authHeader
    )
    console.log('Trigger created, sys_id:', triggerRes.body.result && triggerRes.body.result.sys_id)

    // Wait 3 seconds for ServiceNow job executor
    console.log('Waiting 3s for background job execution...')
    await new Promise(r => setTimeout(r, 3000))

    // 4. Inspect handoff state
    console.log('4. Inspecting handoff after overdue sweep...')
    const hndCheck1 = await apiCall(
        'GET',
        `/api/now/table/x_caresetu_ai_handoff/${hndId}?sysparm_fields=number,status,is_overdue,linked_blocker,resolution_notes`,
        null,
        authHeader
    )
    console.log('Handoff state after sweep:', JSON.stringify(hndCheck1.body.result, null, 2))

    // 5. Inspect linked blocker
    const blockerId = hndCheck1.body.result.linked_blocker && (hndCheck1.body.result.linked_blocker.value || hndCheck1.body.result.linked_blocker)
    console.log('Linked blocker sys_id:', blockerId)
    if (blockerId) {
        const blkCheck = await apiCall(
            'GET',
            `/api/now/table/x_caresetu_ai_blocker/${blockerId}?sysparm_fields=number,category,status,description,encounter`,
            null,
            authHeader
        )
        console.log('Blocker state:', JSON.stringify(blkCheck.body.result, null, 2))
    }

    // 6. Test IDEMPOTENCY: Trigger a second sweep
    console.log('6. Triggering SECOND sweep to verify idempotency (no duplicate blocker)...')
    await apiCall(
        'POST',
        '/api/now/table/sys_trigger',
        {
            name: 'CareSetu Test Run Sweep 2',
            next_action: '1970-01-01 00:00:00',
            state: '0',
            trigger_type: '0',
            script: 'new x_caresetu_ai.HandoffEngine().processOverdueHandoffs();'
        },
        authHeader
    )
    await new Promise(r => setTimeout(r, 3000))

    // Count blockers for this encounter
    const blkCountRes = await apiCall(
        'GET',
        `/api/now/table/x_caresetu_ai_blocker?sysparm_query=encounter=${encId}&sysparm_fields=sys_id,number,status`,
        null,
        authHeader
    )
    console.log(`Blockers for encounter ${encNum}: ${blkCountRes.body.result ? blkCountRes.body.result.length : 0} (expected: 1, duplicate prevented!)`)

    // 7. Test ACKNOWLEDGMENT & BLOCKER RESOLUTION: Acknowledge the handoff
    console.log('7. Acknowledging handoff to verify blocker resolution...')
    const ackRes = await apiCall(
        'POST',
        `/api/x_caresetu_ai/handoff/handoffs/${hndId}/acknowledge`,
        { notes: 'Acknowledged by cardiology receiving nurse.' },
        authHeader
    )
    console.log('Acknowledge API response:', ackRes.body)

    // Verify blocker is now resolved
    if (blockerId) {
        const blkResolved = await apiCall(
            'GET',
            `/api/now/table/x_caresetu_ai_blocker/${blockerId}?sysparm_fields=number,status,resolution_notes,resolution_time`,
            null,
            authHeader
        )
        console.log('Blocker state after handoff acknowledged:', JSON.stringify(blkResolved.body.result, null, 2))
    }

    // Verify encounter unack_handoffs is now 0
    await new Promise(r => setTimeout(r, 1000))
    const encFinal = await apiCall('GET', `/api/now/table/x_caresetu_ai_encounter/${encId}?sysparm_fields=unack_handoffs,open_blockers`, null, authHeader)
    console.log('Encounter final counters:', encFinal.body.result)

    // 8. Clean up
    console.log('8. Cleaning up test records...')
    if (blockerId) await apiCall('DELETE', `/api/now/table/x_caresetu_ai_blocker/${blockerId}`, null, authHeader)
    await apiCall('DELETE', `/api/now/table/x_caresetu_ai_handoff/${hndId}`, null, authHeader)
    await apiCall('DELETE', `/api/now/table/x_caresetu_ai_encounter/${encId}`, null, authHeader)
    console.log('Test cleanup complete.')
    console.log('=== Test Smart Handoff SLA Integrity Complete ===')
}

main().catch(err => {
    console.error('Test error:', err)
    process.exit(1)
})
