import React, { useEffect, useState, useMemo } from 'react'
import { fetchEncounters, fetchAllRiskScores } from '../service'
import { enrichEncounter } from '../utils'
import type { EnrichedEncounter, RiskScore, RiskTier } from '../types'
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
const ICON_SEARCH   = <SVG d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />
const ICON_FILTER   = <SVG d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
const ICON_REFRESH  = <SVG d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
const ICON_ARROW    = <SVG d="M5 12h14M12 5l7 7-7 7" size={12} />

const TIER_OPTIONS: { value: RiskTier | 'all'; label: string }[] = [
    { value: 'all', label: 'All Risk Tiers' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High Risk' },
    { value: 'medium', label: 'At Risk' },
    { value: 'normal', label: 'Ready' },
]

const BLOCKER_OPTIONS = ['All Blockers', 'None', 'Coordination', 'Milestones', 'Handoff', 'Workflow Blockers']

export function DischargePipeline({ onEncounterClick, onToggleAI }: Props) {
    const [encounters, setEncounters] = useState<EnrichedEncounter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState('')

    const [search, setSearch] = useState('')
    const [tierFilter, setTierFilter] = useState<string>('all')
    const [blockerFilter, setBlockerFilter] = useState('All Blockers')
    const [sortCol, setSortCol] = useState<'risk' | 'delay' | 'promised'>('risk')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

    useEffect(() => { loadData() }, [])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            const [rawEncs, scores] = await Promise.all([fetchEncounters(), fetchAllRiskScores()])
            const riskMap = new Map<string, RiskScore>(scores.map(s => [s.encounter, s]))
            setEncounters(rawEncs.map(e => enrichEncounter(e, riskMap)))
            setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        } catch {
            setError('Unable to load pipeline. Showing cached view.')
        }
        setLoading(false)
    }

    const filtered = useMemo(() => {
        let data = encounters
        if (search) {
            const q = search.toLowerCase()
            data = data.filter(e => e.number.toLowerCase().includes(q) || e.patient_mrn.toLowerCase().includes(q) || (e.ward || '').toLowerCase().includes(q))
        }
        if (tierFilter !== 'all') data = data.filter(e => e.riskTier === tierFilter)
        if (blockerFilter !== 'All Blockers') data = data.filter(e => e.primaryBlocker === blockerFilter)

        return [...data].sort((a, b) => {
            let av = 0, bv = 0
            if (sortCol === 'risk')    { av = a.riskScore; bv = b.riskScore }
            if (sortCol === 'delay')   { av = a.delayMinutes; bv = b.delayMinutes }
            return sortDir === 'desc' ? bv - av : av - bv
        })
    }, [encounters, search, tierFilter, blockerFilter, sortCol, sortDir])

    function toggleSort(col: typeof sortCol) {
        if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
        else { setSortCol(col); setSortDir('desc') }
    }

    const ready    = encounters.filter(e => e.riskTier === 'normal').length
    const atRisk   = encounters.filter(e => e.riskTier === 'medium' || e.riskTier === 'high').length
    const critical = encounters.filter(e => e.riskTier === 'critical').length

    return (
        <div className="cs-content">
            {/* Header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <div className="cs-page-header__eyebrow">Operations</div>
                        <h1 className="cs-page-header__title">Discharge Pipeline</h1>
                        <p className="cs-page-header__subtitle">
                            {encounters.length} active encounters
                            {lastUpdated && <> · Updated {lastUpdated}</>}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="cs-btn cs-btn--ghost" onClick={loadData}>
                            {ICON_REFRESH} Refresh
                        </button>
                        <button className="cs-btn cs-btn--primary" onClick={() => onToggleAI('Summarize the discharge pipeline status and highlight the biggest risks.')}>
                            ✦ AI Summary
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="cs-error-banner">⚠ {error}</div>}

            {/* Quick stats */}
            <div className="cs-kpi-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                <div className="cs-kpi-card cs-kpi-card--total">
                    <div className="cs-kpi-card__eyebrow">Total</div>
                    <div className="cs-kpi-card__value">{encounters.length}</div>
                    <div className="cs-kpi-card__meta">Active encounters</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: '100%' }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--ready">
                    <div className="cs-kpi-card__eyebrow">Ready</div>
                    <div className="cs-kpi-card__value">{ready}</div>
                    <div className="cs-kpi-card__meta">No blockers</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${encounters.length ? ready / encounters.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">At Risk</div>
                    <div className="cs-kpi-card__value">{atRisk}</div>
                    <div className="cs-kpi-card__meta">Needs attention</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${encounters.length ? atRisk / encounters.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--critical">
                    <div className="cs-kpi-card__eyebrow">Critical</div>
                    <div className="cs-kpi-card__value">{critical}</div>
                    <div className="cs-kpi-card__meta">Immediate action</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${encounters.length ? critical / encounters.length * 100 : 0}%` }} /></div>
                </div>
            </div>

            {/* Filters */}
            <div className="cs-card cs-mb-16" style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted-fg)', flexShrink: 0 }}>{ICON_SEARCH}</span>
                        <input
                            id="pipeline-search"
                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--fg)' }}
                            placeholder="Search encounter, MRN, ward…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            aria-label="Search pipeline"
                        />
                    </div>
                    <span style={{ color: 'var(--muted-fg)', flexShrink: 0 }}>{ICON_FILTER}</span>
                    <select
                        id="pipeline-tier-filter"
                        className="cs-btn cs-btn--ghost"
                        style={{ cursor: 'pointer', paddingRight: 28 }}
                        value={tierFilter}
                        onChange={e => setTierFilter(e.target.value)}
                        aria-label="Filter by risk tier"
                    >
                        {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select
                        id="pipeline-blocker-filter"
                        className="cs-btn cs-btn--ghost"
                        style={{ cursor: 'pointer', paddingRight: 28 }}
                        value={blockerFilter}
                        onChange={e => setBlockerFilter(e.target.value)}
                        aria-label="Filter by blocker"
                    >
                        {BLOCKER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {(search || tierFilter !== 'all' || blockerFilter !== 'All Blockers') && (
                        <button className="cs-btn cs-btn--ghost cs-btn--sm" onClick={() => { setSearch(''); setTierFilter('all'); setBlockerFilter('All Blockers') }}>
                            Clear
                        </button>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--muted-fg)', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Table */}
            <div className="cs-card">
                {loading ? (
                    <div className="cs-loading"><div className="cs-spinner" />Loading pipeline…</div>
                ) : filtered.length === 0 ? (
                    <div className="cs-placeholder" style={{ padding: '48px 32px' }}>
                        <div className="cs-placeholder__icon">🔍</div>
                        <div className="cs-placeholder__title">No encounters match filters</div>
                        <div className="cs-placeholder__sub">Try adjusting your search or clearing filters.</div>
                    </div>
                ) : (
                    <div className="cs-table-wrap">
                        <table className="cs-table" aria-label="Discharge pipeline">
                            <thead>
                                <tr>
                                    <th scope="col">Encounter</th>
                                    <th scope="col">Ward / Bed</th>
                                    <th scope="col">
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', fontWeight: 700, color: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => toggleSort('risk')}>
                                            Risk {sortCol === 'risk' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                                        </button>
                                    </th>
                                    <th scope="col">Primary Blocker</th>
                                    <th scope="col">Promised</th>
                                    <th scope="col">Predicted</th>
                                    <th scope="col">
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', fontWeight: 700, color: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => toggleSort('delay')}>
                                            Delay {sortCol === 'delay' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                                        </button>
                                    </th>
                                    <th scope="col">Owner</th>
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
                                        <td className="cs-table__ward">{enc.wardBed || enc.ward || '—'}</td>
                                        <td><RiskBadge tier={enc.riskTier} showDot /></td>
                                        <td>
                                            <span className={`cs-table__blocker${enc.primaryBlocker === 'None' ? ' cs-table__blocker--none' : ''}`}>
                                                {enc.primaryBlocker}
                                            </span>
                                        </td>
                                        <td className="cs-table__time">{enc.promisedDischarge}</td>
                                        <td className="cs-table__time">{enc.predictedDischarge}</td>
                                        <td>
                                            {enc.delayMinutes > 0
                                                ? <span className="cs-table__delay">+{enc.delayMinutes}m</span>
                                                : <span className="cs-table__delay--ok">On time</span>}
                                        </td>
                                        <td style={{ color: 'var(--muted-fg)' }}>
                                            {enc.primaryBlocker === 'Coordination' ? 'Care Team' : enc.primaryBlocker === 'None' ? '—' : 'Staff'}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <button
                                                id={`pipeline-view-${enc.sys_id}`}
                                                className="cs-btn cs-btn--ghost cs-btn--sm"
                                                onClick={() => onEncounterClick(enc.sys_id)}
                                                aria-label={`View ${enc.number}`}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                            >
                                                View {ICON_ARROW}
                                            </button>
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
