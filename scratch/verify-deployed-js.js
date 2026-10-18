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

async function verifyJS() {
    const attList = await request('/api/now/table/sys_attachment?sysparm_query=file_name=main.jsdbx&sysparm_fields=sys_id,file_name,size_bytes,sys_updated_on&sysparm_limit=1')
    const json = JSON.parse(attList.body)
    const attSysId = json.result[0].sys_id
    console.log('main.jsdbx sys_id:', attSysId)

    const jsData = await request(`/api/now/attachment/${attSysId}/file`)
    console.log('JS download status:', jsData.status, 'size:', jsData.body.length)

    console.log('Checking bundle strings:')
    console.log('- has cs-ai-panel__footer:', jsData.body.includes('cs-ai-panel__footer'))
    console.log('- has handleScroll / onScroll:', jsData.body.includes('handleScroll') || jsData.body.includes('onScroll'))
    console.log('- has scrollToBottom / scrollTo:', jsData.body.includes('scrollTo'))
}

verifyJS().catch(console.error)
