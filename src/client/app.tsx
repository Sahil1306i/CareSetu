import React, { useState, useEffect, useCallback } from 'react'
import './app.css'
import { CommandCenter } from './views/CommandCenter'
import { Encounter360 }  from './views/Encounter360'
import { EmergencyView } from './views/EmergencyView'
import { PlaceholderView } from './views/PlaceholderView'
import { SideNav } from './components/SideNav'
import { AIPanel } from './components/AIPanel'
import { DischargePipeline } from './views/DischargePipeline'
import { EncounterList } from './views/EncounterList'
import { BlockersView } from './views/BlockersView'
import { EscalationsView } from './views/EscalationsView'
import { InsightsView } from './views/InsightsView'

type View =
    | 'command-center'
    | 'discharge-pipeline'
    | 'encounters'
    | 'tasks'
    | 'handoffs'
    | 'escalations'
    | 'insights'
    | 'ai-coordinator'
    | 'emergency'
    | 'encounter-detail'
    | 'blockers'

function readParams(): { view: View; id: string | null } {
    const p = new URLSearchParams(window.location.search)
    return {
        view: (p.get('view') as View) || 'command-center',
        id: p.get('id'),
    }
}

// Live clock hook
function useClock() {
    const [time, setTime] = useState(() =>
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    )
    useEffect(() => {
        const t = setInterval(() => setTime(
            new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
        ), 1000)
        return () => clearInterval(t)
    }, [])
    return time
}

const SVG = ({ d, size = 14 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)
const ICON_BELL     = <SVG d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
const ICON_SPARKLES = <SVG d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 3L18 7.5 14.5 9 13 12l-1.5-3L8 7.5 11.5 6 13 3zM20 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />

export default function App() {
    const [{ view, id }, setRouteState] = useState(readParams)
    const [aiOpen,       setAiOpen]     = useState(false)
    const [aiPrompt,     setAiPrompt]   = useState<string | undefined>()
    const [lastUpdated,  setLastUpdated] = useState('')
    const clock = useClock()

    const isEmergency = view === 'emergency'

    useEffect(() => {
        const handler = () => setRouteState(readParams())
        window.addEventListener('popstate', handler)
        return () => window.removeEventListener('popstate', handler)
    }, [])

    const navigateTo = useCallback((v: View, params: Record<string, string> = {}) => {
        const p = new URLSearchParams({ view: v, ...params })
        if (window.self !== window.top) {
            ;(window as any).CustomEvent?.fireTop?.('magellanNavigator.permalink.set', {
                relativePath: `${window.location.pathname}?${p}`,
                title: 'CareSetu Command Center',
            })
        }
        window.history.pushState({ view: v, ...params }, '', `?${p}`)
        setRouteState({ view: v, id: params.id || null })
    }, [])

    const onEncounterClick = useCallback((sysId: string) => {
        navigateTo('encounter-detail', { id: sysId })
    }, [navigateTo])

    const openAI = useCallback((prompt?: string) => {
        setAiPrompt(prompt)
        setAiOpen(true)
    }, [])

    // Breadcrumb label for current view
    const VIEW_LABELS: Record<string, string> = {
        'command-center':     'Command Center',
        'discharge-pipeline': 'Discharge Pipeline',
        'encounters':         'Encounters',
        'tasks':              'Coordination Tasks',
        'handoffs':           'Handoffs',
        'escalations':        'Escalations',
        'insights':           'Operational Insights',
        'ai-coordinator':     'AI Care Coordinator',
        'emergency':          'Emergency Operations',
        'encounter-detail':   'Encounter 360°',
        'blockers':           'Blockers',
    }

    return (
        <div className={`cs-app${isEmergency ? ' cs-app--emergency' : ''}`}>
            <SideNav currentView={view} onNavigate={navigateTo} onToggleAI={() => openAI()} />

            <div className="cs-main">
                {/* Top bar */}
                <header className="cs-topbar">
                    <span className="cs-topbar__title">
                        CareSetu AI <span className="cs-topbar__title-muted">/ {VIEW_LABELS[view] || view}</span>
                    </span>

                    {isEmergency ? (
                        <div className="cs-topbar__status-emergency">
                            <span className="cs-topbar__status-dot cs-topbar__status-dot--pulse" aria-hidden="true" />
                            Emergency Mode Active
                        </div>
                    ) : (
                        <div className="cs-topbar__status-ok">
                            <span className="cs-topbar__status-dot" aria-hidden="true" />
                            Normal Operations
                        </div>
                    )}

                    <span className="cs-topbar__hospital">St. Mary's General Hospital</span>

                    <div className="cs-topbar__right">
                        <span className="cs-topbar__clock" aria-label="Current time">{clock}</span>
                        <span className="cs-topbar__updated">IST</span>
                        <button
                            id="topbar-notif"
                            className="cs-topbar__notif-btn"
                            aria-label="Notifications"
                        >
                            {ICON_BELL}
                            <span className="cs-topbar__notif-dot" aria-hidden="true" />
                        </button>
                        <button
                            id="topbar-ai"
                            className="cs-topbar__ai-btn"
                            onClick={() => openAI()}
                        >
                            {ICON_SPARKLES}
                            Ask AI
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className={`cs-content-wrap${isEmergency ? ' cs-content--emergency' : ''}`}>
                    {view === 'command-center' && (
                        <CommandCenter onEncounterClick={onEncounterClick} onToggleAI={() => openAI()} />
                    )}
                    {view === 'encounter-detail' && id && (
                        <Encounter360 sysId={id} onBack={() => navigateTo('command-center')} onToggleAI={openAI} />
                    )}
                    {view === 'emergency' && (
                        <EmergencyView onNavigate={navigateTo} onToggleAI={openAI} />
                    )}
                    {view === 'discharge-pipeline' && (
                        <DischargePipeline onEncounterClick={onEncounterClick} onToggleAI={openAI} />
                    )}
                    {view === 'encounters' && (
                        <EncounterList onEncounterClick={onEncounterClick} onToggleAI={openAI} />
                    )}
                    {view === 'blockers' && (
                        <BlockersView onEncounterClick={onEncounterClick} onToggleAI={openAI} />
                    )}
                    {view === 'escalations' && (
                        <EscalationsView onEncounterClick={onEncounterClick} onToggleAI={openAI} />
                    )}
                    {view === 'insights' && (
                        <InsightsView onEncounterClick={onEncounterClick} onToggleAI={openAI} />
                    )}
                    {(view === 'tasks' || view === 'handoffs') && (
                        <PlaceholderView viewName={view} onNavigate={navigateTo} />
                    )}
                </div>
            </div>

            <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} initialPrompt={aiPrompt} />
        </div>
    )
}
