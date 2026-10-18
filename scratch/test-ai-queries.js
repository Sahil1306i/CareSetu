const https = require('https')
const { execSync } = require('child_process')

let TOKEN = ''
try {
    TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
} catch(e) {
    console.error('Failed to get token:', e.message)
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

async function testQuery(query, encNumber) {
    console.log(`\n========================================`)
    console.log(`TEST QUERY: "${query}"`)
    console.log(`========================================`)

    // Try both paths just in case
    const paths = [
        '/api/x_caresetu_ai/operational_risk/v1/ai/query',
        '/api/x_caresetu_ai/operational_risk/ai/query'
    ]

    for (const p of paths) {
        const res = await request('POST', p, { query, encounter_number: encNumber })
        console.log(`Endpoint: ${p} -> HTTP ${res.status}`)
        if (res.status === 200) {
            try {
                const parsed = JSON.parse(res.body)
                console.log('Result:', JSON.stringify(parsed, null, 2))
                return parsed
            } catch(e) {
                console.log('Body:', res.body)
            }
            break
        } else {
            console.log('Error Body:', res.body)
        }
    }
}

async function main() {
    // 1. "Who are you?"
    await testQuery("Who are you?")

    // 2. "What is the current emergency status?"
    await testQuery("What is the current emergency status?")

    // 3. "What should I prioritize right now?"
    await testQuery("What should I prioritize right now?")

    // 4. "Explain the discharge risk for ENC1000007."
    await testQuery("Explain the discharge risk for ENC1000007.")
}

main().catch(console.error)
