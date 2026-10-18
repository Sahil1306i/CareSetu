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
    // Check all encounters stored blocker & handoff counts vs live child counts
    const encRes = await apiCall('GET', '/api/now/table/x_caresetu_ai_encounter?sysparm_fields=sys_id,number,open_blockers,unack_handoffs');
    const encs = encRes.body.result || [];
    console.log(`Checking ${encs.length} encounters...`);
    for (const e of encs) {
        const blkRes = await apiCall('GET', `/api/now/table/x_caresetu_ai_blocker?sysparm_query=encounter=${e.sys_id}^statusINopen,in_progress,escalated`);
        const liveBlk = (blkRes.body.result || []).length;
        const hndRes = await apiCall('GET', `/api/now/table/x_caresetu_ai_handoff?sysparm_query=encounter=${e.sys_id}^statusINpending_acknowledgment,escalated`);
        const liveHnd = (hndRes.body.result || []).length;
        const storedBlk = parseInt(e.open_blockers, 10) || 0;
        const storedHnd = parseInt(e.unack_handoffs, 10) || 0;
        console.log(`[${e.number}] Stored Blk: ${storedBlk} (Live: ${liveBlk}) | Stored Hnd: ${storedHnd} (Live: ${liveHnd})`);
    }
}

test().catch(console.error);
