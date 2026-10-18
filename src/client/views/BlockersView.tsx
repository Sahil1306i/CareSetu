import React, { useEffect, useState, useMemo } from 'react'
import { fetchAllBlockers, updateBlocker } from '../service'
import type { Blocker } from '../types'
import { formatDateTime } from '../utils'

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
const ICON_REFRESH  = <SVG d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
const ICON_CHECK    = <SVG d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={12} />

const CATEGORIES = ['All Categories', 'Coordination', 'Milestones', 'Handoff', 'Workflow Blocker', 'Clinical', 'Pharmacy', 'Transport', 'Other']
const STATUSES   = ['All Statuses', 'open', 'in_progress', 'escalated']

const STATUS_COLORS: Record<string, string> = {
    open:        'var(--critical)',
    in_progress: 'var(--risk)',
    escalated:   'var(--critical)',
    resolved:    'var(--ready)',
}

export function BlockersView({ onEncounterClick, onToggleAI }: Props) {
    const [blockers, setBlockers] = useState<Blocker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('All Categories')
    const [statusFilter, setStatusFilter] = useState('All Statuses')
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => { loadData() }, [])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            setBlockers(await fetchAllBlockers())
        } catch {
            setError('Unable to load blockers.')
        }
        setLoading(false)
    }

    async function markResolved(b: Blocker) {
        setUpdating(b.sys_id)
        const ok = await updateBlocker(b.sys_id, { status: 'resolved', resolution_notes: 'Resolved via CareSetu AI Command Center' })
        if (ok) setBlockers(prev => prev.filter(x => x.sys_id !== b.sys_id))
        setUpdating(null)
    }

    const filtered = useMemo(() => {
        let data = blockers
        if (search) {
            const q = search.toLowerCase()
            data = data.filter(b => b.number.toLowerCase().includes(q) || b.encounter.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))
        }
        if (catFilter !== 'All Categories') data = data.filter(b => (b.category_label || b.category) === catFilter)
        if (statusFilter !== 'All Statuses') data = data.filter(b => b.status === statusFilter)
        return data
    }, [blockers, search, catFilter, statusFilter])

    const overdue  = blockers.filter(b => b.is_overdue).length
    const open     = blockers.filter(b => b.status === 'open').length
    const inProg   = blockers.filter(b => b.status === 'in_progress').length
    const totalDelay = blockers.reduce((s, b) => s + (b.estimated_delay_minutes || 0), 0)

    return (
        <div className="cs-content">
            {/* Header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <div className="cs-page-header__eyebrow">Operations</div>
                        <h1 className="cs-page-header__title">Blockers</h1>
                        <p className="cs-page-header__subtitle">Active discharge blockers across all encounters</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="cs-btn cs-btn--ghost" onClick={loadData}>{ICON_REFRESH} Refresh</button>
                        <button className="cs-btn cs-btn--primary" onClick={() => onToggleAI('What are the most critical blockers right now? How can we resolve them fastest?')}>
                            ✦ AI Insights
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="cs-error-banner">⚠ {error}</div>}

            {/* Quick stats */}
            <div className="cs-kpi-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
                <div className="cs-kpi-card cs-kpi-card--critical">
                    <div className="cs-kpi-card__eyebrow">Overdue</div>
                    <div className="cs-kpi-card__value">{overdue}</div>
                    <div className="cs-kpi-card__meta">Past target time</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${blockers.length ? overdue / blockers.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">Open</div>
                    <div className="cs-kpi-card__value">{open}</div>
                    <div className="cs-kpi-card__meta">Not yet in progress</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${blockers.length ? open / blockers.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--total">
                    <div className="cs-kpi-card__eyebrow">In Progress</div>
                    <div className="cs-kpi-card__value">{inProg}</div>
                    <div className="cs-kpi-card__meta">Active resolution</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${blockers.length ? inProg / blockers.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">Total Delay</div>
                    <div className="cs-kpi-card__value">{totalDelay}m</div>
                    <div className="cs-kpi-card__meta">Cumulative across blockers</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: '70%' }} /></div>
                </div>
            </div>

            {/* Filters */}
            <div className="cs-card cs-mb-16" style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted-fg)' }}>{ICON_SEARCH}</span>
                        <input
                            id="blocker-search"
                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--fg)' }}
                            placeholder="Search blocker, encounter…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select id="blocker-cat-filter" className="cs-btn cs-btn--ghost" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select id="blocker-status-filter" className="cs-btn cs-btn--ghost" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s === 'All Statuses' ? s : s.replace('_', ' ')}</option>)}
                    </select>
                    <span style={{ fontSize: 12, color: 'var(--muted-fg)', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Table */}
            <div className="cs-card">
                {loading ? (
                    <div className="cs-loading"><div className="cs-spinner" />Loading blockers…</div>
                ) : filtered.length === 0 ? (
                    <div className="cs-placeholder" style={{ padding: '48px' }}>
                        <div className="cs-placeholder__icon">✓</div>
                        <div className="cs-placeholder__title">No blockers found</div>
                        <div className="cs-placeholder__sub">No active blockers match your current filters.</div>
                    </div>
                ) : (
                    <div className="cs-table-wrap">
                        <table className="cs-table" aria-label="Blockers">
                            <thead>
                                <tr>
                                    <th scope="col">Blocker #</th>
                                    <th scope="col">Encounter</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Department</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Delay</th>
                                    <th scope="col">Target Time</th>
                                    <th scope="col">Overdue</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(b => (
                                    <tr key={b.sys_id} style={{ background: b.is_overdue ? 'rgba(208,60,39,0.03)' : undefined }}>
                                        <td>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{b.number || b.sys_id.slice(0, 8)}</span>
                                        </td>
                                        <td>
                                            <button
                                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}
                                                onClick={() => onEncounterClick(b.encounter)}
                                                aria-label={`View encounter ${b.encounter}`}
                                            >
                                                {b.encounter.slice(0, 12)}…
                                            </button>
                                        </td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(80,120,200,0.1)', color: 'var(--primary)' }}>
                                                {b.category_label || b.category || '—'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--muted-fg)' }}>{b.department || '—'}</td>
                                        <td style={{ fontSize: 12 }}>{b.owner || '—'}</td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: `${STATUS_COLORS[b.status] || 'var(--muted)'}1a`, color: STATUS_COLORS[b.status] || 'var(--muted-fg)' }}>
                                                {b.status_label || b.status || 'open'}
                                            </span>
                                        </td>
                                        <td>
                                            {b.estimated_delay_minutes > 0 ? (
                                                <span className="cs-table__delay">+{b.estimated_delay_minutes}m</span>
                                            ) : <span style={{ color: 'var(--muted-fg)', fontSize: 12 }}>—</span>}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{b.target_resolution_time ? formatDateTime(b.target_resolution_time) : '—'}</td>
                                        <td>
                                            {b.is_overdue ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--critical)' }}>
                                                    ⚠ Overdue
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: 11, color: 'var(--ready)' }}>On time</span>
                                            )}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <button
                                                id={`blocker-resolve-${b.sys_id}`}
                                                className="cs-btn cs-btn--ghost cs-btn--sm"
                                                onClick={() => markResolved(b)}
                                                disabled={updating === b.sys_id}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                                aria-label={`Resolve ${b.number}`}
                                            >
                                                {updating === b.sys_id ? '…' : <>{ICON_CHECK} Resolve</>}
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
