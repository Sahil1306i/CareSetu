import React, { useEffect, useState, useMemo } from 'react'
import { fetchEncounters, fetchAllRiskScores } from '../service'
import { enrichEncounter } from '../utils'
import type { EnrichedEncounter, RiskScore } from '../types'
import { RiskBadge } from '../components/RiskBadge'

interface Props {
    onEncounterClick: (sysId: string) => void
    onToggleAI: (prompt?: string) => void
}

const SVG = ({ d, size = 14 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)
const ICON_SEARCH  = <SVG d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />
const ICON_REFRESH = <SVG d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
const ICON_ARROW   = <SVG d="M5 12h14M12 5l7 7-7 7" size={12} />

const WARD_OPTIONS = ['All Wards', 'ICU', 'General Ward', 'Cardiology', 'Oncology']

export function EncounterList({ onEncounterClick, onToggleAI }: Props) {
    const [encounters, setEncounters] = useState<EnrichedEncounter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [wardFilter, setWardFilter] = useState('All Wards')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

    useEffect(() => { loadData() }, [])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            const [rawEncs, scores] = await Promise.all([fetchEncounters(), fetchAllRiskScores()])
            const riskMap = new Map<string, RiskScore>(scores.map(s => [s.encounter, s]))
            setEncounters(rawEncs.map(e => enrichEncounter(e, riskMap)))
        } catch {
            setError('Unable to load encounters.')
        }
        setLoading(false)
    }

    const wards = useMemo(() => {
        const w = new Set(encounters.map(e => e.ward).filter(Boolean))
        return ['All Wards', ...Array.from(w)]
    }, [encounters])

    const filtered = useMemo(() => {
        let data = encounters
        if (search) {
            const q = search.toLowerCase()
            data = data.filter(e => e.number.toLowerCase().includes(q) || e.patient_mrn.toLowerCase().includes(q))
        }
        if (wardFilter !== 'All Wards') data = data.filter(e => e.ward === wardFilter)
        return data
    }, [encounters, search, wardFilter])

    return (
        <div className="cs-content">
            {/* Header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <div className="cs-page-header__eyebrow">Operations</div>
                        <h1 className="cs-page-header__title">Encounters</h1>
                        <p className="cs-page-header__subtitle">{encounters.length} active in discharge pipeline</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="cs-btn cs-btn--ghost" onClick={loadData}>{ICON_REFRESH} Refresh</button>
                        <button
                            className={`cs-btn cs-btn--ghost`}
                            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                            aria-label="Toggle view mode"
                        >
                            {viewMode === 'table' ? '⊞ Grid' : '☰ Table'}
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="cs-error-banner">⚠ {error}</div>}

            {/* Filters */}
            <div className="cs-card cs-mb-16" style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted-fg)' }}>{ICON_SEARCH}</span>
                        <input
                            id="encounter-search"
                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--fg)' }}
                            placeholder="Search encounter or MRN…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            aria-label="Search encounters"
                        />
                    </div>
                    <select
                        id="encounter-ward-filter"
                        className="cs-btn cs-btn--ghost"
                        value={wardFilter}
                        onChange={e => setWardFilter(e.target.value)}
                        aria-label="Filter by ward"
                    >
                        {wards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <span style={{ fontSize: 12, color: 'var(--muted-fg)', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {loading ? (
                <div className="cs-loading"><div className="cs-spinner" />Loading encounters…</div>
            ) : filtered.length === 0 ? (
                <div className="cs-placeholder">
                    <div className="cs-placeholder__icon">🔍</div>
                    <div className="cs-placeholder__title">No encounters match</div>
                    <div className="cs-placeholder__sub">Try a different search term or ward filter.</div>
                </div>
            ) : viewMode === 'table' ? (
                <div className="cs-card">
                    <div className="cs-table-wrap">
                        <table className="cs-table" aria-label="Encounters">
                            <thead>
                                <tr>
                                    <th scope="col">Encounter / MRN</th>
                                    <th scope="col">Ward</th>
                                    <th scope="col">Bed</th>
                                    <th scope="col">Risk</th>
                                    <th scope="col">Readiness</th>
                                    <th scope="col">Predicted Discharge</th>
                                    <th scope="col">Blockers</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(enc => (
                                    <tr key={enc.sys_id} onClick={() => onEncounterClick(enc.sys_id)}>
                                        <td>
                                            <div className="cs-table__enc-id">{enc.number}</div>
                                            <div className="cs-table__mrn">{enc.patient_mrn || '—'}</div>
                                        </td>
                                        <td className="cs-table__ward">{enc.ward || '—'}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{enc.bed_number || '—'}</td>
                                        <td><RiskBadge tier={enc.riskTier} showDot /></td>
                                        <td style={{ fontSize: 12, color: 'var(--muted-fg)' }}>{enc.readinessLabel}</td>
                                        <td className="cs-table__time">{enc.predictedDischarge}</td>
                                        <td>
                                            {parseInt(enc.open_blockers || '0', 10) > 0 ? (
                                                <span className="cs-table__blocker">{enc.open_blockers} active</span>
                                            ) : (
                                                <span className="cs-table__blocker--none">Clear</span>
                                            )}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <button id={`enc-view-${enc.sys_id}`} className="cs-btn cs-btn--ghost cs-btn--sm" onClick={() => onEncounterClick(enc.sys_id)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                View {ICON_ARROW}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid view */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
                    {filtered.map(enc => (
                        <div
                            key={enc.sys_id}
                            className={`cs-attention-card cs-attention-card--${enc.riskTier}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onEncounterClick(enc.sys_id)}
                            id={`enc-card-${enc.sys_id}`}
                        >
                            <div className="cs-attention-card__top">
                                <span className="cs-attention-card__enc">{enc.number}</span>
                                <RiskBadge tier={enc.riskTier} />
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted-fg)', marginBottom: 8 }}>
                                MRN: {enc.patient_mrn || '—'}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                                {enc.ward || 'Unknown Ward'}{enc.bed_number ? ` · Bed ${enc.bed_number}` : ''}
                            </div>
                            <div className="cs-attention-card__time">
                                <span>Predicted: {enc.predictedDischarge}</span>
                                {enc.delayMinutes > 0 && <span style={{ color: 'var(--critical)', fontWeight: 700 }}>+{enc.delayMinutes}m</span>}
                            </div>
                            <div className="cs-attention-card__actions">
                                <button className="cs-btn cs-btn--ghost cs-btn--sm" onClick={e => { e.stopPropagation(); onEncounterClick(enc.sys_id) }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    360° View {ICON_ARROW}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
