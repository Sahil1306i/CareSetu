const https = require('https')
const { execSync } = require('child_process')

let TOKEN = ''
try {
    TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
} catch(e) {
    console.error('Failed to get token:', e.message)
    process.exit(1)
}

function request(method, path, body, authHeader) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : ''
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (authHeader !== false) {
            headers['Authorization'] = 'Bearer ' + (authHeader || TOKEN)
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

async function testEdgeCases() {
    console.log('Testing Unauthenticated Request (should return 401):')
    const unauth = await request('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: 'test' }, false)
    console.log('Unauth status:', unauth.status)

    console.log('\nTesting Nonexistent Encounter:')
    const nonExistent = await request('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: 'Explain risk for ENC9999999' })
    console.log('Nonexistent encounter result:', nonExistent.body)

    console.log('\nTesting Empty Query (should return 400):')
    const emptyQ = await request('POST', '/api/x_caresetu_ai/operational_risk/ai/query', { query: '' })
    console.log('Empty query status:', emptyQ.status, emptyQ.body)
}

testEdgeCases().catch(console.error)
