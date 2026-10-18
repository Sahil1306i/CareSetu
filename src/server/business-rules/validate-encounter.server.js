(function executeRule(current, previous) {
    /**
     * CareSetu: Before Validation — Patient Encounter
     *
     * Runs BEFORE insert or update. Aborts the save if required fields are missing
     * or signal counts are invalid.
     *
     * Validated:
     *   - patient_mrn must be non-empty
     *   - All four signal count fields must be >= 0
     */
    if (!current.getValue('patient_mrn')) {
        gs.addErrorMessage('Patient MRN is required on a CareSetu encounter.')
        current.setAbortAction(true)
        return
    }

    var signals = [
        'overdue_coord_tasks',
        'incomplete_milestones',
        'unack_handoffs',
        'open_blockers',
    ]

    for (var i = 0; i < signals.length; i++) {
        var raw = current.getValue(signals[i])
        var val = parseInt(raw) || 0
        if (val < 0) {
            gs.addErrorMessage(signals[i].replace(/_/g, ' ') + ' cannot be negative.')
            current.setAbortAction(true)
            return
        }
    }
})(current, previous)
