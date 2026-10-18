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

async function listAttachments() {
    const attList = await request('/api/now/table/sys_attachment?sysparm_fields=sys_id,file_name,size_bytes,sys_updated_on&sysparm_limit=10')
    const json = JSON.parse(attList.body)
    console.log('Attachments:', JSON.stringify(json.result, null, 2))
}

listAttachments().catch(console.error)
