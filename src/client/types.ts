// Encounter record shape from x_caresetu_ai_encounter (Table API)
export interface Encounter {
    sys_id: string
    number: string
    patient_mrn: string
    ward: string
    bed_number: string
    state: string
    priority: string
    expected_discharge_time: string
    promised_discharge_time: string
    actual_discharge_time: string
    overdue_coord_tasks: string
    incomplete_milestones: string
    unack_handoffs: string
    open_blockers: string
    charge_nurse: string
    short_description: string
    sys_created_on: string
    sys_updated_on: string
}

// Risk score record shape from x_caresetu_ai_risk_score
export interface RiskScore {
    sys_id: string
    encounter: string
    risk_score: string
    risk_tier: string
    explanation: string
    data_quality_warning: string
    is_latest: string
    scored_at: string
}

// Escalation record shape from x_caresetu_ai_escalation
export interface Escalation {
    sys_id: string
    number: string
    encounter: string
    risk_score: string
    risk_tier: string
    reason: string
    escalation_status: string
    state: string
    sys_created_on: string
}

// Blocker record from x_caresetu_ai_blocker
export interface Blocker {
    sys_id: string
    number: string
    encounter: string
    category: string
    category_label: string
    department: string
    owner: string
    owner_sys_id: string
    status: string
    status_label: string
    is_overdue: boolean
    estimated_delay_minutes: number
    target_resolution_time: string
    resolution_time: string
    description: string
    resolution_notes: string
    sys_created_on: string
    sys_updated_on: string
}

// Breakdown item in DischargePrediction
export interface PredictionBreakdown {
    category: string
    label: string
    delay_minutes: number
    source: 'blocker_record' | 'signal'
}

// Discharge prediction from x_caresetu_ai_discharge_prediction (via REST API)
export interface DischargePrediction {
    encounter: string
    encounter_number: string
    promised_discharge_time: string
    predicted_discharge_time: string
    predicted_delay_minutes: number
    breakdown: PredictionBreakdown[]
    explanation: string
    is_latest: boolean
    predicted_at: string | null
    sys_id?: string
}

export type RiskTier = 'normal' | 'medium' | 'high' | 'critical' | 'unknown'

export interface EnrichedEncounter extends Encounter {
    riskTier: RiskTier
    riskScore: number
    riskExplanation: string
    escalationStatus: string
    primaryBlocker: string
    readinessLabel: string
    // derived from prediction record when available, else from signals
    promisedDischarge: string
    predictedDischarge: string
    delayMinutes: number
    wardBed: string
    // live prediction (loaded on demand for Encounter 360)
    prediction?: DischargePrediction
}

