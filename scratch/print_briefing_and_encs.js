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
    
    console.log('=== TEST 1: HOSPITAL-WIDE PRIORITY BRIEFING ===')
    const b = await apiCall('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: 'What should I prioritize right now?' }, authHeader)
    console.log(b.body.result && b.body.result.response)

    console.log('\n=== TEST 2: EXPLAIN RISK FOR ENC1000007 ===')
    const e7 = await apiCall('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: 'Explain the discharge risk for ENC1000007.' }, authHeader)
    console.log(e7.body.result && e7.body.result.response)

    console.log('\n=== TEST 3: EXPLAIN RISK FOR ENC1000010 ===')
    const e10 = await apiCall('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: 'Explain the discharge risk for ENC1000010.' }, authHeader)
    console.log(e10.body.result && e10.body.result.response)
}

main().catch(console.error)
