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

async function inspectCases() {
    for (const num of ['ENC1000007', 'ENC1000010']) {
        console.log(`\n================== ${num} ==================`)
        const encRes = await request(`/api/now/table/x_caresetu_ai_encounter?sysparm_query=number=${num}`)
        const enc = JSON.parse(encRes.body).result[0]
        console.log('Encounter Details:')
        console.log({
            sys_id: enc.sys_id,
            number: enc.number,
            state: enc.state,
            ward: enc.ward,
            open_blockers: enc.open_blockers,
            unack_handoffs: enc.unack_handoffs,
            overdue_coord_tasks: enc.overdue_coord_tasks,
            incomplete_milestones: enc.incomplete_milestones,
            expected_discharge_time: enc.expected_discharge_time,
            promised_discharge_time: enc.promised_discharge_time,
            actual_discharge_time: enc.actual_discharge_time,
        })

        // Risk scores for this encounter
        const scoreRes = await request(`/api/now/table/x_caresetu_ai_risk_score?sysparm_query=encounter=${enc.sys_id}&sysparm_fields=sys_id,risk_score,risk_tier,is_latest,scored_at,explanation&sysparm_query=ORDERBYDESCscored_at`)
        const scores = JSON.parse(scoreRes.body).result
        console.log(`\nRisk scores count: ${scores.length}`)
        for (const s of scores) {
            console.log(`  id:${s.sys_id} is_latest:${s.is_latest} score:${s.risk_score} tier:${s.risk_tier} scored_at:${s.scored_at}`)
            console.log(`    explanation: ${s.explanation}`)
        }

        // Blockers for this encounter
        const blkRes = await request(`/api/now/table/x_caresetu_ai_blocker?sysparm_query=encounter=${enc.sys_id}&sysparm_fields=sys_id,number,category,department,status,is_overdue,estimated_delay_minutes,description`)
        const blks = JSON.parse(blkRes.body).result
        console.log(`\nBlockers count: ${blks.length}`)
        for (const b of blks) {
            console.log(`  number:${b.number} id:${b.sys_id} status:${b.status} overdue:${b.is_overdue} delay:${b.estimated_delay_minutes} desc:${b.description}`)
        }

        // Handoffs for this encounter
        const hndRes = await request(`/api/now/table/x_caresetu_ai_handoff?sysparm_query=encounter=${enc.sys_id}&sysparm_fields=sys_id,number,priority,status,is_overdue,summary,acknowledgment_deadline`)
        const hnds = JSON.parse(hndRes.body).result
        console.log(`\nHandoffs count: ${hnds.length}`)
        for (const h of hnds) {
            console.log(`  number:${h.number} id:${h.sys_id} status:${h.status} priority:${h.priority} overdue:${h.is_overdue} deadline:${h.acknowledgment_deadline} summary:${h.summary}`)
        }

        // Escalation for this encounter
        const escRes = await request(`/api/now/table/x_caresetu_ai_escalation?sysparm_query=encounter=${enc.sys_id}&sysparm_fields=sys_id,number,escalation_status,risk_score,risk_tier,reason,sys_updated_on`)
        const escs = JSON.parse(escRes.body).result
        console.log(`\nEscalations count: ${escs.length}`)
        for (const esc of escs) {
            console.log(`  number:${esc.number} id:${esc.sys_id} status:${esc.escalation_status} tier:${esc.risk_tier} score:${esc.risk_score} updated:${esc.sys_updated_on}`)
            console.log(`    reason: ${esc.reason}`)
        }
    }
}

inspectCases().catch(console.error)
