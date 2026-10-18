import type { Encounter, RiskScore, Escalation, Blocker, DischargePrediction } from './types'

const BASE = '/api/now/table'
const PRED_API = '/api/x_caresetu_ai/discharge_prediction/v1'

function token(): string {
    return (window as any).g_ck || ''
}

async function get<T>(url: string): Promise<T[]> {
    const res = await fetch(url, {
        headers: {
            'X-UserToken': token(),
            Accept: 'application/json',
        },
    })
    if (!res.ok) throw new Error(`API ${res.status}: ${url}`)
    const json = await res.json()
    return json.result || []
}

async function getOne<T>(url: string): Promise<T | null> {
    const res = await fetch(url, {
        headers: {
            'X-UserToken': token(),
            Accept: 'application/json',
        },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.result || null
}

export async function fetchEncounters(): Promise<Encounter[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: 'active=true^ORDERBYDESCsys_created_on',
        sysparm_limit: '50',
        sysparm_fields:
            'sys_id,number,patient_mrn,ward,bed_number,state,priority,expected_discharge_time,promised_discharge_time,actual_discharge_time,overdue_coord_tasks,incomplete_milestones,unack_handoffs,open_blockers,charge_nurse,short_description,sys_created_on,sys_updated_on',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_encounter?${params}`)
    return rows.map(extractFields)
}

export async function fetchEncounterById(sysId: string): Promise<Encounter | null> {
    const params = new URLSearchParams({ sysparm_display_value: 'all' })
    const row = await getOne<any>(`${BASE}/x_caresetu_ai_encounter/${sysId}?${params}`)
    if (!row) return null
    return extractFields(row)
}

export async function fetchLatestRiskScore(encounterSysId: string): Promise<RiskScore | null> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: `encounter=${encounterSysId}^is_latest=true`,
        sysparm_limit: '1',
        sysparm_fields: 'sys_id,encounter,risk_score,risk_tier,explanation,data_quality_warning,is_latest,scored_at',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_risk_score?${params}`)
    if (!rows.length) return null
    const r = rows[0]
    return {
        sys_id: v(r.sys_id),
        encounter: v(r.encounter),
        risk_score: v(r.risk_score),
        risk_tier: v(r.risk_tier),
        explanation: v(r.explanation),
        data_quality_warning: v(r.data_quality_warning),
        is_latest: v(r.is_latest),
        scored_at: v(r.scored_at),
    }
}

export async function fetchAllRiskScores(): Promise<RiskScore[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: 'is_latest=true',
        sysparm_limit: '50',
        sysparm_fields: 'sys_id,encounter,risk_score,risk_tier,explanation,data_quality_warning,is_latest,scored_at',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_risk_score?${params}`)
    return rows.map((r: any) => ({
        sys_id: v(r.sys_id),
        encounter: v(r.encounter),
        risk_score: v(r.risk_score),
        risk_tier: v(r.risk_tier),
        explanation: v(r.explanation),
        data_quality_warning: v(r.data_quality_warning),
        is_latest: v(r.is_latest),
        scored_at: v(r.scored_at),
    }))
}

export async function fetchEscalations(encounterSysId?: string): Promise<Escalation[]> {
    let query = 'active=true'
    if (encounterSysId) query += `^encounter=${encounterSysId}`
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: query,
        sysparm_limit: '50',
        sysparm_fields: 'sys_id,number,encounter,risk_score,risk_tier,reason,escalation_status,state,sys_created_on',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_escalation?${params}`)
    return rows.map((r: any) => ({
        sys_id: v(r.sys_id),
        number: v(r.number),
        encounter: v(r.encounter),
        risk_score: v(r.risk_score),
        risk_tier: v(r.risk_tier),
        reason: v(r.reason),
        escalation_status: v(r.escalation_status),
        state: v(r.state),
        sys_created_on: v(r.sys_created_on),
    }))
}

// ── Prediction API ────────────────────────────────────────────────────────────

export async function fetchDischargePrediction(encSysId: string): Promise<DischargePrediction | null> {
    try {
        const res = await fetch(`${PRED_API}/encounters/${encSysId}/prediction`, {
            headers: { 'X-UserToken': token(), Accept: 'application/json' },
        })
        if (!res.ok) return null
        return await res.json() as DischargePrediction
    } catch { return null }
}

export async function runDischargePrediction(encSysId: string): Promise<DischargePrediction | null> {
    try {
        const res = await fetch(`${PRED_API}/encounters/${encSysId}/predict`, {
            method: 'POST',
            headers: { 'X-UserToken': token(), Accept: 'application/json', 'Content-Type': 'application/json' },
        })
        if (!res.ok) return null
        return await res.json() as DischargePrediction
    } catch { return null }
}

// ── All Blockers (table API for global list view) ─────────────────────────────

export async function fetchAllBlockers(): Promise<Blocker[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: 'status!=resolved^ORDERBYDESCsys_created_on',
        sysparm_limit: '100',
        sysparm_fields: 'sys_id,number,encounter,category,department,owner,status,is_overdue,estimated_delay_minutes,target_resolution_time,resolution_time,description,resolution_notes,sys_created_on,sys_updated_on',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_blocker?${params}`)
    return rows.map((r: any) => ({
        sys_id: v(r.sys_id),
        number: v(r.number),
        encounter: v(r.encounter),
        category: v(r.category),
        category_label: v(r.category) || v(r.category),
        department: v(r.department),
        owner: v(r.owner),
        owner_sys_id: '',
        status: v(r.status),
        status_label: v(r.status),
        is_overdue: v(r.is_overdue) === 'true' || v(r.is_overdue) === '1',
        estimated_delay_minutes: parseInt(v(r.estimated_delay_minutes) || '0', 10),
        target_resolution_time: v(r.target_resolution_time),
        resolution_time: v(r.resolution_time),
        description: v(r.description),
        resolution_notes: v(r.resolution_notes),
        sys_created_on: v(r.sys_created_on),
        sys_updated_on: v(r.sys_updated_on),
    }))
}

export async function fetchAllEscalations(): Promise<Escalation[]> {
    const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: 'active=true^ORDERBYDESCsys_created_on',
        sysparm_limit: '100',
        sysparm_fields: 'sys_id,number,encounter,risk_score,risk_tier,reason,escalation_status,state,sys_created_on,assigned_to',
    })
    const rows = await get<any>(`${BASE}/x_caresetu_ai_escalation?${params}`)
    return rows.map((r: any) => ({
        sys_id: v(r.sys_id),
        number: v(r.number),
        encounter: v(r.encounter),
        risk_score: v(r.risk_score),
        risk_tier: v(r.risk_tier),
        reason: v(r.reason),
        escalation_status: v(r.escalation_status),
        state: v(r.state),
        sys_created_on: v(r.sys_created_on),
    }))
}

// ── Blocker API ───────────────────────────────────────────────────────────────

export async function fetchBlockers(encSysId: string, includeResolved = false): Promise<Blocker[]> {
    try {
        const url = `${PRED_API}/encounters/${encSysId}/blockers${includeResolved ? '?include_resolved=true' : ''}`
        const res = await fetch(url, {
            headers: { 'X-UserToken': token(), Accept: 'application/json' },
        })
        if (!res.ok) return []
        const json = await res.json()
        return (json.blockers || []) as Blocker[]
    } catch { return [] }
}

export async function createBlocker(encSysId: string, data: {
    category: string
    department?: string
    description?: string
    estimated_delay_minutes?: number
}): Promise<{ sys_id: string } | null> {
    try {
        const res = await fetch(`${PRED_API}/encounters/${encSysId}/blockers`, {
            method: 'POST',
            headers: { 'X-UserToken': token(), Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) return null
        return await res.json()
    } catch { return null }
}

export async function updateBlocker(blockerSysId: string, data: {
    status?: string
    resolution_notes?: string
    estimated_delay_minutes?: number
}): Promise<boolean> {
    try {
        const res = await fetch(`${PRED_API}/blockers/${blockerSysId}`, {
            method: 'PATCH',
            headers: { 'X-UserToken': token(), Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return res.ok
    } catch { return false }
}

// ── Fix It For Me / Operational Actions API ────────────────────────────────
export interface ActionProposal {
    sys_id: string
    number: string
    action_type: 'reassign_blocker' | 'escalate_blocker' | 'record_tpa_followup'
    action_type_label?: string
    status: 'pending_approval' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed'
    status_label?: string
    title: string
    rationale: string
    target_table: string
    target_record: string
    encounter: string
    encounter_number?: string
    proposed_parameters?: any
    snapshot_state?: any
    proposed_by?: string
    approved_by?: string
    approval_time?: string
    execution_time?: string
    execution_result?: any
    rejection_reason?: string
    failure_reason?: string
    idempotency_key?: string
}

export interface ActionResult {
    success: boolean
    status: string
    number?: string
    action_type?: string
    result?: any
    error?: string
    already_executed?: boolean
}

const ACTIONS_API = '/api/x_caresetu_ai/actions'

export async function fetchActionRequests(filters?: { status?: string; encounter?: string; action_type?: string }): Promise<ActionProposal[]> {
    try {
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        if (filters?.encounter) params.set('encounter', filters.encounter)
        if (filters?.action_type) params.set('action_type', filters.action_type)
        const qs = params.toString() ? `?${params.toString()}` : ''

        const res = await fetch(`${ACTIONS_API}/requests${qs}`, {
            headers: { 'X-UserToken': token(), Accept: 'application/json' },
        })
        if (!res.ok) return []
        const json = await res.json()
        const result = json.result || json
        return result.requests || []
    } catch {
        return []
    }
}

export async function fetchActionRequest(sysId: string): Promise<ActionProposal | null> {
    try {
        const res = await fetch(`${ACTIONS_API}/requests/${sysId}`, {
            headers: { 'X-UserToken': token(), Accept: 'application/json' },
        })
        if (!res.ok) return null
        const json = await res.json()
        const result = json.result || json
        return result.request || null
    } catch {
        return null
    }
}

export async function approveActionRequest(sysId: string, notes?: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${ACTIONS_API}/requests/${sysId}/approve`, {
            method: 'POST',
            headers: {
                'X-UserToken': token(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes: notes || '' }),
        })
        const json = await res.json()
        return (json.result || json) as ActionResult
    } catch (e: any) {
        return { success: false, status: 'error', error: e.message || 'Network error approving action' }
    }
}

export async function rejectActionRequest(sysId: string, reason: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${ACTIONS_API}/requests/${sysId}/reject`, {
            method: 'POST',
            headers: {
                'X-UserToken': token(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reason || 'Rejected by operational coordinator' }),
        })
        const json = await res.json()
        return (json.result || json) as ActionResult
    } catch (e: any) {
        return { success: false, status: 'error', error: e.message || 'Network error rejecting action' }
    }
}

export async function fetchActionResult(sysId: string): Promise<ActionResult | null> {
    try {
        const res = await fetch(`${ACTIONS_API}/requests/${sysId}/result`, {
            headers: { 'X-UserToken': token(), Accept: 'application/json' },
        })
        if (!res.ok) return null
        const json = await res.json()
        return (json.result || json) as ActionResult
    } catch {
        return null
    }
}

export async function proposeAction(payload: {
    encounter: string
    action_type: string
    target_table: string
    target_record: string
    title?: string
    rationale?: string
    proposed_parameters?: any
}): Promise<{ success: boolean; request_id?: string; number?: string; error?: string }> {
    try {
        const res = await fetch(`${ACTIONS_API}/propose`, {
            method: 'POST',
            headers: {
                'X-UserToken': token(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        const json = await res.json()
        return json.result || json
    } catch (e: any) {
        return { success: false, error: e.message || 'Network error proposing action' }
    }
}

// ── AI Care Coordinator Query API ───────────────────────────────────────────

export interface AICoordinatorResponse {
    success: boolean
    query_type: string
    response: string
    source: string
    encounter?: string
    error?: string
    proposed_actions?: ActionProposal[]
}

export async function queryAICoordinator(query: string, encounterNumber?: string): Promise<AICoordinatorResponse> {
    try {
        const res = await fetch('/api/x_caresetu_ai/operational_risk/ai/query', {
            method: 'POST',
            headers: {
                'X-UserToken': token(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                encounter_number: encounterNumber || '',
            }),
        })

        if (!res.ok) {
            let errorText = `HTTP ${res.status}`
            try {
                const errJson = await res.json()
                if (errJson.result?.error) errorText = errJson.result.error
                else if (errJson.error) errorText = errJson.error
            } catch (_) {}

            if (res.status === 401 || res.status === 403) {
                return {
                    success: false,
                    query_type: 'permission_error',
                    response: 'Permission denied: Your current ServiceNow role does not have authorization to access the AI Care Coordinator operational risk service. Please verify x_caresetu_ai role assignment.',
                    source: 'authorization_error',
                }
            }

            return {
                success: false,
                query_type: 'service_error',
                response: `Service error (${res.status}): ${errorText}`,
                source: 'api_error',
            }
        }

        const json = await res.json()
        const result = json.result || json
        return result as AICoordinatorResponse
    } catch (e: any) {
        return {
            success: false,
            query_type: 'network_error',
            response: `Network error connecting to CareSetu AI service: ${e?.message || 'Check network connection'}`,
            source: 'network_error',
        }
    }
}

// Helper: extract display_value (with sysparm_display_value=all, fields are {value, display_value})
function v(field: any): string {
    if (field === null || field === undefined) return ''
    if (typeof field === 'object' && 'value' in field) return field.value ?? ''
    return String(field)
}

function extractFields(r: any): Encounter {
    return {
        sys_id: v(r.sys_id),
        number: v(r.number),
        patient_mrn: v(r.patient_mrn),
        ward: v(r.ward),
        bed_number: v(r.bed_number),
        state: v(r.state),
        priority: v(r.priority),
        expected_discharge_time: v(r.expected_discharge_time),
        promised_discharge_time: v(r.promised_discharge_time),
        actual_discharge_time: v(r.actual_discharge_time),
        overdue_coord_tasks: v(r.overdue_coord_tasks),
        incomplete_milestones: v(r.incomplete_milestones),
        unack_handoffs: v(r.unack_handoffs),
        open_blockers: v(r.open_blockers),
        charge_nurse: v(r.charge_nurse),
        short_description: v(r.short_description),
        sys_created_on: v(r.sys_created_on),
        sys_updated_on: v(r.sys_updated_on),
    }
}
