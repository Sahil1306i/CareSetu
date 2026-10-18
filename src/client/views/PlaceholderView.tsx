import React from 'react'

const VIEW_META: Record<string, { icon: string; title: string; desc: string }> = {
    'discharge-pipeline': {
        icon: '⇄',
        title: 'Discharge Pipeline',
        desc: 'Full discharge pipeline management with filtering, sorting, and bulk actions. Coming in the next UI phase.',
    },
    'encounters': {
        icon: '🪪',
        title: 'Encounters / Patients',
        desc: 'Full encounter list with advanced search, multi-ward filtering, and encounter comparison. Coming in the next UI phase.',
    },
    'tasks': {
        icon: '✓',
        title: 'Coordination Tasks',
        desc: 'Manage care coordination tasks across all wards. View overdue tasks, assign owners, and track completion. Coming in the next UI phase.',
    },
    'handoffs': {
        icon: '↔',
        title: 'Handoff Management',
        desc: 'Track and acknowledge handoffs across nursing shifts and departments. Coming in the next UI phase.',
    },
    'escalations': {
        icon: '⚠',
        title: 'Escalations',
        desc: 'Review open escalations, acknowledge critical cases, and track resolution status. Coming in the next UI phase.',
    },
    'insights': {
        icon: '◎',
        title: 'Operational Insights',
        desc: 'Analytics, trends, and discharge performance KPIs across time periods and wards. Coming in the next UI phase.',
    },
    'ai-coordinator': {
        icon: '✦',
        title: 'AI Care Coordinator',
        desc: 'Full AI-powered care coordination assistant powered by ServiceNow Now Assist. Use the panel on the Command Center to activate.',
    },
}

interface Props {
    viewName: string
    onNavigate: (view: any) => void
}

export function PlaceholderView({ viewName, onNavigate }: Props) {
    const meta = VIEW_META[viewName] || { icon: '◉', title: viewName, desc: 'This section is under development.' }

    return (
        <div className="cs-placeholder">
            <div className="cs-placeholder__icon" aria-hidden="true">{meta.icon}</div>
            <div className="cs-placeholder__title">{meta.title}</div>
            <div className="cs-placeholder__sub">{meta.desc}</div>
            <button
                id="placeholder-back"
                className="cs-btn cs-btn--ghost"
                onClick={() => onNavigate('command-center')}
                style={{ marginTop: 8 }}
            >
                ← Back to Command Center
            </button>
        </div>
    )
}
