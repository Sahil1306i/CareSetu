import { NowAssistSkillConfig } from '@servicenow/sdk/core'

/**
 * CareSetu: Explain Discharge Risk
 *
 * PURPOSE
 * -------
 * This skill reads a Patient Encounter and its latest Discharge Risk Score
 * (produced by the deterministic OperationalRiskEngine) and asks an LLM to
 * explain the result in plain language for care coordinators and charge nurses.
 *
 * AUTHORITY BOUNDARY
 * ------------------
 * The OperationalRiskEngine (ScriptInclude) is the SOLE authority for:
 *   - risk_score (0–100)
 *   - risk_tier  (normal / medium / high / critical)
 *
 * This skill NEVER recalculates, modifies, or overrides either value.
 * The LLM is provided the engine's pre-computed output and is explicitly
 * instructed to narrate it — not reinterpret it.
 *
 * The LLM must NEVER:
 *   - make clinical judgements
 *   - reference diagnosis, comorbidities, vitals, or medical severity
 *   - recommend treatment
 *   - produce clinical predictions
 *
 * TOOLS
 * -----
 * 1. GetEncounter      — queries x_caresetu_ai_encounter by number
 * 2. GetLatestRiskScore — queries x_caresetu_ai_risk_score where is_latest=true
 *    (depends on GetEncounter to resolve the encounter sys_id)
 *
 * DEPLOYMENT
 * ----------
 * - UI Action button on x_caresetu_ai_encounter form
 * - Now Assist Panel (ServiceNow Otto chat) for natural-language queries
 *
 * POST-DEPLOY REQUIRED (see comment at bottom of file):
 *   The auto-generated UI Action script displays raw JSON by default.
 *   After `npm run deploy`, update the UI Action script in Studio to format
 *   the LLM response as readable text. See the post-deploy script template below.
 *
 * Field names verified against live instance sys_dictionary.
 * Table existence verified via sys_db_object query.
 * testValues reference real record ENC1000004 (risk_tier=critical, risk_score=100).
 */
export const explainRiskSkill = NowAssistSkillConfig(
    // ─── Arg 1: Skill Definition ────────────────────────────────────────────────
    {
        $id: Now.ID['caresetu-explain-risk-skill'],
        name: 'CareSetu Explain Discharge Risk',

        // ── Inputs ────────────────────────────────────────────────────────────
        // Single string input: the encounter number (e.g. "ENC1000004").
        // Input names with spaces require bracket notation in the prompt:
        //   p.input['encounter number']
        // and snake_case in context.getValue():
        //   context.getValue('encounter_number')
        inputs: [
            {
                $id: Now.ID['caresetu-skill-input-encounter-number'],
                name: 'encounter number',
                mandatory: true,
                dataType: 'string',
                testValues: 'ENC1000004',
            },
        ],

        // ── Tools ─────────────────────────────────────────────────────────────
        // Two InlineScript tools chained via `depends`.
        // Both query verified live tables with verified field names.
        // Neither tool modifies any record.
        tools: (t) => {
            // ── Tool 1: GetEncounter ───────────────────────────────────────────
            // Queries x_caresetu_ai_encounter by number.
            // Returns all five operational signal fields plus identity fields.
            // The sys_id is embedded in the JSON output for Tool 2 to use.
            const getEncounter = t.InlineScript('GetEncounter', {
                $id: Now.ID['caresetu-skill-tool-get-encounter'],
                script: `(function(context) {
    try {
        var encounterNumber = context.getValue('encounter_number');
        if (!encounterNumber) {
            return { error: 'encounter_number input is required' };
        }

        var enc = new GlideRecord('x_caresetu_ai_encounter');
        if (!enc.isValid()) {
            return { error: 'Table x_caresetu_ai_encounter not found on this instance' };
        }
        enc.addQuery('number', encounterNumber);
        enc.addQuery('patient_mrn', 'DOES NOT CONTAIN', 'TEST-NORMAL');
        enc.query();

        if (!enc.next()) {
            enc = new GlideRecord('x_caresetu_ai_encounter');
            enc.addQuery('number', encounterNumber);
            enc.query();
            if (!enc.next()) {
                return { error: 'Encounter not found: ' + encounterNumber };
            }
        }

        var encSysId = enc.getUniqueValue();
        var openBlockers = parseInt(enc.getValue('open_blockers'), 10) || 0;
        var unackHandoffs = parseInt(enc.getValue('unack_handoffs'), 10) || 0;

        var blk = new GlideAggregate('x_caresetu_ai_blocker');
        if (blk.isValid()) {
            blk.addQuery('encounter', encSysId);
            blk.addQuery('status', 'IN', 'open,in_progress,escalated');
            blk.addAggregate('COUNT');
            blk.query();
            if (blk.next()) {
                openBlockers = parseInt(blk.getAggregate('COUNT'), 10) || 0;
            }
        }

        var hnd = new GlideAggregate('x_caresetu_ai_handoff');
        if (hnd.isValid()) {
            hnd.addQuery('encounter', encSysId);
            hnd.addQuery('status', 'IN', 'pending_acknowledgment,escalated');
            hnd.addAggregate('COUNT');
            hnd.query();
            if (hnd.next()) {
                unackHandoffs = parseInt(hnd.getAggregate('COUNT'), 10) || 0;
            }
        }

        // Parse expected_discharge_time for human-readable display
        var edt = enc.getValue('expected_discharge_time');
        var edtDisplay = edt ? edt : 'Not set';

        return {
            sys_id:                   encSysId,
            number:                   enc.getValue('number'),
            patient_mrn:              enc.getValue('patient_mrn'),
            ward:                     enc.getValue('ward') || 'Not specified',
            expected_discharge_time:  edtDisplay,
            overdue_coord_tasks:      parseInt(enc.getValue('overdue_coord_tasks'), 10) || 0,
            incomplete_milestones:    parseInt(enc.getValue('incomplete_milestones'), 10) || 0,
            unack_handoffs:           unackHandoffs,
            open_blockers:            openBlockers
        };
    } catch (e) {
        gs.error('CareSetu GetEncounter tool failed: ' + e.message);
        return { error: 'Script execution failed: ' + e.message };
    }
})(context)`,
            })

            // ── Tool 2: GetLatestRiskScore ────────────────────────────────────
            // Queries x_caresetu_ai_risk_score where encounter=<sys_id>
            // and is_latest=true. Depends on GetEncounter to resolve the sys_id.
            //
            // IMPORTANT: This tool reads and surfaces the score. It does NOT
            // recalculate or modify it. The OperationalRiskEngine is the sole
            // authority for risk_score and risk_tier.
            const getLatestRiskScore = t.InlineScript('GetLatestRiskScore', {
                $id: Now.ID['caresetu-skill-tool-get-risk-score'],
                depends: [getEncounter],
                script: `(function(context) {
    try {
        var encounterSysId = null;

        // Try parsing JSON output from GetEncounter
        var rawEnc = context.getValue('get_encounter_output') || context.getValue('GetEncounter') || context.getValue('get_encounter');
        if (rawEnc) {
            try {
                var parsed = typeof rawEnc === 'string' ? JSON.parse(rawEnc) : rawEnc;
                if (parsed && parsed.sys_id) {
                    encounterSysId = parsed.sys_id;
                }
            } catch (pErr) {}
        }

        // Resilient fallback: resolve directly by encounter_number input
        if (!encounterSysId) {
            var encNum = context.getValue('encounter_number');
            if (encNum) {
                var encLookup = new GlideRecord('x_caresetu_ai_encounter');
                encLookup.addQuery('number', encNum);
                encLookup.query();
                if (encLookup.next()) {
                    encounterSysId = encLookup.getUniqueValue();
                }
            }
        }

        if (!encounterSysId) {
            return { error: 'Could not resolve encounter sys_id — encounter may not exist' };
        }

        // Query latest risk score
        var score = new GlideRecord('x_caresetu_ai_risk_score');
        if (!score.isValid()) {
            return { error: 'Table x_caresetu_ai_risk_score not found on this instance' };
        }
        score.addQuery('encounter', encounterSysId);
        score.addQuery('is_latest', true);
        score.orderByDesc('scored_at');
        score.setLimit(1);
        score.query();

        var riskScore = null;
        var riskTier = 'unknown';
        var explanation = 'No risk score has been calculated for this encounter yet.';
        var dataQualityWarning = '';
        var scoredAt = null;

        if (score.next()) {
            riskScore = parseFloat(score.getValue('risk_score')) || 0;
            riskTier = score.getValue('risk_tier') || 'unknown';
            explanation = score.getValue('explanation') || '';
            dataQualityWarning = score.getValue('data_quality_warning') || '';
            scoredAt = score.getValue('scored_at') || null;
        }

        // Query active operational blockers
        var blockers = [];
        var blk = new GlideRecord('x_caresetu_ai_blocker');
        if (blk.isValid()) {
            blk.addQuery('encounter', encounterSysId);
            blk.addQuery('status', 'IN', 'open,in_progress,escalated');
            blk.query();
            while (blk.next()) {
                blockers.push({
                    category: blk.getValue('category'),
                    description: blk.getValue('description'),
                    delay_minutes: parseInt(blk.getValue('estimated_delay_minutes'), 10) || 0
                });
            }
        }

        // Query active escalation
        var escalation = null;
        var esc = new GlideRecord('x_caresetu_ai_escalation');
        if (esc.isValid()) {
            esc.addQuery('encounter', encounterSysId);
            esc.addQuery('escalation_status', 'IN', 'open,acknowledged');
            esc.orderByDesc('sys_created_on');
            esc.setLimit(1);
            esc.query();
            if (esc.next()) {
                escalation = {
                    number: esc.getValue('number'),
                    status: esc.getValue('escalation_status'),
                    priority: esc.getValue('priority'),
                    tier: esc.getValue('risk_tier'),
                    reason: esc.getValue('reason')
                };
            }
        }

        return {
            risk_score:           riskScore,
            risk_tier:            riskTier,
            explanation:          explanation,
            data_quality_warning: dataQualityWarning,
            scored_at:            scoredAt,
            active_blockers:      blockers,
            active_escalation:    escalation
        };
    } catch (e) {
        gs.error('CareSetu GetLatestRiskScore tool failed: ' + e.message);
        return { error: 'Script execution failed: ' + e.message };
    }
})(context)`,
            })

            // Explicit property assignment required (shorthand breaks tool resolution)
            return {
                GetEncounter:       getEncounter,
                GetLatestRiskScore: getLatestRiskScore,
            }
        },

        // ── Security Controls ──────────────────────────────────────────────────
        // $id is REQUIRED on userAccess — missing causes sync errors on re-deploy.
        // type: 'authenticated' — any logged-in user with encounter access can use it.
        // roleRestrictions: charge_nurse and coordinator roles from live instance.
        securityControls: {
            userAccess: {
                $id: Now.ID['caresetu-explain-risk-skill-acl'],
                type: 'authenticated',
            },
            roleRestrictions: [
                '5beaa5896d944d9f982717542715bd74', // x_caresetu_ai.charge_nurse
                '70aff402bb0848098d66702b4d974e13', // x_caresetu_ai.coordinator
                '477509d764ab03107f441ef9e64c70a1', // x_snc_caresetu_ai.admin
            ],
        },

        // ── Deployment Settings ────────────────────────────────────────────────
        // UI Action: button on the encounter form. actions_access=true confirmed.
        // Now Assist Panel: enabled for chat-based "why is ENC1000004 critical?" queries.
        deploymentSettings: {
            nowAssistPanel: {
                enabled: true,
                roles: ['now_assist_panel_user'],
            },
        },
    },

    // ─── Arg 2: LLM Provider and Prompt ─────────────────────────────────────────
    {
        providers: [
            {
                provider: 'Now LLM Service',
                prompts: [
                    {
                        name: 'Explain Operational Risk',
                        versions: [
                            {
                                $id: Now.ID['caresetu-explain-risk-prompt-v1'],
                                model: 'llm_generic_small_v2',
                                promptState: 'draft',
                                // temperature omitted — use model default for factual narration
                                prompt: (p) =>
                                    `## Role
You are a care coordination support assistant embedded in a hospital operational dashboard.
You explain operational discharge risk scores to charge nurses and care coordinators.

## What You Must NEVER Do
- Diagnose the patient
- Reference comorbidities, vitals, medical history, or clinical severity
- Recommend treatment or clinical interventions
- Override, recalculate, or reinterpret the risk score or risk tier
- Speculate beyond the operational data provided

## Encounter Data (from x_caresetu_ai_encounter)
${p.tool.GetEncounter.output}

## Current Discharge Risk Score (from x_caresetu_ai_risk_score — computed by OperationalRiskEngine)
${p.tool.GetLatestRiskScore.output}

## Instructions
Produce a concise explanation for the care coordination team. Structure your response as follows:

**Risk Summary**
State the risk tier (Normal / Medium / High / Critical) and the numeric score (0–100).
One sentence only.

**Active Operational Blockers**
List ONLY the signal fields that are non-zero. For each:
- Overdue coordination tasks: [value]
- Incomplete discharge milestones: [value]
- Unacknowledged handoffs: [value]
- Open equipment / workflow blockers: [value]
- Discharge time: state whether past-due, within 1 hour, within 3 hours, or later
If all signals are zero, write: "No active operational blockers."

**Why This Score**
Quote the explanation field from the risk score record verbatim. Do not paraphrase or add clinical context.

**What the Team Should Focus On**
2–3 sentences about which operational blockers are highest priority based solely on the coordination data above. Do not recommend clinical actions.

**Data Quality**
If data_quality_warning is non-empty, display it exactly as provided, prefixed with ⚠️.
If data_quality_warning is empty, omit this section entirely.

Keep the total response under 300 words.`,
                            },
                        ],
                    },
                ],
            },
        ],
    },
)

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * POST-DEPLOY UI ACTION SCRIPT (apply after `npm run deploy`)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * After deployment, the auto-generated UI Action shows raw JSON.
 * Open Studio → x_caresetu_ai (scope) → UI Actions → "CareSetu: Explain Discharge Risk"
 * Replace the generated script with:
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * var skillResponse = sn_nowassist_skill.SkillRunner.run(
 *     '<skill_sys_id>',           // replace with actual skill sys_id after deploy
 *     { 'encounter number': current.number.toString() }
 * );
 *
 * var result = skillResponse && skillResponse.response
 *     ? skillResponse.response
 *     : 'No explanation available. Ensure the encounter has been scored.';
 *
 * gs.addInfoMessage(result.replace(/\n/g, '<br/>'));
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * To find the skill sys_id after deploy:
 *   npx @servicenow/sdk query sn_nowassist_skill_config -q "nameCONTAINSCareSetu" -f "name,sys_id" -o json
 */
