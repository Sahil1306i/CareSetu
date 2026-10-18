const https = require('https')
const { execSync } = require('child_process')

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()

function request(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'act-hck-4161-0029.lab.service-now.com', port: 443, method: 'GET', path,
            headers: { 'Authorization': 'Bearer ' + TOKEN, 'Accept': '*/*' }
        }, res => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => resolve({ status: res.statusCode, body: data }))
        })
        req.on('error', reject)
        req.end()
    })
}

async function verifyBodyCSS() {
    const attList = await request('/api/now/table/sys_attachment?sysparm_query=file_name=app.css&sysparm_fields=sys_id,file_name,size_bytes,sys_updated_on&sysparm_limit=1')
    const json = JSON.parse(attList.body)
    const attSysId = json.result[0].sys_id

    const cssData = await request(`/api/now/attachment/${attSysId}/file`)
    const idx = cssData.body.indexOf('.cs-ai-panel__body {')
    if (idx !== -1) {
        console.log('--- DEPLOYED BODY CSS ---')
        console.log(cssData.body.substring(idx, idx + 800))
        console.log('-------------------------')
    }
}

verifyBodyCSS().catch(console.error)
