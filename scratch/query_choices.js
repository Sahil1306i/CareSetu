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
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        if (authHeader) {
            const parts = authHeader.split(': ')
            headers[parts[0]] = parts[1]
        }
        const req = https.request({ hostname: HOST, path: urlPath, method, headers }, res => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
                catch (_) { resolve({ status: res.statusCode, body: data }) }
            })
        })
        req.on('error', reject)
        req.end()
    })
}

async function main() {
    const authHeader = getAuthHeader()
    const tables = ['x_caresetu_ai_blocker', 'x_caresetu_ai_handoff', 'x_caresetu_ai_escalation', 'x_caresetu_ai_encounter']
    for (const t of tables) {
        console.log(`\n=== sys_choice for ${t} ===`)
        const res = await apiCall(
            'GET',
            `/api/now/table/sys_choice?sysparm_query=name=${t}&sysparm_fields=element,value,label,sequence`,
            null,
            authHeader
        )
        console.log(JSON.stringify(res.body.result, null, 2))
    }
}

main().catch(console.error)
