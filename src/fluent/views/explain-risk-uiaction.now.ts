import { Record } from '@servicenow/sdk/core'

export const explainRiskUiAction = Record({
    $id: Now.ID['caresetu-explain-risk-uiaction'],
    table: 'sys_ui_action',
    data: {
        name: 'CareSetu Explain Discharge Risk',
        table: 'x_caresetu_ai_encounter',
        action_name: 'caresetu_explain_risk',
        active: true,
        form_button: true,
        form_action: true,
        form_context_menu: false,
        form_link: false,
        list_action: false,
        list_button: false,
        list_context_menu: false,
        client: false,
        show_insert: false,
        show_update: true,
        condition: 'current.canRead()',
        script: `
try {
    var capabilityId = 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13';
    var request = {
        executionRequests: [{
            payload: { 'encounter_number': current.getValue('number') },
            capabilityId: capabilityId,
            meta: {
                skillConfigId: '9d8fed4927d24638a7cb7d624decd3e4'
            }
        }],
        mode: 'sync'
    };

    var response = sn_one_extend.OneExtendUtil.executeSecure(request) || {};
    var skillResponse = ((response["capabilities"] || {})[capabilityId] || {})["response"];
    
    var result = skillResponse;
    if (typeof skillResponse !== 'string') {
        result = JSON.stringify(skillResponse) || 'No explanation available. Ensure the encounter has been scored first.';
    }
        
    gs.addInfoMessage(result.replace(/\\n/g, '<br/>'));
} catch (e) {
    var errDetail = typeof e === 'object' ? JSON.stringify(e) : e.toString();
    gs.error('CareSetu Explain Risk skill error: ' + errDetail);
    gs.addErrorMessage('Something went wrong while executing the Explain Discharge Risk skill.');
}
action.setRedirectURL(current);
        `
    }
})
