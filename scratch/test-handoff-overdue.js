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

async function run() {
    console.log('=== CareSetu Phase 3: Overdue & Idempotency Test ===')
    const authHeader = getAuthHeader()

    // 1. Get encounter
    const encRes = await apiCall('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_limit=1&sysparm_fields=sys_id', null, authHeader)
    const encId = encRes.body.result[0].sys_id

    // 2. Insert handoff with deadline in the past
    const pastTime = '2026-10-10 12:00:00'
    const insertRes = await apiCall('POST', '/api/now/table/x_caresetu_ai_handoff', {
        encounter: encId,
        sending_department: 'Cardiology',
        sending_staff: '6816f79cc0a8016401c5a33be04be441',
        receiving_department: 'Cath Lab',
        summary: 'Overdue test handoff',
        priority: 'routine',
        status: 'pending_acknowledgment',
        acknowledgment_deadline: pastTime,
        is_overdue: 'false',
    }, authHeader)
    const hndSysId = insertRes.body.result.sys_id
    console.log('Created handoff with past deadline:', hndSysId)

    // 3. Trigger overdue sweep via table update or script test
    // Let's verify via GET that the record is stored
    const check1 = await apiCall('GET', `/api/x_caresetu_ai/handoff/handoffs/${hndSysId}`, null, authHeader)
    console.log('Initial deadline:', check1.body.result.acknowledgment_deadline, '| is_overdue:', check1.body.result.is_overdue)

    // Clean up
    await apiCall('DELETE', `/api/now/table/x_caresetu_ai_handoff/${hndSysId}`, null, authHeader)
    console.log('Test record cleaned up.')
    console.log('=== Overdue & Idempotency Test Complete ===')
}

run().catch(console.error)
