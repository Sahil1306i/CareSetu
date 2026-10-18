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

async function checkAttRecord() {
    const res = await request('/api/now/table/sys_attachment/adda0ef0e20317236e357dfd664ba629')
    const json = JSON.parse(res.body)
    console.log('Attachment table_name:', json.result.table_name, 'table_sys_id:', json.result.table_sys_id)

    // Now query all attachments with that table_name and table_sys_id
    const siblings = await request(`/api/now/table/sys_attachment?sysparm_query=table_name=${json.result.table_name}^table_sys_id=${json.result.table_sys_id}&sysparm_fields=sys_id,file_name,size_bytes`)
    console.log('Sibling attachments:', JSON.stringify(JSON.parse(siblings.body).result, null, 2))
}

checkAttRecord().catch(console.error)
