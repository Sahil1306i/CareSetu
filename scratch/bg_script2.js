var inputsPayload = {};
inputsPayload['encounter_number'] = 'ENC1000010';

var capabilityId = 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'; 
var request = {
    executionRequests: [{
        payload: inputsPayload,
        capabilityId: capabilityId,
        meta: {
            skillConfigId: '9d8fed4927d24638a7cb7d624decd3e4'
        }
    }], 
    mode: 'sync' 
};

try {
    var response = sn_one_extend.OneExtendUtil.executeSecure(request); 
    gs.print('### TEST RESULTS ###\n' + JSON.stringify(response, null, 2));
} catch(e) {
    gs.print('### TEST RESULTS ###\nERROR: ' + (typeof e === 'object' ? JSON.stringify(e) : e.toString()));
}
