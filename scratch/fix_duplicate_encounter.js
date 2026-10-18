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
    console.log('Renumbering duplicate test encounter bcc253df192703107f44b568fd251407 to ENC1000012...')
    const patchRes = await apiCall(
        'PATCH',
        '/api/now/table/x_caresetu_ai_encounter/bcc253df192703107f44b568fd251407',
        { number: 'ENC1000012' },
        authHeader
    )
    console.log('PATCH Status:', patchRes.status)
    console.log('Updated Record:', patchRes.body.result ? {
        sys_id: patchRes.body.result.sys_id,
        number: patchRes.body.result.number,
        patient_mrn: patchRes.body.result.patient_mrn
    } : patchRes.body)
}

main().catch(console.error)
