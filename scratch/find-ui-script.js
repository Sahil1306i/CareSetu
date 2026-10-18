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

async function findUIScript() {
    const res = await request('/api/now/table/sys_ui_script?sysparm_query=sys_scope=0336010b358446838d92f98030f1589c&sysparm_fields=sys_id,name,script,sys_updated_on')
    const json = JSON.parse(res.body)
    console.log('UI Scripts in scope:', json.result.map(r => ({ name: r.name, updated: r.sys_updated_on })))

    if (json.result.length > 0) {
        const script = json.result[0].script || ''
        console.log('Checks on UI Script:', json.result[0].name)
        console.log('- has cs-ai-panel__footer:', script.includes('cs-ai-panel__footer'))
        console.log('- has scrollToBottom / scrollTo:', script.includes('scrollTo'))
        console.log('- has handleScroll / onScroll:', script.includes('handleScroll') || script.includes('onScroll'))
    }
}

findUIScript().catch(console.error)
