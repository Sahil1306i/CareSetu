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

async function findSourceScript() {
    const res = await request('/api/now/table/sys_ux_lib_source_script?sysparm_query=sys_scope=0336010b358446838d92f98030f1589c&sysparm_fields=sys_id,name,script,sys_updated_on')
    const json = JSON.parse(res.body)
    console.log('sys_ux_lib_source_script in scope count:', json.result ? json.result.length : 0)
    if (json.result && json.result.length > 0) {
        console.log('Scripts:', json.result.map(r => ({ name: r.name, updated: r.sys_updated_on })))
        const s = json.result[0].script || ''
        console.log('Has cs-ai-panel__footer:', s.includes('cs-ai-panel__footer'))
        console.log('Has scrollTo:', s.includes('scrollTo'))
        console.log('Has handleScroll / onScroll:', s.includes('handleScroll') || s.includes('onScroll'))
    }
}

findSourceScript().catch(console.error)
