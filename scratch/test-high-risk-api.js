const https = require('https');
const { execSync } = require('child_process');

let TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim();
const HOST = 'act-hck-4161-0029.lab.service-now.com';

function apiCall(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : '';
        const headers = { 'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/json', 'Content-Type': 'application/json' };
        if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);
        const req = https.request({ hostname: HOST, port: 443, method, path, headers }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch(e) { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function test() {
    console.log('Testing GET /encounters/high-risk');
    const res = await apiCall('GET', '/api/x_caresetu_ai/operational_risk/encounters/high-risk');
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
}

test().catch(console.error);
