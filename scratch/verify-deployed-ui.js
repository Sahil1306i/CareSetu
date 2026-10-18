const https = require('https')
const { execSync } = require('child_process')

let TOKEN = ''
try {
    TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
} catch(e) {
    console.error('Failed to get token:', e.message)
    process.exit(1)
}

function request(method, path) {
    return new Promise((resolve, reject) => {
        const headers = {
            'Accept': '*/*',
            'Authorization': 'Bearer ' + TOKEN
        }
        const opts = {
            hostname: 'act-hck-4161-0029.lab.service-now.com', port: 443, method, path,
            headers
        }
        const req = https.request(opts, (res) => {
            let data = ''
            res.on('data', c => data += c)
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }))
        })
        req.on('error', reject)
        req.end()
    })
}

async function verifyDeployedBundle() {
    console.log('Checking /x_caresetu_ai_command_center.do ...')
    const res = await request('GET', '/x_caresetu_ai_command_center.do')
    console.log('Status:', res.status)
    console.log('Content preview (first 500 chars):')
    console.log(res.body.substring(0, 500))

    // Check sys_ui_page record to confirm installed record
    console.log('\nChecking sys_ui_page record for x_caresetu_ai_command_center:')
    const pageRes = await request('GET', '/api/now/table/sys_ui_page?sysparm_query=name=x_caresetu_ai_command_center&sysparm_fields=sys_id,name,sys_updated_on,html')
    const pageJson = JSON.parse(pageRes.body)
    if (pageJson.result && pageJson.result[0]) {
        console.log('Page found! sys_id:', pageJson.result[0].sys_id, 'updated_on:', pageJson.result[0].sys_updated_on)
    }

    // Check attachment/asset records for BYOUI files
    console.log('\nChecking sys_attachment for BYOUI files:')
    const attRes = await request('GET', '/api/now/table/sys_attachment?sysparm_query=file_nameLIKEmain.jsdbx^ORfile_nameLIKEapp.css&sysparm_fields=file_name,size_bytes,sys_updated_on&sysparm_limit=5')
    const attJson = JSON.parse(attRes.body)
    console.log('Attachments:', JSON.stringify(attJson.result, null, 2))
}

verifyDeployedBundle().catch(console.error)
