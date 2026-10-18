import type { Encounter, EnrichedEncounter, RiskScore, RiskTier } from './types'

// Blocker labels derived from operational signals
const BLOCKER_LABELS: Record<string, string> = {
    overdue_coord_tasks: 'Coordination',
    incomplete_milestones: 'Milestones',
    unack_handoffs: 'Handoff',
    open_blockers: 'Workflow Blockers',
}

export function deriveBlocker(enc: Encounter): string {
    const signals = [
        { key: 'overdue_coord_tasks', val: parseInt(enc.overdue_coord_tasks || '0', 10) },
        { key: 'open_blockers', val: parseInt(enc.open_blockers || '0', 10) },
        { key: 'unack_handoffs', val: parseInt(enc.unack_handoffs || '0', 10) },
        { key: 'incomplete_milestones', val: parseInt(enc.incomplete_milestones || '0', 10) },
    ]
    const top = signals.sort((a, b) => b.val - a.val)[0]
    return top.val > 0 ? BLOCKER_LABELS[top.key] : 'None'
}

export function riskTierFromScore(score: number): RiskTier {
    if (score >= 75) return 'critical'
    if (score >= 50) return 'high'
    if (score >= 25) return 'medium'
    return 'normal'
}

// Demo delay offsets by encounter (UI-layer only, not backend)
const DEMO_DELAYS: Record<string, number> = {
    ENC1000005: 90,
    ENC1000007: 70,
    ENC1000008: 45,
    ENC1000009: 120,
    ENC1000010: 25,
    ENC1000011: 60,
}

export function enrichEncounter(
    enc: Encounter,
    riskMap: Map<string, RiskScore>
): EnrichedEncounter {
    const rs = riskMap.get(enc.sys_id)
    const rawScore = rs ? parseFloat(rs.risk_score) : deriveLocalScore(enc)
    const tier = rs?.risk_tier as RiskTier || riskTierFromScore(rawScore)

    // Use promised_discharge_time if set, fall back to expected_discharge_time
    const baselineRaw = enc.promised_discharge_time || enc.expected_discharge_time || ''
    const baselineDate = baselineRaw ? new Date(baselineRaw.replace(' ', 'T')) : null

    // Delay is derived from operational signals (mirrors DischargePredictionEngine constants)
    const coordDelay     = parseInt(enc.overdue_coord_tasks || '0', 10) * 15
    const handoffDelay   = parseInt(enc.unack_handoffs || '0', 10) * 15
    const milestoneDelay = parseInt(enc.incomplete_milestones || '0', 10) * 10
    const blockerDelay   = parseInt(enc.open_blockers || '0', 10) * 30
    const delayMinutes   = coordDelay + handoffDelay + milestoneDelay + blockerDelay

    const predictedDate = baselineDate
        ? new Date(baselineDate.getTime() + delayMinutes * 60000)
        : null

    return {
        ...enc,
        riskTier: tier,
        riskScore: rawScore,
        riskExplanation: rs?.explanation || '',
        escalationStatus: '',
        primaryBlocker: deriveBlocker(enc),
        readinessLabel: readiness(tier),
        promisedDischarge: baselineDate && !isNaN(baselineDate.getTime()) ? formatTime(baselineDate) : '—',
        predictedDischarge: predictedDate && !isNaN(predictedDate.getTime()) ? formatTime(predictedDate) : '—',
        delayMinutes,
        wardBed: enc.bed_number ? `${enc.ward} / ${enc.bed_number}` : (enc.ward || 'Unknown'),
    }
}


function deriveLocalScore(enc: Encounter): number {
    const t = parseInt(enc.overdue_coord_tasks || '0', 10)
    const m = parseInt(enc.incomplete_milestones || '0', 10)
    const h = parseInt(enc.unack_handoffs || '0', 10)
    const b = parseInt(enc.open_blockers || '0', 10)
    return Math.min(100, t * 20 + m * 15 + h * 10 + b * 25)
}

function readiness(tier: RiskTier): string {
    const map: Record<RiskTier, string> = {
        normal: 'Ready',
        medium: 'At Risk',
        high: 'High Risk',
        critical: 'Critical',
        unknown: 'Unknown',
    }
    return map[tier] || 'Unknown'
}

export function formatTime(d: Date): string {
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function formatDateTime(s: string): string {
    if (!s) return '—'
    const d = new Date(s.replace(' ', 'T'))
    if (isNaN(d.getTime())) return s
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function navigate(view: string, params: Record<string, string> = {}): void {
    const p = new URLSearchParams({ view, ...params })
    if (window.self !== window.top) {
        ;(window as any).CustomEvent?.fireTop?.('magellanNavigator.permalink.set', {
            relativePath: `${window.location.pathname}?${p}`,
            title: 'CareSetu Command Center',
        })
    }
    window.history.pushState({ view, ...params }, '', `?${p}`)
}
