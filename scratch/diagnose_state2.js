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

    console.log('=== 1. sysauto_script (Handoff Overdue Chaser) ===')
    const jobRes = await apiCall(
        'GET',
        '/api/now/table/sysauto_script?sysparm_query=nameLIKEHandoff%20Overdue&sysparm_fields=sys_id,name,run_period,run_type,interval,active,sys_updated_on,run_time',
        null,
        authHeader
    )
    console.log(JSON.stringify(jobRes.body.result, null, 2))

    console.log('\n=== 2. x_caresetu_ai_encounter (all records) ===')
    const encRes = await apiCall(
        'GET',
        '/api/now/table/x_caresetu_ai_encounter?sysparm_fields=sys_id,number,patient_mrn,ward,expected_discharge_time,overdue_coord_tasks,incomplete_milestones,unack_handoffs,open_blockers',
        null,
        authHeader
    )
    console.log(JSON.stringify(encRes.body.result, null, 2))
}

main().catch(console.error)
