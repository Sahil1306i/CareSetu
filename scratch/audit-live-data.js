const https = require('https')
const { execSync } = require('child_process')

let TOKEN = ''
try {
    TOKEN = execSync('npx @servicenow/sdk auth --print --format bearer', { encoding: 'utf8' }).trim()
} catch(e) {
    console.error('Failed to get token:', e.message)
    process.exit(1)
}

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

async function audit() {
    // 1. Encounters
    const encRes = await request('/api/now/table/x_caresetu_ai_encounter?sysparm_fields=sys_id,number,patient_mrn,ward,bed_number,state,priority,expected_discharge_time,promised_discharge_time,open_blockers,unack_handoffs,overdue_coord_tasks,incomplete_milestones')
    const encs = JSON.parse(encRes.body).result || []
    const encMap = {}
    console.log(`=== ENCOUNTERS (${encs.length}) ===`)
    for (const e of encs) {
        encMap[e.sys_id] = e.number
        console.log(`[${e.number}] id:${e.sys_id} MRN:${e.patient_mrn} Ward:${e.ward} StoredBlockers:${e.open_blockers} StoredHandoffs:${e.unack_handoffs} OverdueTasks:${e.overdue_coord_tasks} IncompleteMilestones:${e.incomplete_milestones} EDT:${e.expected_discharge_time} PDT:${e.promised_discharge_time}`)
    }

    // 2. Risk Scores (all risk scores, not just latest)
    console.log('\n=== RISK SCORES ===')
    const scoreRes = await request('/api/now/table/x_caresetu_ai_risk_score?sysparm_fields=sys_id,encounter,risk_score,risk_tier,explanation,is_latest,scored_at&sysparm_query=ORDERBYDESCscored_at')
    const scores = JSON.parse(scoreRes.body).result || []
    for (const s of scores) {
        const encId = typeof s.encounter === 'object' ? s.encounter.value : s.encounter
        const encNum = encMap[encId] || 'UNKNOWN_ENC'
        console.log(`Score: ${s.sys_id} | Enc: ${encNum} (${encId}) | Score: ${s.risk_score} [${s.risk_tier}] | is_latest: ${s.is_latest} | Scored At: ${s.scored_at}`)
        console.log(`  Explanation: ${s.explanation}`)
    }

    // 3. Blockers
    console.log('\n=== BLOCKERS ===')
    const blkRes = await request('/api/now/table/x_caresetu_ai_blocker?sysparm_fields=sys_id,number,encounter,category,department,status,is_overdue,estimated_delay_minutes,description')
    const blockers = JSON.parse(blkRes.body).result || []
    for (const b of blockers) {
        const encId = typeof b.encounter === 'object' ? b.encounter.value : b.encounter
        const encNum = encMap[encId] || 'UNKNOWN_ENC'
        console.log(`Blocker: ${b.number} (${b.sys_id}) | Enc: ${encNum} | Status: ${b.status} | Overdue: ${b.is_overdue} | Delay: ${b.estimated_delay_minutes}m | Dept: ${b.department}`)
        console.log(`  Desc: ${b.description}`)
    }

    // 4. Handoffs
    console.log('\n=== HANDOFFS ===')
    const hndRes = await request('/api/now/table/x_caresetu_ai_handoff?sysparm_fields=sys_id,number,encounter,priority,status,is_overdue,summary,acknowledgment_deadline,acknowledged_time')
    const handoffs = JSON.parse(hndRes.body).result || []
    for (const h of handoffs) {
        const encId = typeof h.encounter === 'object' ? h.encounter.value : h.encounter
        const encNum = encMap[encId] || 'UNKNOWN_ENC'
        console.log(`Handoff: ${h.number} (${h.sys_id}) | Enc: ${encNum} | Priority: ${h.priority} | Status: ${h.status} | Overdue: ${h.is_overdue} | Deadline: ${h.acknowledgment_deadline}`)
        console.log(`  Summary: ${h.summary}`)
    }

    // 5. Escalations
    console.log('\n=== ESCALATIONS ===')
    const escRes = await request('/api/now/table/x_caresetu_ai_escalation?sysparm_fields=sys_id,number,encounter,risk_score,risk_tier,escalation_status,reason,sys_created_on,sys_updated_on')
    const escalations = JSON.parse(escRes.body).result || []
    for (const esc of escalations) {
        const encId = typeof esc.encounter === 'object' ? esc.encounter.value : esc.encounter
        const encNum = encMap[encId] || 'UNKNOWN_ENC'
        console.log(`Escalation: ${esc.number} (${esc.sys_id}) | Enc: ${encNum} | Status: ${esc.escalation_status} | Tier: ${esc.risk_tier} | Score: ${esc.risk_score} | Updated: ${esc.sys_updated_on}`)
        console.log(`  Reason: ${esc.reason}`)
    }
}

audit().catch(console.error)
