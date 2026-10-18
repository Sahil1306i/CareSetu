const https = require('https');
const { execSync } = require('child_process');

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim();
const HOST = 'act-hck-4161-0029.lab.service-now.com';

function apiCall(method, path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: HOST, port: 443, method: 'GET', path,
            headers: { 'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/json' }
        }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch(e) { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function checkNurses() {
    const res = await apiCall('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_fields=number,charge_nurse,charge_nurse.name,charge_nurse.user_name');
    console.log(JSON.stringify(res.body.result, null, 2));
}

checkNurses().catch(console.error);
