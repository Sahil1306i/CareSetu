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

async function verifyLiveAsset() {
    console.log('Querying live sys_ux_lib_asset 14ca71ddffed427ba2f631692aca4241 on instance...')
    const res = await request('/api/now/table/sys_ux_lib_asset/14ca71ddffed427ba2f631692aca4241?sysparm_fields=sys_id,checksum,sys_updated_on,content')
    const json = JSON.parse(res.body)
    if (json.result) {
        console.log('Record sys_id:', json.result.sys_id)
        console.log('Record updated_on:', json.result.sys_updated_on)
        console.log('Checksum:', json.result.checksum)
        const content = json.result.content || ''
        console.log('Checks on live deployed content:')
        console.log('- contains cs-ai-panel__footer:', content.includes('cs-ai-panel__footer'))
        console.log('- contains onScroll:', content.includes('onScroll'))
        console.log('- contains handleScroll:', content.includes('handleScroll'))
        console.log('- contains scrollTo:', content.includes('scrollTo'))
        console.log('- contains threshold 70:', content.includes('70'))
    } else {
        console.log('Error querying record:', res.body)
    }
}

verifyLiveAsset().catch(console.error)
