/**
 * ActionExecutionEngine — CareSetu AI
 *
 * Implements the human-approved operational action system ("Fix It For Me").
 *
 * Grounding & Safety Principles:
 * 1. AI recommends actions; humans approve and authorize execution.
 * 2. No action may execute automatically without an explicit human approval.
 * 3. A proposal is strictly read-only until approved.
 * 4. Rejection leaves target records completely untouched.
 * 5. Strict allowlist of supported action types:
 *    - reassign_blocker: Reassign an active blocker to an eligible owner
 *    - escalate_blocker: Escalate an active overdue blocker
 *    - record_tpa_followup: Record a follow-up action on a pending TPA case
 * 6. Server-side role authorization enforcement:
 *    - Requires x_caresetu_ai.coordinator or x_caresetu_ai.charge_nurse role
 * 7. State and parameter validation immediately before execution:
 *    - Validates target record exists, is active, and parameters are valid
 * 8. Fully idempotent execution: duplicate calls or retries cannot re-execute completed actions.
 * 9. Reuses existing engines (TpaChaseEngine, OperationalRiskEngine, etc.) without duplicating logic.
 */
var ActionExecutionEngine = Class.create()
ActionExecutionEngine.prototype = {
    initialize: function() {},

    // ── Allowlist of Executable Action Types ──────────────────────────────────
    ACTION_TYPES: {
        REASSIGN_BLOCKER:    'reassign_blocker',
        ESCALATE_BLOCKER:    'escalate_blocker',
        RECORD_TPA_FOLLOWUP: 'record_tpa_followup',
    },

    // ── Propose an Action ─────────────────────────────────────────────────────
    /**
     * Creates an auditable pending action request. Does NOT modify the target record.
     * @param {object} fields - { encounter, action_type, target_table, target_record, title, rationale, proposed_parameters }
     * @param {string} [proposerSysId] - sys_id of user proposing (defaults to session user)
     * @returns {{ success: boolean, request_id?: string, number?: string, status?: string, error?: string }}
     */
    proposeAction: function(fields, proposerSysId) {
        if (!fields) return { success: false, error: 'Action fields payload is required.' }

        var actionType = fields.action_type
        if (!this._isValidActionType(actionType)) {
            return {
                success: false,
                error: 'Unsupported action type: "' + actionType + '". Permitted types: reassign_blocker, escalate_blocker, record_tpa_followup.',
            }
        }

        if (!fields.encounter) {
            return { success: false, error: 'Encounter reference is required.' }
        }

        var enc = new GlideRecord('x_caresetu_ai_encounter')
        if (!enc.get(fields.encounter)) {
            return { success: false, error: 'Encounter not found: ' + fields.encounter }
        }

        var targetTable = fields.target_table
        var targetRecord = fields.target_record
        if (!targetTable || !targetRecord) {
            return { success: false, error: 'target_table and target_record are required.' }
        }

        // Validate target table matches action type allowlist
        var expectedTable = this._getExpectedTable(actionType)
        if (targetTable !== expectedTable) {
            return {
                success: false,
                error: 'Invalid target_table for action ' + actionType + ': expected ' + expectedTable + ', got ' + targetTable,
            }
        }

        // Validate target record exists and snapshot state
        var targetGr = new GlideRecord(targetTable)
        if (!targetGr.get(targetRecord)) {
            return { success: false, error: 'Target record not found in ' + targetTable + ': ' + targetRecord }
        }

        // Check if target record belongs to the specified encounter
        if (targetGr.getValue('encounter') !== fields.encounter) {
            return { success: false, error: 'Target record encounter mismatch.' }
        }

        // Take snapshot of target record state
        var snapshot = this._captureSnapshot(targetGr, actionType)

        // Validate action-specific parameters at proposal time
        var paramValidation = this._validateParameters(actionType, fields.proposed_parameters, targetGr)
        if (!paramValidation.valid) {
            return { success: false, error: paramValidation.error }
        }

        var userId = proposerSysId || gs.getUserID()
        var now = new GlideDateTime()
        var nowMs = now.getNumericValue()
        var idempotencyKey = fields.idempotency_key || (actionType + '_' + targetRecord + '_' + nowMs)

        // Create the action request record
        var req = new GlideRecord('x_caresetu_ai_action_request')
        req.initialize()
        req.setValue('encounter',            fields.encounter)
        req.setValue('action_type',          actionType)
        req.setValue('status',               'pending_approval')
        req.setValue('title',                fields.title || this._getDefaultTitle(actionType, targetGr))
        req.setValue('rationale',            fields.rationale || 'Operational efficiency and discharge delay reduction.')
        req.setValue('target_table',         targetTable)
        req.setValue('target_record',        targetRecord)
        req.setValue('proposed_parameters',  typeof fields.proposed_parameters === 'object' ? JSON.stringify(fields.proposed_parameters) : (fields.proposed_parameters || '{}'))
        req.setValue('snapshot_state',       JSON.stringify(snapshot))
        req.setValue('proposed_by',          userId)
        req.setValue('idempotency_key',      idempotencyKey)

        var newId = req.insert()
        if (!newId) {
            return { success: false, error: 'Failed to insert action request record.' }
        }

        var insertedReq = new GlideRecord('x_caresetu_ai_action_request')
        var reqNumber = ''
        if (insertedReq.get(newId)) {
            reqNumber = insertedReq.getValue('number')
        }

        gs.info('ActionExecutionEngine: proposed action ' + reqNumber + ' [' + actionType + '] on ' + targetTable + '/' + targetRecord)

        return {
            success:    true,
            request_id: newId,
            number:     reqNumber,
            action_type: actionType,
            status:     'pending_approval',
            title:      req.getValue('title'),
        }
    },

    // ── Generate & Retrieve Action Proposals ──────────────────────────────────
    /**
     * Generates or retrieves operational action proposals for an encounter or hospital-wide.
     * Evaluates live records to identify actionable bottlenecks:
     *   1. Reassign unresolved blocker to charge nurse / coordinator
     *   2. Escalate overdue blocker impacting discharge
     *   3. Record TPA follow-up on pending authorization
     *
     * Ensures auditable pending request records exist in x_caresetu_ai_action_request.
     * Does NOT mutate any target operational record.
     *
     * @param {string} [encounterIdOrNumber] - encounter sys_id or number
     * @param {object} [options] - { limit: number }
     * @returns {Array<object>} list of formatted action request proposals in pending_approval state
     */
    generateProposals: function(encounterIdOrNumber, options) {
        var opts = options || {}
        var limit = opts.limit || 3
        var proposals = []

        var encGr = null
        if (encounterIdOrNumber) {
            encGr = new GlideRecord('x_caresetu_ai_encounter')
            if (encGr.get(encounterIdOrNumber)) {
                // found by sys_id
            } else {
                encGr = new GlideRecord('x_caresetu_ai_encounter')
                encGr.addQuery('number', encounterIdOrNumber)
                encGr.query()
                if (!encGr.next()) {
                    encGr = null
                }
            }
        }

        var encounterSysIds = []
        if (encGr) {
            encounterSysIds.push(encGr.getUniqueValue())
        } else {
            // Find top critical/high active encounters
            var scoreGr = new GlideRecord('x_caresetu_ai_risk_score')
            scoreGr.addQuery('is_latest', true)
            scoreGr.addQuery('risk_tier', 'IN', 'critical,high')
            scoreGr.orderByDesc('risk_score')
            scoreGr.setLimit(5)
            scoreGr.query()
            while (scoreGr.next()) {
                var encRef = scoreGr.getValue('encounter')
                if (encRef && encounterSysIds.indexOf(encRef) === -1) {
                    encounterSysIds.push(encRef)
                }
            }
            if (encounterSysIds.length === 0) {
                var anyEnc = new GlideRecord('x_caresetu_ai_encounter')
                anyEnc.addQuery('active', true)
                anyEnc.setLimit(5)
                anyEnc.query()
                while (anyEnc.next()) {
                    encounterSysIds.push(anyEnc.getUniqueValue())
                }
            }
        }

        for (var i = 0; i < encounterSysIds.length; i++) {
            if (proposals.length >= limit) break
            var currEncSysId = encounterSysIds[i]
            var eGr = new GlideRecord('x_caresetu_ai_encounter')
            if (!eGr.get(currEncSysId)) continue

            var chargeNurseId = eGr.getValue('charge_nurse')
            var chargeNurseName = eGr.getDisplayValue('charge_nurse') || ''

            if (!chargeNurseId) {
                var userLookup = new GlideRecord('sys_user')
                userLookup.addQuery('user_name', 'abel.tuter')
                userLookup.setLimit(1)
                userLookup.query()
                if (userLookup.next()) {
                    chargeNurseId = userLookup.getUniqueValue()
                    chargeNurseName = userLookup.getDisplayValue('name')
                } else {
                    chargeNurseId = gs.getUserID()
                    chargeNurseName = gs.getUserDisplayName() || 'Care Coordinator'
                }
            }

            // --- Candidate 1: Blocker Reassignment ---
            var unassignedBlk = new GlideRecord('x_caresetu_ai_blocker')
            unassignedBlk.addQuery('encounter', currEncSysId)
            unassignedBlk.addQuery('status', 'IN', 'open,in_progress')
            unassignedBlk.addNullQuery('owner')
            unassignedBlk.setLimit(1)
            unassignedBlk.query()

            if (!unassignedBlk.next() && chargeNurseId) {
                var activeBlk = new GlideRecord('x_caresetu_ai_blocker')
                activeBlk.addQuery('encounter', currEncSysId)
                activeBlk.addQuery('status', 'IN', 'open,in_progress')
                activeBlk.addQuery('owner', '!=', chargeNurseId)
                activeBlk.setLimit(1)
                activeBlk.query()
                if (activeBlk.next()) {
                    unassignedBlk = activeBlk
                }
            }

            if (unassignedBlk && unassignedBlk.isValidRecord() && chargeNurseId) {
                var blkId = unassignedBlk.getUniqueValue()
                var blkNum = unassignedBlk.getValue('number')
                var blkLabel = blkNum || (unassignedBlk.getDisplayValue('category') ? unassignedBlk.getDisplayValue('category') + ' Blocker' : 'Blocker')
                var pReassign = this._getOrCreateProposal({
                    encounter: currEncSysId,
                    action_type: this.ACTION_TYPES.REASSIGN_BLOCKER,
                    target_table: 'x_caresetu_ai_blocker',
                    target_record: blkId,
                    title: 'Reassign ' + blkLabel + ' to ' + chargeNurseName,
                    rationale: 'Blocker (' + unassignedBlk.getDisplayValue('category') + ' in ' + (unassignedBlk.getValue('department') || 'Unit') + ') requires dedicated coordination. Reassigning to ' + chargeNurseName + ' expedites resolution before discharge deadline.',
                    proposed_parameters: {
                        new_owner: chargeNurseId,
                        new_owner_name: chargeNurseName,
                        notes: 'Operational reassignment proposed by AI Care Coordinator.'
                    }
                })
                if (pReassign) proposals.push(pReassign)
            }

            if (proposals.length >= limit) break

            // --- Candidate 2: Escalate Overdue Blocker ---
            var overdueBlk = new GlideRecord('x_caresetu_ai_blocker')
            overdueBlk.addQuery('encounter', currEncSysId)
            overdueBlk.addQuery('status', 'IN', 'open,in_progress')
            overdueBlk.addQuery('is_overdue', true)
            overdueBlk.setLimit(1)
            overdueBlk.query()
            if (overdueBlk.next()) {
                var oBlkId = overdueBlk.getUniqueValue()
                var oBlkNum = overdueBlk.getValue('number')
                var oBlkLabel = oBlkNum || (overdueBlk.getDisplayValue('category') ? overdueBlk.getDisplayValue('category') + ' Blocker' : 'Blocker')
                var pEscalate = this._getOrCreateProposal({
                    encounter: currEncSysId,
                    action_type: this.ACTION_TYPES.ESCALATE_BLOCKER,
                    target_table: 'x_caresetu_ai_blocker',
                    target_record: oBlkId,
                    title: 'Escalate Overdue ' + oBlkLabel,
                    rationale: 'Overdue ' + overdueBlk.getDisplayValue('category') + ' blocker (' + (overdueBlk.getValue('estimated_delay_minutes') || 60) + 'm delay) is delaying target discharge. Escalation alerts management and triggers priority SLA handling.',
                    proposed_parameters: {
                        escalation_reason: 'Overdue operational blocker impacting discharge timeline.'
                    }
                })
                if (pEscalate) proposals.push(pEscalate)
            }

            if (proposals.length >= limit) break

            // --- Candidate 3: Record TPA Follow-Up ---
            var tpaCase = new GlideRecord('x_caresetu_ai_tpa_case')
            tpaCase.addQuery('encounter', currEncSysId)
            tpaCase.addQuery('status', 'IN', 'submitted,pending_documents,under_review,escalated')
            tpaCase.orderBy('is_overdue')
            tpaCase.setLimit(1)
            tpaCase.query()
            if (tpaCase.next()) {
                var tpaId = tpaCase.getUniqueValue()
                var pTpa = this._getOrCreateProposal({
                    encounter: currEncSysId,
                    action_type: this.ACTION_TYPES.RECORD_TPA_FOLLOWUP,
                    target_table: 'x_caresetu_ai_tpa_case',
                    target_record: tpaId,
                    title: 'Record TPA Follow-Up for ' + tpaCase.getValue('payer_name'),
                    rationale: 'Insurance authorization (' + tpaCase.getValue('number') + ') is awaiting payer response. Recording a coordinator follow-up logs contact and advances the follow-up SLA clock.',
                    proposed_parameters: {
                        payer_name: tpaCase.getValue('payer_name'),
                        notes: 'Routine follow-up initiated by care coordinator via AI recommendation.'
                    }
                })
                if (pTpa) proposals.push(pTpa)
            }
        }

        return proposals
    },

    /**
     * Helper: Returns existing pending action request if one already exists for this
     * target record & action type, or creates a new one in pending_approval state.
     */
    _getOrCreateProposal: function(fields) {
        var existing = new GlideRecord('x_caresetu_ai_action_request')
        existing.addQuery('target_table', fields.target_table)
        existing.addQuery('target_record', fields.target_record)
        existing.addQuery('action_type', fields.action_type)
        existing.addQuery('status', 'pending_approval')
        existing.orderByDesc('sys_created_on')
        existing.setLimit(1)
        existing.query()
        if (existing.next()) {
            return this._formatRequestDetail(existing)
        }

        var propResult = this.proposeAction(fields, gs.getUserID())
        if (propResult.success && propResult.request_id) {
            return this.getRequest(propResult.request_id)
        }
        return null
    },

    // ── Approve and Execute an Action ─────────────────────────────────────────
    /**
     * Approves and executes a proposed action request after human authorization.
     * @param {string} requestId - sys_id of x_caresetu_ai_action_request
     * @param {string} [approverSysId] - sys_id of approving user
     * @param {string} [approvalNotes] - optional coordinator notes
     * @returns {{ success: boolean, status: string, result?: object, error?: string }}
     */
    approveAndExecute: function(requestId, approverSysId, approvalNotes) {
        if (!requestId) {
            return { success: false, error: 'requestId parameter is required.' }
        }

        var req = new GlideRecord('x_caresetu_ai_action_request')
        if (!req.get(requestId)) {
            return { success: false, error: 'Action request not found: ' + requestId }
        }

        var currentStatus = req.getValue('status')

        // Idempotency: if already completed, return existing verified result
        if (currentStatus === 'completed') {
            gs.info('ActionExecutionEngine.approveAndExecute: request ' + req.getValue('number') + ' already completed — returning cached result.')
            var cachedResult = {}
            try { cachedResult = JSON.parse(req.getValue('execution_result') || '{}') } catch (_) {}
            return {
                success: true,
                status: 'completed',
                already_executed: true,
                number: req.getValue('number'),
                result: cachedResult,
            }
        }

        if (currentStatus === 'rejected') {
            return { success: false, error: 'Cannot approve a rejected action request (' + req.getValue('number') + ').' }
        }

        if (currentStatus === 'executing') {
            return { success: false, error: 'Action request (' + req.getValue('number') + ') is currently executing.' }
        }

        if (currentStatus !== 'pending_approval' && currentStatus !== 'approved') {
            return { success: false, error: 'Invalid state for approval: ' + currentStatus }
        }

        var approverId = approverSysId || gs.getUserID()

        // Server-Side Role Enforcement
        var authCheck = this._checkAuthorization(req.getValue('action_type'), approverId)
        if (!authCheck.authorized) {
            return { success: false, error: authCheck.error }
        }

        // Lock to executing state
        var now = new GlideDateTime()
        req.setValue('status',        'executing')
        req.setValue('approved_by',   approverId)
        req.setValue('approval_time', now.getValue())
        req.update()

        // Execute via dedicated server handler
        var actionType = req.getValue('action_type')
        var targetTable = req.getValue('target_table')
        var targetRecord = req.getValue('target_record')
        var params = {}
        try { params = JSON.parse(req.getValue('proposed_parameters') || '{}') } catch (_) {}

        try {
            var executionResult = null

            if (actionType === this.ACTION_TYPES.REASSIGN_BLOCKER) {
                executionResult = this._executeReassignBlocker(req, targetRecord, params, approverId, approvalNotes)
            } else if (actionType === this.ACTION_TYPES.ESCALATE_BLOCKER) {
                executionResult = this._executeEscalateBlocker(req, targetRecord, params, approverId, approvalNotes)
            } else if (actionType === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP) {
                executionResult = this._executeRecordTpaFollowup(req, targetRecord, params, approverId, approvalNotes)
            } else {
                throw new Error('Unsupported action type during execution: ' + actionType)
            }

            // Update request to completed
            var execNow = new GlideDateTime()
            req.setValue('status',           'completed')
            req.setValue('executed_by',      approverId)
            req.setValue('execution_time',   execNow.getValue())
            req.setValue('execution_result', JSON.stringify(executionResult))
            req.update()

            gs.info('ActionExecutionEngine: successfully executed ' + req.getValue('number') + ' [' + actionType + ']')

            return {
                success: true,
                status:  'completed',
                number:  req.getValue('number'),
                action_type: actionType,
                result:  executionResult,
            }
        } catch (e) {
            req.setValue('status',         'failed')
            req.setValue('failure_reason', e.message)
            req.update()

            gs.error('ActionExecutionEngine: execution failed for ' + req.getValue('number') + ': ' + e.message)

            return {
                success: false,
                status:  'failed',
                number:  req.getValue('number'),
                error:   'Action execution failed: ' + e.message,
            }
        }
    },

    // ── Reject an Action ──────────────────────────────────────────────────────
    /**
     * Rejects an action request with an auditable reason. Target record is untouched.
     * @param {string} requestId
     * @param {string} [rejectorSysId]
     * @param {string} rejectionReason
     * @returns {{ success: boolean, status: string, error?: string }}
     */
    rejectAction: function(requestId, rejectorSysId, rejectionReason) {
        if (!requestId) return { success: false, error: 'requestId parameter is required.' }

        var req = new GlideRecord('x_caresetu_ai_action_request')
        if (!req.get(requestId)) {
            return { success: false, error: 'Action request not found: ' + requestId }
        }

        var currentStatus = req.getValue('status')
        if (currentStatus === 'completed') {
            return { success: false, error: 'Cannot reject an already completed action request.' }
        }

        if (currentStatus === 'rejected') {
            return { success: true, status: 'rejected', message: 'Action request already rejected.' }
        }

        var rejectorId = rejectorSysId || gs.getUserID()
        var now = new GlideDateTime()

        req.setValue('status',           'rejected')
        req.setValue('approved_by',      rejectorId)
        req.setValue('approval_time',    now.getValue())
        req.setValue('rejection_reason', rejectionReason || 'Action rejected by operational coordinator.')
        req.update()

        gs.info('ActionExecutionEngine: rejected action ' + req.getValue('number') + ' with reason: ' + rejectionReason)

        return {
            success: true,
            status:  'rejected',
            number:  req.getValue('number'),
            rejection_reason: req.getValue('rejection_reason'),
        }
    },

    // ── List & Get Queries ────────────────────────────────────────────────────
    /**
     * List action requests with optional status and encounter filters.
     */
    listRequests: function(filters) {
        var f = filters || {}
        var gr = new GlideRecord('x_caresetu_ai_action_request')
        if (f.encounter) gr.addQuery('encounter', f.encounter)
        if (f.status) {
            var statuses = f.status.split(',')
            gr.addQuery('status', 'IN', statuses.join(','))
        }
        if (f.action_type) gr.addQuery('action_type', f.action_type)

        gr.orderByDesc('sys_created_on')
        gr.setLimit(f.limit ? parseInt(f.limit, 10) : 50)
        gr.query()

        var results = []
        while (gr.next()) {
            results.push(this._formatRequestSummary(gr))
        }
        return { count: results.length, requests: results }
    },

    /**
     * Retrieve single request with audit details.
     */
    getRequest: function(requestId) {
        var gr = new GlideRecord('x_caresetu_ai_action_request')
        if (!gr.get(requestId)) return null
        return this._formatRequestDetail(gr)
    },

    // ── Concrete Action Handlers ──────────────────────────────────────────────
    /**
     * Action Handler A: Reassign an operational blocker.
     */
    _executeReassignBlocker: function(req, blockerSysId, params, approverId, approvalNotes) {
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        if (!blk.get(blockerSysId)) {
            throw new Error('Target blocker record not found: ' + blockerSysId)
        }

        // Re-validate state at execution time: blocker must be active
        var currentStatus = blk.getValue('status')
        if (currentStatus === 'resolved') {
            throw new Error('Target blocker is already resolved. Reassignment is no longer applicable.')
        }

        var newOwnerSysId = params.new_owner
        if (!newOwnerSysId) {
            throw new Error('Proposed parameter "new_owner" is required for blocker reassignment.')
        }

        var newOwner = new GlideRecord('sys_user')
        if (!newOwner.get(newOwnerSysId)) {
            throw new Error('Proposed owner not found in sys_user: ' + newOwnerSysId)
        }

        var prevOwnerSysId = blk.getValue('owner')
        var prevOwnerName = blk.getDisplayValue('owner') || 'Unassigned'
        var newOwnerName = newOwner.getDisplayValue('name') || newOwner.getValue('user_name')

        // Apply reassignment
        blk.setValue('owner', newOwnerSysId)
        if (currentStatus === 'open') {
            blk.setValue('status', 'in_progress')
        }

        var noteStamp = '[Action ' + req.getValue('number') + '] Reassigned from ' + prevOwnerName + ' to ' + newOwnerName + ' by authorized coordinator.' + (approvalNotes ? ' Notes: ' + approvalNotes : '')
        var existingNotes = blk.getValue('resolution_notes') || ''
        blk.setValue('resolution_notes', existingNotes ? existingNotes + '\n' + noteStamp : noteStamp)

        blk.update()

        return {
            blocker_sys_id:   blockerSysId,
            blocker_number:   blk.getValue('number'),
            previous_owner:   prevOwnerSysId,
            previous_owner_name: prevOwnerName,
            new_owner:        newOwnerSysId,
            new_owner_name:   newOwnerName,
            updated_status:   blk.getValue('status'),
            action_performed: 'reassigned_owner',
        }
    },

    /**
     * Action Handler B: Escalate an overdue blocker.
     */
    _executeEscalateBlocker: function(req, blockerSysId, params, approverId, approvalNotes) {
        var blk = new GlideRecord('x_caresetu_ai_blocker')
        if (!blk.get(blockerSysId)) {
            throw new Error('Target blocker record not found: ' + blockerSysId)
        }

        var currentStatus = blk.getValue('status')
        if (currentStatus === 'resolved') {
            throw new Error('Target blocker is already resolved. Cannot escalate.')
        }

        var prevStatus = currentStatus
        blk.setValue('status', 'escalated')
        blk.setValue('is_overdue', 'true')

        var noteStamp = '[Action ' + req.getValue('number') + '] Blocker escalated by authorized coordinator. Rationale: ' + req.getValue('rationale') + (approvalNotes ? ' Notes: ' + approvalNotes : '')
        var existingNotes = blk.getValue('resolution_notes') || ''
        blk.setValue('resolution_notes', existingNotes ? existingNotes + '\n' + noteStamp : noteStamp)

        blk.update()
        // Note: Blocker update triggers sync-blocker-count BR -> triggers rescore -> syncs escalation safely without duplicates

        return {
            blocker_sys_id:   blockerSysId,
            blocker_number:   blk.getValue('number'),
            previous_status:  prevStatus,
            new_status:       'escalated',
            is_overdue:       true,
            action_performed: 'escalated_blocker',
        }
    },

    /**
     * Action Handler C: Record a TPA follow-up action.
     */
    _executeRecordTpaFollowup: function(req, caseSysId, params, approverId, approvalNotes) {
        var tpaCase = new GlideRecord('x_caresetu_ai_tpa_case')
        if (!tpaCase.get(caseSysId)) {
            throw new Error('Target TPA case record not found: ' + caseSysId)
        }

        var status = tpaCase.getValue('status')
        if (status === 'approved' || status === 'rejected' || status === 'closed') {
            throw new Error('Target TPA case is in terminal status (' + status + '). Follow-up no longer applicable.')
        }

        var notes = params.notes || ('Approved follow-up action ' + req.getValue('number') + ': ' + req.getValue('rationale'))
        if (approvalNotes) notes += ' | ' + approvalNotes

        // Delegate to existing tested TpaChaseEngine
        var engine = new x_caresetu_ai.TpaChaseEngine()
        var fuResult = engine.recordFollowup(caseSysId, notes)

        if (!fuResult || !fuResult.success) {
            throw new Error('TpaChaseEngine follow-up failed: ' + (fuResult ? fuResult.error : 'Unknown engine error'))
        }

        return {
            tpa_case_sys_id:   caseSysId,
            tpa_case_number:   tpaCase.getValue('number'),
            payer_name:        tpaCase.getValue('payer_name'),
            followup_count:    fuResult.followup_count,
            next_followup_due: fuResult.next_followup_due,
            action_performed:  'recorded_tpa_followup',
        }
    },

    // ── Private Validation & Helpers ──────────────────────────────────────────
    _isValidActionType: function(type) {
        return type === this.ACTION_TYPES.REASSIGN_BLOCKER ||
               type === this.ACTION_TYPES.ESCALATE_BLOCKER ||
               type === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP
    },

    _getExpectedTable: function(type) {
        if (type === this.ACTION_TYPES.REASSIGN_BLOCKER || type === this.ACTION_TYPES.ESCALATE_BLOCKER) {
            return 'x_caresetu_ai_blocker'
        }
        if (type === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP) {
            return 'x_caresetu_ai_tpa_case'
        }
        return ''
    },

    _checkAuthorization: function(actionType, userId) {
        // Platform Role Verification
        // x_caresetu_ai.coordinator or x_caresetu_ai.charge_nurse or admin
        var hasCoord = gs.hasRole('x_caresetu_ai.coordinator')
        var hasNurse = gs.hasRole('x_caresetu_ai.charge_nurse')
        var isAdmin  = gs.hasRole('admin')

        if (!hasCoord && !hasNurse && !isAdmin) {
            return {
                authorized: false,
                error: 'Unauthorized: User does not possess the required CareSetu coordinator or charge nurse role to approve operational actions.',
            }
        }

        return { authorized: true }
    },

    _validateParameters: function(actionType, paramsRaw, targetGr) {
        var params = paramsRaw
        if (typeof params === 'string') {
            try { params = JSON.parse(params) } catch (_) { params = {} }
        }
        params = params || {}

        if (actionType === this.ACTION_TYPES.REASSIGN_BLOCKER) {
            if (!params.new_owner) {
                return { valid: false, error: 'Parameter "new_owner" (sys_id) is required for reassign_blocker.' }
            }
            var user = new GlideRecord('sys_user')
            if (!user.get(params.new_owner)) {
                return { valid: false, error: 'Proposed new owner user record not found: ' + params.new_owner }
            }
        }

        if (actionType === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP) {
            // Optional notes can be empty, will default in handler
        }

        return { valid: true }
    },

    _captureSnapshot: function(gr, actionType) {
        var snap = {
            sys_id: gr.getUniqueValue(),
            sys_updated_on: gr.getValue('sys_updated_on'),
        }
        if (actionType === this.ACTION_TYPES.REASSIGN_BLOCKER || actionType === this.ACTION_TYPES.ESCALATE_BLOCKER) {
            snap.number = gr.getValue('number')
            snap.category = gr.getValue('category')
            snap.status = gr.getValue('status')
            snap.owner = gr.getValue('owner')
            snap.is_overdue = gr.getValue('is_overdue')
            snap.description = gr.getValue('description')
        } else if (actionType === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP) {
            snap.number = gr.getValue('number')
            snap.payer_name = gr.getValue('payer_name')
            snap.status = gr.getValue('status')
            snap.followup_count = gr.getValue('followup_count')
            snap.next_followup_due = gr.getValue('next_followup_due')
        }
        return snap
    },

    _getDefaultTitle: function(actionType, gr) {
        if (actionType === this.ACTION_TYPES.REASSIGN_BLOCKER) {
            return 'Reassign Operational Blocker (' + (gr.getValue('number') || gr.getDisplayValue('category')) + ')'
        }
        if (actionType === this.ACTION_TYPES.ESCALATE_BLOCKER) {
            return 'Escalate Overdue Blocker (' + (gr.getValue('number') || gr.getDisplayValue('category')) + ')'
        }
        if (actionType === this.ACTION_TYPES.RECORD_TPA_FOLLOWUP) {
            return 'Record TPA Follow-Up for ' + (gr.getValue('payer_name') || 'Payer')
        }
        return 'Operational Action Request'
    },

    _formatRequestSummary: function(gr) {
        return {
            sys_id:           gr.getUniqueValue(),
            number:           gr.getValue('number'),
            encounter:        gr.getValue('encounter'),
            encounter_number: gr.getDisplayValue('encounter'),
            action_type:      gr.getValue('action_type'),
            action_type_label: gr.getDisplayValue('action_type'),
            status:           gr.getValue('status'),
            status_label:     gr.getDisplayValue('status'),
            title:            gr.getValue('title'),
            rationale:        gr.getValue('rationale'),
            target_table:     gr.getValue('target_table'),
            target_record:    gr.getValue('target_record'),
            proposed_by:      gr.getDisplayValue('proposed_by'),
            approved_by:      gr.getDisplayValue('approved_by'),
            approval_time:    gr.getDisplayValue('approval_time'),
            execution_time:   gr.getDisplayValue('execution_time'),
            sys_created_on:   gr.getDisplayValue('sys_created_on'),
        }
    },

    _formatRequestDetail: function(gr) {
        var summary = this._formatRequestSummary(gr)
        var params = {}
        var snapshot = {}
        var result = null
        try { params = JSON.parse(gr.getValue('proposed_parameters') || '{}') } catch (_) {}
        try { snapshot = JSON.parse(gr.getValue('snapshot_state') || '{}') } catch (_) {}
        try { result = JSON.parse(gr.getValue('execution_result') || 'null') } catch (_) {}

        summary.proposed_parameters = params
        summary.snapshot_state      = snapshot
        summary.execution_result    = result
        summary.rejection_reason    = gr.getValue('rejection_reason')
        summary.failure_reason      = gr.getValue('failure_reason')
        summary.idempotency_key     = gr.getValue('idempotency_key')
        return summary
    },

    type: 'ActionExecutionEngine',
}
