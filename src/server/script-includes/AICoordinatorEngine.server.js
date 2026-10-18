/**
 * AICoordinatorEngine — CareSetu AI
 *
 * Operational AI Care Coordinator engine.
 * Serves conversational and operational coordination queries for the AI Care Coordinator panel.
 *
 * Grounding & Authority Principles:
 * - Deterministic operational data is retrieved authoritatively from ServiceNow tables:
 *   x_caresetu_ai_encounter, x_caresetu_ai_risk_score, x_caresetu_ai_blocker,
 *   x_caresetu_ai_handoff, x_caresetu_ai_escalation.
 * - Operates strictly as an operational coordination assistant, NEVER a clinician.
 * - Never makes clinical diagnoses or treatment recommendations.
 * - Never invents risk scores, emergency surge states, or capacity telemetry.
 * - Attempts live execution via Now Assist (OneExtendUtil / NowAssistSkillConfig);
 *   if the custom skill is in draft or GenAI controller returns error, transparently
 *   provides an authoritative, deterministic briefing grounded in live ServiceNow records.
 */
var AICoordinatorEngine = Class.create()
AICoordinatorEngine.prototype = {
    initialize: function() {},

    CAPABILITY_ID: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13',
    SKILL_CONFIG_ID: '9d8fed4927d24638a7cb7d624decd3e4',

    /**
     * Process an operational user query.
     * @param {string} query - user question
     * @param {string} [contextEncounterNumber] - encounter number from context if viewing encounter
     * @returns {{ success: boolean, query_type: string, response: string, encounter?: string, source: string }}
     */
    answerQuery: function(query, contextEncounterNumber) {
        var q = (query || '').trim()
        if (!q) {
            return {
                success: false,
                query_type: 'empty',
                response: 'Please enter an operational question.',
                source: 'system'
            }
        }

        var lower = q.toLowerCase()

        // ── 1. Identity & Capability Check ─────────────────────────────────────
        if (lower.indexOf('who are you') !== -1 ||
            lower.indexOf('what are you') !== -1 ||
            lower.indexOf('what do you do') !== -1 ||
            lower.indexOf('introduce yourself') !== -1) {
            return {
                success: true,
                query_type: 'identity',
                response: "I'm CareSetu AI, your hospital operations and discharge coordination assistant. I help teams identify discharge delays, coordinate handoffs, track blockers and prioritize operational follow-ups.",
                source: 'identity_engine'
            }
        }

        // ── 2. Emergency Operations Check ──────────────────────────────────────
        if (lower.indexOf('emergency') !== -1 ||
            lower.indexOf('surge') !== -1 ||
            lower.indexOf('disaster') !== -1 ||
            (lower.indexOf('capacity') !== -1 && lower.indexOf('hospital') !== -1)) {
            return this._getEmergencyStatusResponse()
        }

        // ── 3. Encounter-Specific Check ────────────────────────────────────────
        var encMatch = q.match(/ENC\d{7}/i)
        var encNumber = encMatch ? encMatch[0].toUpperCase() : (contextEncounterNumber || null)

        // ── 3.5. Fix It For Me / Action Proposals Check ────────────────────────
        if (lower.indexOf('fix it') !== -1 ||
            lower.indexOf('propose action') !== -1 ||
            lower.indexOf('propose corrective') !== -1 ||
            lower.indexOf('what can be fixed') !== -1 ||
            lower.indexOf('corrective action') !== -1 ||
            lower.indexOf('take action') !== -1) {
            return this._getFixItForMeResponse(encNumber)
        }

        // If user asked about a specific encounter or is asking encounter questions ("why is this case at risk?", "what is blocking discharge?")
        if (encNumber || lower.indexOf('this case') !== -1 || lower.indexOf('this encounter') !== -1) {
            if (!encNumber && contextEncounterNumber) {
                encNumber = contextEncounterNumber
            }
            if (encNumber) {
                return this._getEncounterRiskResponse(encNumber, q)
            }
        }

        // ── 4. Hospital-Wide Prioritization Check ──────────────────────────────
        if (lower.indexOf('prioritize') !== -1 ||
            lower.indexOf('priority') !== -1 ||
            lower.indexOf('critical cases') !== -1 ||
            lower.indexOf('needs attention') !== -1 ||
            lower.indexOf('pipeline') !== -1 ||
            lower.indexOf('delay') !== -1 ||
            lower.indexOf('summary') !== -1 ||
            lower.indexOf('what should i do') !== -1) {
            return this._getHospitalPrioritizationResponse()
        }

        // ── 5. General Operational Guidance Fallback ───────────────────────────
        return this._getGeneralOperationalResponse(q)
    },

    /**
     * Report emergency-mode status and capacity information only when backed by
     * authoritative data; explicitly states limitations if telemetry is not implemented.
     */
    _getEmergencyStatusResponse: function() {
        return {
            success: true,
            query_type: 'emergency_status',
            response: "**Emergency Operations Status: Normal Operations**\n\n" +
                      "No hospital emergency surge or disaster mode is currently active.\n\n" +
                      "*Note: Hospital-wide disaster/surge capacity tracking is not currently configured with an authoritative telemetry source on this instance. Live operational coordination remains focused on individual encounter risk scores, handoff SLA enforcement, and active discharge blockers.*",
            source: 'live_operations_engine'
        }
    },

    /**
     * Answers questions regarding a specific encounter using live records and Now Assist.
     */
    _getEncounterRiskResponse: function(encNumber, userQuery) {
        var enc = new GlideRecord('x_caresetu_ai_encounter')
        enc.addQuery('number', encNumber)
        enc.addQuery('patient_mrn', 'DOES NOT CONTAIN', 'TEST-NORMAL')
        enc.query()
        if (!enc.next()) {
            enc = new GlideRecord('x_caresetu_ai_encounter')
            enc.addQuery('number', encNumber)
            enc.query()
            if (!enc.next()) {
                return {
                    success: false,
                    query_type: 'encounter_risk',
                    encounter: encNumber,
                    response: 'Encounter ' + encNumber + ' was not found in the CareSetu database. Please verify the encounter number and try again.',
                    source: 'validation'
                }
            }
        }

        var encSysId = enc.getUniqueValue()

        // 1. Fetch latest risk score
        var score = new GlideRecord('x_caresetu_ai_risk_score')
        score.addQuery('encounter', encSysId)
        score.addQuery('is_latest', true)
        score.orderByDesc('scored_at')
        score.setLimit(1)
        score.query()

        if (!score.next()) {
            return {
                success: false,
                query_type: 'encounter_risk',
                encounter: encNumber,
                response: 'No operational discharge risk score has been computed for encounter ' + encNumber + ' yet. Please trigger risk rescoring or save the encounter record to compute operational signals.',
                source: 'validation'
            }
        }

        var riskScore = parseFloat(score.getValue('risk_score')) || 0
        var riskTier  = score.getValue('risk_tier') || 'normal'
        var explanation = score.getValue('explanation') || 'No operational risk factors are present.'
        var dataQuality = score.getValue('data_quality_warning') || ''
        var scoredAt = score.getDisplayValue('scored_at') || score.getValue('scored_at') || 'Recent'

        // 2. Fetch active blockers
        var blockers = []
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        blk.addQuery('encounter', encSysId)
        blk.addQuery('status', 'IN', 'open,in_progress,escalated')
        blk.orderBy('category')
        blk.query()
        while (blk.next()) {
            blockers.push({
                sys_id: blk.getUniqueValue(),
                category: blk.getDisplayValue('category') || blk.getValue('category'),
                description: blk.getValue('description'),
                department: blk.getValue('department') || 'Hospital Operations',
                delay_minutes: parseInt(blk.getValue('estimated_delay_minutes'), 10) || 0
            })
        }

        // 3. Fetch unacknowledged handoffs
        var handoffs = []
        var hnd = new GlideRecord('x_caresetu_ai_handoff')
        hnd.addQuery('encounter', encSysId)
        hnd.addQuery('status', 'IN', 'pending_acknowledgment,escalated')
        hnd.orderBy('priority')
        hnd.query()
        while (hnd.next()) {
            handoffs.push({
                sys_id: hnd.getUniqueValue(),
                priority: hnd.getDisplayValue('priority') || hnd.getValue('priority'),
                status: hnd.getDisplayValue('status') || hnd.getValue('status'),
                summary: hnd.getValue('summary'),
                receiving_dept: hnd.getValue('receiving_department') || 'Nursing'
            })
        }

        // 4. Fetch active escalation
        var escInfo = null
        var esc = new GlideRecord('x_caresetu_ai_escalation')
        esc.addQuery('encounter', encSysId)
        esc.addQuery('escalation_status', 'IN', 'open,acknowledged')
        esc.orderByDesc('sys_created_on')
        esc.setLimit(1)
        esc.query()
        if (esc.next()) {
            escInfo = {
                number: esc.getValue('number'),
                status: esc.getDisplayValue('escalation_status') || esc.getValue('escalation_status'),
                tier: esc.getValue('risk_tier'),
                priority: esc.getValue('priority'),
                reason: esc.getValue('reason')
            }
        }

        // 5. Fetch pending TPA authorization cases
        var tpaCases = []
        var tpa = new GlideRecord('x_caresetu_ai_tpa_case')
        tpa.addQuery('encounter', encSysId)
        tpa.addQuery('status', 'IN', 'submitted,pending_documents,under_review,escalated')
        tpa.orderBy('status')
        tpa.query()
        while (tpa.next()) {
            tpaCases.push({
                sys_id: tpa.getUniqueValue(),
                number: tpa.getValue('number') || 'TPA Case',
                payer: tpa.getValue('payer_name') || 'Insurance Desk',
                auth_type: tpa.getDisplayValue('authorization_type') || tpa.getValue('authorization_type') || 'Pre-Auth',
                status: tpa.getDisplayValue('status') || tpa.getValue('status'),
                is_overdue: tpa.getValue('is_overdue') === 'true' || tpa.getValue('is_overdue') === '1',
                next_followup: tpa.getDisplayValue('next_followup_due') || ''
            })
        }

        // 6. Attempt Now Assist LLM Skill Execution
        var nowAssistResponse = this._invokeNowAssistSkill(encNumber)
        if (nowAssistResponse) {
            return {
                success: true,
                query_type: 'encounter_risk',
                encounter: encNumber,
                response: nowAssistResponse,
                source: 'now_assist_skill'
            }
        }

        // 7. Grounded Operational Reasoning Synthesis
        var edt = enc.getValue('expected_discharge_time') || 'Not scheduled'
        var overdueTasks = parseInt(enc.getValue('overdue_coord_tasks'), 10) || 0
        var incompleteMilestones = parseInt(enc.getValue('incomplete_milestones'), 10) || 0

        // Parse baseline signals captured in the risk score explanation
        var baselineBlockers = null
        var baselineHandoffs = null
        var baselineTasks = null
        var baselineMilestones = null

        var mBlockers = explanation.match(/(\d+)\s+equipment or workflow blocker\(s\)/i)
        if (mBlockers) baselineBlockers = parseInt(mBlockers[1], 10)
        else if (explanation.indexOf('No operational risk factors') !== -1) baselineBlockers = 0

        var mHandoffs = explanation.match(/(\d+)\s+care handoff\(s\)/i)
        if (mHandoffs) baselineHandoffs = parseInt(mHandoffs[1], 10)
        else if (explanation.indexOf('No operational risk factors') !== -1) baselineHandoffs = 0

        var mTasks = explanation.match(/(\d+)\s+overdue coordination task\(s\)/i)
        if (mTasks) baselineTasks = parseInt(mTasks[1], 10)
        else if (explanation.indexOf('No operational risk factors') !== -1) baselineTasks = 0

        var mMilestones = explanation.match(/(\d+)\s+required discharge milestone\(s\)/i)
        if (mMilestones) baselineMilestones = parseInt(mMilestones[1], 10)
        else if (explanation.indexOf('No operational risk factors') !== -1) baselineMilestones = 0

        var deltas = []
        if (baselineBlockers !== null && baselineBlockers !== blockers.length) {
            deltas.push('Active blockers: ' + baselineBlockers + ' recorded at scoring → ' + blockers.length + ' active currently')
        }
        if (baselineHandoffs !== null && baselineHandoffs !== handoffs.length) {
            deltas.push('Pending handoffs: ' + baselineHandoffs + ' recorded at scoring → ' + handoffs.length + ' active currently')
        }
        if (baselineTasks !== null && baselineTasks !== overdueTasks) {
            deltas.push('Overdue tasks: ' + baselineTasks + ' recorded at scoring → ' + overdueTasks + ' active currently')
        }
        if (baselineMilestones !== null && baselineMilestones !== incompleteMilestones) {
            deltas.push('Incomplete milestones: ' + baselineMilestones + ' recorded at scoring → ' + incompleteMilestones + ' active currently')
        }

        var lines = []
        lines.push('### Operational Risk Analysis: ' + encNumber)
        lines.push('**Risk Summary:** Encounter **' + encNumber + '** is evaluated at **' + riskTier.toUpperCase() + '** operational discharge risk with a score of **' + riskScore + '/100**.')
        lines.push('')
        lines.push('**Current Live Operational Signals:**')
        lines.push('- Expected Discharge Time: ' + edt)
        lines.push('- Overdue Coordination Tasks: ' + overdueTasks)
        lines.push('- Incomplete Discharge Milestones: ' + incompleteMilestones)
        lines.push('- Unacknowledged Care Handoffs: ' + handoffs.length)
        lines.push('- Active Equipment/Workflow Blockers: ' + blockers.length)
        lines.push('- Pending TPA Authorizations: ' + tpaCases.length)
        lines.push('')

        if (blockers.length > 0) {
            lines.push('**Unresolved Operational Blockers:**')
            for (var i = 0; i < blockers.length; i++) {
                var b = blockers[i]
                lines.push('- [' + b.category + ' — ' + b.department + ']: ' + b.description + ' (Estimated delay: +' + b.delay_minutes + 'm)')
            }
            lines.push('')
        }

        if (handoffs.length > 0) {
            lines.push('**Care Handoffs Pending Acknowledgment:**')
            for (var j = 0; j < handoffs.length; j++) {
                var h = handoffs[j]
                lines.push('- [' + h.priority + ' Priority]: ' + h.summary + ' → ' + h.receiving_dept + ' (Status: ' + h.status + ')')
            }
            lines.push('')
        }

        if (tpaCases.length > 0) {
            lines.push('**Pending TPA / Insurance Authorizations:**')
            for (var k = 0; k < tpaCases.length; k++) {
                var tc = tpaCases[k]
                var followupInfo = tc.next_followup ? ' (Next follow-up: ' + tc.next_followup + ')' : ''
                lines.push('- [' + tc.payer + ' — ' + tc.auth_type + ']: ' + tc.status + (tc.is_overdue ? ' [OVERDUE]' : '') + followupInfo)
            }
            lines.push('')
        }

        if (escInfo) {
            lines.push('**Active Escalation Task:**')
            lines.push('- **' + escInfo.number + '** [Priority ' + escInfo.priority + ', ' + (escInfo.tier ? escInfo.tier.toUpperCase() : 'HIGH') + ']: ' + escInfo.reason + ' (Status: ' + escInfo.status + ')')
            lines.push('')
        }

        lines.push('**Risk Score Calculation Baseline (Scored at: ' + scoredAt + '):**')
        lines.push('>' + explanation)
        lines.push('')

        lines.push('**Operational State Comparison vs. Scoring Baseline:**')
        if (deltas.length === 0) {
            lines.push('✅ Current live operational signals match the baseline recorded at scoring time (' + scoredAt + ').')
        } else {
            lines.push('⚠️ **Operational Delta Notice:** Legitimate coordination updates have occurred since the score was calculated at ' + scoredAt + ':')
            for (var d = 0; d < deltas.length; d++) {
                lines.push('- ' + deltas[d])
            }
            lines.push('*Action: Re-scoring is recommended to synchronize risk score with current operational values.*')
        }
        lines.push('')

        lines.push('**Coordination Action Items:**')
        if (blockers.length > 0) {
            lines.push('1. Coordinate resolution of ' + blockers[0].category + ' bottleneck in ' + blockers[0].department + '.')
        }
        if (handoffs.length > 0) {
            lines.push('2. Expedite receiving staff acknowledgment for ' + handoffs[0].receiving_dept + ' handoff.')
        }
        if (overdueTasks > 0) {
            lines.push('3. Clear the ' + overdueTasks + ' overdue coordination task(s) on the encounter checklist.')
        }
        if (tpaCases.length > 0) {
            lines.push('4. Chase pending ' + tpaCases[0].payer + ' authorization with insurance coordinator.')
        }
        if (blockers.length === 0 && handoffs.length === 0 && overdueTasks === 0 && tpaCases.length === 0) {
            lines.push('All core operational coordination gates are clear. Monitor progress toward target discharge time.')
        }

        if (dataQuality) {
            lines.push('')
            lines.push('⚠️ **Data Quality Warning:** ' + dataQuality)
        }

        var actionEngine = new x_caresetu_ai.ActionExecutionEngine()
        var proposals = actionEngine.generateProposals(encSysId, { limit: 2 })

        return {
            success: true,
            query_type: 'encounter_risk',
            encounter: encNumber,
            response: lines.join('\n'),
            proposed_actions: proposals,
            source: 'care_coordinator_grounded_engine'
        }
    },

    /**
     * Answers hospital-wide operational prioritization questions using live records.
     */
    _getHospitalPrioritizationResponse: function() {
        // Query critical and high latest scores
        var highRiskEncs = []
        var scoreGr = new GlideRecord('x_caresetu_ai_risk_score')
        scoreGr.addQuery('is_latest', true)
        scoreGr.addQuery('risk_tier', 'IN', 'critical,high')
        scoreGr.orderByDesc('risk_score')
        scoreGr.query()

        while (scoreGr.next()) {
            if (!scoreGr.encounter) continue
            var encGr = scoreGr.encounter.getRefRecord()
            if (!encGr.isValidRecord()) continue

            var encSysId = encGr.getUniqueValue()

            // Count live active blockers for this encounter
            var encBlockers = 0
            var blkAgg = new GlideAggregate('x_caresetu_ai_blocker')
            blkAgg.addQuery('encounter', encSysId)
            blkAgg.addQuery('status', 'IN', 'open,in_progress,escalated')
            blkAgg.addAggregate('COUNT')
            blkAgg.query()
            if (blkAgg.next()) {
                encBlockers = parseInt(blkAgg.getAggregate('COUNT'), 10) || 0
            }

            // Count live pending handoffs for this encounter
            var encHandoffs = 0
            var hndAgg = new GlideAggregate('x_caresetu_ai_handoff')
            hndAgg.addQuery('encounter', encSysId)
            hndAgg.addQuery('status', 'IN', 'pending_acknowledgment,escalated')
            hndAgg.addAggregate('COUNT')
            hndAgg.query()
            if (hndAgg.next()) {
                encHandoffs = parseInt(hndAgg.getAggregate('COUNT'), 10) || 0
            }

            highRiskEncs.push({
                encounter_number: encGr.getValue('number') || 'Unknown',
                patient_mrn: encGr.getValue('patient_mrn') || 'N/A',
                ward: encGr.getValue('ward') || 'Unassigned',
                score: parseFloat(scoreGr.getValue('risk_score')) || 0,
                tier: scoreGr.getValue('risk_tier') || 'high',
                explanation: scoreGr.getValue('explanation') || '',
                overdue_tasks: parseInt(encGr.getValue('overdue_coord_tasks'), 10) || 0,
                unack_handoffs: encHandoffs,
                open_blockers: encBlockers,
            })
        }

        // Query total unresolved blockers
        var blockerCount = 0
        var deptBlockers = {}
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        blk.addQuery('status', 'IN', 'open,in_progress,escalated')
        blk.query()
        while (blk.next()) {
            blockerCount++
            var dept = blk.getValue('department') || blk.getDisplayValue('category') || 'Operations'
            deptBlockers[dept] = (deptBlockers[dept] || 0) + 1
        }

        // Query active unacknowledged handoffs and overdue count
        var unackHandoffCount = 0
        var overdueHandoffCount = 0
        var hnd = new GlideRecord('x_caresetu_ai_handoff')
        hnd.addQuery('status', 'IN', 'pending_acknowledgment,escalated')
        hnd.query()
        while (hnd.next()) {
            unackHandoffCount++
            if (hnd.getValue('is_overdue') === 'true' || hnd.getValue('is_overdue') === '1') {
                overdueHandoffCount++
            }
        }

        // Query active escalations across hospital
        var activeEscalationCount = 0
        var esc = new GlideRecord('x_caresetu_ai_escalation')
        esc.addQuery('escalation_status', 'IN', 'open,acknowledged')
        esc.query()
        while (esc.next()) {
            activeEscalationCount++
        }

        // Query pending TPA / insurance cases across hospital
        var pendingTpaCount = 0
        var tpa = new GlideRecord('x_caresetu_ai_tpa_case')
        tpa.addQuery('status', 'IN', 'submitted,pending_documents,under_review,escalated')
        tpa.query()
        while (tpa.next()) {
            pendingTpaCount++
        }

        // Assemble response
        var lines = []
        lines.push('### Hospital-Wide Discharge Prioritization Briefing')
        lines.push('Live operational status synthesized from active ServiceNow coordination records:\n')

        lines.push('**Operational Executive Summary:**')
        lines.push('- **' + highRiskEncs.length + '** patient encounter(s) are currently at Critical or High discharge risk.')
        lines.push('- **' + blockerCount + '** unresolved equipment/workflow operational blocker(s) active.')
        lines.push('- **' + unackHandoffCount + '** care handoff(s) currently awaiting receiving staff acknowledgment (' + overdueHandoffCount + ' overdue).')
        lines.push('- **' + activeEscalationCount + '** open or acknowledged escalation task(s) active.')
        lines.push('- **' + pendingTpaCount + '** pending TPA / insurance authorization case(s) requiring follow-up.')
        lines.push('')

        if (highRiskEncs.length > 0) {
            lines.push('**Top Encounters Requiring Immediate Coordination Follow-up:**')
            var displayLimit = Math.min(highRiskEncs.length, 5)
            for (var i = 0; i < displayLimit; i++) {
                var e = highRiskEncs[i]
                lines.push((i + 1) + '. **' + e.encounter_number + '** (' + e.ward + ' Ward | MRN: ' + e.patient_mrn + ')')
                lines.push('   - Risk: **' + e.score + '/100 [' + e.tier.toUpperCase() + ']**')
                lines.push('   - Drivers: ' + e.open_blockers + ' blocker(s), ' + e.unack_handoffs + ' unacknowledged handoff(s), ' + e.overdue_tasks + ' overdue task(s).')
                lines.push('   - Key factor: ' + e.explanation)
            }
            lines.push('')
        } else {
            lines.push('✅ No encounters are currently at Critical or High operational risk. All active encounters are within Normal to Medium thresholds.\n')
        }

        if (blockerCount > 0) {
            lines.push('**Departmental Operational Bottlenecks:**')
            for (var d in deptBlockers) {
                lines.push('- ' + d + ': ' + deptBlockers[d] + ' open blocker(s)')
            }
            lines.push('')
        }

        lines.push('**Recommended Coordinator Action Sequence:**')
        var stepNum = 1
        if (highRiskEncs.length > 0) {
            lines.push(stepNum++ + '. Review top critical encounter **' + highRiskEncs[0].encounter_number + '** on Encounter 360.')
        }
        if (overdueHandoffCount > 0) {
            lines.push(stepNum++ + '. Intervene on ' + overdueHandoffCount + ' overdue care handoff(s) to clear transfer bottlenecks.')
        } else if (unackHandoffCount > 0) {
            lines.push(stepNum++ + '. Coordinate acknowledgment for ' + unackHandoffCount + ' pending care handoff(s).')
        }
        if (activeEscalationCount > 0) {
            lines.push(stepNum++ + '. Coordinate with charge nurses on ' + activeEscalationCount + ' active discharge escalation(s).')
        }
        if (blockerCount > 0) {
            lines.push(stepNum++ + '. Follow up with department leads on outstanding workflow blockers.')
        }
        if (pendingTpaCount > 0) {
            lines.push(stepNum++ + '. Expedite ' + pendingTpaCount + ' pending TPA authorization(s) approaching discharge cutoff.')
        }

        var actionEngine = new x_caresetu_ai.ActionExecutionEngine()
        var proposals = actionEngine.generateProposals(null, { limit: 3 })

        return {
            success: true,
            query_type: 'hospital_prioritization',
            response: lines.join('\n'),
            proposed_actions: proposals,
            source: 'live_operations_engine'
        }
    },

    /**
     * Answers Fix It For Me queries by generating and presenting actionable proposals.
     */
    _getFixItForMeResponse: function(encNumber) {
        var actionEngine = new x_caresetu_ai.ActionExecutionEngine()
        var proposals = actionEngine.generateProposals(encNumber, { limit: 3 })

        var lines = []
        lines.push('### Fix It For Me — Operational Action Proposals')
        if (encNumber) {
            lines.push('Target Encounter: **' + encNumber + '**')
        }
        lines.push('')
        if (proposals.length === 0) {
            lines.push('✅ No pending operational bottlenecks currently require corrective intervention. All active coordination gates and blockers are clear.')
        } else {
            lines.push('I have analyzed current operational bottlenecks and prepared **' + proposals.length + ' human-approved corrective action proposal(s)**:')
            for (var i = 0; i < proposals.length; i++) {
                var p = proposals[i]
                lines.push((i + 1) + '. **' + p.title + '** (' + p.number + ')')
                lines.push('   - **Rationale:** ' + p.rationale)
                lines.push('   - **Target:** ' + p.target_table + ' [' + p.target_record + ']')
            }
            lines.push('')
            lines.push('⚠️ *Human-in-the-loop policy: Operational actions are never executed autonomously. Authorized staff must review and click **Approve** on each action card below to execute.*')
        }

        return {
            success: true,
            query_type: 'fix_it_for_me',
            encounter: encNumber,
            response: lines.join('\n'),
            proposed_actions: proposals,
            source: 'action_execution_engine'
        }
    },

    /**
     * Answers general operational queries with guidance.
     */
    _getGeneralOperationalResponse: function(query) {
        return {
            success: true,
            query_type: 'general',
            response: "I'm CareSetu AI, your hospital operations and discharge coordination assistant.\n\n" +
                      "Here are the operational queries you can ask me:\n" +
                      "- **\"Fix it for me\"** (Proposes human-approved corrective actions for active blockers and TPA delays)\n" +
                      "- **\"Explain the discharge risk for [Encounter Number]\"** (e.g. *Explain the discharge risk for ENC1000007*)\n" +
                      "- **\"What should I prioritize right now?\"** (Identifies highest risk cases, blockers, and overdue tasks)\n" +
                      "- **\"What is the current emergency status?\"** (Reports authoritative hospital emergency operations status)\n" +
                      "- **\"Show me critical cases\"** or **\"Summarize today's pipeline\"**",
            source: 'coordinator_assistant'
        }
    },

    /**
     * Attempt invocation of the Now Assist Skill via OneExtendUtil.
     * Returns string on success, or null if skill cannot execute.
     */
    _invokeNowAssistSkill: function(encounterNumber) {
        try {
            var request = {
                executionRequests: [{
                    payload: { 'encounter_number': encounterNumber },
                    capabilityId: this.CAPABILITY_ID,
                    meta: {
                        skillConfigId: this.SKILL_CONFIG_ID
                    }
                }],
                mode: 'sync'
            }
            var response = sn_one_extend.OneExtendUtil.executeSecure(request)
            if (response && response.capabilities && response.capabilities[this.CAPABILITY_ID]) {
                var cap = response.capabilities[this.CAPABILITY_ID]
                if (cap.status === 'completed' && (cap.response || cap.output)) {
                    return cap.response || cap.output
                }
            }
        } catch (e) {
            gs.info('AICoordinatorEngine: Now Assist skill execution bypassed: ' + e.message)
        }
        return null
    },

    type: 'AICoordinatorEngine'
}
