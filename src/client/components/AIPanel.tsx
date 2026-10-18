import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    queryAICoordinator,
    approveActionRequest,
    rejectActionRequest,
    type ActionProposal,
} from '../service'

interface Props {
    open: boolean
    onClose: () => void
    initialPrompt?: string
}

const SVG = ({ d, size = 16 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const ICON_SPARKLES = <SVG d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 3L18 7.5 14.5 9 13 12l-1.5-3L8 7.5 11.5 6 13 3zM20 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
const ICON_X        = <SVG d="M18 6L6 18M6 6l12 12" />
const ICON_SEND     = <SVG d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
const ICON_ARROW    = <SVG d="M5 12h14M12 5l7 7-7 7" size={12} />

const INITIAL_INSIGHT = `3 encounters are at critical discharge risk today. ICU ward has 2 high-priority cases with overdue coordination tasks. Recommend immediate review of ENC1000007 — 2 open blockers and unacknowledged handoff.`

const QUESTIONS = [
    'Fix it for me',
    'What should I prioritize right now?',
    'Explain the discharge risk for ENC1000007',
    'What is the current emergency status?',
    'What is blocking discharge?',
    'Show me critical cases',
    'Who are you?',
]

interface Message {
    role: 'user' | 'ai'
    text: string
    proposals?: ActionProposal[]
}

/**
 * ActionProposalCard — Interactive human approval card for proposed operational actions.
 */
function ActionProposalCard({
    proposal,
    onUpdated,
}: {
    proposal: ActionProposal
    onUpdated: (updated: ActionProposal) => void
}) {
    const [status, setStatus] = useState(proposal.status)
    const [result, setResult] = useState<any>(proposal.execution_result || null)
    const [error, setError] = useState<string>(proposal.failure_reason || '')
    const [notes, setNotes] = useState('')
    const [busy, setBusy] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const badgeClass =
        proposal.action_type === 'reassign_blocker'
            ? 'cs-action-badge--reassign'
            : proposal.action_type === 'escalate_blocker'
            ? 'cs-action-badge--escalate'
            : 'cs-action-badge--tpa'

    const badgeLabel =
        proposal.action_type === 'reassign_blocker'
            ? 'Reassign Blocker'
            : proposal.action_type === 'escalate_blocker'
            ? 'Escalate Blocker'
            : 'Record TPA Follow-Up'

    const statusClass =
        status === 'completed'
            ? 'cs-action-status--completed'
            : status === 'executing'
            ? 'cs-action-status--executing'
            : status === 'rejected'
            ? 'cs-action-status--rejected'
            : status === 'failed'
            ? 'cs-action-status--failed'
            : 'cs-action-status--pending'

    const statusLabel =
        status === 'completed'
            ? 'Completed'
            : status === 'executing'
            ? 'Executing…'
            : status === 'rejected'
            ? 'Rejected'
            : status === 'failed'
            ? 'Failed'
            : 'Pending Approval'

    // Formatted change diff
    let changeSummary = ''
    if (proposal.action_type === 'reassign_blocker') {
        const p = proposal.proposed_parameters || {}
        changeSummary = `Reassign owner to ${p.new_owner_name || 'Charge Nurse'} · Status to In Progress`
    } else if (proposal.action_type === 'escalate_blocker') {
        changeSummary = `Set blocker status to Escalated (is_overdue = true) · Sync hospital escalation`
    } else if (proposal.action_type === 'record_tpa_followup') {
        changeSummary = `Log coordinator follow-up note · Increment follow-up count & recalculate SLA`
    }

    async function handleApprove() {
        if (busy) return
        setBusy(true)
        setStatus('executing')
        setError('')
        try {
            const res = await approveActionRequest(proposal.sys_id, notes)
            if (res.success) {
                setStatus('completed')
                setResult(res.result)
                onUpdated({
                    ...proposal,
                    status: 'completed',
                    execution_result: res.result,
                })
            } else {
                setStatus('failed')
                setError(res.error || 'Execution failed')
                onUpdated({
                    ...proposal,
                    status: 'failed',
                    failure_reason: res.error,
                })
            }
        } catch (e: any) {
            setStatus('failed')
            setError(e.message || 'Execution error')
        } finally {
            setBusy(false)
        }
    }

    async function handleReject() {
        if (busy) return
        const reason = notes.trim() || 'Rejected by operational coordinator.'
        setBusy(true)
        setError('')
        try {
            const res = await rejectActionRequest(proposal.sys_id, reason)
            if (res.success) {
                setStatus('rejected')
                onUpdated({
                    ...proposal,
                    status: 'rejected',
                    rejection_reason: reason,
                })
            } else {
                setError(res.error || 'Rejection failed')
            }
        } catch (e: any) {
            setError(e.message || 'Rejection error')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="cs-action-card">
            {/* Top row */}
            <div className="cs-action-card__top">
                <div className="cs-action-card__badge-row">
                    <span className={`cs-action-badge ${badgeClass}`}>{badgeLabel}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>
                        {proposal.number}
                    </span>
                </div>
                <span className={`cs-action-status ${statusClass}`}>{statusLabel}</span>
            </div>

            {/* Title & Target */}
            <div className="cs-action-card__title">{proposal.title}</div>
            <div className="cs-action-card__meta">
                {proposal.encounter_number ? `Encounter: ${proposal.encounter_number}` : ''}
                {proposal.target_table ? ` · Target: ${proposal.target_table}` : ''}
            </div>

            {/* Rationale */}
            <div className="cs-action-card__rationale">
                <strong>Operational Rationale:</strong> {proposal.rationale}
            </div>

            {/* What will change */}
            <div className="cs-action-card__diff">
                <span className="cs-action-card__diff-label">Proposed Record Change</span>
                {changeSummary}
            </div>

            {/* Actions or Outcomes */}
            {status === 'pending_approval' && (
                <>
                    <input
                        className="cs-action-card__notes-input"
                        placeholder="Optional coordinator notes or rejection reason…"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        disabled={busy}
                    />
                    <div className="cs-action-card__btn-row">
                        <button
                            className="cs-action-btn-approve"
                            onClick={handleApprove}
                            disabled={busy}
                        >
                            {busy ? 'Executing…' : 'Approve & Execute'}
                        </button>
                        <button
                            className="cs-action-btn-reject"
                            onClick={handleReject}
                            disabled={busy}
                        >
                            Reject
                        </button>
                        <button
                            className="cs-action-btn-details"
                            onClick={() => setShowDetails(!showDetails)}
                            type="button"
                        >
                            {showDetails ? 'Hide Details' : 'Review Details'}
                        </button>
                    </div>
                </>
            )}

            {status === 'completed' && (
                <div className="cs-action-card__result-box">
                    <strong>✅ Verified in ServiceNow:</strong> Action executed successfully.
                    {result && typeof result === 'object' && (
                        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
                            {result.action_performed ? `Operation: ${result.action_performed}` : ''}
                            {result.new_owner_name ? ` · New Owner: ${result.new_owner_name}` : ''}
                            {result.new_status ? ` · Status: ${result.new_status}` : ''}
                            {result.followup_count ? ` · Follow-up #${result.followup_count}` : ''}
                            {result.next_followup_due ? ` · Next Due: ${result.next_followup_due}` : ''}
                        </div>
                    )}
                </div>
            )}

            {status === 'rejected' && (
                <div className="cs-action-card__rejected-box">
                    <strong>⛔ Action Rejected:</strong> Target record remains unchanged.
                    {proposal.rejection_reason && ` (${proposal.rejection_reason})`}
                </div>
            )}

            {status === 'failed' && (
                <div className="cs-action-card__error-box">
                    <strong>❌ Execution Failed:</strong> {error || 'ServiceNow workflow rejected this action.'}
                </div>
            )}

            {showDetails && (
                <div className="cs-action-card__details-box">
                    <div>Parameters: {JSON.stringify(proposal.proposed_parameters, null, 2)}</div>
                    <div style={{ marginTop: 4 }}>Target Record: {proposal.target_record}</div>
                    {proposal.snapshot_state && (
                        <div style={{ marginTop: 4 }}>
                            Snapshot at Proposal: {JSON.stringify(proposal.snapshot_state, null, 2)}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export function AIPanel({ open, onClose, initialPrompt }: Props) {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const bodyRef = useRef<HTMLDivElement>(null)
    const isAtBottomRef = useRef(true)
    const prevMessagesLenRef = useRef(0)
    const bottomAnchorRef = useRef<HTMLDivElement>(null)

    // Smooth scroll to bottom helper
    const scrollToBottom = useCallback((smooth = true) => {
        if (!bodyRef.current) return
        try {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            })
        } catch (_) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [])

    // Track user scroll position so we don't drag them down if they scrolled up to read history
    const handleScroll = useCallback(() => {
        const el = bodyRef.current
        if (!el) return
        const threshold = 70
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
        isAtBottomRef.current = distanceFromBottom <= threshold
    }, [])

    // Scroll when messages change, but ONLY if user is already at/near bottom
    useEffect(() => {
        const hasNewMessages = messages.length > prevMessagesLenRef.current
        prevMessagesLenRef.current = messages.length

        if (hasNewMessages && isAtBottomRef.current) {
            const raf = requestAnimationFrame(() => {
                scrollToBottom(true)
            })
            return () => cancelAnimationFrame(raf)
        }
    }, [messages, scrollToBottom])

    // Scroll when loading indicator appears, if at bottom
    useEffect(() => {
        if (loading && isAtBottomRef.current) {
            const raf = requestAnimationFrame(() => {
                scrollToBottom(true)
            })
            return () => cancelAnimationFrame(raf)
        }
    }, [loading, scrollToBottom])

    // Initial scroll when panel opens
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                if (isAtBottomRef.current) {
                    scrollToBottom(false)
                }
            }, 60)
            return () => clearTimeout(timer)
        }
    }, [open, scrollToBottom])

    // If a prompt is passed in (from another component), send it automatically
    useEffect(() => {
        if (initialPrompt && open) {
            sendMessage(initialPrompt)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt, open])

    async function sendMessage(text: string) {
        const trimmed = text.trim()
        if (!trimmed || loading) return

        // User explicitly sent a message: follow conversation down
        isAtBottomRef.current = true

        const userMsg: Message = { role: 'user', text: trimmed }
        setMessages(m => [...m, userMsg])
        setInput('')

        // Ensure user message is immediately scrolled into view
        requestAnimationFrame(() => scrollToBottom(true))

        const lower = trimmed.toLowerCase()

        // 1. Client-side identity handling: quick and avoids unnecessary backend calls
        if (
            lower.includes('who are you') ||
            lower.includes('who are u') ||
            lower.includes('what are you') ||
            lower.includes('what do you do') ||
            lower.includes('introduce yourself')
        ) {
            const aiMsg: Message = {
                role: 'ai',
                text: "I'm CareSetu AI, your hospital operations and discharge coordination assistant. I help teams identify discharge delays, coordinate handoffs, track blockers and prioritize operational follow-ups.",
            }
            setMessages(m => [...m, aiMsg])
            return
        }

        // 2. Call live ServiceNow AI Care Coordinator REST endpoint
        setLoading(true)
        try {
            const res = await queryAICoordinator(trimmed)
            let replyText = res.response

            if (!res.success && !replyText) {
                if (res.query_type === 'permission_error') {
                    replyText = 'Access Error: Your account does not have authorization to view CareSetu operational risk records.'
                } else {
                    replyText = 'AI Care Coordinator was unable to process this operational query. Please verify operational data or encounter number.'
                }
            }

            const aiMsg: Message = {
                role: 'ai',
                text: replyText || 'No response returned from operational intelligence engine.',
                proposals: res.proposed_actions || [],
            }
            setMessages(m => [...m, aiMsg])
        } catch (e: any) {
            const errorMsg: Message = {
                role: 'ai',
                text: `Service error: ${e?.message || 'Unable to connect to AI Care Coordinator service.'}`,
            }
            setMessages(m => [...m, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cs-ai-overlay${open ? '' : ' cs-ai-overlay--hidden'}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <aside
                className={`cs-ai-panel${open ? ' cs-ai-panel--open' : ''}`}
                aria-label="AI Care Coordinator"
                aria-modal="true"
                role="dialog"
            >
                {/* Header: fixed at top */}
                <header className="cs-ai-panel__header">
                    <span className="cs-ai-panel__icon">{ICON_SPARKLES}</span>
                    <div>
                        <div className="cs-ai-panel__title">AI Care Coordinator</div>
                        <div className="cs-ai-panel__status">
                            <span className="cs-ai-panel__status-dot" aria-hidden="true" />
                            Operational intelligence · Now Assist
                        </div>
                    </div>
                    <button
                        id="ai-panel-close"
                        className="cs-ai-panel__close"
                        onClick={onClose}
                        aria-label="Close AI panel"
                    >
                        {ICON_X}
                    </button>
                </header>

                {/* Body: constrained scrolling transcript */}
                <div
                    className="cs-ai-panel__body"
                    ref={bodyRef}
                    onScroll={handleScroll}
                    tabIndex={0}
                    aria-label="Chat messages"
                >
                    {/* Today's insight */}
                    <div className="cs-ai-panel__insight">{INITIAL_INSIGHT}</div>

                    {/* Suggestions or chat */}
                    {messages.length === 0 ? (
                        <div>
                            <div className="cs-ai-panel__q-header">Suggested questions</div>
                            <div className="cs-ai-panel__suggestions">
                                {QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        id={`ai-question-${i}`}
                                        className="cs-ai-panel__suggestion"
                                        onClick={() => sendMessage(q)}
                                    >
                                        {q}
                                        <span aria-hidden="true">{ICON_ARROW}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={msg.role === 'user' ? 'cs-ai-panel__msg-you' : 'cs-ai-panel__msg-ai'}
                                >
                                    <div>{msg.text}</div>
                                    {msg.proposals && msg.proposals.length > 0 && (
                                        <div className="cs-action-proposals">
                                            {msg.proposals.map((prop, pIdx) => (
                                                <ActionProposalCard
                                                    key={prop.sys_id || pIdx}
                                                    proposal={prop}
                                                    onUpdated={updated => {
                                                        setMessages(prev => {
                                                            const copy = [...prev]
                                                            const curMsg = { ...copy[i] }
                                                            if (curMsg.proposals) {
                                                                curMsg.proposals = curMsg.proposals.map(p =>
                                                                    p.sys_id === updated.sys_id ? updated : p
                                                                )
                                                            }
                                                            copy[i] = curMsg
                                                            return copy
                                                        })
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div
                                    className="cs-ai-panel__msg-ai"
                                    style={{ fontStyle: 'italic', color: 'var(--muted-fg)' }}
                                >
                                    Analyzing operational coordination signals…
                                </div>
                            )}
                        </>
                    )}
                    <div ref={bottomAnchorRef} style={{ height: 1, flexShrink: 0 }} aria-hidden="true" />
                </div>

                {/* Footer: pinned at bottom */}
                <footer className="cs-ai-panel__footer">
                    <form
                        className="cs-ai-panel__footer-form"
                        onSubmit={e => { e.preventDefault(); sendMessage(input) }}
                        role="search"
                        aria-label="Ask AI coordinator"
                    >
                        <input
                            id="ai-panel-input"
                            className="cs-ai-panel__input"
                            placeholder="Ask about discharge status, blockers, or risk…"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            aria-label="AI question input"
                            autoComplete="off"
                            disabled={loading}
                        />
                        <button
                            id="ai-panel-send"
                            type="submit"
                            className="cs-ai-panel__send"
                            aria-label="Send message"
                            disabled={loading || !input.trim()}
                            style={{ opacity: loading || !input.trim() ? 0.6 : 1 }}
                        >
                            {ICON_SEND}
                        </button>
                    </form>
                    <div className="cs-ai-panel__disclaimer">
                        Operational intelligence only. No clinical judgment is made or implied.
                    </div>
                </footer>
            </aside>
        </>
    )
}
