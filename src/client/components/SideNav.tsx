import React, { useState } from 'react'

type View = string

interface Props {
    currentView: string
    onNavigate: (view: any) => void
    onToggleAI: () => void
}

// Lucide-style SVG icons as tiny inline components
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const Icons = {
    home:      <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    pipeline:  <Icon d="M22 12H2M22 12l-4-4M22 12l-4 4" />,
    encounters:<Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    tasks:     <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
    handoffs:  <Icon d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 8v8M9.5 11l2.5-3 2.5 3" />,
    escalation:<Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
    blocker:   <Icon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6" />,
    insights:  <Icon d="M18 20V10M12 20V4M6 20v-6" />,
    ai:        <Icon d="M12 2a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />,
    emergency: <Icon d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />,
    user:      <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    sparkles:  <Icon d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 3L18 7.5 14.5 9 13 12l-1.5-3L8 7.5 11.5 6 13 3zM20 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />,
    chevronRight: <Icon d="M9 18l6-6-6-6" size={12} />,
}

const NAV_MAIN = [
    { id: 'command-center',     label: 'Command Center',      icon: Icons.home },
    { id: 'discharge-pipeline', label: 'Discharge Pipeline',  icon: Icons.pipeline },
    { id: 'encounters',         label: 'Encounters',          icon: Icons.encounters },
]

const NAV_OPS = [
    { id: 'tasks',       label: 'Coordination Tasks', icon: Icons.tasks },
    { id: 'handoffs',    label: 'Handoffs',           icon: Icons.handoffs },
    { id: 'blockers',    label: 'Blockers',           icon: Icons.blocker },
    { id: 'escalations', label: 'Escalations',        icon: Icons.escalation, badge: 2 },
]

const NAV_INTEL = [
    { id: 'insights',       label: 'Operational Insights', icon: Icons.insights },
    { id: 'ai-coordinator', label: 'AI Care Coordinator',  icon: Icons.ai,        dot: true },
    { id: 'emergency',      label: 'Emergency Mode',       icon: Icons.emergency, emergency: true },
]

export function SideNav({ currentView, onNavigate, onToggleAI }: Props) {
    const renderItem = (item: any) => {
        const isActive = currentView === item.id
        const isEmergency = item.emergency
        const isAI = item.id === 'ai-coordinator'

        let cls = `cs-sidenav__item${isActive ? ' cs-sidenav__item--active' : ''}`
        if (isEmergency) cls += ' cs-sidenav__item--emergency'

        const handleClick = isAI
            ? () => onToggleAI()
            : () => onNavigate(item.id)

        return (
            <button
                key={item.id}
                id={`nav-${item.id}`}
                className={cls}
                onClick={handleClick}
                aria-current={isActive ? 'page' : undefined}
            >
                <span
                    className={`cs-sidenav__item-icon${isEmergency ? ' cs-sidenav__emergency-icon' : isAI ? ' cs-sidenav__ai-icon' : ''}`}
                >
                    {item.icon}
                </span>
                {item.label}
                {item.badge != null && (
                    <span className="cs-sidenav__badge" aria-label={`${item.badge} items`}>{item.badge}</span>
                )}
                {item.dot && !item.badge && (
                    <span className="cs-sidenav__item-dot" aria-hidden="true" />
                )}
            </button>
        )
    }

    return (
        <nav className="cs-sidenav" aria-label="CareSetu navigation">
            {/* Logo */}
            <div className="cs-sidenav__logo">
                <div className="cs-sidenav__logo-mark" aria-hidden="true">
                    {Icons.sparkles}
                </div>
                <div>
                    <div className="cs-sidenav__logo-name">CareSetu AI</div>
                    <div className="cs-sidenav__logo-sub">Discharge Ops</div>
                </div>
            </div>

            {/* Navigation */}
            <div className="cs-sidenav__nav">
                <div className="cs-sidenav__section-label">Main</div>
                {NAV_MAIN.map(renderItem)}

                <div className="cs-sidenav__section-label">Operations</div>
                {NAV_OPS.map(renderItem)}

                <div className="cs-sidenav__section-label">Intelligence</div>
                {NAV_INTEL.map(renderItem)}
            </div>

            {/* Footer */}
            <div className="cs-sidenav__footer">
                <div className="cs-sidenav__footer-name">
                    <span aria-hidden="true">{Icons.user}</span>
                    Charge Nurse
                </div>
                <div className="cs-sidenav__footer-sub">St. Mary's General Hospital</div>
            </div>
        </nav>
    )
}
