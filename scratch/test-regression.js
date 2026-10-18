const https = require('https')
const { execSync } = require('child_process')

let TOKEN = ''
try {
    TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
} catch(e) {
    process.exit(1)
}

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : ''
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
        }
        const opts = {
            hostname: 'act-hck-4161-0029.lab.service-now.com', port: 443, method, path,
            headers: { ...headers, 'Content-Length': Buffer.byteLength(bodyStr) },
        }
        const req = https.request(opts, (res) => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => resolve({ status: res.statusCode, body: data }))
        })
        req.on('error', reject)
        if (bodyStr) req.write(bodyStr)
        req.end()
    })
}

async function testRegression() {
    // 1. Check existing encounters
    const encRes = await request('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_limit=2')
    console.log('Encounter Table GET:', encRes.status)

    // 2. Check risk scores
    const scoreRes = await request('GET', '/api/now/table/x_caresetu_ai_risk_score?sysparm_limit=2')
    console.log('Risk Scores Table GET:', scoreRes.status)

    // 3. Check high-risk route
    const hrRes = await request('GET', '/api/x_caresetu_ai/operational_risk/encounters/high-risk')
    console.log('Operational Risk High-Risk Route GET:', hrRes.status)

    // 4. Check UI page status
    const uiRes = await request('GET', '/x_caresetu_ai_command_center.do')
    console.log('Command Center UI Page GET:', uiRes.status)
}

testRegression().catch(console.error)
