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

    console.log('1. Activating sn_nowassist_skill_config_status (d57b276d090147c7a1faf4963f5ddc90)...')
    const patchStatus = await apiCall(
        'PATCH',
        '/api/now/table/sn_nowassist_skill_config_status/d57b276d090147c7a1faf4963f5ddc90',
        { active: 'true', in_product_active: 'true' },
        authHeader
    )
    console.log('Status PATCH result:', patchStatus.status, patchStatus.body.result && patchStatus.body.result.active)

    console.log('2. Activating sys_generative_ai_config (619441ea57f947c1bb101e1df7a18d20)...')
    const patchGenAi = await apiCall(
        'PATCH',
        '/api/now/table/sys_generative_ai_config/619441ea57f947c1bb101e1df7a18d20',
        { active: 'true', state: 'published' },
        authHeader
    )
    console.log('GenAI Config PATCH result:', patchGenAi.status, patchGenAi.body.result && patchGenAi.body.result.state)

    console.log('3. Triggering test execution of the skill...')
    const script = `
        var inputsPayload = { 'encounter_number': 'ENC1000010' };
        var capabilityId = 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'; 
        var request = {
            executionRequests: [{
                payload: inputsPayload,
                capabilityId: capabilityId,
                meta: {
                    skillConfigId: '9d8fed4927d24638a7cb7d624decd3e4'
                }
            }], 
            mode: 'sync' 
        };
        try {
            var response = sn_one_extend.OneExtendUtil.executeSecure(request);
            gs.info('### SKILL ACTIVATED TEST RESULT ### ' + JSON.stringify(response));
        } catch(e) {
            gs.error('### SKILL ACTIVATED TEST ERROR ### ' + (e.message || JSON.stringify(e)));
        }
    `

    await apiCall('POST', '/api/now/table/sys_trigger', {
        name: 'CareSetu Activated Skill Test',
        next_action: '1970-01-01 00:00:00',
        state: '0',
        trigger_type: '0',
        script: script
    }, authHeader)

    console.log('Waiting 5s for trigger execution...')
    await new Promise(r => setTimeout(r, 5000))

    const query = encodeURIComponent('### SKILL ACTIVATED TEST')
    const logRes = await apiCall(
        'GET',
        `/api/now/table/syslog?sysparm_query=messageLIKE${query}&sysparm_limit=1&sysparm_fields=sys_created_on,level,message`,
        null,
        authHeader
    )
    console.log('Log message:', logRes.body.result && logRes.body.result[0] && logRes.body.result[0].message)
}

main().catch(console.error)
