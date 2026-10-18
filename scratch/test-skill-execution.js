const https = require('https')

let TOKEN = process.env.SNOW_TOKEN || ''
if (!TOKEN) {
    const { execSync } = require('child_process')
    try {
        TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
    } catch(e) {
        console.error('Failed to get token')
        process.exit(1)
    }
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

async function main() {
    const sysId = '4ac253df192703107f44b568fd251482';
    const path = `/api/x_caresetu_ai/caresetu_operational_risk/v1/encounters/${sysId}/score`;
    const res = await request('POST', path, {});
    console.log('Status:', res.status)
    try {
        console.log('Response:', JSON.stringify(JSON.parse(res.body), null, 2))
    } catch(e) {
        console.log('Response:', res.body)
    }
}
main()
