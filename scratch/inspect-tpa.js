const https = require('https');
const { execSync } = require('child_process');

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim();
const HOST = 'act-hck-4161-0029.lab.service-now.com';

function request(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: HOST, port: 443, method: 'GET', path,
            headers: { 'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/json' }
        }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function inspectTpa() {
    console.log('=== TPA CASES ===');
    const res = await request('/api/now/table/x_caresetu_ai_tpa_case?sysparm_fields=sys_id,number,encounter,payer_name,authorization_type,status,is_overdue,next_followup_due,last_followup_time,followup_count,linked_blocker');
    const cases = JSON.parse(res.body).result || [];
    console.log(`Total TPA cases: ${cases.length}`);
    for (const c of cases) {
        console.log({
            number: c.number,
            sys_id: c.sys_id,
            encounter: typeof c.encounter === 'object' ? c.encounter.value : c.encounter,
            payer: c.payer_name,
            auth_type: c.authorization_type,
            status: c.status,
            is_overdue: c.is_overdue,
            next_followup_due: c.next_followup_due,
            followup_count: c.followup_count,
            linked_blocker: typeof c.linked_blocker === 'object' ? c.linked_blocker.value : c.linked_blocker
        });
    }
}

inspectTpa().catch(console.error);
