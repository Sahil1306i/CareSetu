const https = require('https')
const { execSync } = require('child_process')

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()

function request(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'act-hck-4161-0029.lab.service-now.com', port: 443, method: 'GET', path,
            headers: { 'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/json' }
        }, res => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => resolve({ status: res.statusCode, body: data }))
        })
        req.on('error', reject)
        req.end()
    })
}

async function findUIPage() {
    const res = await request('/api/now/table/sys_ui_page?sysparm_query=sys_scope=0336010b358446838d92f98030f1589c&sysparm_fields=sys_id,name,html,sys_updated_on')
    const json = JSON.parse(res.body)
    console.log('UI Pages in scope:', json.result ? json.result.length : 0)
    if (json.result && json.result.length > 0) {
        for (const p of json.result) {
            console.log('Name:', p.name, 'updated:', p.sys_updated_on)
            console.log('HTML snippet:', (p.html || '').substring(0, 300))
        }
    }
}

findUIPage().catch(console.error)
