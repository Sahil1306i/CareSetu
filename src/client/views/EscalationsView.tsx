import React, { useEffect, useState, useMemo } from 'react'
import { fetchAllEscalations } from '../service'
import type { Escalation } from '../types'
import { RiskBadge } from '../components/RiskBadge'
import type { RiskTier } from '../types'
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
const ICON_REFRESH = <SVG d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
const ICON_ARROW   = <SVG d="M5 12h14M12 5l7 7-7 7" size={12} />

const TIER_PRIORITY: Record<string, number> = { critical: 4, high: 3, medium: 2, normal: 1, unknown: 0 }

export function EscalationsView({ onEncounterClick, onToggleAI }: Props) {
    const [escalations, setEscalations] = useState<Escalation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tierFilter, setTierFilter] = useState<string>('all')

    useEffect(() => { loadData() }, [])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            setEscalations(await fetchAllEscalations())
        } catch {
            setError('Unable to load escalations.')
        }
        setLoading(false)
    }

    const sorted = useMemo(() => {
        let data = escalations
        if (tierFilter !== 'all') data = data.filter(e => e.risk_tier === tierFilter)
        return [...data].sort((a, b) => (TIER_PRIORITY[b.risk_tier] || 0) - (TIER_PRIORITY[a.risk_tier] || 0))
    }, [escalations, tierFilter])

    const critical = escalations.filter(e => e.risk_tier === 'critical').length
    const high     = escalations.filter(e => e.risk_tier === 'high').length
    const open     = escalations.filter(e => e.escalation_status === 'open' || !e.escalation_status).length

    return (
        <div className="cs-content">
            {/* Header */}
            <div className="cs-page-header">
                <div className="cs-page-header__row">
                    <div>
                        <div className="cs-page-header__eyebrow">Operations</div>
                        <h1 className="cs-page-header__title">Escalations</h1>
                        <p className="cs-page-header__subtitle">{escalations.length} active escalation{escalations.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="cs-btn cs-btn--ghost" onClick={loadData}>{ICON_REFRESH} Refresh</button>
                        <button className="cs-btn cs-btn--primary" onClick={() => onToggleAI('Which escalations need immediate attention right now?')}>
                            ✦ AI Triage
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="cs-error-banner">⚠ {error}</div>}

            {/* Stats */}
            <div className="cs-kpi-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
                <div className="cs-kpi-card cs-kpi-card--critical">
                    <div className="cs-kpi-card__eyebrow">Critical</div>
                    <div className="cs-kpi-card__value">{critical}</div>
                    <div className="cs-kpi-card__meta">Immediate action</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${escalations.length ? critical / escalations.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--risk">
                    <div className="cs-kpi-card__eyebrow">High Risk</div>
                    <div className="cs-kpi-card__value">{high}</div>
                    <div className="cs-kpi-card__meta">Urgent review</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${escalations.length ? high / escalations.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--total">
                    <div className="cs-kpi-card__eyebrow">Open</div>
                    <div className="cs-kpi-card__value">{open}</div>
                    <div className="cs-kpi-card__meta">Unresolved</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: `${escalations.length ? open / escalations.length * 100 : 0}%` }} /></div>
                </div>
                <div className="cs-kpi-card cs-kpi-card--total">
                    <div className="cs-kpi-card__eyebrow">Total</div>
                    <div className="cs-kpi-card__value">{escalations.length}</div>
                    <div className="cs-kpi-card__meta">All active</div>
                    <div className="cs-kpi-card__bar"><div className="cs-kpi-card__bar-fill" style={{ width: '100%' }} /></div>
                </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['all', 'critical', 'high', 'medium', 'normal'].map(t => (
                    <button
                        key={t}
                        id={`esc-filter-${t}`}
                        className={tierFilter === t ? 'cs-btn cs-btn--primary cs-btn--sm' : 'cs-btn cs-btn--ghost cs-btn--sm'}
                        onClick={() => setTierFilter(t)}
                    >
                        {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                        {t !== 'all' && <span style={{ marginLeft: 4, opacity: 0.7 }}>({escalations.filter(e => e.risk_tier === t).length})</span>}
                    </button>
                ))}
            </div>

            {/* Cards */}
            {loading ? (
                <div className="cs-loading"><div className="cs-spinner" />Loading escalations…</div>
            ) : sorted.length === 0 ? (
                <div className="cs-placeholder">
                    <div className="cs-placeholder__icon">✓</div>
                    <div className="cs-placeholder__title">No escalations</div>
                    <div className="cs-placeholder__sub">No active escalations match the selected tier.</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sorted.map(esc => (
                        <div
                            key={esc.sys_id}
                            className={`cs-attention-card cs-attention-card--${esc.risk_tier || 'unknown'}`}
                            id={`esc-card-${esc.sys_id}`}
                        >
                            <div className="cs-attention-card__top">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{esc.number}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-fg)' }}>
                                        Encounter: {esc.encounter ? esc.encounter.slice(0, 16) + '…' : '—'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    <RiskBadge tier={(esc.risk_tier as RiskTier) || 'unknown'} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>
                                        Score: {esc.risk_score || '—'}
                                    </span>
                                </div>
                            </div>

                            {esc.reason && (
                                <div style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, marginBottom: 12, padding: '10px 12px', background: 'var(--muted)', borderRadius: 8 }}>
                                    {esc.reason}
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, color: 'var(--muted-fg)' }}>
                                <span>
                                    Status: <strong style={{ color: esc.escalation_status === 'open' ? 'var(--critical)' : 'var(--fg)' }}>
                                        {esc.escalation_status || 'Open'}
                                    </strong>
                                </span>
                                <span>Created: {formatDateTime(esc.sys_created_on)}</span>
                            </div>

                            <div className="cs-attention-card__actions" style={{ marginTop: 14 }}>
                                <button
                                    id={`esc-view-enc-${esc.sys_id}`}
                                    className="cs-btn cs-btn--ghost cs-btn--sm"
                                    onClick={() => esc.encounter && onEncounterClick(esc.encounter)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    View Encounter {ICON_ARROW}
                                </button>
                                <button
                                    id={`esc-ai-${esc.sys_id}`}
                                    className="cs-btn cs-btn--ghost cs-btn--sm"
                                    onClick={() => onToggleAI(`Explain escalation ${esc.number}: ${esc.reason}`)}
                                >
                                    ✦ Ask AI
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
