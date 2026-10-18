const https = require('https');
const { execSync } = require('child_process');

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim();
const INSTANCE = 'act-hck-4161-0029.lab.service-now.com';

function snGet(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: INSTANCE,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json'
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch(e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    console.log('--- Querying sysauto_script for caresetu / handoff ---');
    const autoRes = await snGet('/api/now/table/sysauto_script?sysparm_query=nameLIKEcaresetu^ORnameLIKEhandoff&sysparm_fields=sys_id,name,run_type,run_period,run_time,active,sys_scope');
    console.log(JSON.stringify(autoRes.data, null, 2));

    console.log('--- Querying sys_trigger for caresetu / handoff ---');
    const trigRes = await snGet('/api/now/table/sys_trigger?sysparm_query=nameLIKEcaresetu^ORnameLIKEhandoff&sysparm_fields=sys_id,name,trigger_type,run_time,next_action,state');
    console.log(JSON.stringify(trigRes.data, null, 2));
}

run().catch(console.error);
