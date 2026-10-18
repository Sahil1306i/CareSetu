# CareSetu AI — Comprehensive Technical & Product Architecture Report
## Closed-Loop Hospital Discharge Operations on the ServiceNow Platform

**Repository / Local Workspace:** `C:\Users\sahil\CareSetu`  
**ServiceNow Instance:** `https://act-hck-4161-0029.lab.service-now.com`  
**Scoped Application:** `x_caresetu_ai` (`0336010b358446838d92f98030f1589c`)  
**ServiceNow SDK Version:** 4.13.3 (ServiceNow Fluent / TypeScript build system)  
**Report Version:** 1.0.0 — Hackathon Submission & Technical Defense Edition  
**Author / Engineering Team:** CareSetu AI Platform Architecture & Engineering  

---

## 1. Executive Summary

Hospital discharge delay is one of modern healthcare’s most pervasive and costly operational failures. While clinical decisions dictate *when* a patient is medically fit for discharge, the actual release is routinely stalled for 4 to 8 hours by fragmented administrative, logistical, and interdepartmental bottlenecks: unacknowledged nursing handoffs, pending Third-Party Administrator (TPA) insurance pre-authorizations, delayed take-home medications, equipment unavailability, and missing transport.

**CareSetu AI** transforms the ServiceNow platform into an operational nervous system for acute care hospitals. Built natively within scoped application `x_caresetu_ai`, CareSetu AI couples:
1. **Deterministic Operational Risk Scoring (0–100):** Real-time, rule-based urgency scoring driven entirely by non-clinical coordination signals.
2. **Transparent Delay Prediction:** Additive delay modeling calculated from individual operational blocker commitments and signal defaults.
3. **Smart Handoff SLA Enforcement:** Closed-loop shift-to-shift and inter-unit handoffs with automated acknowledgment timers and blocker generation upon breach.
4. **TPA / Insurance Auto-Chasing:** Systematic tracking of insurance authorizations, automated deadline escalation, and blocker synchronization.
5. **Grounded AI Care Coordinator:** A natural-language operational copilot that answers prioritization queries grounded directly in live ServiceNow coordination records.
6. **"Fix It For Me" (Human-Approved Operational Actions):** An auditable, human-in-the-loop action engine allowing the AI to propose corrective interventions (reassigning blockers, escalating bottlenecks, logging insurance follow-ups) that execute through strict server-side handlers *only* after explicit authorization by licensed charge nurses or coordinators.

---

## 2. Problem Statement & Design Principles

### 2.1 The Operational Problem
In acute healthcare facilities, clinical readiness does not equal operational departure. Once an attending physician writes a discharge order:
- **Visibility Deficit:** Charge nurses lack a single consolidated view of what is holding up the discharge across radiology, pharmacy, insurance desk, and biomedical engineering.
- **Diffused Ownership:** Blockers lack clear individual owners, target resolution times, and accountability SLAs.
- **Unmanaged Handoffs:** Shift changes and inter-unit transfers occur via verbal or paper handoffs that go unacknowledged, leading to dropped dependencies.
- **Payer Gridlock:** TPA desks operate reactively; delayed claim follow-ups leave patients occupying acute care beds hours after clinical clearance.
- **Lack of Actionability in AI:** Generic LLM chatbots output vague narrative suggestions without platform mechanisms to execute changes or enforce approvals.

### 2.2 Core Design Principles
CareSetu AI was engineered against six uncompromised platform principles:

1. **Strict Non-Clinical Scope:** CareSetu AI monitors *operational coordination signals only*. It never reads vital signs, lab values, diagnostic imaging, or physician notes, and never issues medical advice, diagnosis, or clinical triage.
2. **Deterministic, Explainable Risk Scoring:** Urgency scores and delay predictions are calculated via transparent, published mathematical rules in ServiceNow Script Includes—never by stochastic LLM hallucinations.
3. **Closed-Loop Accountability:** Every blocker, handoff, and insurance case has an assigned owner, target deadline, state machine lifecycle, and automated escalation path.
4. **Zero Autonomous Record Mutation:** The AI proposes corrective actions, but the platform forbids autonomous writes. Execution requires explicit, authenticated approval from authorized personnel (`x_caresetu_ai.coordinator` or `x_caresetu_ai.charge_nurse`).
5. **Platform Native & Fluent Managed:** All tables, Business Rules, Script Includes, REST APIs, and ACLs are defined declaratively in ServiceNow SDK Fluent (`.now.ts`), compiled with `npx @servicenow/sdk`, and managed via versioned rollback contexts.
6. **Data Minimization:** No Patient Health Information (PHI) or patient names are stored in operational coordination tables; records reference synthetic/operational identifiers only (`patient_mrn`, `bed_number`, `ward`).

---

## 3. End-to-End System Architecture

CareSetu AI follows a multi-tier, defense-in-depth architecture entirely hosted on the ServiceNow platform:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                PRESENTATION TIER                                       │
│   ServiceNow UI Page: x_caresetu_ai_command_center.do (React 18 + Pure CSS Tokens)    │
│   ┌────────────────────┬──────────────────────┬──────────────────┬─────────────────┐   │
│   │  Command Center    │  Discharge Pipeline  │  Encounter 360   │  Emergency Ops  │   │
│   │  (Hospital KPIs)   │  (Bed Board View)    │  (Deep Dive)     │  (Surge Mode)   │   │
│   └────────────────────┴──────────────────────┴──────────────────┴─────────────────┘   │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  AI Care Coordinator Slide-Over (Grounded Briefings + Action Proposal Cards)   │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Authenticated HTTPS / REST (X-UserToken / Bearer)
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             APPLICATION & SECURITY TIER                                │
│   Scoped REST APIs: /api/x_caresetu_ai/...                                             │
│   ┌───────────────────┬────────────────────┬───────────────────┬───────────────────┐   │
│   │  /operational_risk│  /discharge_pred   │  /handoff         │  /actions (Fix-It)│   │
│   └───────────────────┴────────────────────┴───────────────────┴───────────────────┘   │
│   Security Boundary: Scoped ACLs (read/write/create) · Role Authorization Engine       │
│   Permitted Roles: x_caresetu_ai.coordinator · x_caresetu_ai.charge_nurse · admin      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Server-Side Script Include Invocations
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             OPERATIONAL ENGINES TIER                                   │
│   ┌─────────────────────────────┐         ┌─────────────────────────────┐              │
│   │    OperationalRiskEngine    │         │  DischargePredictionEngine  │              │
│   │  Deterministic 0-100 Score  │         │  Additive Delay Minutes     │              │
│   └──────────────┬──────────────┘         └──────────────┬──────────────┘              │
│   ┌──────────────┴──────────────┐         ┌──────────────┴──────────────┐              │
│   │        HandoffEngine        │         │       TpaChaseEngine        │              │
│   │  SLA timers & auto-blockers │         │  Payer Follow-up Schedule   │              │
│   └──────────────┬──────────────┘         └──────────────┬──────────────┘              │
│   ┌──────────────┴──────────────┐         ┌──────────────┴──────────────┐              │
│   │     AICoordinatorEngine     │         │    ActionExecutionEngine    │              │
│   │  Grounded operational synth │         │  Human-in-the-loop handler  │              │
│   └─────────────────────────────┘         └─────────────────────────────┘              │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Async Business Rules & GlideRecord Engine
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             DATA & AUTOMATION TIER                                     │
│   Scoped Tables:                                                                       │
│   • x_caresetu_ai_encounter             • x_caresetu_ai_risk_score                     │
│   • x_caresetu_ai_blocker               • x_caresetu_ai_discharge_prediction           │
│   • x_caresetu_ai_handoff               • x_caresetu_ai_tpa_case                       │
│   • x_caresetu_ai_escalation            • x_caresetu_ai_action_request                 │
│                                                                                        │
│   Automation & Background Daemons:                                                     │
│   • sync-blocker-count (BR)             • sync-handoff-count (BR)                      │
│   • compute-risk-async (BR)             • predict-discharge-async (BR)                 │
│   • handoff-overdue-chaser (Scheduled)  • tpa-followup-chaser (Scheduled)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component-by-Component Source Breakdown

| Component | Repository Path | Type | Primary Entry Points |
|---|---|---|---|
| **OperationalRiskEngine** | [`src/server/script-includes/OperationalRiskEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/OperationalRiskEngine.server.js) | Script Include | `scoreEncounter(encSysId)`<br>`_applyRules(signals)`<br>`_syncEscalation(enc, result)` |
| **DischargePredictionEngine** | [`src/server/script-includes/DischargePredictionEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/DischargePredictionEngine.server.js) | Script Include | `predictDischarge(encSysId)`<br>`computeOnly(encSysId)`<br>`_computePrediction(enc)` |
| **HandoffEngine** | [`src/server/script-includes/HandoffEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/HandoffEngine.server.js) | Script Include | `createHandoff(fields)`<br>`acknowledgeHandoff(...)`<br>`processOverdueHandoffs()`<br>`syncEncounterUnackCount(encSysId)` |
| **TpaChaseEngine** | [`src/server/script-includes/TpaChaseEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/TpaChaseEngine.server.js) | Script Include | `scheduleNextFollowup(...)`<br>`processOverdueCases()`<br>`recordFollowup(...)`<br>`resolveLinkedBlocker(...)` |
| **AICoordinatorEngine** | [`src/server/script-includes/AICoordinatorEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/AICoordinatorEngine.server.js) | Script Include | `answerQuery(query, encNumber)`<br>`_getHospitalPrioritizationResponse()`<br>`_getEncounterRiskResponse(...)`<br>`_getFixItForMeResponse(...)` |
| **ActionExecutionEngine** | [`src/server/script-includes/ActionExecutionEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/ActionExecutionEngine.server.js) | Script Include | `proposeAction(fields)`<br>`approveAndExecute(requestId, ...)`<br>`rejectAction(requestId, ...)`<br>`generateProposals(encId)` |
| **Sync Blocker Counter** | [`src/server/business-rules/sync-blocker-count.server.js`](file:///c:/Users/sahil/CareSetu/src/server/business-rules/sync-blocker-count.server.js) | Business Rule (Async) | Triggered after blocker insert/update/delete; updates `encounter.open_blockers` |
| **Sync Handoff Counter** | [`src/server/business-rules/sync-handoff-count.server.js`](file:///c:/Users/sahil/CareSetu/src/server/business-rules/sync-handoff-count.server.js) | Business Rule (Async) | Triggered after handoff insert/update/delete; updates `encounter.unack_handoffs` |
| **Compute Risk Async** | [`src/server/business-rules/compute-risk-async.server.js`](file:///c:/Users/sahil/CareSetu/src/server/business-rules/compute-risk-async.server.js) | Business Rule (Async) | Triggered on encounter update; calls `OperationalRiskEngine.scoreEncounter` |
| **Handoff Overdue Chaser** | [`src/server/scheduled-scripts/handoff-overdue-chaser.server.js`](file:///c:/Users/sahil/CareSetu/src/server/scheduled-scripts/handoff-overdue-chaser.server.js) | Scheduled Script | Hourly daemon invoking `HandoffEngine.processOverdueHandoffs()` |
| **TPA Followup Chaser** | [`src/server/scheduled-scripts/tpa-followup-chaser.server.js`](file:///c:/Users/sahil/CareSetu/src/server/scheduled-scripts/tpa-followup-chaser.server.js) | Scheduled Script | Hourly daemon invoking `TpaChaseEngine.processOverdueCases()` |
| **UI Page Application** | [`src/fluent/ui-pages/command-center.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/ui-pages/command-center.now.ts) | UI Page Mount | Mounts compiled React bundle at endpoint `/x_caresetu_ai_command_center.do` |
| **React Application Shell** | [`src/client/app.tsx`](file:///c:/Users/sahil/CareSetu/src/client/app.tsx) | Frontend Root | Manages hash routing, view switching, header status, and global coordinator drawer |

---

## 5. Scoped Data Model & Table Relationships

The application is structured around eight dedicated scoped tables in the `x_caresetu_ai` namespace:

```
                          ┌───────────────────────────┐
                          │  x_caresetu_ai_encounter  │
                          │  (number: ENC1000001)     │
                          └─────────────┬─────────────┘
                                        │
         ┌──────────────┬───────────────┼───────────────┬──────────────┐
         ▼              ▼               ▼               ▼              ▼
  ┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
  │  risk_score  ││discharge_pred││   blocker    ││   handoff    ││   tpa_case   │
  │  (SCO100001) ││ (PRE100001)  ││ (BLK100001)  ││ (HND100001)  ││ (TPA100001)  │
  └──────────────┘└──────────────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘
                                         ▲               │               │
                                         │ linked_blocker│ linked_blocker│
                                         └───────────────┴───────────────┘
                                         ▲               ▲
                                         │ target_record │ target_record
                                  ┌──────┴───────────────┴──────┐
                                  │   action_request (Fix It)   │
                                  │   (ACT1000001)              │
                                  └─────────────────────────────┘
```

### Table Definitions & Key Schema Fields

1. **`x_caresetu_ai_encounter`** ([`src/fluent/tables/patient-encounter.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/patient-encounter.now.ts))
   - `number` (String, display, auto-number `ENC`)
   - `patient_mrn` (String): Non-PHI synthetic Medical Record Number (e.g. `CS-MRN-1024`)
   - `ward` (Choice): `ICU`, `General Ward`, `Step Down`, `Surgical`, `Telemetry`
   - `bed_number` (String): Operational bed allocation (e.g. `ICU-04`)
   - `expected_discharge_time` (DateTime): Operational target discharge timestamp
   - `promised_discharge_time` (DateTime): Baseline promised departure time
   - `actual_discharge_time` (DateTime): Departed timestamp
   - `overdue_coord_tasks` (Integer): Count of overdue tasks
   - `incomplete_milestones` (Integer): Count of remaining milestones
   - `unack_handoffs` (Integer): Count of active unacknowledged care handoffs
   - `open_blockers` (Integer): Count of unresolved operational blockers
   - `charge_nurse` (Reference → `sys_user`): Lead nurse responsible for discharge execution

2. **`x_caresetu_ai_risk_score`** ([`src/fluent/tables/discharge-risk-score.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/discharge-risk-score.now.ts))
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `risk_score` (Integer, 0–100): Calculated score
   - `risk_tier` (Choice): `normal`, `medium`, `high`, `critical`
   - `explanation` (MultiLineText, 4000): Verbatim mathematical rationale
   - `data_quality_warning` (String): Stamped if baseline parameters are missing
   - `is_latest` (Boolean): Flag marking current active score
   - `scored_at` (DateTime): Calculation timestamp

3. **`x_caresetu_ai_blocker`** ([`src/fluent/tables/operational-blocker.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/operational-blocker.now.ts))
   - `number` (String, auto-number `BLK`)
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `category` (Choice): `tpa`, `pharmacy`, `handoff`, `transport`, `equipment`, `documentation`, `coordination`, `other`
   - `department` (String): Department holding resolution
   - `owner` (Reference → `sys_user`): Staff member assigned to resolve
   - `status` (Choice): `open`, `in_progress`, `resolved`, `escalated`
   - `is_overdue` (Boolean): Breach flag
   - `estimated_delay_minutes` (Integer): Specific minute contribution
   - `resolution_notes` (MultiLineText): Audit history and coordinator notes

4. **`x_caresetu_ai_handoff`** ([`src/fluent/tables/handoff.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/handoff.now.ts))
   - `number` (String, auto-number `HND`)
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `sending_department`, `receiving_department` (String)
   - `sending_staff`, `receiving_staff` (Reference → `sys_user`)
   - `priority` (Choice): `routine` (30m SLA), `urgent` (15m SLA), `critical` (5m SLA)
   - `status` (Choice): `pending_acknowledgment`, `acknowledged`, `in_progress`, `completed`, `escalated`, `cancelled`
   - `acknowledgment_deadline` (DateTime): SLA limit
   - `is_overdue` (Boolean): SLA breach indicator
   - `linked_blocker` (Reference → `x_caresetu_ai_blocker`): Auto-generated blocker record

5. **`x_caresetu_ai_tpa_case`** ([`src/fluent/tables/tpa-case.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/tpa-case.now.ts))
   - `number` (String, auto-number `TPA`)
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `payer_name` (String): Insurer / TPA firm name
   - `status` (Choice): `submitted`, `pending_documents`, `under_review`, `approved`, `rejected`, `escalated`, `closed`
   - `submission_time`, `next_followup_due`, `last_followup_time` (DateTime)
   - `followup_count` (Integer): Count of staff follow-ups
   - `is_overdue` (Boolean): Payer follow-up breach indicator
   - `linked_blocker` (Reference → `x_caresetu_ai_blocker`): Associated blocker

6. **`x_caresetu_ai_discharge_prediction`** ([`src/fluent/tables/discharge-prediction.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/discharge-prediction.now.ts))
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `promised_discharge_time`, `predicted_discharge_time` (DateTime)
   - `predicted_delay_minutes` (Integer): Total additive delay
   - `prediction_breakdown` (JSON MultiLineText): Array of line-item contributors
   - `explanation` (MultiLineText): Text breakdown
   - `is_latest` (Boolean): Latest prediction indicator

7. **`x_caresetu_ai_escalation`** ([`src/fluent/tables/escalation-task.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/escalation-task.now.ts))
   - `number` (String, auto-number `ESC`)
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `risk_tier` (Choice): Synchronized with risk score
   - `priority` (Integer): `1` (Critical), `2` (High), `3` (Medium), `4` (Normal)
   - `escalation_status` (Choice): `open`, `acknowledged`, `resolved`, `cancelled`
   - `assigned_to` (Reference → `sys_user`): Charge nurse

8. **`x_caresetu_ai_action_request`** ([`src/fluent/tables/action-request.now.ts`](file:///c:/Users/sahil/CareSetu/src/fluent/tables/action-request.now.ts))
   - `number` (String, auto-number `ACT`)
   - `encounter` (Reference → `x_caresetu_ai_encounter`)
   - `action_type` (Choice): `reassign_blocker`, `escalate_blocker`, `record_tpa_followup`
   - `status` (Choice): `pending_approval`, `approved`, `rejected`, `executing`, `completed`, `failed`, `expired`
   - `title`, `rationale` (String / MultiLineText)
   - `target_table`, `target_record` (String): Pointer to target record
   - `proposed_parameters`, `snapshot_state` (JSON MultiLineText)
   - `proposed_by`, `approved_by`, `executed_by` (Reference → `sys_user`)
   - `approval_time`, `execution_time` (DateTime)
   - `execution_result`, `rejection_reason`, `failure_reason` (MultiLineText)
   - `idempotency_key` (String, unique lock)

---

## 6. Deterministic Risk Scoring Formula

*Source verification: [`src/server/script-includes/OperationalRiskEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/OperationalRiskEngine.server.js#L125-L199)*

The risk scoring engine produces an integer score from `0` to `100`. It operates strictly on coordination deadlines and queue sizes.

### Mathematical Definition
$$\text{RiskScore} = \min\left(100, \, R_{\text{time}} + R_{\text{tasks}} + R_{\text{milestones}} + R_{\text{handoffs}} + R_{\text{blockers}}\right)$$

Where:
1. **Time Urgency Contribution ($R_{\text{time}}$):**
   - If $\text{minutesRemaining} < 0$ (Discharge already past due): $+40$
   - Else if $\text{minutesRemaining} < 60$ (Due within 1 hour): $+25$
   - Else if $\text{minutesRemaining} < 180$ (Due within 3 hours): $+15$
   - Else (Due in $\ge 3$ hours or no discharge time set): $+0$
   *(Note: If `expected_discharge_time` is missing, $R_{\text{time}} = 0$ and a Data Quality Warning is stamped without penalizing the patient).*
2. **Overdue Coordination Tasks ($R_{\text{tasks}}$):**
   $$R_{\text{tasks}} = \min(30, \, \text{overdue\_tasks} \times 10)$$
3. **Incomplete Required Milestones ($R_{\text{milestones}}$):**
   $$R_{\text{milestones}} = \min(24, \, \text{incomplete\_milestones} \times 8)$$
4. **Unacknowledged Care Handoffs ($R_{\text{handoffs}}$):**
   $$R_{\text{handoffs}} = \min(20, \, \text{unack\_handoffs} \times 10)$$
   *(Dynamically verified against live active rows in `x_caresetu_ai_handoff`).*
5. **Unresolved Operational Blockers ($R_{\text{blockers}}$):**
   $$R_{\text{blockers}} = \min(30, \, \text{open\_blockers} \times 15)$$
   *(Dynamically verified against live active rows in `x_caresetu_ai_blocker`).*

### Score Tiers & Action Thresholds
| Tier | Score Range | Platform Behavior |
|---|---|---|
| **Normal** | 0 – 39 | On-track. Routine coordinator monitoring. |
| **Medium** | 40 – 59 | Early warning. Visible in pipeline yellow status. |
| **High** | 60 – 79 | Triggers Priority 2 Escalation Task (`ESC`) assigned to Charge Nurse. |
| **Critical** | 80 – 100 | Triggers Priority 1 Escalation Task (`ESC`) with urgent management alert. |

---

## 7. Discharge Prediction Formula & Limitations

*Source verification: [`src/server/script-includes/DischargePredictionEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/DischargePredictionEngine.server.js#L77-L199)*

Unlike the risk score (which measures operational urgency), the discharge predictor calculates an estimated clock departure time.

### Mathematical Formulation
$$\text{PredictedTime} = \text{BaselineTime} + \sum \Delta_{\text{delay}}$$

1. **Baseline Resolution:** Uses `promised_discharge_time` (the target departure time promised to family/transport). If null, falls back to `expected_discharge_time`. If both are missing, predicted time is flagged `Unknown`.
2. **Individual Blocker Delay Accumulation:** Sums `estimated_delay_minutes` across all active rows in `x_caresetu_ai_blocker`. If an individual blocker record specifies no delay, default category constants are applied:
   - TPA / Insurance: **+45 min**
   - Patient Transport: **+30 min**
   - Medical Equipment: **+25 min**
   - Pharmacy / Take-Home Meds: **+20 min**
   - Inter-unit Coordination: **+20 min**
   - Care Handoff: **+15 min**
   - Discharge Documentation: **+15 min**
3. **Signal Fallback Addition (Double-Counting Prevention):**
   - Overdue tasks add $+15\text{ min}$ each *only if no active `coordination` blocker exists*.
   - Unacknowledged handoffs add $+15\text{ min}$ each *only if no active `handoff` blocker exists*.
   - Incomplete milestones add $+10\text{ min}$ each.
4. **Sorted Line-Item Breakdown:** Contributors are sorted descending by delay minutes so coordinators immediately see the highest-leverage bottleneck.

### Implemented Limitations
- **Linear Additive Assumption:** Delays are treated as sequential/additive. Parallel activities (e.g. pharmacy filling meds simultaneously while transport is dispatched) are not modeled with critical path dependency graphs.
- **Deterministic vs. ML:** The predictor is an operational rules engine, not a trained machine learning model. It reflects calibrated hospital baseline times.

---

## 8. AI Care Coordinator & Now Assist Architecture

*Source verification: [`src/server/script-includes/AICoordinatorEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/AICoordinatorEngine.server.js)*

The AI Care Coordinator provides an interactive briefing drawer embedded directly in the Command Center header and Encounter 360 views.

### Request Path & Query Resolution Flow
1. **User Query Input:** Coordinator asks an operational question via `AIPanel.tsx`.
2. **REST Endpoint:** Dispatched via `POST /api/x_caresetu_ai/operational_risk/ai/query`.
3. **Intent Categorization in `AICoordinatorEngine`:**
   - **Identity Queries ("Who are you?"):** Returns role definition (hospital operational assistant, non-clinical).
   - **Emergency Queries ("What is emergency status?"):** Reports current hospital operational state.
   - **Fix It For Me ("Fix it for me", "What can be fixed?"):** Generates action proposals via `ActionExecutionEngine` and returns proposal cards.
   - **Encounter-Specific Queries ("Explain risk for ENC1000007"):** Queries live records on encounter, latest risk score, blockers, handoffs, escalations, and TPA cases.
   - **Hospital-Wide Prioritization ("What should I prioritize?"):** Aggregates critical encounters, open blockers, overdue handoffs, and active escalations.
4. **Now Assist GenAI Capability Attempt:**
   - Attempts invocation of scoped Generative AI Skill (`explain-risk-skill.now.ts`, Capability ID `ed6bcfeaf26b4dba90e7f7d8ffa0bf13`) via `sn_one_extend.OneExtendUtil.executeSecure()`.
5. **Grounded Fallback Architecture:**
   - On instances where Now Assist GenAI controller is inactive, unconfigured, or in draft status, `AICoordinatorEngine` executes its authoritative deterministic reasoning engine. It extracts live child records and synthesizes an auditable markdown briefing with zero hallucination.

---

## 9. "Fix It For Me" (Human-Approved Operational Actions)

*Source verification: [`src/server/script-includes/ActionExecutionEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/ActionExecutionEngine.server.js)*

The "Fix It For Me" module allows the AI Care Coordinator to propose corrective interventions that can only be executed by authorized human staff.

### The 3 Strict Allowlisted Actions
1. **`reassign_blocker`:** Reassigns an unassigned or bottlenecked blocker on `x_caresetu_ai_blocker` to an eligible coordinator or charge nurse.
2. **`escalate_blocker`:** Escalates an overdue blocker on `x_caresetu_ai_blocker`, setting `status = 'escalated'`, `is_overdue = true`, and triggering escalation synchronization.
3. **`record_tpa_followup`:** Calls `TpaChaseEngine.recordFollowup()` on `x_caresetu_ai_tpa_case`, advancing the follow-up counter and rolling forward the SLA deadline.

### Security & State Transition Matrix
```
[Propose Action] ──► status: pending_approval (TARGET UNCHANGED)
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      [Reject Action]             [Approve Action]
      status: rejected            Server verifies role
      Target remains untouched    status: executing (Lock)
                                  Server re-validates target state
                                  Handler executes update
                                  status: completed (Stamp result)
```

- **Server-Side Role Guard:** Approver must hold `x_caresetu_ai.coordinator`, `x_caresetu_ai.charge_nurse`, or `admin`.
- **Pre-Execution Stale Guard:** Before applying updates, handler re-fetches target record. If already resolved or closed, execution aborts with status `failed`.
- **Idempotency Guarantee:** If an already-completed action is submitted again, it returns the cached `execution_result` (`already_executed: true`) without re-running handlers.
- **Auditable Stamp:** Every approval logs approver `sys_user`, timestamp, notes, and records an audit string inside the target record's `resolution_notes`.

---

## 10. TPA Auto-Chaser & Smart Handoff Engines

### 10.1 Smart Handoff Lifecycle
- **Acknowledgment SLAs:** Strict priority timers: Critical (5 min), Urgent (15 min), Routine (30 min).
- **Automated Blocker Generation:** If a handoff breaches its deadline, `HandoffEngine.processOverdueHandoffs()` flags `is_overdue = true` and creates an operational blocker of category `handoff`.
- **Cascade Synchronization:** Changing handoffs automatically updates `encounter.unack_handoffs` via `sync-handoff-count` Business Rule, which asynchronously triggers risk rescoring and prediction recalculation.

### 10.2 TPA / Insurance Auto-Chaser
- **Follow-up Cadence:** Defaults to 4 hours (`x_caresetu_ai.tpa.followup_interval_hours`).
- **Scheduled Sweeper:** `tpa-followup-chaser` runs hourly in `sys_trigger`, identifying overdue cases and ensuring linked blockers exist.
- **Blocker Auto-Resolution:** When an authorization case transitions to a terminal state (`approved`, `rejected`, `closed`), `resolveLinkedBlocker()` automatically marks linked blockers resolved, updating predictions.

---

## 11. Emergency Operations Architecture & Honest Limitations

*Source verification: [`src/client/views/EmergencyView.tsx`](file:///c:/Users/sahil/CareSetu/src/client/views/EmergencyView.tsx) and [`AICoordinatorEngine.server.js`](file:///c:/Users/sahil/CareSetu/src/server/script-includes/AICoordinatorEngine.server.js#L96-L108)*

The Emergency Operations screen provides an incident command view for surge situations.

### Honest Status & Constraints
1. **Surge Mode Simulation:** The UI supports initiating simulated surge protocols (e.g. mass casualty triage, rapid bed turnarounds).
2. **Telemetry Limitation:** *Authoritative hospital-wide surge telemetry, telemetry monitor hardware feeds, and real-time bed sensor integrations are not currently configured on this lab instance.* The system reports:
   > *"Emergency Operations Status: Normal Operations. Hospital-wide disaster/surge capacity tracking is not currently configured with an authoritative telemetry source on this instance."*
3. **No External Payer Carrier Delivery:** TPA chasers log staff outreach and manage internal operational deadlines. Direct EDI 278 / API transmission to third-party insurance portals is not integrated; all claims follow internal hospital workflow.

---

## 12. Security & Healthcare Safety Guardrails

CareSetu AI was built following the highest standards of healthcare application security:

1. **Scoped Isolation:** Entire application is contained within scope `x_caresetu_ai`. Cross-scope access is denied by default.
2. **Least Privilege ACLs:** Table-level `read`, `write`, and `create` operations require `x_caresetu_ai.coordinator` or `x_caresetu_ai.charge_nurse` roles.
3. **No Autonomous Mutation:** All action proposals are read-only until approved by a human user with authenticated session tokens.
4. **Data Minimization & Zero PHI:** Operational tracking uses anonymous surrogate identifiers (`ENC1000007`, `CS-MRN-1024`). No names, diagnoses, clinical notes, or medical history are captured or transmitted.
5. **Session Token Validation:** All client REST requests pass the authenticated ServiceNow session token (`X-UserToken` / `g_ck`), validated against instance security contexts.

---

## 13. Comprehensive Verification Matrix

This matrix evaluates all application capabilities against repository source code and live instance test runs.

| Capability / Feature | Source File Reference | Test Evidence | Verified Status | Verification Notes |
|---|---|---|---|---|
| **Deterministic Risk Scoring** | `OperationalRiskEngine.server.js` (lines 125–199) | `test-regression.js`<br>`test-phase4-actions.js` | **LIVE VERIFIED** | Tested on `ENC1000007`. Score computed to 85/100 (Critical) matching published mathematical formulas. |
| **Additive Delay Predictor** | `DischargePredictionEngine.server.js` (lines 77–199) | `test-pipeline.js`<br>`test-phase4-actions.js` | **LIVE VERIFIED** | Tested on `ENC1000008` and `ENC1000007`. Breakdown sorted descending; double-counting prevented. |
| **Async Blocker Counter Sync** | `sync-blocker-count.server.js` (lines 1–40) | `test-pipeline.js` | **LIVE VERIFIED** | Adding blocker dynamically incremented `encounter.open_blockers` and cascaded to risk score. |
| **Smart Handoff SLA Engine** | `HandoffEngine.server.js` (lines 46–125) | `test-handoff-pipeline.js`<br>`test-handoff-sla-integrity.js` | **LIVE VERIFIED** | Deadlines calculated correctly (5m, 15m, 30m); overdue sweep created linked blockers. |
| **TPA Auto-Chasing** | `TpaChaseEngine.server.js` (lines 40–120) | `test-tpa-pipeline.js` | **LIVE VERIFIED** | Follow-up incremented counter, advanced next due timestamp (+4h), cleared upon case approval. |
| **Fix It For Me Propose Action** | `ActionExecutionEngine.server.js` (lines 40–130) | `test-phase4-actions.js` (Step 1) | **LIVE VERIFIED** | Created `ACT` request in `pending_approval`; target blocker remained 100% untouched. |
| **Fix It For Me Rejection** | `ActionExecutionEngine.server.js` (lines 254–288) | `test-phase4-actions.js` (Step 3) | **LIVE VERIFIED** | Marked rejected with audit note; target blocker remained completely untouched. |
| **Fix It For Me Approval & Execution** | `ActionExecutionEngine.server.js` (lines 140–244) | `test-phase4-actions.js` (Step 4, 7, 8) | **LIVE VERIFIED** | Successfully executed blocker reassignment, blocker escalation, and TPA follow-up with audit stamp. |
| **Action Execution Idempotency** | `ActionExecutionEngine.server.js` (lines 152–164) | `test-phase4-actions.js` (Step 5) | **LIVE VERIFIED** | Duplicate approval call safely returned cached result (`already_executed: true`). |
| **Stale Target Record Guard** | `ActionExecutionEngine.server.js` (lines 336–338) | `test-phase4-actions.js` (Step 6) | **LIVE VERIFIED** | Resolved blockers rejected execution safely with HTTP 422 / error status. |
| **AI Care Coordinator Queries** | `AICoordinatorEngine.server.js` (lines 31–93) | `test-ai-queries.js`<br>`test-phase4-actions.js` (Step 9) | **LIVE VERIFIED** | Answered "Fix it for me", "What should I prioritize", and encounter queries with live grounded data. |
| **Now Assist LLM Skill** | `explain-risk-skill.now.ts` | `test-skill-activation.js` | **NEEDS ACTIVATION** | Code is implemented in fluent, but GenAI controller on sub-production lab instance is inactive; falls back cleanly to deterministic engine. |
| **External Insurer EDI Comms** | `TpaChaseEngine.server.js` | Code inspection | **NOT CONFIGURED** | System manages internal hospital SLAs and staff follow-ups; direct carrier API integration is not implemented. |
| **Emergency Telemetry Feed** | `EmergencyView.tsx` | Browser verification | **NOT CONFIGURED** | Emergency UI supports incident workflow, but live telemetry hardware feeds are not present on lab instance. |

---

## 14. Known Limitations & Operational Risks

1. **ServiceNow Sub-Production LLM Activation:** On demo lab instances without enterprise Now Assist GenAI licenses, generative LLM text synthesis is bypassed in favor of deterministic operational synthesis.
2. **Simplified Delay Modeling:** The additive delay formula assumes sequential operational bottlenecks. High-concurrency clinical workflows may experience overlapping task completion.
3. **No Direct Hardware Telemetry:** Bed availability and telemetry monitoring rely on manual coordinator updates or simulated workflows rather than automated IoT telemetry.
4. **Action Allowlist Boundary:** Only three specific operational actions are currently authorized for automated execution (`reassign_blocker`, `escalate_blocker`, `record_tpa_followup`). Additional actions require explicit handler definitions.

---

## 15. Suggested Demo Path & 7–8 Minute Presentation Timing

| Timestamp | Screen / Visual | Narration & Demo Action | Key Talking Point |
|---|---|---|---|
| **0:00 – 1:00** | Slide 1–2 (Title & Personal Story) | Presenter shares the real-world frustration of the 8-hour discharge delay following cardiac surgery. | Hospital discharge delay is an operational coordination crisis, not a clinical problem. |
| **1:00 – 1:45** | Slide 3–4 (Problem & CareSetu Approach) | Explains the 5 coordination silos (nursing, pharmacy, transport, equipment, insurance). | CareSetu AI provides closed-loop tracking and operational urgency on ServiceNow. |
| **1:45 – 2:45** | Live App: Command Center (`/x_caresetu_ai_command_center.do`) | Show KPI cards (Patients in Pipeline, Ready, At Risk), Delay Predictor bar, and live encounter table. | Real-time visibility into operational delay hours and hospital-wide risk distribution. |
| **2:45 – 3:45** | Live App: Encounter 360 (`ENC1000007`) | Drill into Critical encounter. Show 5 coordination signals, line-item delay contributors, and active blockers. | Transparent, explainable scoring (85/100 Critical) grounded in live data. |
| **3:45 – 4:45** | Slide 5–6 (Architecture & Risk vs. Prediction) | Walk through architecture diagram and side-by-side comparison of risk score vs. predicted discharge time. | Explainable mathematical rules vs. additive delay modeling. No black-box AI. |
| **4:45 – 6:15** | Live App: AI Care Coordinator & "Fix It For Me" | Open AI drawer. Click "Fix it for me". Review Action Proposal Cards (Reassign Blocker, Escalate, TPA). Click **Approve & Execute**. | Human-in-the-loop safety: AI identifies and proposes; human approves; ServiceNow executes. |
| **6:15 – 7:00** | Live App: Smart Handoffs & TPA Pipeline | Highlight closed-loop handoffs with SLA timers and TPA insurance auto-chasing. | Automated escalation before delays cascade into overnight bed stays. |
| **7:00 – 7:30** | Slide 11–12 (Safety Boundaries & Conclusion) | Summarize healthcare safety guardrails (non-clinical, scoped ACLs, zero PHI) and closing impact statement. | "Returning hours of acute care bed capacity back to the hospital, one coordinated discharge at a time." |

---

## 16. Glossary of Project Terms

- **Encounter:** A specific patient hospital admission episode (`x_caresetu_ai_encounter`).
- **Operational Blocker:** A concrete logistical obstacle (e.g. missing transport, unmixed pharmacy meds) preventing patient release (`x_caresetu_ai_blocker`).
- **Care Handoff:** An operational or clinical transition of patient responsibility between nursing shifts or hospital units (`x_caresetu_ai_handoff`).
- **TPA (Third-Party Administrator):** The insurance organization responsible for processing cashless hospital pre-authorization and final claim approval (`x_caresetu_ai_tpa_case`).
- **Deterministic Risk Score:** A 0–100 calculated urgency metric derived from published rules rather than probabilistic models (`x_caresetu_ai_risk_score`).
- **Promised Discharge Time:** The target departure time agreed upon with patient and family, serving as the baseline for prediction.
- **Fix It For Me:** CareSetu AI’s human-approved operational intervention system (`x_caresetu_ai_action_request`).
- **Now Assist:** ServiceNow’s native generative AI platform capabilities.
- **Fluent:** ServiceNow SDK TypeScript declarative language for managing platform metadata as code.
