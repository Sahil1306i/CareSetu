import React, { useEffect, useState, useMemo } from 'react'
import { fetchEncounters, fetchAllRiskScores, fetchAllBlockers, fetchAllEscalations } from '../service'
import { enrichEncounter } from '../utils'
import type { EnrichedEncounter, RiskScore, Blocker, Escalation } from '../types'
import { RiskBadge } from '../components/RiskBadge'

interface Props {
    onEncounterClick: (sysId: string) => void
    onToggleAI: (prompt?: string) => void
}

function pct(n: number, d: number) { return d ? Math.round(n / d * 100) : 0 }

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
    return (
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${max ? (value / max) * 100 : 0}%`, background: color, borderRadius: 4, transition: 'width .6s ease' }} />
        </div>
    )
}

const HEATMAP_WARDS = ['ICU', 'Gen Ward', 'Cardio', 'Oncology']
const HEATMAP_HOURS = ['8am', '10am', '12pm', '2pm', '4pm', '6pm']
const HEATMAP_DATA  = [
    [0.2, 0.4, 0.7, 0.9, 0.6, 0.3],
    [0.1, 0.3, 0.5, 0.7, 0.8, 0.4],
    [0.3, 0.5, 0.6, 0.5, 0.4, 0.2],
    [0.1, 0.2, 0.3, 0.6, 0.7, 0.5],
]
function heatColor(v: number) {
    if (v < 0.25) return 'oklch(0.93 0.04 155)' // green-tint
    if (v < 0.5)  return 'oklch(0.95 0.04 80)'  // yellow
    if (v < 0.75) return 'oklch(0.93 0.08 50)'  // orange
    return 'oklch(0.91 0.06 25)' // red-tint
}

export function InsightsView({ onEncounterClick, onToggleAI }: Props) {
    const [encounters, setEncounters] = useState<EnrichedEncounter[]>([])
    const [blockers,   setBlockers]   = useState<Blocker[]>([])
    const [escalations,setEscalations]= useState<Escalation[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetchEncounters(),
            fetchAllRiskScores(),
            fetchAllBlockers(),
            fetchAllEscalations(),
        ]).then(([rawEncs, scores, blk, esc]) => {
            const riskMap = new Map<string, RiskScore>(scores.map(s => [s.encounter, s]))
            setEncounters(rawEncs.map(e => enrichEncounter(e, riskMap)))
            setBlockers(blk)
            setEscalations(esc)
        }).catch(() => setError('Unable to load insights data.'))
        .finally(() => setLoading(false))
    }, [])

    const riskDist = useMemo(() => {
        const counts = { critical: 0, high: 0, medium: 0, normal: 0 }
        encounters.forEach(e => { if (e.riskTier in counts) counts[e.riskTier as keyof typeof counts]++ })
        return counts
    }, [encounters])

    const blockerDist = useMemo(() => {
        const map: Record<string, number> = {}
        blockers.forEach(b => {
            const cat = b.category_label || b.category || 'Other'
            map[cat] = (map[cat] || 0) + 1
        })
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
    }, [blockers])

    const wardSummary = useMemo(() => {
        const map: Record<string, { total: number; critical: number; delay: number }> = {}
        encounters.forEach(e => {
            const w = e.ward || 'Unknown'
            if (!map[w]) map[w] = { total: 0, critical: 0, delay: 0 }
            map[w].total++
            if (e.riskTier === 'critical') map[w].critical++
            map[w].delay += e.delayMinutes
        })
        return Object.entries(map).sort((a, b) => b[1].critical - a[1].critical)
    }, [encounters])

    const avgDelay = useMemo(() => {
        const delayed = encounters.filter(e => e.delayMinutes > 0)
        return delayed.length ? Math.round(delayed.reduce((s, e) => s + e.delayMinutes, 0) / delayed.length) : 0
    }, [encounters])

    const maxBlockerCount = blockerDist[0]?.[1] || 1

    if (loading) return <div className="cs-loading"><div className="cs-spinner" />Loading insights…</div>

    return (
        <div className="cs-content">
            {/* Header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <div className="cs-page-header__eyebrow">Intelligence</div>
                        <h1 className="cs-page-header__title">Operational Insights</h1>
                        <p className="cs-page-header__subtitle">Aggregated from live encounter, blocker, and escalation data</p>
                    </div>
                    <button className="cs-btn cs-btn--primary" onClick={() => onToggleAI('Give me a complete operational analysis of today\'s discharge performance including key risks and recommendations.')}>
                        ✦ AI Analysis
                    </button>
                </div>
            </div>

            {error && <div className="cs-error-banner">⚠ {error}</div>}

            {/* Top KPIs */}
            <div className="cs-kpi-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                <div className="cs-kpi-card cs-kpi-card--total">
                    <div className="cs-kpi-card__eyebrow">Total Encounters</div>
                    <div className="cs-kpi-card__value">{encounters.length}</div>
                    <div className="cs-kpi-card__meta">In discharge pipeline</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: '100%' }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">Avg Delay</div>
                    <div className="cs-kpi-card__value">{avgDelay}m</div>
                    <div className="cs-kpi-card__meta">Per delayed encounter</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${Math.min(100, avgDelay)}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--critical">
                    <div className="cs-kpi-card__eyebrow">Active Blockers</div>
                    <div className="cs-kpi-card__value">{blockers.length}</div>
                    <div className="cs-kpi-card__meta">{blockers.filter(b => b.is_overdue).length} overdue</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${pct(blockers.filter(b => b.is_overdue).length, blockers.length)}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">Escalations</div>
                    <div className="cs-kpi-card__value">{escalations.length}</div>
                    <div className="cs-kpi-card__meta">{escalations.filter(e => e.risk_tier === 'critical').length} critical</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${pct(escalations.filter(e => e.risk_tier === 'critical').length, escalations.length)}%` }} /></div>
                </div>
            </div>

            {/* Two columns: risk dist + blocker dist */}
            <div className="cs-grid-2col cs-mb-24">
                {/* Risk distribution */}
                <div className="cs-card">
                    <div className="cs-card__title-bar">
                        <span className="cs-card__title">Risk Distribution</span>
                        <span style={{ fontSize: 11, color: 'var(--muted-fg)' }}>{encounters.length} encounters</span>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {([
                            { tier: 'critical', label: 'Critical', color: 'var(--critical)' },
                            { tier: 'high',     label: 'High Risk', color: 'var(--risk)' },
                            { tier: 'medium',   label: 'At Risk',  color: 'oklch(0.75 0.12 70)' },
                            { tier: 'normal',   label: 'Ready',    color: 'var(--ready)' },
                        ] as const).map(r => {
                            const count = riskDist[r.tier as keyof typeof riskDist] || 0
                            return (
                                <div key={r.tier}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <RiskBadge tier={r.tier as any} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                                            {count} <span style={{ color: 'var(--muted-fg)', fontWeight: 400 }}>({pct(count, encounters.length)}%)</span>
                                        </span>
                                    </div>
                                    <Bar value={count} max={encounters.length} color={r.color} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Blocker distribution */}
                <div className="cs-card">
                    <div className="cs-card__title-bar">
                        <span className="cs-card__title">Blocker Categories</span>
                        <span style={{ fontSize: 11, color: 'var(--muted-fg)' }}>{blockers.length} active</span>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {blockerDist.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--muted-fg)', fontSize: 13, padding: '20px 0' }}>No active blockers</div>
                        ) : blockerDist.map(([cat, count]) => (
                            <div key={cat} className="cs-blocker-item">
                                <span className="cs-blocker-item__label">{cat}</span>
                                <div className="cs-blocker-item__bar">
                                    <div className="cs-blocker-item__fill" style={{ width: `${pct(count, maxBlockerCount)}%` }} />
                                </div>
                                <span className="cs-blocker-item__stat">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ward summary */}
            <div className="cs-mb-24">
                <div className="cs-section-header cs-mb-16">
                    <span className="cs-section-title">Ward Summary</span>
                </div>
                <div className="cs-card">
                    <div className="cs-table-wrap">
                        <table className="cs-table" aria-label="Ward summary">
                            <thead>
                                <tr>
                                    <th scope="col">Ward</th>
                                    <th scope="col">Encounters</th>
                                    <th scope="col">Critical</th>
                                    <th scope="col">Total Delay</th>
                                    <th scope="col">Avg Delay</th>
                                    <th scope="col">Pressure</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wardSummary.map(([ward, stats]) => (
                                    <tr key={ward}>
                                        <td style={{ fontWeight: 600 }}>{ward}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>{stats.total}</td>
                                        <td>
                                            {stats.critical > 0 ? (
                                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--critical)' }}>{stats.critical}</span>
                                            ) : <span style={{ color: 'var(--ready)' }}>0</span>}
                                        </td>
                                        <td>
                                            {stats.delay > 0
                                                ? <span className="cs-table__delay">+{stats.delay}m</span>
                                                : <span className="cs-table__delay--ok">On time</span>}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                                            {stats.total ? Math.round(stats.delay / stats.total) : 0}m avg
                                        </td>
                                        <td style={{ minWidth: 120 }}>
                                            <Bar value={stats.critical} max={Math.max(...wardSummary.map(([, s]) => s.critical), 1)} color="var(--critical)" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pressure heatmap */}
            <div className="cs-mb-24">
                <div className="cs-section-header cs-mb-16">
                    <span className="cs-section-title">Discharge Pressure Heatmap</span>
                    <span className="cs-section-meta">Today · by hour (illustrative distribution)</span>
                </div>
                <div className="cs-card">
                    <div className="cs-heatmap" role="table" aria-label="Discharge pressure by ward and hour">
                        <div className="cs-heatmap__row-label" />
                        {HEATMAP_HOURS.map(h => <div key={h} className="cs-heatmap__col-label" role="columnheader">{h}</div>)}
                        {HEATMAP_WARDS.map((ward, wi) => (
                            <React.Fragment key={ward}>
                                <div className="cs-heatmap__row-label">{ward}</div>
                                {HEATMAP_DATA[wi].map((val, hi) => (
                                    <div
                                        key={hi}
                                        className="cs-heatmap__cell"
                                        style={{ background: heatColor(val) }}
                                        title={`${ward} at ${HEATMAP_HOURS[hi]}: ${Math.round(val * 100)}% pressure`}
                                        role="cell"
                                        aria-label={`${ward} at ${HEATMAP_HOURS[hi]}: ${Math.round(val * 100)}%`}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delay distribution */}
            <div className="cs-mb-24">
                <div className="cs-section-header cs-mb-16">
                    <span className="cs-section-title">Delay Distribution</span>
                </div>
                <div className="cs-card" style={{ padding: 20 }}>
                    {encounters.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: '20px 0', fontSize: 13 }}>No encounter data available</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { label: 'On time (0m)',    count: encounters.filter(e => e.delayMinutes === 0).length,           color: 'var(--ready)' },
                                { label: 'Low (1–30m)',     count: encounters.filter(e => e.delayMinutes > 0 && e.delayMinutes <= 30).length,   color: 'oklch(0.75 0.12 70)' },
                                { label: 'Medium (31–60m)', count: encounters.filter(e => e.delayMinutes > 30 && e.delayMinutes <= 60).length,  color: 'var(--risk)' },
                                { label: 'High (>60m)',     count: encounters.filter(e => e.delayMinutes > 60).length,            color: 'var(--critical)' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 56px', alignItems: 'center', gap: 14 }}>
                                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{row.label}</span>
                                    <Bar value={row.count} max={encounters.length} color={row.color} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'right' }}>{row.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
