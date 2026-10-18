import React, { useEffect, useState } from 'react'
import { fetchEncounterById, fetchLatestRiskScore, fetchEscalations } from '../service'
import { enrichEncounter, formatDateTime } from '../utils'
import type { EnrichedEncounter, Escalation } from '../types'
import type { RiskScore } from '../types'
import { RiskBadge } from '../components/RiskBadge'
import { DEMO_ENCOUNTERS } from './CommandCenter'

interface Props {
    sysId: string
    onBack: () => void
    onToggleAI?: (prompt?: string) => void
}

export function Encounter360({ sysId, onBack, onToggleAI }: Props) {
    const [enc, setEnc] = useState<EnrichedEncounter | null>(null)
    const [rs, setRs] = useState<RiskScore | null>(null)
    const [escalations, setEscalations] = useState<Escalation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDemo, setIsDemo] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)
        setEnc(null)

        if (sysId.startsWith('demo-')) {
            const d = DEMO_ENCOUNTERS.find(x => x.sys_id === sysId)
            if (d) {
                setEnc(d)
                setIsDemo(true)
                setRs({
                    sys_id: 'rs-demo',
                    encounter: sysId,
                    risk_score: String(d.riskScore),
                    risk_tier: d.riskTier,
                    explanation: d.riskExplanation || 'Demo risk explanation.',
                    data_quality_warning: '',
                    is_latest: 'true',
                    scored_at: '',
                })
                setEscalations([])
                setLoading(false)
                return
            }
        }

        setIsDemo(false)
        Promise.all([
            fetchEncounterById(sysId),
            fetchLatestRiskScore(sysId),
            fetchEscalations(sysId),
        ]).then(([raw, score, escs]) => {
            if (!raw) { setError('Encounter not found.'); setLoading(false); return }
            const riskMap = new Map<string, RiskScore>()
            if (score) riskMap.set(sysId, score)
            setEnc(enrichEncounter(raw, riskMap))
            setRs(score)
            setEscalations(escs)
            setLoading(false)
        }).catch(() => {
            setError('Failed to load encounter data.')
            setLoading(false)
        })
    }, [sysId])

    if (loading) {
        return (
            <div className="cs-loading" style={{ flex: 1 }}>
                <div className="cs-spinner" />
                Loading encounter…
            </div>
        )
    }

    if (error || !enc) {
        return (
            <div className="cs-content">
                <div className="cs-placeholder">
                    <div className="cs-placeholder__icon">⚠</div>
                    <div className="cs-placeholder__title">{error || 'Encounter not found'}</div>
                    <button id="enc360-back-error" className="cs-btn cs-btn--ghost cs-btn--sm" onClick={onBack}>
                        ← Back to Command Center
                    </button>
                </div>
            </div>
        )
    }

    const score = enc.riskScore
    const circumference = 2 * Math.PI * 30
    const dashOffset = circumference * (1 - score / 100)
    const scoreColor = enc.riskTier === 'critical' ? '#ef4444' : enc.riskTier === 'high' ? '#f97316' : enc.riskTier === 'medium' ? '#f59e0b' : '#22c55e'

    const signals = [
        { label: 'Overdue Tasks',         value: parseInt(enc.overdue_coord_tasks || '0', 10) },
        { label: 'Incomplete Milestones', value: parseInt(enc.incomplete_milestones || '0', 10) },
        { label: 'Unack Handoffs',        value: parseInt(enc.unack_handoffs || '0', 10) },
        { label: 'Open Blockers',         value: parseInt(enc.open_blockers || '0', 10) },
    ]

    const timelineItems = buildTimeline(enc, escalations)

    return (
        <div className="cs-content cs-enc360-content" style={{ padding: '28px 32px', maxWidth: 1440, width: '100%', margin: '0 auto' }}>
            {isDemo && (
                <div style={{ background: '#fef08a', color: '#854d0e', padding: '10px 16px', fontSize: 12, fontWeight: 600, textAlign: 'center', marginBottom: 20, borderRadius: 8, border: '1px solid #fde047' }}>
                    ⚠ VISUAL DEMO MODE: Showing local mock data because a real sys_id was not provided or failed to load.
                </div>
            )}

            {/* ── Top Navigation ── */}
            <div className="cs-enc360-nav" style={{ marginBottom: 16 }}>
                <button
                    id="enc360-back"
                    className="cs-enc360-back-link"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'var(--muted-fg, #64748b)',
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'color .15s ease',
                    }}
                    onClick={onBack}
                    aria-label="Back to Command Center"
                >
                    <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden="true">←</span> Command Center
                </button>
            </div>

            {/* ── Encounter Header Card ── */}
            <div
                className="cs-card cs-enc360-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 32,
                    padding: '24px 28px',
                    marginBottom: 24,
                    flexWrap: 'nowrap',
                }}
            >
                <div className="cs-enc360-header__left" style={{ minWidth: 0, flex: 1 }}>
                    <div className="cs-enc360-header__eyebrow" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-fg, #64748b)', marginBottom: 6 }}>
                        ENCOUNTER 360
                    </div>
                    <div className="cs-enc360-header__title-row" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                        <h1 className="cs-enc360-header__id" style={{ margin: 0, fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: 'var(--fg, #0f172a)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            {enc.number}
                        </h1>
                        <RiskBadge tier={enc.riskTier} showDot />
                        <span className="cs-enc360-header__score-pill" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', color: 'var(--muted-fg, #64748b)', background: 'var(--muted, #f1f5f9)', border: '1px solid var(--border, #e2e8f0)', padding: '3px 10px', borderRadius: 999 }}>
                            Risk Score: {Math.round(score)}/100
                        </span>
                        {escalations.length > 0 && (
                            <span className="cs-badge cs-badge--critical">
                                ⚠ {escalations[0].number} {escalations[0].escalation_status || 'Open'}
                            </span>
                        )}
                    </div>
                    <div className="cs-enc360-header__meta" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13, color: 'var(--muted-fg, #64748b)' }}>
                        <span className="cs-enc360-header__meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, background: 'var(--muted, #f1f5f9)', border: '1px solid var(--border, #e2e8f0)', fontSize: 12, fontWeight: 500, color: 'var(--fg, #0f172a)' }}>
                            🏥 {enc.wardBed || enc.ward || 'Unknown Ward'}
                        </span>
                        <span className="cs-enc360-header__meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, background: 'var(--muted, #f1f5f9)', border: '1px solid var(--border, #e2e8f0)', fontSize: 12, fontWeight: 500, color: 'var(--fg, #0f172a)' }}>
                            MRN: <strong>{enc.patient_mrn || '—'}</strong>
                        </span>
                        {enc.charge_nurse && (
                            <span className="cs-enc360-header__meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, background: 'var(--muted, #f1f5f9)', border: '1px solid var(--border, #e2e8f0)', fontSize: 12, fontWeight: 500, color: 'var(--fg, #0f172a)' }}>
                                👤 Nurse: <strong>{enc.charge_nurse}</strong>
                            </span>
                        )}
                        <span className="cs-enc360-header__meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, background: 'var(--muted, #f1f5f9)', border: '1px solid var(--border, #e2e8f0)', fontSize: 12, fontWeight: 500, color: 'var(--fg, #0f172a)' }}>
                            ⏱ Promised: <strong>{enc.expected_discharge_time ? formatDateTime(enc.expected_discharge_time) : 'No discharge time set'}</strong>
                        </span>
                    </div>
                </div>
                <div className="cs-enc360-header__right" style={{ display: 'flex', alignItems: 'center', gap: 32, flexShrink: 0 }}>
                    <div className="cs-enc360-stat" style={{ textAlign: 'right' }}>
                        <div className="cs-enc360-stat__label" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-fg, #64748b)', marginBottom: 4 }}>Promised Discharge</div>
                        <div className="cs-enc360-stat__val" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 24, fontWeight: 700, color: 'var(--fg, #0f172a)', lineHeight: 1.1 }}>{enc.promisedDischarge || '—'}</div>
                    </div>
                    <div className="cs-enc360-stat" style={{ textAlign: 'right' }}>
                        <div className="cs-enc360-stat__label" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-fg, #64748b)', marginBottom: 4 }}>Predicted Discharge</div>
                        <div className={`cs-enc360-stat__val ${enc.delayMinutes > 0 ? 'cs-enc360-stat__val--delay' : ''}`} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 24, fontWeight: 700, color: enc.delayMinutes > 0 ? 'var(--critical, #ef4444)' : 'var(--fg, #0f172a)', lineHeight: 1.1 }}>
                            {enc.predictedDischarge || '—'}
                        </div>
                    </div>
                    <div className="cs-enc360-stat" style={{ textAlign: 'right' }}>
                        <div className="cs-enc360-stat__label" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-fg, #64748b)', marginBottom: 4 }}>Delay</div>
                        <div className={`cs-enc360-stat__val ${enc.delayMinutes > 0 ? 'cs-enc360-stat__val--delay' : 'cs-enc360-stat__val--ontime'}`} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 24, fontWeight: 700, color: enc.delayMinutes > 0 ? 'var(--critical, #ef4444)' : 'var(--ready, #22c55e)', lineHeight: 1.1 }}>
                            {enc.delayMinutes > 0 ? `+${enc.delayMinutes} min` : 'On track'}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main 2-Column Grid ── */}
            <div
                className="cs-enc360-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.85fr) 340px',
                    gap: 24,
                    alignItems: 'start',
                    marginBottom: 24,
                }}
            >
                {/* Left: Risk Overview + Signals + Predictor */}
                <div className="cs-enc360-col-main" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Risk Overview */}
                    <div>
                        <div className="cs-section-header" style={{ marginBottom: 10 }}>
                            <span className="cs-section-title">Risk Overview</span>
                        </div>
                        <div className="cs-card cs-risk-overview-card" style={{ padding: '22px 24px' }}>
                            <div className="cs-risk-overview" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                {/* Donut */}
                                <div className="cs-score-donut" aria-label={`Risk score: ${Math.round(score)}`} style={{ position: 'relative', width: 80, height: 80, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                                    <svg className="cs-score-donut__svg" viewBox="0 0 80 80" aria-hidden="true" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                        <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                        <circle
                                            cx="40" cy="40" r="30"
                                            fill="none"
                                            stroke={scoreColor}
                                            strokeWidth="8"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={dashOffset}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                        />
                                    </svg>
                                    <div className="cs-score-donut__label" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                                        <div className="cs-score-donut__value" style={{ color: scoreColor, fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{Math.round(score)}</div>
                                        <div className="cs-score-donut__sub" style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-fg, #64748b)', marginTop: 2 }}>/ 100</div>
                                    </div>
                                </div>
                                <div className="cs-risk-overview__details" style={{ flex: 1, minWidth: 0 }}>
                                    <div className="cs-risk-overview__header" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <RiskBadge tier={enc.riskTier} showDot />
                                        <span className="cs-risk-overview__tier-text" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted-fg, #64748b)' }}>
                                            {enc.riskTier.toUpperCase()} OPERATIONAL RISK
                                        </span>
                                    </div>
                                    {rs?.explanation ? (
                                        <div className="cs-risk-overview__explanation" style={{ fontSize: 13, color: '#334155', lineHeight: 1.55 }}>{rs.explanation}</div>
                                    ) : (
                                        <div className="cs-risk-overview__explanation" style={{ fontSize: 13, color: 'var(--muted-fg, #64748b)', lineHeight: 1.55 }}>
                                            {enc.primaryBlocker !== 'None'
                                                ? `Primary blocker: ${enc.primaryBlocker}. ${score > 50 ? 'Escalation recommended.' : 'Monitor closely.'}`
                                                : 'No active blockers. Encounter on track.'}
                                        </div>
                                    )}
                                    {rs?.data_quality_warning && (
                                        <div className="cs-risk-overview__warning" style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', padding: '6px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            ⚠ {rs.data_quality_warning}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Signals */}
                    <div>
                        <div className="cs-section-header" style={{ marginBottom: 10 }}>
                            <span className="cs-section-title">Operational Signals</span>
                        </div>
                        <div
                            className="cs-signal-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 14,
                            }}
                        >
                            {signals.map(sig => {
                                const cls = sig.value === 0 ? 'ok' : sig.value <= 1 ? 'warn' : 'danger'
                                const valColor = sig.value === 0 ? 'var(--ready, #22c55e)' : sig.value <= 1 ? 'var(--risk, #f97316)' : 'var(--critical, #ef4444)'
                                return (
                                    <div
                                        key={sig.label}
                                        className="cs-signal-card"
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: 12,
                                            border: '1px solid var(--border, #e2e8f0)',
                                            boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.06))',
                                            padding: '20px 14px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div
                                            className={`cs-signal-card__value cs-signal-card__value--${cls}`}
                                            style={{
                                                fontSize: 32,
                                                fontWeight: 700,
                                                fontFamily: 'var(--font-mono, monospace)',
                                                lineHeight: 1,
                                                marginBottom: 8,
                                                color: valColor,
                                            }}
                                        >
                                            {sig.value}
                                        </div>
                                        <div
                                            className="cs-signal-card__label"
                                            style={{
                                                fontSize: 11.5,
                                                fontWeight: 600,
                                                color: 'var(--muted-fg, #64748b)',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {sig.label}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Discharge Predictor */}
                    <div>
                        <div className="cs-section-header" style={{ marginBottom: 10 }}>
                            <span className="cs-section-title">Discharge Predictor</span>
                        </div>
                        <div className="cs-card cs-predictor-card" style={{ padding: '22px 24px' }}>
                            <div className="cs-predictor-flow" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                                <TimeBlock label="Promised" time={enc.promisedDischarge} />
                                <div className="cs-predictor-arrow" style={{ fontSize: 20, color: 'var(--muted-fg, #64748b)' }} aria-hidden="true">→</div>
                                <TimeBlock label="Predicted" time={enc.predictedDischarge} highlight={enc.delayMinutes > 0} />
                                {enc.delayMinutes > 0 ? (
                                    <div
                                        className="cs-predictor-pill cs-predictor-pill--delay"
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: 999,
                                            fontFamily: 'var(--font-mono, monospace)',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            background: 'var(--critical-soft, #fef2f2)',
                                            color: 'var(--critical, #ef4444)',
                                            border: '1px solid rgba(239,68,68,0.25)',
                                        }}
                                        aria-label={`Delay: ${enc.delayMinutes} minutes`}
                                    >
                                        +{enc.delayMinutes}m Delay
                                    </div>
                                ) : (
                                    <div
                                        className="cs-predictor-pill cs-predictor-pill--ontime"
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: 999,
                                            fontFamily: 'var(--font-mono, monospace)',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            background: 'var(--ready-soft, #f0fdf4)',
                                            color: 'var(--ready, #22c55e)',
                                            border: '1px solid rgba(34,197,94,0.25)',
                                        }}
                                    >
                                        On Time
                                    </div>
                                )}
                            </div>
                            {enc.delayMinutes > 0 && (
                                <div
                                    className="cs-predictor-desc"
                                    style={{
                                        marginTop: 14,
                                        fontSize: 12,
                                        color: 'var(--muted-fg, #64748b)',
                                        borderTop: '1px solid var(--border, #e2e8f0)',
                                        paddingTop: 12,
                                    }}
                                >
                                    Estimated {enc.delayMinutes} min delay driven by {enc.primaryBlocker !== 'None' ? `${enc.primaryBlocker} blocker` : 'active operational signals'}.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Escalation Status + Actions */}
                <div className="cs-enc360-col-side" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Escalation Status */}
                    <div>
                        <div className="cs-section-header" style={{ marginBottom: 10 }}>
                            <span className="cs-section-title">Escalation Status</span>
                        </div>
                        <div className="cs-card cs-esc-card" style={{ overflow: 'hidden' }}>
                            {escalations.length === 0 ? (
                                <div className="cs-esc-empty" style={{ padding: '28px 20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 13, color: 'var(--muted-fg)' }}>No active escalations</div>
                                    <div style={{ fontSize: 11.5, color: 'var(--muted-fg)', marginTop: 4 }}>Encounter is operating within normal parameters.</div>
                                </div>
                            ) : escalations.map(esc => (
                                <div key={esc.sys_id} className="cs-esc-item" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                                    <div className="cs-esc-item__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span className="cs-esc-item__num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--critical)' }}>
                                            {esc.number}
                                        </span>
                                        <span className={`cs-badge cs-badge--${esc.risk_tier || 'unknown'}`}>{esc.escalation_status || 'Open'}</span>
                                    </div>
                                    {esc.reason && <div className="cs-esc-item__reason" style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{esc.reason}</div>}
                                    {esc.sys_created_on && (
                                        <div className="cs-esc-item__time" style={{ fontSize: 11, color: 'var(--muted-fg)', marginTop: 4 }}>
                                            Logged: {formatDateTime(esc.sys_created_on)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <div className="cs-section-header" style={{ marginBottom: 10 }}>
                            <span className="cs-section-title">Actions</span>
                        </div>
                        <div className="cs-card cs-actions-card" style={{ padding: 20 }}>
                            <div className="cs-actions-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <a
                                    id="enc360-view-record"
                                    href={`x_caresetu_ai_encounter.do?sys_id=${enc.sys_id}`}
                                    className="cs-btn cs-btn--primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open Full Record ↗
                                </a>
                                <button
                                    id="enc360-create-esc"
                                    className="cs-btn cs-btn--ghost"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => onToggleAI?.(`Create an escalation plan for encounter ${enc.number} in ${enc.wardBed}. What steps are urgent?`)}
                                >
                                    ⚠ Create Escalation
                                </button>
                                <button
                                    id="enc360-ack-handoff"
                                    className="cs-btn cs-btn--ghost"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => onToggleAI?.(`Review pending handoffs for encounter ${enc.number} and draft acknowledgement notes.`)}
                                >
                                    ↔ Acknowledge Handoff
                                </button>
                                <button
                                    id="enc360-ai-assist"
                                    className="cs-btn cs-btn--ghost"
                                    style={{ width: '100%', justifyContent: 'center', borderColor: '#a855f7', color: '#7c3aed' }}
                                    onClick={() => onToggleAI?.(`Analyze encounter ${enc.number} in ${enc.wardBed}. Provide risk breakdown and coordination next steps.`)}
                                >
                                    ✦ Ask AI Coordinator
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div>
                <div className="cs-section-header" style={{ marginBottom: 10 }}>
                    <span className="cs-section-title">Activity Timeline</span>
                </div>
                <div className="cs-card cs-timeline-card" style={{ padding: '20px 24px', marginBottom: 32 }}>
                    <div className="cs-timeline" style={{ display: 'flex', flexDirection: 'column' }}>
                        {timelineItems.map((item, i) => (
                            <div key={i} className="cs-timeline__item">
                                <div className={`cs-timeline__dot cs-timeline__dot--${item.type}`} aria-hidden="true">{item.icon}</div>
                                <div className="cs-timeline__content">
                                    <div className="cs-timeline__title">{item.title}</div>
                                    {item.desc && <div className="cs-timeline__desc">{item.desc}</div>}
                                    <div className="cs-timeline__time">{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TimeBlock({ label, time, highlight }: { label: string; time: string; highlight?: boolean }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: highlight ? '#ef4444' : '#1e293b', letterSpacing: '-0.02em', lineHeight: 1 }}>{time}</div>
        </div>
    )
}

interface TimelineItem { type: 'info' | 'warn' | 'danger' | 'ok'; icon: string; title: string; desc?: string; time: string }

function buildTimeline(enc: EnrichedEncounter, escalations: Escalation[]): TimelineItem[] {
    const items: TimelineItem[] = []

    items.push({
        type: 'info', icon: '+',
        title: 'Encounter opened',
        desc: `Encounter ${enc.number} entered discharge pipeline`,
        time: enc.sys_created_on ? formatDateTime(enc.sys_created_on) : 'Unknown',
    })

    if (parseInt(enc.overdue_coord_tasks || '0', 10) > 0) {
        items.push({
            type: 'warn', icon: '!',
            title: 'Coordination tasks overdue',
            desc: `${enc.overdue_coord_tasks} task(s) past due date`,
            time: 'Active',
        })
    }

    if (parseInt(enc.unack_handoffs || '0', 10) > 0) {
        items.push({
            type: 'warn', icon: '↔',
            title: 'Unacknowledged handoffs',
            desc: `${enc.unack_handoffs} handoff(s) awaiting acknowledgement`,
            time: 'Active',
        })
    }

    if (parseInt(enc.open_blockers || '0', 10) > 0) {
        items.push({
            type: 'danger', icon: '✕',
            title: 'Workflow blockers open',
            desc: `${enc.open_blockers} active blocker(s) preventing discharge`,
            time: 'Active',
        })
    }

    for (const esc of escalations) {
        items.push({
            type: 'danger', icon: '⚠',
            title: `Escalation created — ${esc.number}`,
            desc: esc.reason || 'Risk threshold exceeded',
            time: esc.sys_created_on ? formatDateTime(esc.sys_created_on) : 'Unknown',
        })
    }

    if (enc.riskTier === 'normal' && items.length === 1) {
        items.push({
            type: 'ok', icon: '✓',
            title: 'Encounter on track',
            desc: 'No active blockers or overdue tasks.',
            time: 'Now',
        })
    }

    return items
}
