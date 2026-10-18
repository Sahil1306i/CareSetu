import React, { useState } from 'react'

type View = string

interface Props {
    onNavigate: (view: any) => void
    onToggleAI: (prompt?: string) => void
}

const SVG = ({ d, size = 20 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const ICONS = {
    alert:    <SVG d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
    bed:      <SVG d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    users:    <SVG d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    activity: <SVG d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    phone:    <SVG d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
    shield:   <SVG d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    route:    <SVG d="M3 17l6-6 4 4 8-9M3 17h18" />,
    sparkles: <SVG d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 3L18 7.5 14.5 9 13 12l-1.5-3L8 7.5 11.5 6 13 3zM20 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />,
    checklist:<SVG d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
    broadcast:<SVG d="M16.24 7.76A6 6 0 1 1 7.76 16.24M18 6l-2 2M6 18l-2 2M21 12a9 9 0 1 0-18 0" />,
    check:    <SVG d="M22 11.08V12a10 10 0 1 1-5.93-9.14" size={16} />,
    arrow:    <SVG d="M5 12h14M12 5l7 7-7 7" size={14} />,
}

// Static emergency metrics — in a real implementation these would come from
// emergency-specific ServiceNow REST endpoints
const METRICS = [
    { label: 'Critical Encounters',   value: 14,   variant: 'critical', pct: 60, sub: '+6 in last hour', pulse: true },
    { label: 'Blocked Beds',          value: 23,   variant: 'risk',     pct: 44, sub: '23 of 52 occupied' },
    { label: 'Ready for Discharge',   value: 8,    variant: 'ready',    pct: 15, sub: '8 awaiting clearance' },
    { label: 'Staff on Alert',        value: 47,   variant: 'live',     pct: 78, sub: 'All wards notified' },
    { label: 'Incoming Transfers',    value: 12,   variant: 'default',  pct: 40, sub: 'ETA: within 2h' },
    { label: 'Avg Wait (hrs)',        value: 3.2,  variant: 'risk',     pct: 65, sub: 'Target: ≤ 2h' },
]

const BAR_COLORS: Record<string, string> = {
    critical: 'var(--critical)',
    risk:     'var(--risk)',
    ready:    'var(--ready)',
    live:     'var(--live)',
    default:  'var(--primary)',
}

const ISSUES = [
    { level: 'critical', icon: ICONS.alert,    title: 'ICU at 98% capacity',           sub: '2 beds available — incoming transfer ETA 45min' },
    { level: 'critical', icon: ICONS.alert,    title: '14 TPA authorizations pending',  sub: 'Insurance desk response time avg +2.5h over SLA' },
    { level: 'risk',     icon: ICONS.activity, title: 'Pharmacy queue backed up',       sub: '23 reconciliation requests, ETA +3h' },
    { level: 'risk',     icon: ICONS.users,    title: 'ICU handoff SLAs breaching',     sub: '6 unacknowledged handoffs — escalation required' },
    { level: 'ready',    icon: ICONS.check,    title: '8 patients cleared for discharge',sub: 'Awaiting transport coordination' },
]

const ACTIONS = [
    { icon: ICONS.phone,     title: 'Activate Incident Command',  sub: 'Notify charge nurses and HOD', hint: 'Trigger protocol' },
    { icon: ICONS.shield,    title: 'Emergency Bed Reallocation', sub: 'Override normal allocation rules', hint: 'View bed map' },
    { icon: ICONS.broadcast, title: 'Staff Broadcast',            sub: 'Send alert to all on-duty staff', hint: 'Send alert' },
    { icon: ICONS.route,     title: 'Diversion Protocol',         sub: 'Route incoming to partner hospitals', hint: 'Initiate' },
    { icon: ICONS.checklist, title: 'Mass Discharge Checklist',   sub: 'Fast-track 8 cleared patients', hint: 'Open checklist' },
]

export function EmergencyView({ onNavigate, onToggleAI }: Props) {
    const [activeAction, setActiveAction] = useState<number | null>(null)

    return (
        <div className="cs-content">
            <div className="cs-emergency-content">
                {/* Header */}
                <div className="cs-page-header">
                    <div className="cs-page-header__row">
                        <div>
                            <div className="cs-page-header__eyebrow" style={{ color: 'var(--navy-muted)' }}>
                                Emergency Operations
                            </div>
                            <h1 className="cs-page-header__title cs-page-header__title--emg">
                                Emergency Mode — Active
                            </h1>
                            <p className="cs-page-header__subtitle cs-page-header__subtitle--emg">
                                Real-time situational overview · All wards · Auto-refresh 30s
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="cs-btn cs-btn--ghost" style={{ color: 'var(--navy-fg)', borderColor: 'var(--navy-2)' }} onClick={() => onNavigate('command-center')}>
                                Exit Emergency Mode
                            </button>
                            <button
                                className="cs-btn cs-btn--primary"
                                onClick={() => onToggleAI('What is the current emergency status? What should I prioritize?')}
                            >
                                {ICONS.sparkles} AI Briefing
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="cs-emergency-metrics" role="region" aria-label="Emergency metrics">
                    {METRICS.map((m) => (
                        <div
                            key={m.label}
                            className={`cs-emergency-metric${m.pulse ? ' cs-emergency-metric--pulse' : ''}`}
                        >
                            <div className="cs-emergency-metric__label">{m.label}</div>
                            <div className={`cs-emergency-metric__value cs-emergency-metric__value--${m.variant}`}>
                                {m.value}
                            </div>
                            <div className="cs-emergency-metric__bar">
                                <div
                                    className="cs-emergency-metric__bar-fill"
                                    style={{
                                        width: `${m.pct}%`,
                                        background: BAR_COLORS[m.variant] || BAR_COLORS.default,
                                    }}
                                />
                            </div>
                            <div className="cs-emergency-metric__sub">{m.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Two-column: issues + ai summary */}
                <div className="cs-emergency-two-col">
                    {/* Active issues */}
                    <div className="cs-emergency-panel">
                        <div className="cs-card__title-bar" style={{ padding: '0 0 14px 0', background: 'transparent', border: 'none' }}>
                            <span className="cs-card__title cs-card__title--navy">Active Issues</span>
                            <span style={{ fontSize: 11, color: 'var(--navy-muted)' }}>{ISSUES.length} open</span>
                        </div>
                        {ISSUES.map((issue, i) => (
                            <div key={i} className="cs-emergency-issue">
                                <span className={`cs-emergency-issue__icon--${issue.level}`}>{issue.icon}</span>
                                <div>
                                    <div className="cs-emergency-issue__title">{issue.title}</div>
                                    <div className="cs-emergency-issue__sub">{issue.sub}</div>
                                </div>
                                <div className={`cs-emergency-issue__dot cs-emergency-issue__dot--${issue.level}`} aria-hidden="true" />
                            </div>
                        ))}
                    </div>

                    {/* AI situational briefing card */}
                    <div className="cs-emergency-panel">
                        <div className="cs-card__title-bar" style={{ padding: '0 0 14px 0', background: 'transparent', border: 'none' }}>
                            <span className="cs-card__title cs-card__title--navy" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {ICONS.sparkles} AI Situational Briefing
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--live)' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--live)', display: 'inline-block' }} />
                                Live
                            </span>
                        </div>
                        <div style={{ background: 'var(--navy)', borderRadius: 10, padding: 16, fontSize: 13, lineHeight: 1.7, color: 'var(--navy-muted)', marginBottom: 16 }}>
                            <strong style={{ color: 'var(--navy-fg)' }}>Critical path summary:</strong> ICU capacity breach is the primary constraint. 14 TPA holds are creating a cascade of bed unavailability. Recommend immediate escalation to insurance desk supervisor and activating 8 cleared-patient fast-track discharge protocol to free 8 beds within 90 minutes.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                'What should I prioritize right now?',
                                'Which patients can be fast-tracked?',
                                'How do I resolve the TPA backlog?',
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    className="cs-ai-card__prompt"
                                    style={{ color: 'var(--navy-fg)', background: 'var(--navy)', borderColor: 'var(--navy-2)' }}
                                    onClick={() => onToggleAI(q)}
                                >
                                    {q}
                                    <span aria-hidden="true">{ICONS.arrow}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            className="cs-btn cs-btn--primary"
                            style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                            onClick={() => onToggleAI('Give me a full emergency status briefing')}
                        >
                            {ICONS.sparkles} Open AI Care Coordinator
                        </button>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="cs-emergency-panel" style={{ marginBottom: 0 }}>
                    <div className="cs-card__title-bar" style={{ padding: '0 0 14px 0', background: 'transparent', border: 'none' }}>
                        <span className="cs-card__title cs-card__title--navy">Emergency Actions</span>
                    </div>
                    <div className="cs-emergency-actions">
                        {ACTIONS.map((a, i) => (
                            <button
                                key={i}
                                id={`emergency-action-${i}`}
                                className="cs-emergency-action-btn"
                                onClick={() => setActiveAction(activeAction === i ? null : i)}
                                aria-pressed={activeAction === i}
                            >
                                <div className="cs-emergency-action-btn__icon">{a.icon}</div>
                                <div className="cs-emergency-action-btn__title">{a.title}</div>
                                <div className="cs-emergency-action-btn__sub">{a.sub}</div>
                                <div className="cs-emergency-action-btn__hint">{a.hint} →</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
