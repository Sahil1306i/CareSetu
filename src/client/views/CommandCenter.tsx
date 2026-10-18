import React, { useEffect, useState, useMemo } from 'react'
import { fetchEncounters, fetchAllRiskScores } from '../service'
import { enrichEncounter } from '../utils'
import type { EnrichedEncounter } from '../types'
import type { RiskScore } from '../types'
import { RiskBadge } from '../components/RiskBadge'

interface Props {
    onEncounterClick: (sysId: string) => void
    onToggleAI: (prompt?: string) => void
}

export function CommandCenter({ onEncounterClick, onToggleAI }: Props) {
    const [encounters, setEncounters] = useState<EnrichedEncounter[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            const [rawEncs, scores] = await Promise.all([fetchEncounters(), fetchAllRiskScores()])
            const riskMap = new Map<string, RiskScore>(scores.map(s => [s.encounter, s]))
            const enriched = rawEncs.map(e => enrichEncounter(e, riskMap))
            setEncounters(enriched)
            setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        } catch (e) {
            setError('Unable to load encounters. Check network connectivity.')
            // Load with demo data so UI is still usable
            setEncounters(DEMO_ENCOUNTERS)
        }
        setLoading(false)
    }

    const kpis = useMemo(() => {
        const data = encounters.length ? encounters : DEMO_ENCOUNTERS
        return {
            total: data.length,
            ready: data.filter(e => e.riskTier === 'normal').length,
            atRisk: data.filter(e => e.riskTier === 'medium' || e.riskTier === 'high').length,
            critical: data.filter(e => e.riskTier === 'critical').length,
        }
    }, [encounters])

    const displayData = encounters.length ? encounters : DEMO_ENCOUNTERS

    const attentionItems = useMemo(() =>
        displayData
            .filter(e => e.riskTier === 'critical' || e.riskTier === 'high')
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5)
    , [displayData])

    return (
        <div className="cs-content">
            {error && (
                <div className="cs-error-banner">
                    ⚠ {error} Showing demo data.
                </div>
            )}

            {/* Page header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <h1 className="cs-page-header__title">Discharge Command Center</h1>
                        <p className="cs-page-header__subtitle">
                            Coordinate discharge readiness, resolve operational blockers, and prevent avoidable delays.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button id="btn-refresh" className="cs-btn cs-btn--ghost" onClick={loadData}>
                            ↻ Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="cs-kpi-row" role="region" aria-label="Key performance indicators">
                <KpiCard variant="total"    label="Patients in Pipeline"    value={kpis.total}    meta="+6 since 8:00 AM" />
                <KpiCard variant="ready"    label="Ready for Discharge"     value={kpis.ready}    meta="43% of pipeline · 7 before noon" />
                <KpiCard variant="risk"     label="At Risk"        value={kpis.atRisk}   meta="Likely to miss promise by 15-45m" />
                <KpiCard variant="critical" label="Critical / Delayed"       value={kpis.critical} meta="Avg. delay +58 min · 2 escalations" />
            </div>

            {/* Main grid: Forecast + AI */}
            <div className="cs-grid-pipeline">
                <DischargePredictor encounters={displayData} />
                <AiCard onToggleAI={onToggleAI} />
            </div>

            <div className="cs-mb-24">
                <DischargeTable encounters={displayData} onEncounterClick={onEncounterClick} loading={loading} />
            </div>

            {/* Bed Board */}
            <div className="cs-mb-24">
                <BedBoard encounters={displayData} onEncounterClick={onEncounterClick} />
            </div>

            {/* Attention */}
            <div className="cs-mb-24">
                <AttentionQueue items={attentionItems} onEncounterClick={onEncounterClick} onToggleAI={onToggleAI} />
            </div>

            {/* Ops row */}
            <div className="cs-grid-2col cs-mb-24">
                <BottleneckSection encounters={displayData} />
                <PerformanceSection />
            </div>
        </div>
    )
}

/* ── KPI Card ── */
function KpiCard({ variant, label, value, meta }: { variant: string; label: string; value: number; meta: string }) {
    return (
        <div className={`cs-kpi-card cs-kpi-card--${variant}`} role="group" aria-label={label}>
            <div className="cs-kpi-card__eyebrow">{label}</div>
            <div className="cs-kpi-card__value">{value}</div>
            <div className="cs-kpi-card__meta">{meta}</div>
            <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: '60%' }} /></div>
        </div>
    )
}

/* ── Discharge Predictor ── */
function DischargePredictor({ encounters }: { encounters: EnrichedEncounter[] }) {
    const delayed = encounters.filter(e => e.delayMinutes > 0)
    const avgDelay = delayed.length
        ? Math.round(delayed.reduce((s, e) => s + e.delayMinutes, 0) / delayed.length)
        : 0

    const factors = [
        { label: 'Coordination', min: Math.round(avgDelay * 0.35), pct: 35, color: 'var(--critical)' },
        { label: 'Handoff',      min: Math.round(avgDelay * 0.28), pct: 28, color: 'var(--risk)' },
        { label: 'Pharmacy',     min: Math.round(avgDelay * 0.22), pct: 22, color: 'var(--risk)' },
        { label: 'Transport',    min: Math.round(avgDelay * 0.15), pct: 15, color: 'var(--primary)' },
    ]

    return (
        <div className="cs-forecast">
            <div className="cs-forecast__header">
                <div className="cs-card__title">Discharge Delay Predictor — Today</div>
            </div>
            <div className="cs-forecast__times">
                <div className="cs-forecast__time-block">
                    <div className="cs-forecast__time-label">Avg Promised</div>
                    <div className="cs-forecast__time-value">4:00 PM</div>
                </div>
                <div className="cs-forecast__arrow" aria-hidden="true">→</div>
                <div className="cs-forecast__time-block">
                    <div className="cs-forecast__time-label">Avg Predicted</div>
                    <div className={`cs-forecast__time-value${avgDelay > 0 ? ' cs-forecast__time-value--delay' : ''}`}>
                        {avgDelay > 0 ? `${Math.floor((240 + avgDelay) / 60)}:${String((avgDelay % 60)).padStart(2,'0')} PM` : '4:00 PM'}
                    </div>
                </div>
                {avgDelay > 0 && (
                    <div className="cs-forecast__delay-pill" aria-label={`Average delay: ${avgDelay} minutes`}>+{avgDelay}m delay</div>
                )}
                <div style={{ flex: 1 }} />
                <div className="cs-forecast__factors">
                    {factors.map(f => (
                        <div key={f.label} className="cs-forecast__factor">
                            <span className="cs-forecast__factor-label">{f.label}</span>
                            <div className="cs-forecast__factor-bar">
                                <div className="cs-forecast__factor-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                            </div>
                            <span className="cs-forecast__factor-min">{f.min}m</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ── Discharge Table ── */
function DischargeTable({ encounters, onEncounterClick, loading }: {
    encounters: EnrichedEncounter[]
    onEncounterClick: (id: string) => void
    loading: boolean
}) {
    return (
        <div>
            <div className="cs-card">
                <div className="cs-card__title-bar">
                    <div className="cs-section-title" style={{ margin: 0, padding: 0 }}>DISCHARGE PIPELINE</div>
                </div>
                {loading ? (
                    <div className="cs-loading"><div className="cs-spinner" aria-hidden="true" />Loading encounters…</div>
                ) : (
                    <div className="cs-table-wrap">
                        <table className="cs-table" aria-label="Discharge pipeline">
                            <thead>
                                <tr>
                                    <th scope="col">Encounter</th>
                                    <th scope="col">Ward / Bed</th>
                                    <th scope="col">Readiness</th>
                                    <th scope="col">Primary Blocker</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Promised</th>
                                    <th scope="col">Predicted</th>
                                    <th scope="col">Delay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {encounters.map(enc => (
                                    <tr key={enc.sys_id} onClick={() => onEncounterClick(enc.sys_id)}>
                                        <td>
                                            <div className="cs-table__enc-id">{enc.number}</div>
                                        </td>
                                        <td className="cs-table__ward">{enc.ward || '—'} / {enc.bed_number || '—'}</td>
                                        <td><RiskBadge tier={enc.riskTier} showDot /></td>
                                        <td>
                                            {enc.primaryBlocker}
                                        </td>
                                        <td style={{ color: 'var(--muted-fg)' }}>
                                            {enc.primaryBlocker === 'Coordination' ? 'Care Team' : enc.primaryBlocker === 'None' ? '—' : 'Staff'}
                                        </td>
                                        <td className="cs-table__time">{enc.promisedDischarge}</td>
                                        <td className="cs-table__time" style={{ fontWeight: 600 }}>{enc.predictedDischarge}</td>
                                        <td>
                                            {enc.delayMinutes > 0
                                                ? <span className="cs-table__delay">+{enc.delayMinutes}m</span>
                                                : <span className="cs-table__delay--ok">On time</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── Attention Queue ── */
function AttentionQueue({ items, onEncounterClick, onToggleAI }: { items: EnrichedEncounter[]; onEncounterClick: (id: string) => void; onToggleAI: (prompt?: string) => void }) {
    const list = items.slice(0, 3) // Match Lovable showing 3 items
    return (
        <div>
            <div className="cs-section-header">
                <span className="cs-section-title">Attention Required</span>
            </div>
            {list.length === 0 ? (
                <div className="cs-placeholder" style={{ padding: '32px' }}>
                    <div className="cs-placeholder__icon">✓</div>
                    <div className="cs-placeholder__title" style={{ fontSize: 14 }}>No critical cases</div>
                </div>
            ) : (
                <div className="cs-attention-grid">
                    {list.map(enc => {
                        const styleCls = enc.riskTier === 'critical' ? 'cs-attention-card--critical' : enc.riskTier === 'high' ? 'cs-attention-card--high' : 'cs-attention-card--normal'
                        return (
                            <div key={enc.sys_id} className={`cs-attention-card ${styleCls}`}>
                                <div className="cs-attention-card__top">
                                    <span className="cs-attention-card__enc">{enc.number}</span>
                                    <RiskBadge tier={enc.riskTier} showDot={true} />
                                </div>
                                <div className="cs-attention-card__blocker-label">Primary blocker</div>
                                <div className="cs-attention-card__blocker-val">{enc.primaryBlocker}</div>
                                <div className="cs-attention-card__time">
                                    <span aria-hidden="true">⏱</span> {enc.delayMinutes > 0 ? `${enc.delayMinutes} min delay` : 'Clear to discharge'}
                                </div>
                                <div className="cs-attention-card__actions">
                                    <button className="cs-btn cs-btn--ghost" style={{ flex: 1 }} onClick={() => onEncounterClick(enc.sys_id)}>View</button>
                                    <button className="cs-btn cs-btn--primary" style={{ flex: 1 }}>Resolve</button>
                                    {enc.riskTier === 'critical' && <button className="cs-btn cs-btn--ghost" style={{ flex: 1, borderColor: 'rgba(208,60,39,0.3)', color: 'var(--critical)' }}>Escalate</button>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/* ── Bed Board ── */
const WARD_BEDS: Record<string, number[]> = {
    'ICU':          [101, 102, 103, 104, 105, 106, 107, 108],
    'General Ward': [201, 202, 203, 204, 205, 206, 207, 208],
    'Cardiology':   [301, 302, 303, 304, 305, 306],
    'Oncology':     [401, 402, 403, 404],
}

function BedBoard({ encounters, onEncounterClick }: { encounters: EnrichedEncounter[]; onEncounterClick: (id: string) => void }) {
    const wardMap = useMemo(() => {
        const m = new Map<string, EnrichedEncounter[]>()
        for (const enc of encounters) {
            const w = enc.ward || 'General Ward'
            if (!m.has(w)) m.set(w, [])
            m.get(w)!.push(enc)
        }
        return m
    }, [encounters])

    const allWards = Array.from(new Set([...Object.keys(WARD_BEDS), ...Array.from(wardMap.keys())]))

    return (
        <div className="cs-card">
            <div className="cs-bed-board" role="region" aria-label="Digital bed board">
                {allWards.map(ward => {
                    const encInWard = wardMap.get(ward) || []
                    const beds = WARD_BEDS[ward] || Array.from({ length: 6 }, (_, i) => (parseInt(ward[0] || '5') * 100) + i + 1)
                    return (
                        <div key={ward} className="cs-bed-ward">
                            <div className="cs-bed-ward__label">
                                {ward}
                                <span className="cs-bed-ward__count">{encInWard.length}/{beds.length}</span>
                            </div>
                            <div className="cs-bed-grid">
                                {beds.map((bed, idx) => {
                                    const enc = encInWard[idx]
                                    if (!enc) {
                                        return (
                                            <div key={bed} className="cs-bed-cell cs-bed-cell--empty" aria-label={`Bed ${bed}, empty`}>
                                                <div className="cs-bed-cell__num">{bed}</div>
                                                <div className="cs-bed-cell__enc">Empty</div>
                                                <div className="cs-bed-cell__status-dot" />
                                            </div>
                                        )
                                    }
                                    return (
                                        <div
                                            key={bed}
                                            id={`bed-${bed}`}
                                            className={`cs-bed-cell cs-bed-cell--${enc.riskTier}`}
                                            onClick={() => onEncounterClick(enc.sys_id)}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Bed ${bed}, ${enc.number}, ${enc.riskTier} risk`}
                                            onKeyDown={e => e.key === 'Enter' && onEncounterClick(enc.sys_id)}
                                        >
                                            <div className="cs-bed-cell__num">{bed}</div>
                                            <div className="cs-bed-cell__enc">{enc.number}</div>
                                            <div className="cs-bed-cell__status-dot" aria-hidden="true" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ── Bottleneck Section ── */
function BottleneckSection({ encounters }: { encounters: EnrichedEncounter[] }) {
    const counts = useMemo(() => {
        let coord = 0, milestone = 0, handoff = 0, blockers = 0
        for (const e of encounters) {
            coord     += parseInt(e.overdue_coord_tasks || '0', 10)
            milestone += parseInt(e.incomplete_milestones || '0', 10)
            handoff   += parseInt(e.unack_handoffs || '0', 10)
            blockers  += parseInt(e.open_blockers || '0', 10)
        }
        const total = coord + milestone + handoff + blockers || 1
        return [
            { label: 'Coordination',   count: coord,     pct: Math.round(coord / total * 100),     color: '#ef4444' },
            { label: 'Milestones',     count: milestone, pct: Math.round(milestone / total * 100),  color: '#f97316' },
            { label: 'Handoffs',       count: handoff,   pct: Math.round(handoff / total * 100),    color: '#f59e0b' },
            { label: 'Blockers',       count: blockers,  pct: Math.round(blockers / total * 100),   color: '#a855f7' },
        ]
    }, [encounters])

    return (
        <div>
            <div className="cs-section-header">
                <span className="cs-section-title">Top Bottleneck Categories</span>
            </div>
            <div className="cs-card">
                <div className="cs-blocker-bar">
                    {counts.map(c => (
                        <div key={c.label} className="cs-blocker-item">
                            <span className="cs-blocker-item__label">{c.label}</span>
                            <div className="cs-blocker-item__bar">
                                <div className="cs-blocker-item__fill" style={{ width: `${c.pct}%`, background: c.color }} />
                            </div>
                            <span className="cs-blocker-item__stat" style={{ color: 'var(--fg)' }}>{c.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ── Performance Section ── */
function PerformanceSection() {
    return (
        <div>
            <div className="cs-section-header">
                <span className="cs-section-title">Today's Discharge Performance</span>
            </div>
            <div className="cs-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 20 }}>
                    <div style={{ borderRight: '1px solid var(--border)', paddingRight: 20 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted-fg)' }}>Average turnaround</div>
                        <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: 8 }}>2h 18m</div>
                        <div style={{ fontSize: 12, color: 'var(--risk)', marginTop: 4 }}>Target 2h 00m</div>
                    </div>
                    <div style={{ borderRight: '1px solid var(--border)', padding: '0 20px' }}>
                        <div style={{ fontSize: 12, color: 'var(--muted-fg)' }}>On-time discharge</div>
                        <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: 8 }}>72%</div>
                        <div style={{ fontSize: 12, color: 'var(--ready)', marginTop: 4 }}>+4 pts vs. 7-day avg</div>
                    </div>
                    <div style={{ paddingLeft: 20 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted-fg)' }}>Delayed discharges</div>
                        <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: 8 }}>28%</div>
                        <div style={{ fontSize: 12, color: 'var(--critical)', marginTop: 4 }}>13 of 46 completed</div>
                    </div>
                </div>
                <div style={{ padding: '0 20px 20px', display: 'flex', gap: 4, height: 60, alignItems: 'flex-end' }}>
                    {[40, 55, 70, 62, 80, 75, 68, 72, 85, 66, 74, 72].map((h, i) => (
                        <div key={i} style={{ flex: 1, borderRadius: 2, height: `${h}%`, background: h >= 70 ? 'var(--ready-soft)' : 'var(--risk-soft)', borderTop: `2px solid ${h >= 70 ? 'var(--ready)' : 'var(--risk)'}` }} />
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ── AI Card ── */
function AiCard({ onToggleAI }: { onToggleAI: (prompt?: string) => void }) {
    return (
        <div className="cs-ai-card">
            <div className="cs-ai-card__header">
                <span style={{ color: 'var(--live)' }}>✦</span>
                <span style={{ fontWeight: 600 }}>CareSetu AI</span>
                <div className="cs-ai-card__status">
                    <div className="cs-ai-card__status-dot" /> Ready
                </div>
            </div>
            <div className="cs-ai-card__insight">
                4 encounters are currently at risk of missing their promised discharge time.
            </div>
            <div className="cs-ai-card__prompts">
                {["Why is ENC1000010 critical?", "What is blocking discharge?", "Which patients need attention first?", "Which department is causing the most delay?"].map(p => (
                    <button key={p} className="cs-ai-card__prompt" onClick={() => onToggleAI(p)}>
                        {p} <span>→</span>
                    </button>
                ))}
            </div>
            <button className="cs-ai-card__cta" onClick={() => onToggleAI()}>
                ✦ Ask CareSetu AI
            </button>
        </div>
    )
}

/* ── Demo data fallback ── */
export const DEMO_ENCOUNTERS: EnrichedEncounter[] = [
    { sys_id: 'demo-1', number: 'ENC1000005', patient_mrn: 'CS-MRN-1001', ward: 'ICU', bed_number: '101', state: '1', priority: '1', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '3', incomplete_milestones: '2', unack_handoffs: '1', open_blockers: '0', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'critical', riskScore: 85, riskExplanation: '', escalationStatus: 'open', primaryBlocker: 'Coordination', readinessLabel: 'Critical', promisedDischarge: '4:00 PM', predictedDischarge: '5:30 PM', delayMinutes: 90, wardBed: 'ICU' },
    { sys_id: 'demo-2', number: 'ENC1000006', patient_mrn: 'CS-DEMO-001', ward: 'General Ward', bed_number: '201', state: '1', priority: '4', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '0', incomplete_milestones: '0', unack_handoffs: '0', open_blockers: '0', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'normal', riskScore: 0, riskExplanation: '', escalationStatus: '', primaryBlocker: 'None', readinessLabel: 'Ready', promisedDischarge: '2:00 PM', predictedDischarge: '2:00 PM', delayMinutes: 0, wardBed: 'General Ward' },
    { sys_id: 'demo-3', number: 'ENC1000007', patient_mrn: 'CS-MRN-1024', ward: 'ICU', bed_number: '102', state: '1', priority: '2', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '2', incomplete_milestones: '1', unack_handoffs: '1', open_blockers: '2', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'high', riskScore: 65, riskExplanation: '', escalationStatus: '', primaryBlocker: 'Handoff', readinessLabel: 'High Risk', promisedDischarge: '3:00 PM', predictedDischarge: '4:10 PM', delayMinutes: 70, wardBed: 'ICU' },
    { sys_id: 'demo-4', number: 'ENC1000008', patient_mrn: 'CS-MRN-2042', ward: 'Cardiology', bed_number: '301', state: '1', priority: '2', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '1', incomplete_milestones: '2', unack_handoffs: '0', open_blockers: '0', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'medium', riskScore: 40, riskExplanation: '', escalationStatus: '', primaryBlocker: 'Milestones', readinessLabel: 'At Risk', promisedDischarge: '5:00 PM', predictedDischarge: '5:45 PM', delayMinutes: 45, wardBed: 'Cardiology' },
    { sys_id: 'demo-5', number: 'ENC1000009', patient_mrn: 'CS-MRN-3301', ward: 'General Ward', bed_number: '202', state: '1', priority: '1', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '2', incomplete_milestones: '3', unack_handoffs: '1', open_blockers: '1', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'critical', riskScore: 90, riskExplanation: '', escalationStatus: 'open', primaryBlocker: 'Workflow Blockers', readinessLabel: 'Critical', promisedDischarge: '1:00 PM', predictedDischarge: '3:00 PM', delayMinutes: 120, wardBed: 'General Ward' },
    { sys_id: 'demo-6', number: 'ENC1000010', patient_mrn: 'CS-MRN-4415', ward: 'Oncology', bed_number: '401', state: '1', priority: '3', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '1', incomplete_milestones: '0', unack_handoffs: '0', open_blockers: '0', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'medium', riskScore: 30, riskExplanation: '', escalationStatus: '', primaryBlocker: 'Coordination', readinessLabel: 'At Risk', promisedDischarge: '4:30 PM', predictedDischarge: '4:55 PM', delayMinutes: 25, wardBed: 'Oncology' },
    { sys_id: 'demo-7', number: 'ENC1000011', patient_mrn: 'TEST-MISSING-EDT', ward: 'General Ward', bed_number: '203', state: '1', priority: '2', expected_discharge_time: '', promised_discharge_time: '', actual_discharge_time: '', overdue_coord_tasks: '3', incomplete_milestones: '1', unack_handoffs: '0', open_blockers: '0', charge_nurse: '', short_description: '', sys_created_on: '', sys_updated_on: '', riskTier: 'high', riskScore: 70, riskExplanation: '', escalationStatus: '', primaryBlocker: 'Coordination', readinessLabel: 'High Risk', promisedDischarge: '3:30 PM', predictedDischarge: '4:30 PM', delayMinutes: 60, wardBed: 'General Ward' },
]

