import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'

/**
 * CareSetu: Escalation Notification Flow
 *
 * Trigger: A new x_caresetu_ai_risk_score record is created.
 * Action:  Log the escalation event for audit trail.
 *
 * IMPORTANT ARCHITECTURE NOTE:
 *   The escalation TASK (x_caresetu_ai_escalation) is created SYNCHRONOUSLY
 *   by OperationalRiskEngine inside scoreEncounter().
 *   This Flow provides the ASYNC notification layer only.
 *
 * Phase 1 (this file):
 *   Log the event. The log is visible in Flow Designer execution history.
 *
 * Phase 2 (after first deploy + npm run types):
 *   Replace action.core.log with action.core.sendEmail.
 *   After `npm run types` runs against the deployed instance, the Fluent
 *   type system will resolve field references on x_caresetu_ai_risk_score,
 *   enabling typed wfa.dataPill() calls for ah_to and ah_subject.
 *
 * Why sendEmail is deferred:
 *   wfa.dataPill() requires the Fluent type tracker to know the schema of
 *   the trigger table at compile time. For custom tables (x_caresetu_ai_risk_score),
 *   this schema is only available after the table is deployed and
 *   `npm run types` has generated the type definitions.
 *   Using `as any` to bypass this causes TS211/TS243 errors in the Fluent
 *   compiler's pill resolver. Phase 2 removes the workaround entirely.
 */
Flow(
    {
        $id: Now.ID['caresetu-escalation-notification-flow'],
        name: 'CareSetu: Notify on High-Risk Discharge Score',
        runAs: 'system',
    },
    wfa.trigger(
        trigger.record.created,
        { $id: Now.ID['caresetu-notif-flow-trigger'] },
        { table: 'x_caresetu_ai_risk_score' }
    ),
    (_params) => {
        // Phase 1: log the event for audit trail visibility in Flow Designer.
        // Phase 2: add wfa.flowLogic.if + action.core.sendEmail after npm run types.
        wfa.action(
            action.core.log,
            { $id: Now.ID['caresetu-notif-log-event'] },
            {
                log_level: 'info',
                log_message: 'CareSetu: new discharge risk score created. Review Escalation Task queue.',
            }
        )
    }
)
