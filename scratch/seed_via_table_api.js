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

    // 1. ENC1000007 (8471c7d719a303107f44b568fd251413)
    console.log('Seeding Table API records for ENC1000007...')
    const enc7 = '8471c7d719a303107f44b568fd251413'

    const b1 = await apiCall('POST', '/api/now/table/x_caresetu_ai_blocker', {
        encounter: enc7,
        category: 'equipment',
        department: 'ICU',
        description: 'Portable telemetry monitor battery unit unavailable pending biomedical swap',
        estimated_delay_minutes: '25',
        status: 'open'
    }, authHeader)
    console.log('ENC1000007 Blocker 1:', b1.status, b1.body.result && b1.body.result.number)

    const b2 = await apiCall('POST', '/api/now/table/x_caresetu_ai_blocker', {
        encounter: enc7,
        category: 'pharmacy',
        department: 'Inpatient Pharmacy',
        description: 'Discharge medication reconciliation and IV antibiotic step-down hold',
        estimated_delay_minutes: '20',
        status: 'in_progress'
    }, authHeader)
    console.log('ENC1000007 Blocker 2:', b2.status, b2.body.result && b2.body.result.number)

    const h1 = await apiCall('POST', '/api/now/table/x_caresetu_ai_handoff', {
        encounter: enc7,
        category: 'inter_unit',
        priority: 'urgent',
        sending_department: 'ICU',
        sending_staff: 'Charge Nurse ICU',
        receiving_department: 'Step-Down Unit',
        summary: 'ICU to Step-Down transfer handoff for post-stabilization care',
        status: 'pending_acknowledgment',
        is_overdue: 'false',
        acknowledgment_deadline: '2026-10-12 12:00:00'
    }, authHeader)
    console.log('ENC1000007 Handoff 1:', h1.status, h1.body.result && h1.body.result.number)

    // 2. ENC1000010 (4ac253df192703107f44b568fd251482)
    console.log('\nSeeding Table API records for ENC1000010...')
    const enc10 = '4ac253df192703107f44b568fd251482'

    const b3 = await apiCall('POST', '/api/now/table/x_caresetu_ai_blocker', {
        encounter: enc10,
        category: 'tpa',
        department: 'TPA Desk',
        description: 'Third-party administrator final discharge authorization hold',
        estimated_delay_minutes: '45',
        status: 'open'
    }, authHeader)
    console.log('ENC1000010 Blocker 1:', b3.status, b3.body.result && b3.body.result.number)

    const h2 = await apiCall('POST', '/api/now/table/x_caresetu_ai_handoff', {
        encounter: enc10,
        category: 'inter_unit',
        priority: 'critical',
        sending_department: 'ICU',
        sending_staff: 'Charge Nurse ICU',
        receiving_department: 'General Ward 4B',
        summary: 'Critical bed transfer handoff: telemetry handover',
        status: 'pending_acknowledgment',
        is_overdue: 'false',
        acknowledgment_deadline: '2026-10-12 12:00:00'
    }, authHeader)
    console.log('ENC1000010 Handoff 1:', h2.status, h2.body.result && h2.body.result.number)

    // 3. ENC1000009 (3dc253df192703107f44b568fd25147c)
    console.log('\nSeeding Table API records for ENC1000009...')
    const enc9 = '3dc253df192703107f44b568fd25147c'

    const b4 = await apiCall('POST', '/api/now/table/x_caresetu_ai_blocker', {
        encounter: enc9,
        category: 'transport',
        department: 'Patient Transport',
        description: 'Specialized stretcher transport delayed due to fleet dispatch',
        estimated_delay_minutes: '30',
        status: 'open'
    }, authHeader)
    console.log('ENC1000009 Blocker 1:', b4.status, b4.body.result && b4.body.result.number)

    const h3 = await apiCall('POST', '/api/now/table/x_caresetu_ai_handoff', {
        encounter: enc9,
        category: 'shift_change',
        priority: 'routine',
        sending_department: 'ICU',
        sending_staff: 'Charge Nurse ICU',
        receiving_department: 'ICU Night Shift',
        summary: 'Routine shift change coordination handoff',
        status: 'pending_acknowledgment',
        is_overdue: 'false',
        acknowledgment_deadline: '2026-10-12 12:00:00'
    }, authHeader)
    console.log('ENC1000009 Handoff 1:', h3.status, h3.body.result && h3.body.result.number)

    console.log('\nDone seeding!')
}

main().catch(console.error)
