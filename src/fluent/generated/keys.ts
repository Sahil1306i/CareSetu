import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'app.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'b97c4ae8894940528f6997ecdb6e2d87'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'dcfeabd879c948eaab834053368ee69e'
                    }
                    'caresetu-acl-action-request-create': {
                        table: 'sys_security_acl'
                        id: '04b8c3b4873e4d0dbd312c3a8307492a'
                    }
                    'caresetu-acl-action-request-read': {
                        table: 'sys_security_acl'
                        id: '0a3ae45f84f4471c99ed9e46a5ae1730'
                    }
                    'caresetu-acl-action-request-write': {
                        table: 'sys_security_acl'
                        id: 'b46e47cf6df0456a95624bcdae528517'
                    }
                    'caresetu-acl-blocker-create': {
                        table: 'sys_security_acl'
                        id: 'ecbdd8a3a2bb4fe8be29f83ff84728cb'
                    }
                    'caresetu-acl-blocker-read': {
                        table: 'sys_security_acl'
                        id: 'a3f5d98cabe447928d23afe3fef2d5e5'
                    }
                    'caresetu-acl-blocker-write': {
                        table: 'sys_security_acl'
                        id: 'f4b26a5cbf4e446eaaed68cd808d8129'
                    }
                    'caresetu-acl-encounter-read': {
                        table: 'sys_security_acl'
                        id: 'b02f66372f4e43e5be18484f598ae3a2'
                    }
                    'caresetu-acl-encounter-write': {
                        table: 'sys_security_acl'
                        id: 'c4b8fe3c00d44f098b0988012fd566fc'
                    }
                    'caresetu-acl-escalation-read': {
                        table: 'sys_security_acl'
                        id: '48c04d57988f4aa0b2836afd774a8328'
                    }
                    'caresetu-acl-escalation-write': {
                        table: 'sys_security_acl'
                        id: 'def853fa6c6244f29160ebe9254ff1b8'
                    }
                    'caresetu-acl-handoff-create': {
                        table: 'sys_security_acl'
                        id: '55220e1a51434198a3eacf888478d97d'
                    }
                    'caresetu-acl-handoff-read': {
                        table: 'sys_security_acl'
                        id: '079c3b59d9ff44f59d7c50925b32ab3e'
                    }
                    'caresetu-acl-handoff-write': {
                        table: 'sys_security_acl'
                        id: 'bd1a3ca978e345069d1d5e9dd1c13443'
                    }
                    'caresetu-acl-prediction-read': {
                        table: 'sys_security_acl'
                        id: 'b0da414e9c0245ebbd98e51cba6f1291'
                    }
                    'caresetu-acl-prediction-write': {
                        table: 'sys_security_acl'
                        id: '1d8d6afbdfb64e509c20facaf76f60c7'
                    }
                    'caresetu-acl-risk-score-read': {
                        table: 'sys_security_acl'
                        id: '6142ee3e34de456da410ee044ad3118c'
                    }
                    'caresetu-acl-tpa-case-create': {
                        table: 'sys_security_acl'
                        id: '40ad9e16638845839318c9c905c36e36'
                    }
                    'caresetu-acl-tpa-case-read': {
                        table: 'sys_security_acl'
                        id: 'bd62792bc836400397ee37cda98dffe9'
                    }
                    'caresetu-acl-tpa-case-write': {
                        table: 'sys_security_acl'
                        id: '08c8395469714ed0ba290b21c9d6e5d5'
                    }
                    'caresetu-action-approve-route': {
                        table: 'sys_ws_operation'
                        id: 'ceb289c7d114402aa1e31a15dffe6bc5'
                    }
                    'caresetu-action-execution-engine': {
                        table: 'sys_script_include'
                        id: '2a27e08dadf54d89b577d22cf8ac875f'
                    }
                    'caresetu-action-get-route': {
                        table: 'sys_ws_operation'
                        id: 'c75375bd0be74415807ba6fd697771c5'
                    }
                    'caresetu-action-list-route': {
                        table: 'sys_ws_operation'
                        id: 'dadb7f5d79104c0e93c206317653b007'
                    }
                    'caresetu-action-propose-route': {
                        table: 'sys_ws_operation'
                        id: 'b1265b423b154a56a73e8176144b0000'
                    }
                    'caresetu-action-reject-route': {
                        table: 'sys_ws_operation'
                        id: '7800a2530d124818815da1559e5e8435'
                    }
                    'caresetu-action-result-route': {
                        table: 'sys_ws_operation'
                        id: '7157f20fcead4549b73fb9b791814053'
                    }
                    'caresetu-actions-api': {
                        table: 'sys_ws_definition'
                        id: 'b4a14459fa4842679124e7bf4b86eef1'
                    }
                    'caresetu-actions-api-v1': {
                        table: 'sys_ws_version'
                        id: '54e032b70f3347e99f031830515b1233'
                    }
                    'caresetu-ai-coordinator-engine': {
                        table: 'sys_script_include'
                        id: '57244b6ce9ab4ab4bde1c667e3b38d5a'
                    }
                    'caresetu-api-ai-query': {
                        table: 'sys_ws_operation'
                        id: 'e63707f5fb364ca7addc55e360527404'
                    }
                    'caresetu-api-create-blocker': {
                        table: 'sys_ws_operation'
                        id: 'ea2d891ed12849e19c50d732c26c1ff3'
                    }
                    'caresetu-api-get-blockers': {
                        table: 'sys_ws_operation'
                        id: '120192bb8d7741248e8fec0281b13bcc'
                    }
                    'caresetu-api-get-escalations': {
                        table: 'sys_ws_operation'
                        id: '8642c862083643a59b9f9fb2115603ba'
                    }
                    'caresetu-api-get-high-risk': {
                        table: 'sys_ws_operation'
                        id: '9f9b10e0e8d84755b6d4df77be344d29'
                    }
                    'caresetu-api-get-prediction': {
                        table: 'sys_ws_operation'
                        id: 'a0315cea05b64b4698d92e130b3a477a'
                    }
                    'caresetu-api-post-predict': {
                        table: 'sys_ws_operation'
                        id: '5ba8e72fc95840ec813b9101237598af'
                    }
                    'caresetu-api-post-score': {
                        table: 'sys_ws_operation'
                        id: '7e5248eadf1f4b48a5a574dee8d1aaa6'
                    }
                    'caresetu-api-update-blocker': {
                        table: 'sys_ws_operation'
                        id: '18f9311ffabb42108ef202762fc3e653'
                    }
                    'caresetu-api-v1': {
                        table: 'sys_ws_version'
                        id: '7646849b11dd4ef08011dafc667cb23e'
                    }
                    'caresetu-app-menu': {
                        table: 'sys_app_application'
                        id: '63a25f3c731b4e3a94c3136586a21199'
                    }
                    'caresetu-command-center-module': {
                        table: 'sys_app_module'
                        id: '9a54b11d38fa4122bebe1bb3b5f0e9f0'
                    }
                    'caresetu-compute-risk-async': {
                        table: 'sys_script'
                        id: 'f7ac5c0d427b4b2cb31992f3bb35bbd3'
                    }
                    'caresetu-discharge-prediction-api': {
                        table: 'sys_ws_definition'
                        id: 'e806d2f84da54771bd91b5685b2dab6a'
                    }
                    'caresetu-discharge-prediction-engine': {
                        table: 'sys_script_include'
                        id: '237fafaef31e428497cdffe033cba0d4'
                    }
                    'caresetu-escalation-notification-flow': {
                        table: 'sys_hub_flow'
                        id: '804187e183524339b8134805a65076b3'
                    }
                    'caresetu-explain-risk-prompt-v1': {
                        table: 'sys_generative_ai_config'
                        id: '619441ea57f947c1bb101e1df7a18d20'
                    }
                    'caresetu-explain-risk-skill': {
                        table: 'sys_one_extend_capability'
                        id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                    }
                    'caresetu-explain-risk-skill__output_error': {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'd2807f107ef54d2b8d58e7d6f00e3038'
                    }
                    'caresetu-explain-risk-skill__output_errorcode': {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'ba6938bc345d4e7fa8c666ca855ce5c2'
                    }
                    'caresetu-explain-risk-skill__output_provider': {
                        table: 'sys_one_extend_definition_attribute'
                        id: '6e168fdb8e404b07bd64dd090938aed0'
                    }
                    'caresetu-explain-risk-skill__output_response': {
                        table: 'sys_one_extend_definition_attribute'
                        id: '12eb26ee2c85446d8b962c628045679a'
                    }
                    'caresetu-explain-risk-skill__output_status': {
                        table: 'sys_one_extend_definition_attribute'
                        id: 'a8f09a7364364b3184c52285e13e424a'
                    }
                    'caresetu-explain-risk-skill-acl': {
                        table: 'sys_security_acl'
                        id: '4dbf3f95aed74e2db5e23b06254bb1b2'
                    }
                    'caresetu-explain-risk-uiaction': {
                        table: 'sys_ui_action'
                        id: '9334df9295614a45a8ee52e2fadb5a12'
                    }
                    'caresetu-handoff-ack-route': {
                        table: 'sys_ws_operation'
                        id: 'cbad39eac483481db0726c50ac3d8633'
                    }
                    'caresetu-handoff-api': {
                        table: 'sys_ws_definition'
                        id: '83e57fb09ab542eba89c22bbd1543374'
                    }
                    'caresetu-handoff-api-v1': {
                        table: 'sys_ws_version'
                        id: 'ae1dab46f4e949c8a16d7630e9487712'
                    }
                    'caresetu-handoff-cancel-route': {
                        table: 'sys_ws_operation'
                        id: '19ae3805bd374a27bddea9839d75353d'
                    }
                    'caresetu-handoff-complete-route': {
                        table: 'sys_ws_operation'
                        id: '2adb9ddaaae9428fbda53581d7fca09b'
                    }
                    'caresetu-handoff-create-route': {
                        table: 'sys_ws_operation'
                        id: '5141f8b029804907820cbc04b9404ae3'
                    }
                    'caresetu-handoff-engine': {
                        table: 'sys_script_include'
                        id: 'df969d7af4424daa8f35ad749cef9843'
                    }
                    'caresetu-handoff-get-route': {
                        table: 'sys_ws_operation'
                        id: 'f95732f397414cc48a3197f9af8d1739'
                    }
                    'caresetu-handoff-list-route': {
                        table: 'sys_ws_operation'
                        id: '3e10173fbf8e466587fdd2a61557ac16'
                    }
                    'caresetu-handoff-overdue-chaser': {
                        table: 'sysauto_script'
                        id: 'ca202ab7cca6435bbaea131a4803c0bb'
                    }
                    'caresetu-handoff-reject-route': {
                        table: 'sys_ws_operation'
                        id: '29db240432f249c381d2a69ea29b1b3b'
                    }
                    'caresetu-handoff-test-suite': {
                        table: 'sys_atf_test_suite'
                        id: 'c502dfe8f4a342438b3319c6a96aad6c'
                    }
                    'caresetu-handoff-update-route': {
                        table: 'sys_ws_operation'
                        id: '71b76bb53f97404b95b942b0f7fd2c67'
                    }
                    'caresetu-notif-flow-trigger': {
                        table: 'sys_hub_trigger_instance_v2'
                        id: 'aa59b5e700a945669812e399cf4858dc'
                    }
                    'caresetu-notif-log-event': {
                        table: 'sys_hub_action_instance_v2'
                        id: '8d7bedb79ce7492b96fea0047a582033'
                    }
                    'caresetu-operational-risk-api': {
                        table: 'sys_ws_definition'
                        id: '5694f8bf3f2e4363af438a4edc347175'
                    }
                    'caresetu-operational-risk-engine': {
                        table: 'sys_script_include'
                        id: '49861b5cb72648a6a19c80abcbb742b8'
                    }
                    'caresetu-predict-discharge-async': {
                        table: 'sys_script'
                        id: 'ab32ddca9b6041dfb892e0dd9b8abe85'
                    }
                    'caresetu-prediction-api-v1': {
                        table: 'sys_ws_version'
                        id: '0a3b993c5f8b480b8670ef2da057c6e3'
                    }
                    'caresetu-skill-input-encounter-number': {
                        table: 'sys_one_extend_definition_attribute'
                        id: '8aeeba2f3ef747df91864d86cecbf5cb'
                    }
                    'caresetu-sync-blocker-count': {
                        table: 'sys_script'
                        id: '2dc2ca3fe5d1436ba13456fbfd81156d'
                    }
                    'caresetu-sync-handoff-count': {
                        table: 'sys_script'
                        id: '029e5d3c68634c7fa03b8d6a3cd1f59e'
                    }
                    'caresetu-test-handoff-lifecycle': {
                        table: 'sys_atf_test'
                        id: 'b5a881899adf4c2b9475423e653e4fbe'
                    }
                    'caresetu-test-high-risk': {
                        table: 'sys_atf_test'
                        id: '4dc0b0b8ad7047bb919af3d23e8eaae8'
                    }
                    'caresetu-test-hnd-enc-insert': {
                        table: 'sys_atf_step'
                        id: 'da10a72461c24086956aa8b19da326fa'
                    }
                    'caresetu-test-hnd-insert': {
                        table: 'sys_atf_step'
                        id: 'b5e70a97cea945149025c8af26726197'
                    }
                    'caresetu-test-hnd-log-ack': {
                        table: 'sys_atf_step'
                        id: 'f5517f8e90514343bf29adeba7d7e9ec'
                    }
                    'caresetu-test-hnd-log-complete': {
                        table: 'sys_atf_step'
                        id: '4db11d9aac724617a25bdf003e9c9a98'
                    }
                    'caresetu-test-hnd-log-insert': {
                        table: 'sys_atf_step'
                        id: 'ef7d771e6fe64e8cba87f733951fc5c8'
                    }
                    'caresetu-test-hnd-rest-ack': {
                        table: 'sys_atf_step'
                        id: 'f08575cc73384e9c95edc9360c83d55b'
                    }
                    'caresetu-test-hnd-rest-complete': {
                        table: 'sys_atf_step'
                        id: '8000e25af9a7476a8c6239c96487d531'
                    }
                    'caresetu-test-hr-insert': {
                        table: 'sys_atf_step'
                        id: 'b62dc587bfb745489d0e34e51b6962df'
                    }
                    'caresetu-test-hr-log-dedup': {
                        table: 'sys_atf_step'
                        id: '1a95b004772146e497f48e8305473480'
                    }
                    'caresetu-test-hr-log-escalations': {
                        table: 'sys_atf_step'
                        id: '180a7c7efac24d47b4551cbfe61d3a83'
                    }
                    'caresetu-test-hr-log-insert': {
                        table: 'sys_atf_step'
                        id: '90c5d20ee2a849aa9ae098b01ef4ee42'
                    }
                    'caresetu-test-hr-log-score': {
                        table: 'sys_atf_step'
                        id: '6cc6c99858994333b2c8dbc45b7e658b'
                    }
                    'caresetu-test-hr-rest-esc-dedup': {
                        table: 'sys_atf_step'
                        id: '9cad0af34ba54c0492bc6cd603fcf1c3'
                    }
                    'caresetu-test-hr-rest-escalations': {
                        table: 'sys_atf_step'
                        id: '729901b67e0744c395aadff4fc4191ae'
                    }
                    'caresetu-test-hr-rest-rescore': {
                        table: 'sys_atf_step'
                        id: '866916f949574b159c408a1aebb49be3'
                    }
                    'caresetu-test-hr-rest-score': {
                        table: 'sys_atf_step'
                        id: 'cc037261a02548d0bf4e1eeb29937550'
                    }
                    'caresetu-test-normal': {
                        table: 'sys_atf_test'
                        id: '5c7f2ef453724199b252ca0475dd772a'
                    }
                    'caresetu-test-normal-insert': {
                        table: 'sys_atf_step'
                        id: '28d1aa0a79234288bc57b426d62f53f4'
                    }
                    'caresetu-test-normal-log-escalations': {
                        table: 'sys_atf_step'
                        id: '848c13582417412f830f10028d397bfc'
                    }
                    'caresetu-test-normal-log-insert': {
                        table: 'sys_atf_step'
                        id: 'bfa39caed7a94e809874deab27464f60'
                    }
                    'caresetu-test-normal-log-score': {
                        table: 'sys_atf_step'
                        id: '889713acea7d4905a723b03b385b8aeb'
                    }
                    'caresetu-test-normal-rest-escalations': {
                        table: 'sys_atf_step'
                        id: '0b4b13f45ce5439e8d670c55a882190a'
                    }
                    'caresetu-test-normal-rest-score': {
                        table: 'sys_atf_step'
                        id: 'cc47486b505141f19b840a88c8817a0c'
                    }
                    'caresetu-test-rest': {
                        table: 'sys_atf_test'
                        id: 'c0866d3ab7d0480dbba4948baaae4095'
                    }
                    'caresetu-test-rest-call-escalations': {
                        table: 'sys_atf_step'
                        id: '65a24e3d52474c5bb8441fff83c4ea82'
                    }
                    'caresetu-test-rest-call-high-risk': {
                        table: 'sys_atf_step'
                        id: '393c123a969746cfa09ab4ee8b25b2f5'
                    }
                    'caresetu-test-rest-call-score': {
                        table: 'sys_atf_step'
                        id: '3ae231cb4df84653a313fe8ff0c7c244'
                    }
                    'caresetu-test-rest-insert': {
                        table: 'sys_atf_step'
                        id: 'd5e8ec59ac294536b92905e9e9eaf3b8'
                    }
                    'caresetu-test-rest-log-escalations': {
                        table: 'sys_atf_step'
                        id: '822f88608b034090b3ef241ed6614db7'
                    }
                    'caresetu-test-rest-log-high-risk': {
                        table: 'sys_atf_step'
                        id: '51a3879cd9164dddafb2f09a07cf1586'
                    }
                    'caresetu-test-rest-log-insert': {
                        table: 'sys_atf_step'
                        id: '310413080b62406fae2bd2bc6d1a01cb'
                    }
                    'caresetu-test-rest-log-score': {
                        table: 'sys_atf_step'
                        id: 'c8d88d9ee03f4c85a89c149b5f8d03cd'
                    }
                    'caresetu-test-suite': {
                        table: 'sys_atf_test_suite'
                        id: '36535141b755469381b3e7e7620d9f06'
                    }
                    'caresetu-test-tpa-case-insert': {
                        table: 'sys_atf_step'
                        id: 'e822f546ee2047029271b09d8bf8154c'
                    }
                    'caresetu-test-tpa-enc-insert': {
                        table: 'sys_atf_step'
                        id: 'e0f27f45393b497db4d361a4b7fad726'
                    }
                    'caresetu-test-tpa-lifecycle': {
                        table: 'sys_atf_test'
                        id: '884043fb501d43acbc3232c18e8ecec8'
                    }
                    'caresetu-test-tpa-log-case-created': {
                        table: 'sys_atf_step'
                        id: '7eb5cf426ddc4d60b50994dbe459b74e'
                    }
                    'caresetu-test-tpa-log-complete': {
                        table: 'sys_atf_step'
                        id: 'a9723960efb445bb8256f267203eb8ef'
                    }
                    'caresetu-test-tpa-log-followup': {
                        table: 'sys_atf_step'
                        id: '88f3c4ac4da146efbee2824a70967d24'
                    }
                    'caresetu-test-tpa-rest-followup': {
                        table: 'sys_atf_step'
                        id: '5660d9babf2e45cabadcf751170f239b'
                    }
                    'caresetu-test-tpa-rest-update': {
                        table: 'sys_atf_step'
                        id: '5b80fca459d3431ebcfe849d6eb424f1'
                    }
                    'caresetu-tpa-api': {
                        table: 'sys_ws_definition'
                        id: 'da022562ed524df1879d7c59f518d115'
                    }
                    'caresetu-tpa-api-v1': {
                        table: 'sys_ws_version'
                        id: '9b347652767b496e85faf3abca6d8f14'
                    }
                    'caresetu-tpa-chase-engine': {
                        table: 'sys_script_include'
                        id: '9c3af75f7a294f798484d39ad2365713'
                    }
                    'caresetu-tpa-create-case': {
                        table: 'sys_ws_operation'
                        id: '2d2b8b984a2e40b59a306f761869423f'
                    }
                    'caresetu-tpa-followup-chaser': {
                        table: 'sysauto_script'
                        id: '7f38888b53f446d198726ff6bb7d3f94'
                    }
                    'caresetu-tpa-get-case': {
                        table: 'sys_ws_operation'
                        id: 'dc2c005b6ca34411824f4fc53aa56285'
                    }
                    'caresetu-tpa-list-cases': {
                        table: 'sys_ws_operation'
                        id: '8baf47b3a7c5456a805ad34b1a5bbcfd'
                    }
                    'caresetu-tpa-record-followup': {
                        table: 'sys_ws_operation'
                        id: 'd89a7b76927f41b68a609096c554e612'
                    }
                    'caresetu-tpa-test-suite': {
                        table: 'sys_atf_test_suite'
                        id: 'f993a65904b44496b8cd6062f7c7de4e'
                    }
                    'caresetu-tpa-update-case': {
                        table: 'sys_ws_operation'
                        id: 'cd69a8066181481390d06661f1cee86a'
                    }
                    'caresetu-validate-encounter': {
                        table: 'sys_script'
                        id: '74d8c1f4c1bb4c42bc887e39eb06fff6'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '94ea7797ad614cdcb0e568f1a42cf90e'
                    }
                    'src_server_business-rules_compute-risk-async_server_js': {
                        table: 'sys_module'
                        id: 'ea60d0f9fa5743a491bd21ead6ce20fd'
                    }
                    'src_server_business-rules_predict-discharge-async_server_js': {
                        table: 'sys_module'
                        id: 'a1c79069be334c4197999db4cc8797dc'
                    }
                    'src_server_business-rules_sync-blocker-count_server_js': {
                        table: 'sys_module'
                        id: '718b00b2d999481aa6dc70b696782280'
                    }
                    'src_server_business-rules_sync-handoff-count_server_js': {
                        table: 'sys_module'
                        id: 'd019337c43c9407e9f07c512c7c6c9f3'
                    }
                    'src_server_business-rules_validate-encounter_server_js': {
                        table: 'sys_module'
                        id: '1fec87359d684be9a6a7bced5898d27d'
                    }
                    'src_server_rest-api_acknowledge-handoff_server_js': {
                        table: 'sys_module'
                        id: '57cbd6e9aa11464e9cf132c0a7a09a15'
                    }
                    'src_server_rest-api_ai-query_server_js': {
                        table: 'sys_module'
                        id: '81ca820eb9914cfca452ed7514a72fe6'
                    }
                    'src_server_rest-api_approve-action-request_server_js': {
                        table: 'sys_module'
                        id: '8e8e5351e1564b1c961caea3728b42d5'
                    }
                    'src_server_rest-api_cancel-handoff_server_js': {
                        table: 'sys_module'
                        id: 'f06b8a0899254f0689f11c0ad6ec1942'
                    }
                    'src_server_rest-api_complete-handoff_server_js': {
                        table: 'sys_module'
                        id: 'fe284c841dc941a5984a7097393c5349'
                    }
                    'src_server_rest-api_create-blocker_server_js': {
                        table: 'sys_module'
                        id: 'be39fdc2d87845e9b4803f6c6e9c8c63'
                    }
                    'src_server_rest-api_create-handoff_server_js': {
                        table: 'sys_module'
                        id: '5e83c461cb2b4cac9b60b72af470f01b'
                    }
                    'src_server_rest-api_create-tpa-case_server_js': {
                        table: 'sys_module'
                        id: 'd4dae0bc36ad4045b396877bb3b02fa3'
                    }
                    'src_server_rest-api_get-action-request_server_js': {
                        table: 'sys_module'
                        id: 'e47e24dd70b24ed2a722220e1d8d98a2'
                    }
                    'src_server_rest-api_get-action-result_server_js': {
                        table: 'sys_module'
                        id: '214894e612304e59baeaccafbf8da47b'
                    }
                    'src_server_rest-api_get-blockers_server_js': {
                        table: 'sys_module'
                        id: '66f1a6d2b2384df1b8ba0f5b3bff5271'
                    }
                    'src_server_rest-api_get-discharge-prediction_server_js': {
                        table: 'sys_module'
                        id: 'ecbef57012954daf858255c426b27d53'
                    }
                    'src_server_rest-api_get-escalations_server_js': {
                        table: 'sys_module'
                        id: '5e60015dbf1b4df6a324f5d9127fa1a4'
                    }
                    'src_server_rest-api_get-handoff_server_js': {
                        table: 'sys_module'
                        id: '33bfbd2f8123440e84cb74bc2be4ce34'
                    }
                    'src_server_rest-api_get-tpa-case_server_js': {
                        table: 'sys_module'
                        id: 'e9146430c146408ba5da7ecb86ea9011'
                    }
                    'src_server_rest-api_high-risk-encounters_server_js': {
                        table: 'sys_module'
                        id: '615a1ac2d17048f58353fb40ab252511'
                    }
                    'src_server_rest-api_list-action-requests_server_js': {
                        table: 'sys_module'
                        id: '2db9ba8f58e84f3d81665a77ed737c8b'
                    }
                    'src_server_rest-api_list-handoffs_server_js': {
                        table: 'sys_module'
                        id: 'a49019408a93446c950a7baa9b0f64d1'
                    }
                    'src_server_rest-api_list-tpa-cases_server_js': {
                        table: 'sys_module'
                        id: 'aacbc26fb2bf4a69bf36137c2db70e58'
                    }
                    'src_server_rest-api_propose-action_server_js': {
                        table: 'sys_module'
                        id: '534dfea28f4e471dae2fdc1fae447cc3'
                    }
                    'src_server_rest-api_record-tpa-followup_server_js': {
                        table: 'sys_module'
                        id: '913cc5769b004e26ac8d41cedbfabfd3'
                    }
                    'src_server_rest-api_reject-action-request_server_js': {
                        table: 'sys_module'
                        id: '0d637759a97b44bb8a6e7b459fbb661b'
                    }
                    'src_server_rest-api_reject-handoff_server_js': {
                        table: 'sys_module'
                        id: '82c37ba14fa949d19b1db625d843b09e'
                    }
                    'src_server_rest-api_run-discharge-prediction_server_js': {
                        table: 'sys_module'
                        id: '51e8ac76ed7b4cfaa36c11c087d5ffc4'
                    }
                    'src_server_rest-api_score-encounter_server_js': {
                        table: 'sys_module'
                        id: 'a983856feca248f6b2c5255ab6f6a1f4'
                    }
                    'src_server_rest-api_update-blocker_server_js': {
                        table: 'sys_module'
                        id: '0256d2882072495f9d691c367ed809b2'
                    }
                    'src_server_rest-api_update-handoff_server_js': {
                        table: 'sys_module'
                        id: '18368a204d1c463c86ff58cd2a505658'
                    }
                    'src_server_rest-api_update-tpa-case_server_js': {
                        table: 'sys_module'
                        id: 'bb6db8c668304fd4905602d5be2f6f94'
                    }
                    'src_server_scheduled-scripts_handoff-overdue-chaser_server_js': {
                        table: 'sys_module'
                        id: '6642455520f94a1faf3ce31e1fe5d04f'
                    }
                    'src_server_scheduled-scripts_tpa-followup-chaser_server_js': {
                        table: 'sys_module'
                        id: '001bf37c431d4e9cbb9790850b09fe5c'
                    }
                    'src_server_script-includes_ActionExecutionEngine_server_js': {
                        table: 'sys_module'
                        id: '2419fd90181f4e4d9640b52feb21ce07'
                    }
                    'src_server_script-includes_AICoordinatorEngine_server_js': {
                        table: 'sys_module'
                        id: '470b84c2c29f4be2a1330a0d053262ff'
                    }
                    'src_server_script-includes_DischargePredictionEngine_server_js': {
                        table: 'sys_module'
                        id: '8a22e8f512924db9817d622a23847302'
                    }
                    'src_server_script-includes_HandoffEngine_server_js': {
                        table: 'sys_module'
                        id: '22d2ce057e0846d0b40586fa32f3a5fa'
                    }
                    'src_server_script-includes_OperationalRiskEngine_server_js': {
                        table: 'sys_module'
                        id: '5b6e0017c5774aaf94cd7169040ba68f'
                    }
                    'src_server_script-includes_TpaChaseEngine_server_js': {
                        table: 'sys_module'
                        id: '1aab1c1ac335487c8a0f47b4f7384367'
                    }
                }
                composite: [
                    {
                        table: 'sys_element_mapping'
                        id: '00a40e2e0dc94d57bbc1d112f94f7514'
                        key: {
                            id: '8000e25af9a7476a8c6239c96487d531'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '00cd44bae3464962919c3f2731e7a701'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '011ce6cc61fa49bd85d1d42cc7a9b1d1'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'target_resolution_time'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '01ad6f7f43ea4f5785391ac2aa7beb25'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'assigned_owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '026a87ea2f7e4dc3830e22e85ec8b1fc'
                        key: {
                            sys_security_acl: '48c04d57988f4aa0b2836afd774a8328'
                            sys_user_role: {
                                id: '5beaa5896d944d9f982717542715bd74'
                                key: {
                                    name: 'x_caresetu_ai.charge_nurse'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '029127f21f9c45a4b611a0dec89c7757'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '035b62aad5d84131b224dd0a05e9a475'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'escalation_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '036e03d9c9f44bea88fcf3e407ad5a0d'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                            value: 'critical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '037b9eb850e640e7bbc4b371a76c0c10'
                        key: {
                            document_key: '1a95b004772146e497f48e8305473480'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0414a61145ae40f7bf3242b3ee2028ea'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '04347710814843ae970e42c239ceb070'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'linked_blocker'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '04a3581d49274293b3687cfcb2a8d710'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '04ad7dedfef443398995f2d5ab24abc9'
                        key: {
                            category: 'x_caresetu_ai_blocker'
                            prefix: 'BLK'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '053b75919ab24b8e9e6f33bfb1172c5a'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'CareSetu Coordination Risk'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '05995ac06c924490b0b20d4e500b215e'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'scored_at'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '05e2c1c79d0e419c801c09024675ef19'
                        key: {
                            document_key: 'c8d88d9ee03f4c85a89c149b5f8d03cd'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '05f01051f21d43a8b0957e68d9dc3000'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'actual_discharge_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '064b90bd74104cd485e7b2ce07423e3c'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'resolution_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '06ab9739b56e48b1ae8435020dba8bf0'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '06bffcfe800247e5a3b61909bea32555'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'explanation'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '06fc50fc9f414ffa9be590c83c74d010'
                        key: {
                            document_key: '848c13582417412f830f10028d397bfc'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '07e96a7c9f184322aef3565eb1b0cdae'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '088c8f3f166842488ab7d05801157459'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '08979b4bb8984c2286dfd3deeedeeb05'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '09e81bf2aaa5434b93da396c8f108126'
                        key: {
                            document_key: 'da10a72461c24086956aa8b19da326fa'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0a8e8c99a57b40c980a6967108f9c42c'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'scored_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '0bc11de73666427f81d11fa079cf6b5a'
                        key: {
                            name: 'x_caresetu_ai/main.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0c88113e844644c9b48cd6896264fa71'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'last_followup_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '0dfb41af7a4b47eaa04808873e015f39'
                        key: {
                            name: 'x_caresetu_ai_command_center.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0e590f969e2d4c8d852df815e199fe12'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0e8d4d6e621341f9b749ee67cf9ecce5'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0ea3c06471884739ae660d2d516dadc4'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0f5dc5c3b7aa43b498c1f709ce2e2f8e'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'is_latest'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '109ae725d0ce4d3f9f37a8368555589e'
                        key: {
                            id: '65a24e3d52474c5bb8441fff83c4ea82'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '112c9aee16264e089c2fa91bdc41661a'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'rejection_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '11868861de7f427aadda4017962325da'
                        deleted: true
                        key: {
                            ui_action: '9334df9295614a45a8ee52e2fadb5a12'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '11bbea3d9f964135913e0ba46462e7f0'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '127b165bd7ca490f8f39fcae1410a572'
                        key: {
                            document_key: 'd5e8ec59ac294536b92905e9e9eaf3b8'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '12a9d1675b644330aa9e3ea9109833d6'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'creation_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '12aa1fd525a94d51a01bd6ded8753b29'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '12ee43089ed94ed3b25963b01fc36878'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            value: 'shift_change'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '1317b5df80a74c7a9bcaa4139b3801d4'
                        key: {
                            id: '5660d9babf2e45cabadcf751170f239b'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '132036f1bf8449f3a063434fa7961b0c'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '14010e941ccd4d269f1e9bc9b8004f55'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'is_latest'
                            value: 'false'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '142afbef99794016b4171787acd8ebf4'
                        key: {
                            sys_security_acl: '1d8d6afbdfb64e509c20facaf76f60c7'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '142de9b5430a468fb6a16c91f6a5f6b4'
                        key: {
                            document_key: 'e822f546ee2047029271b09d8bf8154c'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '14707659abee43229cd492a2ac184996'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'is_overdue'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '14ba7631b87048c3ade840fcc093b2e7'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '14ca71ddffed427ba2f631692aca4241'
                        key: {
                            name: 'x_caresetu_ai/main'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1599b62f7813482dab36252e5e0ca073'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '15c6042650f9426897fdbe3c5fa724cc'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '165d5e9107034467b14abe22243f4789'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'promised_discharge_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '16d5e1ac47d445a08d5257e1c11143a6'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '16f2a6fc12c04b43a7cd934523351b80'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '171d6686733f4df79c084f385903eb4e'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'sending_department'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '17c2bb72744844d19fa0a86750ded7e2'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '17ddff02625b447ab57ef8e73874f355'
                        key: {
                            id: '0b4b13f45ce5439e8d670c55a882190a'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '188dac86f5bc40b4b9b84fd3ec5a522a'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'actual_discharge_time'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '18cc062f3b6f43368337cdaaae5e0ceb'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '18f20bbe97b6423393b1d1fcaf1f94a4'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1a697dadcdcc42659dcd5f7c2231736a'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                            value: 'critical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '1a798ba195b54151b8f01313f9e79868'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b19e96c793a40e3ba7f36b1e905525b'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'receiving_staff'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1babad2f774f46d4b9bc8fa7dc3d7e3a'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'approved_amount'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1bac9b00e5114271b9f105d11ea99193'
                        key: {
                            document_key: 'e822f546ee2047029271b09d8bf8154c'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '1c045f73b0364ba2974bd1fa361eee35'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1d55b4516b23409a8597acdb43820648'
                        key: {
                            document_key: 'da10a72461c24086956aa8b19da326fa'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1da38b89e50349f1981486253c1f57d5'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'estimated_delay_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1dbe28aff1cd43b3ab054276441faaba'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'submitted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1f8234e877c047d290d08fe3b41528a8'
                        key: {
                            document_key: 'b62dc587bfb745489d0e34e51b6962df'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '200156a9239f4b5482e92362283a69f1'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '20a95496c3314cab86f1547143a395b1'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'explanation'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '20b5ed777ac8477688f337dd4e679e38'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '20dd89be1a2d418c8578d12a1667a73d'
                        key: {
                            id: '729901b67e0744c395aadff4fc4191ae'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '21589609308e4c5e92410b2ef6247de7'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'execution_time'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '21d42e1b62ec44df83d6fee9e7a59219'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '21e7cba706df41b7b3700c96ec1b3dc2'
                        key: {
                            sys_security_acl: 'b46e47cf6df0456a95624bcdae528517'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '21f5c78755dc4f2cac01215fad01c09c'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '223903fdb8f64cfdb233f9bf63f89b0b'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '22683adc26884464b306c863752c86ea'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '227622e63a8a4d5cbc93e969fb1d7888'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '228a5221ccbe4892bcf57157f4c901a5'
                        key: {
                            sys_security_acl: '40ad9e16638845839318c9c905c36e36'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '229fd0e6850e4758a715a30443bb7433'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_var_set'
                        id: '22e524da4419408f96840932c27846fd'
                        key: {
                            name: '__delivery_step__'
                            skill_config: {
                                id: '9d8fed4927d24638a7cb7d624decd3e4'
                                key: {
                                    skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                }
                            }
                            config_type: '7dfdff5893b64210aa5730f164891837'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '22e7f5d790754d4ab6eabcc56d701a44'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '23548d14cef946c4a0e587013eb781c8'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'failure_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '23812e9f1e09493fa0148b23215431cc'
                        key: {
                            document_key: {
                                id: '22e524da4419408f96840932c27846fd'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '9d8fed4927d24638a7cb7d624decd3e4'
                                        key: {
                                            skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'ab5ef79893b64210aa5730f16489185a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2386ff037f3f4950a4a6b3711b8b40b7'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'resolution_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '24cf1327f5ac4684b204e1130f40f728'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'last_followup_time'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '251b6e9156e4486aae03d78dd9773f0e'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '252c4611273c4aad9e7709056af4c9d7'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'open_blockers'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '253485f5f9ba4e2a9b39d0ff2f998471'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26fdc5cc9fd7475ba50edbfeadc360e8'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'estimated_delay_minutes'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '273bbb77613a4a70a58fc44aa17c2f70'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '28cb494b6b0f42c8a918a1000496b15d'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '28dd86bd40c547eab2ebb2d1c1fa7072'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '29564366250142e68b752210efd4cd7b'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '2989d3b5bdbf45908a133d4d5cc1f74c'
                        key: {
                            resource_mapping: {
                                id: 'e1f423640a8941e08127d3b02cb6e8b5'
                                key: {
                                    parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetEncounter'
                                }
                            }
                            resource_attribute_name: 'a3911d3b7f211210210ca65c4d86651b'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2a5087cfbc9c437cbd0afc7c1ffcdc50'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2a768dd1f1cc40058d1464da212ce753'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2b092b359c9a48789e95d4eb97f507a4'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '2b30d1530b5c41b495d52da4d1929f81'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b719cd4bffc451bbe91f4cab369dfa4'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'promised_discharge_time'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2ba067ce978d44efacf227c5ddd73532'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'charge_nurse'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2bc2ce703f03411b9c07cf9413138b85'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c7e2c1324e04a43945413a4f3fbf134'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'target_record'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2d2602ef3cbc4ebb9aff5c1eece21a09'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2d50bb9f08cb4efca35d6aa94a6deb06'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'target_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2f721d54e18f4a18a8c323ebe30eedf8'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'handoff_details'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2f9de7fdf9224108838da96b3f23ce63'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '30129eb45ea94d7991f4db81745c5e4d'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '30255d79d30842e2b1ae174bb95cbe6a'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'completion_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '304167b9a1604641a930bd765d1e8298'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'requested_amount'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '3043e1c3a6eb41c2bb3ad30a41909d81'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '3076d5a1c2354bc3b42c307a01508e81'
                        key: {
                            resource_mapping: {
                                id: '60ae2a1c99854a22b681803242acb8f3'
                                key: {
                                    parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetLatestRiskScore'
                                }
                            }
                            resource_attribute_name: '0bd1117b7f211210210ca65c4d8665ed'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '309260e231234711adfb87866f2c6280'
                        key: {
                            sys_security_acl: '079c3b59d9ff44f59d7c50925b32ab3e'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3189b6b7380c41b293b3941871353fc2'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '31a947e535674510b87150754add0bfc'
                        key: {
                            application_file: '14ca71ddffed427ba2f631692aca4241'
                            source_artifact: '0dfb41af7a4b47eaa04808873e015f39'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '31b19dda7dd749c8a257dc5fcc9cf0a2'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '31f6501a92f3462d90caa42cfef70c41'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '33f64e42dc5f46f3bc6b51def1405d86'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Escalation Status'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3284f1ab99c443e3ae3f3738428b6661'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'rationale'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '32b9025138dc46e4aa916aa1b3b347f5'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'acknowledged'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '32eb0d9de76848a5a10b24f92676c33d'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'risk_score'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3386638db90643eba695615d58d94e49'
                        key: {
                            document_key: '889713acea7d4905a723b03b385b8aeb'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '338f5042cc724c1da3d226c6bc1392c5'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '33f64e42dc5f46f3bc6b51def1405d86'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'Escalation Status'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '34ad449db58740debea8dff875758947'
                        key: {
                            category: 'x_caresetu_ai_escalation'
                            prefix: 'ESC'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '34cb2370f7d04f33b48b630a2316fea7'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: '35212f79c1dd43a4b9f53e11eec27218'
                        key: {
                            resource_mapping: {
                                id: '60ae2a1c99854a22b681803242acb8f3'
                                key: {
                                    parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetLatestRiskScore'
                                }
                            }
                            resource_attribute_name: 'a3911d3b7f211210210ca65c4d86651b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '35adb7eb5de14779a8eb527157a537bb'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '35bf16b12e0749a7a225c46026f0b429'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '35df9a8c488c4b8aa35aebc2a9fdaa08'
                        key: {
                            document_key: '51a3879cd9164dddafb2f09a07cf1586'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '35fb9891d9434dba88513656155eff5d'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                            value: 'acknowledged'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '368f8800dd634298ba0464e19de9a0a8'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38706d3233dc45bfad16fe9ed2fa67f8'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'target_table'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '396db84870b64e1ba66474fbad326afd'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                            value: 'final_bill'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '39be200a6df74edeae60ba02d590bd20'
                        key: {
                            document_key: '28d1aa0a79234288bc57b426d62f53f4'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a1e79019d2c480cb170aa0950476e62'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'promised_discharge_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3b0fbaaee8af4fbc878680d95c3b4363'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'linked_blocker'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3b92ccdd8e7d41ca81d2f33c0c299735'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'assigned_owner'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3cba8fdb653141f9869718d5c6a5220f'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                            value: 'escalated'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3ce080bfbc4e4274a800c13d78f9199e'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3cf9246fa5e84fb593659d0b175ef7b4'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'summary'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3d74d86b4db64163996412fbff4e8a52'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3e3d7bb98bf84cb98b8f11e2f6e30368'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'is_latest'
                            value: 'true'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_edge'
                        id: '3e81d73b4cec4fc2a0961e2af0972708'
                        key: {
                            internal_name: 'GetEncounter__GetLatestRiskScore'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '40d8bad02e4f48dab465566c949a6645'
                        key: {
                            document_key: 'e0f27f45393b497db4d361a4b7fad726'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '411fee92bfe14cc0b4c9ec8ca4e7387c'
                        key: {
                            document_key: '28d1aa0a79234288bc57b426d62f53f4'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '415302c816774435910975e8385a6737'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'proposed_by'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '417909635a9544edbe028a36b5e7f625'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'sending_department'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '418575c403f242c08e7c8af6fe2a26bc'
                        key: {
                            sys_security_acl: 'f4b26a5cbf4e446eaaed68cd808d8129'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '41c42c458a61434da0b93719ec5daed4'
                        key: {
                            sys_ui_section: {
                                id: 'e4034843e491443da3ead000f1889e7d'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Activity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'activity.xml'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '421483cb4ed24453acd601c835a93e06'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4221252c82b34029acdf9d42b51c28df'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '429ddf2925a24bf9ac7f7935e1f43772'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'next_followup_due'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '42b2cb7a580b4a9999161e645141bb7d'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'executed_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4317d4bc67784bfd9ba37e6720c3e8f3'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'executed_by'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill'
                        id: '43fd084c2a504ae7a0d8abadd2b7be51'
                        key: {
                            skill_document: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                            skill_table: 'sys_one_extend_capability'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '44355554bca04fb49d2602df68d99ffa'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'transport'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '44636c0cbee04277815a4bfd036a644e'
                        key: {
                            sys_security_acl: 'def853fa6c6244f29160ebe9254ff1b8'
                            sys_user_role: {
                                id: '5beaa5896d944d9f982717542715bd74'
                                key: {
                                    name: 'x_caresetu_ai.charge_nurse'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4472e700c917405c8bfe429bfd3dfd9f'
                        deleted: true
                        key: {
                            document_key: {
                                id: '22e524da4419408f96840932c27846fd'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '9d8fed4927d24638a7cb7d624decd3e4'
                                        key: {
                                            skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: 'f09e3f9893b64210aa5730f16489189f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '44b1eecf0c174e8698589e2bd4b6c4d4'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '44ff0253591b4c998ce6eee14c15af36'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '45c48c801b6a46b4b40faca3358724bf'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_delay_minutes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '45cfbb8a607648be8bb73e54c84948f8'
                        key: {
                            document_key: '88f3c4ac4da146efbee2824a70967d24'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4615686d8492420b8ab5278109541081'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '46688708dad648f781bff621717ddcde'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '46d4d67a40074b99a7a1a521bd7f613d'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '47ad2cbd277c4f509f46d244be3c1a8d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'linked_blocker'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '47bb5267af7f46d4a68964ebdc790442'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'followup_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4851d78124a3487a93ec711078a09958'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '495b846c14ce4316901bcfc9a50258f4'
                        key: {
                            document_key: 'e0f27f45393b497db4d361a4b7fad726'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '49faeaa86bfc405d9681b793f0728d91'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4b3e72b9d86941edb735c4060a758ef9'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4b6ef549211444ffa5c759c3bc7a18e6'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_edge'
                        id: '4b732cd1a3484245bd5096b9d81cbcac'
                        key: {
                            internal_name: 'GetLatestRiskScore__CareSetu Explain Discharge Risk'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4bde265d39d5412c8a0e3ded6cd51270'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4d07dbcb526f477b90932b7e0017fe56'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4d64f2a381b94992bd01066e47422ffb'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'ward'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4da92a8b706340e0b20c87a588c395d1'
                        key: {
                            sys_security_acl: '0a3ae45f84f4471c99ed9e46a5ae1730'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4dbca1bfe619470cbc7efbcaa7b27d74'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4e4be126a03744c0b17de89d7dccfd71'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                            value: 'normal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4e6a9124527c4a73bc77af2312b2ca5d'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4ec69915780348cb8e52690c37d5dfad'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'open_blockers'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4f4c1302ddf5418a8edf123ab217f929'
                        key: {
                            sys_security_acl: '04b8c3b4873e4d0dbd312c3a8307492a'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5225a1f13ea245faa068ade4f0784a27'
                        key: {
                            document_key: 'ef7d771e6fe64e8cba87f733951fc5c8'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '526e4801eb0a478eb4aeb09087e2eb31'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_delay_minutes'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '52704c049c3c49ed93c8adfde9595eb9'
                        key: {
                            document_key: 'd5e8ec59ac294536b92905e9e9eaf3b8'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5274c34237d74880a9b92b22d567fff7'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'department'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '52c1ca16efb946568326c50311c6dce2'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'department'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '53352be7b0e1404d82e6a30a01321f33'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'unack_handoffs'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '5389f66f5b634467b272a4a18ff9a1a1'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '53c6856d283e4b5391649115f8b43d4c'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'pending_documents'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5463f9a01eb0484680c1d66c90f861d4'
                        key: {
                            id: 'cc037261a02548d0bf4e1eeb29937550'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '54afe2a4464b4f2b92d2bf5b77fcd89c'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '54c610ab6869423e9e6a0b1ca8a0abe7'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5561b07ced4f4980b5cd74b4a1d21e7c'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '55a49495b3374e7aa6721a4908589d82'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '55d0144b46ea46628d0a1cc5d3ccba21'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'overdue_coord_tasks'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '55d4bdb26bc34297a793b19831b3d3bd'
                        key: {
                            document_key: 'd5e8ec59ac294536b92905e9e9eaf3b8'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '563a57699d2c4651854840862ce807cc'
                        key: {
                            id: 'e822f546ee2047029271b09d8bf8154c'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            field: 'field_values'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '586e530bc3fd423892887edb74d793f2'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'is_overdue'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '58af0de3ebda4c4496a1740a315751fe'
                        key: {
                            sys_security_acl: '6142ee3e34de456da410ee044ad3118c'
                            sys_user_role: {
                                id: '5beaa5896d944d9f982717542715bd74'
                                key: {
                                    name: 'x_caresetu_ai.charge_nurse'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '58e36e348cbf4ee0941bc4e50ecfb26e'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'charge_nurse'
                        }
                    },
                    {
                        table: 'sys_one_extend_definition_config'
                        id: '58fe074d16ec435f8ed6b988baa0656f'
                        key: {
                            definition: {
                                id: 'b1588883e3c8470aa111134e2d76b8d3'
                                key: {
                                    capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                    api: '936e514a53b3b110f028ddeeff7b128c'
                                }
                            }
                            capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59bcb9bc8a4e41228cf8fa25910b2812'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '59c981edbadf4351bc68a0764c308b1e'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5a033eef969e4340bf7b58735da424c9'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5a1e3dc4c3cf4707aa0a641a7636347a'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5a229fd462d34639a64f2624f252ba5f'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'next_followup_due'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '5beaa5896d944d9f982717542715bd74'
                        key: {
                            name: 'x_caresetu_ai.charge_nurse'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5c1a2961fd8140a89d2a723a2ea8dff1'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5c916a77a0644850bf1f51a61d71ac73'
                        key: {
                            sys_security_acl: 'c4b8fe3c00d44f098b0988012fd566fc'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5cd6c624b02c4f669cd1a60b9a20be62'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'overdue_coord_tasks'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5d63a4c760ac47f59d19f324b0b6cf29'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5e9c4c3d5e7444db879209da323639a9'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'proposed_parameters'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5eb664f97d3847aa968760a07568b0c0'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'approval_time'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f5a26fe17244fd393f5a7b12357a34f'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'prediction_breakdown'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '5f5d4467bcbe452bacb6164dd97a877f'
                        key: {
                            category: 'x_caresetu_ai_action_request'
                            prefix: 'ACT'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5fdd32e9402e4c65b094dfc3f45a6c0f'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'bed_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6011b15020c243a4936e05675dc8172d'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: '60ae2a1c99854a22b681803242acb8f3'
                        key: {
                            parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                            resource_capability: '51d095f77f211210210ca65c4d866591'
                            resource_name: 'GetLatestRiskScore'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6110bbb0029b4e7582b2bd62bbe42001'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '612d839bd942409f9755a692868b5817'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '61666dbb01f5489c94e3b53524b7c0fa'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'tpa'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '62e712a5c4784b8eb67e7d8ecbe94d85'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: '63106d8fea7040be8c5495dc2211281d'
                        key: {
                            parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                            resource_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '632f6fd49b2d49b2897f38d4db238ca9'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'Encounter Details'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '63b037bb9ec24a5d8cf5128bcbe8300e'
                        key: {
                            application_file: '0bc11de73666427f81d11fa079cf6b5a'
                            source_artifact: '0dfb41af7a4b47eaa04808873e015f39'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '63c3f4ac8de7474a896bc666b77561e7'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'approved_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '63c6109a14024087ac4c87042982bcff'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'resolution_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '63e8c5fdcdd145c78e32c92530df00f2'
                        key: {
                            id: 'b5e70a97cea945149025c8af26726197'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            field: 'field_values'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '64409071cdf344b589e48d62bd395412'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '647a036af8e34bf0acdb7eda3f01017c'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'is_overdue'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '64d3707f9e204479b3b0b11af9cc4dc4'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'reason'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '652d1c67915c40da82462c66ce0caac0'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'explanation'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6572acfb41fa47e89d6ea09d7023ecb3'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '65f804b37aa349c4904d6d4e0ef6e483'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                            value: 'resolved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '662232627b4e41f5ac5dbdff93694430'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '672ea2d84a10455caf14f3f33507f32c'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '672f22a5691241cba67a08da0549ea69'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6745622f44194e34a2d43bafeb8c7953'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '677a040b1c2c4756bc6b46c731c20b8e'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'Discharge Risk Scores'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '677ba7efc063401680c9eb719b1d3741'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'rationale'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '67c687c9d6d8413299782c18e9aca902'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6a47304846624683942babdfc35daf72'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'work_notes'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6b0b940f0ef1420d9a10a299af45d165'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                            value: 'normal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6b4b2110a99c454087325c600868e658'
                        key: {
                            document_key: 'b5e70a97cea945149025c8af26726197'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6b79eae92fec4ea1b07da13f686abd36'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'work_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '6c03b94ed68c46229f3566190ff7db01'
                        key: {
                            test_suite: 'c502dfe8f4a342438b3319c6a96aad6c'
                            test: 'b5a881899adf4c2b9475423e653e4fbe'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d5c039f692942b1a66b592458a45cf6'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'execution_result'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6de35d342c264f1d8e8e78a0c84c3b46'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'resolution_notes'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '6de58b9aedc34908a5f3c348630d1d7e'
                        key: {
                            application_file: 'b80550f4987b4606b0a64b5f89930310'
                            source_artifact: '0dfb41af7a4b47eaa04808873e015f39'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6ef3e0aba26f4f2f806f43a0a71e2ace'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6f3733cb366d42cea08613f23fdbbc00'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6f9fe09a5d8745d29f3b2d00bacd21fc'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'unack_handoffs'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '702acbc6bb7e4b8a9150b1de2a383904'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'pharmacy'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '703f55499a3145efbfb4488914e37c78'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '70aff402bb0848098d66702b4d974e13'
                        key: {
                            name: 'x_caresetu_ai.coordinator'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '70ec42264fd5466a9e402aaee0dcf26e'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '712a21f557a24a9f9e09f353930e545b'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'acknowledged_time'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '712ba63cfcb24e648c8fa62a1704355b'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '71bccf2196e141a2a30268b3de5b3a3d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '71d3fca4263b4da4b3c85344dcb7cbbd'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'approved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7260058171a34a329b17c5532bee469e'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7261ec776e2a47dabddcd9df93da16d9'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'resolution_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '72aacd47bbe24445a03b9043263359ec'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'receiving_department'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '72d9cac1a42940929758e9424671811c'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            value: 'inter_unit'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '73ffe24346b44a46928f54d244e79646'
                        key: {
                            id: 'f08575cc73384e9c95edc9360c83d55b'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '7441c8e64e9c466e8cffa67648cdf4f3'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '745fbe7d18b246499452588145902033'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74fb16c8ab174a2d8b2ff4963c67dfde'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'resolution_time'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '75b761c796654c72acc60301abf30fb9'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'is_latest'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '761d4ea5fe6948238a799992cb6fa320'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7660dc679bf74e6b96803738e5ead63d'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '76848443a36e406c97270f73dfe246c1'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'failure_reason'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '76db7b25c28b442db0ecf1e2f973305d'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '776ccd83b39843d181d54e58bfb7dc2a'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'reason'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '779119201de640b6b4e660705e13765e'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '783a0d0100294f49af8966eec2cabacb'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'owner'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '78faa84ece114ea884db97122d4aae02'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7958203c61a14187b3ee91cc193af03f'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'execution_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '79f5398d753647c494ca09b5dc9cc0df'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7a092a5169b34fe8bb433274e579de7c'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7a2ed99ffa4845dea28d520d7618f86a'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'target_record'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7a7e6bcceaa4486b8fb833dc16aebd27'
                        key: {
                            sys_security_acl: 'a3f5d98cabe447928d23afe3fef2d5e5'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7aaf8ce508c649d3a19d9c69f43565ed'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'patient_mrn'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7ad44dcd60684b2997f941493c268b82'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7b00159d2fc1415084e75a63376bc23c'
                        key: {
                            document_key: '28d1aa0a79234288bc57b426d62f53f4'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7b2ffed48f1045f3bdd711b0cdc40b67'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                            value: 'resolved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b6a4d5cbb5d43d5b18f6f8a33c01715'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'explanation'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7c3a6fdc4158418e942e314d091b427f'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7c65112688e64adcbb702971f9ef6b62'
                        key: {
                            sys_security_acl: 'b0da414e9c0245ebbd98e51cba6f1291'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7d0d895552154b59934d0efd53152a1b'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7de88f575b7e429b882f93d6d20c5816'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e124f70a06b4365bfd8d620f32b1747'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'data_quality_warning'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7e2cddc5d5164a5390424280cbef9aab'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7e5a27816b8a4ab8b31420ce2548d985'
                        key: {
                            document_key: 'bfa39caed7a94e809874deab27464f60'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7eb5b0c062c24a20ac6d465806c37333'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7f22521e146442a5aba36de2096c9044'
                        key: {
                            sys_ui_section: {
                                id: 'd7e1c49965894fe8a9d554b72b6e023d'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Notes'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'work_notes'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7fcc24862c33467b94db1fb73d3d1987'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '82198486f0fb403caa1d75785942760f'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '826953ac72a341378188a176db47d9a1'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '83029642227b407dbb4fc7c6499e2152'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'rejection_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '832c39d1de5d4c83a6c6351954369715'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '846ca89d80454db19af9bcb3c779b265'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '677a040b1c2c4756bc6b46c731c20b8e'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Discharge Risk Scores'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '848446d40006453385befbd52cf657ce'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'idempotency_key'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '85701be85b9f46bd82483bb7ec951206'
                        key: {
                            agent: '9d8fed4927d24638a7cb7d624decd3e4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '85b2390e88a4484f8282073b6d5dc233'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '85d4d47ecd5c400a9fc47b03ee1b79c6'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '86c8264f0f664135921315ee558b8e5d'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'submission_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '8738eed2ab6d4a61a3fb7dad0ac0493b'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8764b4ee85074ceb993469d24920c5e7'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '87ff3fe540e14e9d80ca06133d7915b0'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'patient_mrn'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '88041d64c70a4b0cad27a2b7fc65bf47'
                        key: {
                            document_key: 'da10a72461c24086956aa8b19da326fa'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '88bfa0d0d679422c904160f811f81369'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '88e4347ac7c743ca88689ba2434943c1'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                            value: 'routine'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '890429784a1a4932aa8b0529ff092a16'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '891bdb4045414854b7e57cabc2c13fa0'
                        key: {
                            sys_ui_section: {
                                id: 'd7e1c49965894fe8a9d554b72b6e023d'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Notes'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8b68d95ef59e4f6a8a7d70c883c7a63c'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'is_latest'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8cca85acff274800a7172e7238b99aff'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8cd71e03b5294189b15475e78d4b3094'
                        key: {
                            sys_ui_section: {
                                id: '33f64e42dc5f46f3bc6b51def1405d86'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Escalation Status'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '12M.x_caresetu_ai_encounter.x_caresetu_ai_escalation.encounter'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8d78fbaeecfd4d6cb47231cbafcadbf0'
                        key: {
                            sys_security_acl: 'ecbdd8a3a2bb4fe8be29f83ff84728cb'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8e981d62a38f4c9cb40714a51c602eea'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'approved_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8f109486fb434001841677cfb5005c08'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '901936a6da254ef5a405b9cd06c2ee20'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'coordination'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '914e32b933c44a9a973b5ecd746316ab'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'approved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9275d9da872b401a9fd7b40f319a2ea0'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'data_quality_warning'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '935c05f72f5b4688bf96eb32e939957b'
                        key: {
                            document_key: 'b62dc587bfb745489d0e34e51b6962df'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '935e6942f5334ed8b28be9a3e013492f'
                        key: {
                            sys_ui_section: {
                                id: '677a040b1c2c4756bc6b46c731c20b8e'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Discharge Risk Scores'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '12M.x_caresetu_ai_encounter.x_caresetu_ai_risk_score.encounter'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '93796acdcc284913a4e96b0a084167e1'
                        key: {
                            document_key: '180a7c7efac24d47b4551cbfe61d3a83'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '938384bb8609415ca7f75693e1cd3c25'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '940e631f96d64928b549901cccddec8e'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '9436c20c8f4a4883aa0e6a2831b7c586'
                        key: {
                            test_suite: '36535141b755469381b3e7e7620d9f06'
                            test: 'c0866d3ab7d0480dbba4948baaae4095'
                        }
                    },
                    {
                        table: 'sys_gen_ai_feature_mapping'
                        id: '9475acf0694945c29dde1a580af7fffd'
                        key: {
                            feature_name: 'CareSetu Explain Discharge Risk'
                            document: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9495c6b7df90410c946ecc6a048ed409'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'ward'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '951dadffeb6b4727808b1850be29736f'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'pending_acknowledgment'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '95f7f1a26a5f4798a9b883e263d7e929'
                        key: {
                            document_key: 'da10a72461c24086956aa8b19da326fa'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '962a2d36309b4aaaba1d51e0569d49e8'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9655642b5abf405ba7f6977d54e24c69'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'acknowledgment_deadline'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '968f82557d19469bb4d316ce631aa703'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '976d0ba4b5734f3d9b650d6536a481fb'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_config'
                        id: '9779090c72dd40aabb76a65ab8ddafe8'
                        key: {
                            skill_id: '43fd084c2a504ae7a0d8abadd2b7be51'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9895ab9048744c4cbc8897460e506e01'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'proposed_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9b2708d77d7a4e19a89e0bb24a8527d5'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                            value: 'high'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9b8dcec6038d43efa4b837d0d34493a1'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                            value: 'medium'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '9be90022d7b34f27a7899b99ad6cf14c'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'assigned_to'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9bf1ee80183f4990b8ceca832282d3cf'
                        key: {
                            sys_security_acl: 'bd1a3ca978e345069d1d5e9dd1c13443'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c12a9f3cfd241a7bfd55e5d7ee88166'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'creation_time'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config'
                        id: '9d8fed4927d24638a7cb7d624decd3e4'
                        key: {
                            skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9e249bcdd6194404afa7199b5e471909'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            value: 'discharge_prep'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9e5d34cbe23d479ab6c1d812ce036aeb'
                        key: {
                            document_key: 'e0f27f45393b497db4d361a4b7fad726'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9ed844ef5dce48e1bcfdfbe9ad4411bd'
                        key: {
                            document_key: '6cc6c99858994333b2c8dbc45b7e658b'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9f1fb23b509547e3bed0d9a8be93db93'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9f22f1752f3440138f8cadfc37fa4bb8'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9f521f835d0a40f5aa105b25a7fc9ced'
                        key: {
                            sys_security_acl: '08c8395469714ed0ba290b21c9d6e5d5'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9fa578bf72c24d99adc2ba0a85eb7cef'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9fa68ca645904792917041ee62b7b999'
                        key: {
                            document_key: 'd5e8ec59ac294536b92905e9e9eaf3b8'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a02e83dc98fa48a88e142d4164b46f94'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a03363d22301409ebbc205460bc05237'
                        key: {
                            document_key: 'e822f546ee2047029271b09d8bf8154c'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a07ec1f6bd0c402a90cad0c1a914ba62'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'a0b658a9b1434379898d7e5d08eb2b66'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'e4034843e491443da3ead000f1889e7d'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Activity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'a112c2cdf7e64b73aa57d16a20f5cb2a'
                        key: {
                            id: 'cc47486b505141f19b840a88c8817a0c'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a19876f027f843dd8711ecdbc2e53f09'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'pending_approval'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a2c44fb3831a4cd7a6600db2f58910b5'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                            value: 'record_tpa_followup'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4588efab4704cd8822d9762aed28c37'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'receiving_department'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a492328e2986442195df96a3dc5f67d9'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'is_latest'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4c4a664396646a09bf89b373ff751e7'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a519cd18f7c847fbb80a7b16009bcc40'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a562c3a805e1460fb5212d565f0886a5'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'payer_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a57402e414df4fabaefad42a4fe428d5'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a7e6f0c356f24f109844b771b67de237'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'charge_nurse'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a81d3dfc9a7a47ccbeb95f3564671254'
                        key: {
                            document_key: 'b62dc587bfb745489d0e34e51b6962df'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a88f3189ee2e419fa0d03143a25a49ee'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a892bf0cccc14987ac1a6c860c0c5a24'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'rejection_reason'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a8be69d0441148bfa805ccbd2a0de38e'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a98f17e315524c03a0485170f1f34af2'
                        key: {
                            document_key: 'b5e70a97cea945149025c8af26726197'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aa21be35275d45629efba2bd6923713e'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'submission_time'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aa84ea165f084c2da0fb92bc45b10887'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'aacdba8ac894403fbe6ad086bf3709f0'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'aaf1433ae7ee4656a8792b6df05eef38'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                            value: 'medium'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ab69aec3260846f8b57c4be6fea4878a'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ab6efeb8730d4225998c7568934937ab'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            value: 'post_op'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ab85673b42de4adb92fb12350178a2f1'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ac8f863b59d844c89c773256b729f3b3'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                            value: 'urgent'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ad643e3139b244bba406d79ea1387e83'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ada1418bda5d4f1880345f228eba941d'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'snapshot_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'adb930bf08cc4fd5a0388feac3d79113'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ae0311a6872143cabb4a3b562dd25503'
                        key: {
                            id: '3ae231cb4df84653a313fe8ff0c7c244'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ae4d528885de46ba872827dbac6d80a9'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aea2a6cb8c4b41f087eb47392f2dc07b'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aef0d9f910914f6a9b24ecc30f4c3eb0'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'is_overdue'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'af1e131c95184d17aec7b79d3948905b'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                            value: 'reassign_blocker'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'af33c609fca84711bc44884afd878350'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'af415e3091e04bfea07adbfb6bf3821c'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'rejection_reason'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'af5f10dbbae646db8780c794fd8db36b'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'afeda4daabfa414b8bf9398a70f3c93a'
                        key: {
                            document_key: '310413080b62406fae2bd2bc6d1a01cb'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b0444220d7cc46058279ccab8472e5dc'
                        key: {
                            document_key: '28d1aa0a79234288bc57b426d62f53f4'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b07aaa5c129e4062962ca36bac83202c'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'b0a321c890cb4fb581ef46017f31465b'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'is_latest'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0b784054ec245728659f1ac17e226ec'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'sending_staff'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b0eb772d95e54e8f94f6655e231a182b'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b10521ff1b8e423b885c5446c02c77ab'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'auth_reference_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_capability_definition'
                        id: 'b1588883e3c8470aa111134e2d76b8d3'
                        key: {
                            capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                            api: '936e514a53b3b110f028ddeeff7b128c'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b256607e8a8f498a952c2075dcb3973a'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b2e249883da449d282b08da3866e6cc6'
                        key: {
                            document_key: '7eb5cf426ddc4d60b50994dbe459b74e'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b2f63616ddec4b8cabb1911c5bc11843'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b2ff8d626a86402c8026320f2eddf40e'
                        key: {
                            document_key: 'b5e70a97cea945149025c8af26726197'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b310f4a56fd2407088f38d4b90854f62'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b36620f80d0943fb8968ae04e7cc5243'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'incomplete_milestones'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b3c339a84fbe458bb65d4f4f268ca2f0'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'execution_result'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'b4087a70fcdd43ac924cabf27e3ea538'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b5b79b995928492fb8471f6dfa005ab1'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'unack_handoffs'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b6214087ecf4409f838a5b0f8dade656'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'b6459d96cd7b4253ac2d602900055ef6'
                        key: {
                            category: 'x_caresetu_ai_tpa_case'
                            prefix: 'TPA'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b668ddd1236e434d969fb48da973a7bf'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'encounter'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'b80550f4987b4606b0a64b5f89930310'
                        key: {
                            endpoint: 'x_caresetu_ai_command_center.do'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b87328f7983245718087aa225fac7f91'
                        key: {
                            document_key: '4db11d9aac724617a25bdf003e9c9a98'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b988b69c5a4249a4bb8f55773b4910b7'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'escalated'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ba602a24677945989b08dd09a0d50cf7'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'explanation'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'badc83b1302c4e09ac02d47eab062333'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bb217e89fb7443398b289dd038a97153'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb74e6c23a154ee6befdcfeae85aff3c'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'patient_mrn'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bbe3f140de9249f79b31984f1637d061'
                        key: {
                            document_key: 'b5e70a97cea945149025c8af26726197'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bbecdf8e57e44211969905933d405b8b'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bbfa4b405f6e44d89f06f55f9bd6c130'
                        key: {
                            document_key: 'e0f27f45393b497db4d361a4b7fad726'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bc0b6823b223436f9c1da69ff1d51de5'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'risk_tier'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bc341a12c82940f5ac12864293e32c4c'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc907118f73a46fdb101a874e86254d3'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bca72136c8b849a79f5d40ba935726ae'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bce5983f7bb64a99ba2272e029565aad'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bcfb72a54fe446b4949b3df9842f4551'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'acknowledged_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bd6f38f72f1a41c189d1ad0054755931'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'snapshot_state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bd9c6565afe5440ea414974bbf7426ca'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'acknowledgment_deadline'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'be0cc30be8af46aea6f85c3876464000'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'payer_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'be5f5ccebeb045198b944d0940f21425'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'target_resolution_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'befd18798d88456b89cc1c3169dfd19c'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf991dd6df7541198ab4a06088a949bc'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bfa930dd28514928878df90c17f7f686'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bfc50f9dd73b48f49394063423b86399'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'prediction_breakdown'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_attribute_mapping'
                        id: 'c16429a9ee59468198702093a9a63b77'
                        key: {
                            resource_mapping: {
                                id: 'e1f423640a8941e08127d3b02cb6e8b5'
                                key: {
                                    parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                    resource_capability: '51d095f77f211210210ca65c4d866591'
                                    resource_name: 'GetEncounter'
                                }
                            }
                            resource_attribute_name: '0bd1117b7f211210210ca65c4d8665ed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c1826d06edee4c32bec245ac9c392fc7'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'auth_reference_number'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c1c52ef7e76a4447ab990f26517d06dd'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c284d83b2fe545868088e949ab84447a'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c2b4ebb6c3d04e66b0f8c029ebccd12d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c2cea2a1ab3f402fa15a6ee1f2de3a04'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'is_overdue'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c2f14aea06774374953ca48d9e275728'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'expected_discharge_time'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c326cae8951c46dbb3e32d634d309aab'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_score'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c34ac296bec44b219c2a943a317a504b'
                        key: {
                            sys_security_acl: 'bd62792bc836400397ee37cda98dffe9'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'c38e590a66ff4cf79c3349cb88b2e5fc'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'data_quality_warning'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c483a18740ee42699ff02c1c2ca5bbe9'
                        key: {
                            document_key: '5b80fca459d3431ebcfe849d6eb424f1'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c4aa2be6519d4943aa1e39dd2a94f00e'
                        key: {
                            sys_security_acl: 'b02f66372f4e43e5be18484f598ae3a2'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c5a10be69fb94e339f64382221c1a23f'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '59877da10b3222000b7da95e93673a56'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c5d67633406d45e98dc322f4d59fbca4'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c65099faa40f4c69aa76faeb02b2b0d6'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c918667ec7a8426890890ba955977419'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c91ed78c3c5c4ed99517ed8c6396c3d4'
                        key: {
                            document_key: 'f08575cc73384e9c95edc9360c83d55b'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c94e38ac459641c1b4e7d6cdae05580b'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ca56f0bdda8143359b34e2c175b825d1'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cb376d64a49b4b9fa821c510d21964d4'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'sending_staff'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cc1a08d8b0344c1780431d1da92a8697'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'handoff_details'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cc29d8b888e34e87a51b5ad37c7821c9'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '58408e250b3222000b7da95e93673a5c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cc5af956f3f54d4b9a1583999e7231f3'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cd3de1f99d124d648704c738f4d2580c'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ce6da6c0330d4e13bb762493b4332708'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'expected_discharge_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'd080af0673bb415581abfc583634a354'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'escalation_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd2d1b0c6af7044c2a224ee30668a5910'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'equipment'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd2df012c9cb44f21a3d0be674e8c16e5'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_discharge_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd3078e8d396c4580b73ff79db3c6ba3a'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'priority'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd363351419b744ef9b06ef375dd74230'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'd3817032a827434fa9f54bf433dda43e'
                        key: {
                            test_suite: '36535141b755469381b3e7e7620d9f06'
                            test: '5c7f2ef453724199b252ca0475dd772a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd3a02886b14945a3becdc07f225cb3ea'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd420737b74e94d18a0f4fd37ff9c73e1'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'proposed_parameters'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd52f0eb6dd7d4fdd9db36a602c47aa4f'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                            value: 'pre_auth'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd536fd54bef448c89d520414d68581b7'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd55ff90e7e824360a2c6d0f8571bc32a'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'documentation'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_nowassist_skill_config_status'
                        id: 'd57b276d090147c7a1faf4963f5ddc90'
                        key: {
                            skill_config: {
                                id: '9d8fed4927d24638a7cb7d624decd3e4'
                                key: {
                                    skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'd5a0e9d1e14a473ca0d64176befbbc29'
                        key: {
                            id: '5b80fca459d3431ebcfe849d6eb424f1'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd5c8e62291084ef88cd20a0f49352b64'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd5ea54bfee50459883215e2a8625abed'
                        key: {
                            document_key: 'f5517f8e90514343bf29adeba7d7e9ec'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd7012436d84444e4b01e2540405f0656'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                            value: 'escalate_blocker'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd771c78c86b84766ae70ac55fec8c708'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'category'
                            value: 'handoff'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd77f77eefcfc4983bb3ecd16d62729fd'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7af60c948634ca6ac038f3c8e593a54'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'requested_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'd7e1c49965894fe8a9d554b72b6e023d'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'Notes'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd8f09a4b0525492bb434df95ae1a8433'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                            value: 'cashless'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd9035f09b8d94e65884ed853811f5cec'
                        key: {
                            document_key: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd9275edfcf7c4caeac2a87f1f0241f82'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'is_overdue'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd953b81afd3244e98ea4a4b59d371c94'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd9b4692f10d94c549d26a9b9a2f80d20'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'approved_by'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'da65a521852749a2b07431d6422369fa'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'incomplete_milestones'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da71d32b4590476dba147480cc9c2547'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'db74adcb57df4440bc62f2749dd03bef'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'followup_count'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dbc5df5b4ca64cc49e497ecd60b18012'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_tier'
                            value: 'high'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dbe3a43cd4ae4a6a9db15ea6702aa56c'
                        key: {
                            document_key: '393c123a969746cfa09ab4ee8b25b2f5'
                            variable: '020a6af09fd32200ef4afa7dc67fcfec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dd8d013460544d4daa9fd3c990230c1f'
                        key: {
                            document_key: '0b4b13f45ce5439e8d670c55a882190a'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'dd9671cfbd074dc6aa77924a386d9797'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dda48c0830af44059e5d3e888e117758'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'df246ad5304a4ea98d2100983cac2bd1'
                        key: {
                            category: 'x_caresetu_ai_handoff'
                            prefix: 'HND'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'df7ff717d8014979864fab540c947513'
                        key: {
                            sys_ui_section: {
                                id: '053b75919ab24b8e9e6f33bfb1172c5a'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'CareSetu Coordination Risk'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'open_blockers'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e00c4407bc8149bb8bac5c2cadfbace2'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'risk_tier'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'e12cc655974942ed81713eb920592cf5'
                        key: {
                            sys_ui_form: {
                                id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'd7e1c49965894fe8a9d554b72b6e023d'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Notes'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e1d8976008d74c04a788b60039f3e2b0'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'expected_discharge_time'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e1dd8ae6b8d6493b98842b0b0b30852f'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'receiving_staff'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_generative_ai_prompt_config'
                        id: 'e1e9697ad2c644388ec32722bdef153a'
                        key: {
                            ai_config: '619441ea57f947c1bb101e1df7a18d20'
                        }
                    },
                    {
                        table: 'sys_one_extend_resource_mapping'
                        id: 'e1f423640a8941e08127d3b02cb6e8b5'
                        key: {
                            parent_capability: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                            resource_capability: '51d095f77f211210210ca65c4d866591'
                            resource_name: 'GetEncounter'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e205d9f4f01f4f018c1b7093d6963290'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e2700f3799424211911e6d2e587bf4cd'
                        key: {
                            sys_security_acl: '55220e1a51434198a3eacf888478d97d'
                            sys_user_role: {
                                id: '70aff402bb0848098d66702b4d974e13'
                                key: {
                                    name: 'x_caresetu_ai.coordinator'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e277931962224eb8a6c5b2184608cedd'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'ward'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e2d5acb0a5f74edeb61ef4fb56399654'
                        key: {
                            document_key: '90c5d20ee2a849aa9ae098b01ef4ee42'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'e4034843e491443da3ead000f1889e7d'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            caption: 'Activity'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e4aa15d55f5a48458d00a28762cb61d9'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e4c4ae7a1e624a33b8f38311108367bd'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'authorization_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e4c7806ba91447bf88a946befa1fda63'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'completion_time'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e4ce12f5920e474ab85a64d3d61bf853'
                        key: {
                            list_id: {
                                id: 'b4087a70fcdd43ac924cabf27e3ea538'
                                key: {
                                    name: 'x_caresetu_ai_risk_score'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'scored_at'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e51b00ada7fa42b3ad2065538121c3e8'
                        key: {
                            document_key: '729901b67e0744c395aadff4fc4191ae'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e56c8e0d138e43c0abb615eadd536d5d'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'sys_created_on'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e6453b27ea9640358cb117ba023e5d0a'
                        key: {
                            document_key: 'a9723960efb445bb8256f267203eb8ef'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e6bad836bc5e4d178256795e7aa86b30'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'incomplete_milestones'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7daa91ec5ce4a1f9062fc8c86d5e03a'
                        key: {
                            document_key: 'cc47486b505141f19b840a88c8817a0c'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e83f28df9ad1447fac52ec6ac6486f28'
                        key: {
                            document_key: '5660d9babf2e45cabadcf751170f239b'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e8508cce443e4192912bf302e4ea6a26'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'predicted_discharge_time'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e8e758ca5bed41f3b611da37dca57197'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: 'cec002650b3222000b7da95e93673aae'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'e8f35e611e4541fb96adc0a2dcfe49b2'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e9e19157c5f94c6ebe22844291b74d96'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'executing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e9e67c1e7162476ab6f0b6af926eab6d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'priority'
                            value: 'critical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea644016b0534431bd63687ecc34f99d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'encounter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'eaced50741b24779a8d47b6351226aaf'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'status'
                            value: 'expired'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eb11bde65b82445abec27e143b42a28d'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'eb5e614c9a7b4b2a8a13323977c689b5'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'status'
                            value: 'under_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ebc70ce7c22b40a2adec41360af0e00e'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'action_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ecd2c79bdd2a43829101f263e13107a2'
                        key: {
                            id: '9cad0af34ba54c0492bc6cd603fcf1c3'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ece5e93841ae49e69e34a4bd892a009c'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'idempotency_key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ed780925d95c4b538314afc65061d1c4'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'bed_number'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'eddadfcc6dbb4acb9a19be361facc201'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '6cdd0ab543010210b6f9a0246bb8f2f2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eed9cebb8c6b4f45aa770493778bd1cc'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f11709eb5a504c22ade9d6859335afac'
                        key: {
                            name: 'x_caresetu_ai_risk_score'
                            element: 'is_latest'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f1801b6892244bbc8f7b963593a05159'
                        key: {
                            name: 'x_caresetu_ai_action_request'
                            element: 'approval_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f20a18e65b234cdd8db833e206974e8e'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f214bb57ab3c447ba8d0e33cfbf9ad0d'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f24f11e8e6de434b85226e0967c77589'
                        key: {
                            document_key: 'b62dc587bfb745489d0e34e51b6962df'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f26585861adb4cdd8f234e7a5483134b'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f30b0832b6cb42f6a99e9d49863d1c30'
                        key: {
                            name: 'x_caresetu_ai_escalation'
                            element: 'risk_score'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f380f91c19584741b1337bb4d2f286b8'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f394b0a5bce24dfda776e3964ccc098a'
                        key: {
                            name: 'x_caresetu_ai_encounter'
                            element: 'overdue_coord_tasks'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'f459597cd4c1448eaf2fdfb3f8638f3c'
                        key: {
                            test_suite: '36535141b755469381b3e7e7620d9f06'
                            test: '4dc0b0b8ad7047bb919af3d23e8eaae8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f55422cd6a9c4e8daeb37448df40bc06'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f5b7abdf8d50410684566eedcb0d1fa7'
                        key: {
                            document_key: '8000e25af9a7476a8c6239c96487d531'
                            variable: '89ad06b543010210b6f9a0246bb8f2d7'
                        }
                    },
                    {
                        table: 'sys_gen_ai_skill_applicability'
                        id: 'f61a0ebb6f9d498fbf233371696cac6b'
                        key: {
                            skill_id: '43fd084c2a504ae7a0d8abadd2b7be51'
                        }
                    },
                    {
                        table: 'sys_gen_ai_strategy_mapping'
                        id: 'f6808349919042a7a4f6fe43416210c8'
                        key: {
                            strategy: 'CAPABILITY_EXECUTION'
                            feature: {
                                id: '9475acf0694945c29dde1a580af7fffd'
                                key: {
                                    feature_name: 'CareSetu Explain Discharge Risk'
                                    document: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'f708a268ed5242bfae7e676367379117'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'risk_score'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f823224592b541aa87108296c38bab19'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f83d9a7ca8774921aa5740f47111cdb0'
                        deleted: true
                        key: {
                            document_key: {
                                id: '22e524da4419408f96840932c27846fd'
                                key: {
                                    name: '__delivery_step__'
                                    skill_config: {
                                        id: '9d8fed4927d24638a7cb7d624decd3e4'
                                        key: {
                                            skill_id: 'ed6bcfeaf26b4dba90e7f7d8ffa0bf13'
                                        }
                                    }
                                    config_type: '7dfdff5893b64210aa5730f164891837'
                                }
                            }
                            variable: '4fee37d893b64210aa5730f164891896'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f86c09c1c6a54ba59ab742abb2a51caa'
                        key: {
                            document_key: '3ae231cb4df84653a313fe8ff0c7c244'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'f8a621e3f0964cb5a7540842ad395874'
                        key: {
                            list_id: {
                                id: '00cd44bae3464962919c3f2731e7a701'
                                key: {
                                    name: 'x_caresetu_ai_escalation'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f8b15fd4912f4ebba181c7df9b40ec6b'
                        key: {
                            name: 'x_caresetu_ai_tpa_case'
                            element: 'linked_blocker'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f945c436eb394fe485aeac0b146b83ce'
                        key: {
                            document_key: 'e822f546ee2047029271b09d8bf8154c'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f965cf312e8845a6ad861a9733e522bb'
                        key: {
                            id: '866916f949574b159c408a1aebb49be3'
                            table: 'var__m_atf_input_variable_e00571a10b3222000b7da95e93673a8f'
                            field: 'end_point'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fadba667808546d0a3149d59c11c7fb9'
                        key: {
                            sys_ui_section: {
                                id: '632f6fd49b2d49b2897f38d4db238ca9'
                                key: {
                                    name: 'x_caresetu_ai_encounter'
                                    caption: 'Encounter Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actual_discharge_time'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'faf0ab8324de4c5893cdd59d39958719'
                        key: {
                            name: 'x_caresetu_ai_blocker'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fb3e930284e241ac93ce2af0d4e6b07c'
                        key: {
                            name: 'x_caresetu_ai_discharge_prediction'
                            element: 'promised_discharge_time'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fba6ea12d17e46169858e798d7563c22'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'category'
                            value: 'procedure'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fc14e29c716c439b8d541a925fad3d32'
                        key: {
                            document_key: '65a24e3d52474c5bb8441fff83c4ea82'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fcee6ae5079040d0aaa4e33231af9642'
                        key: {
                            name: 'x_caresetu_ai_handoff'
                            element: 'status'
                            value: 'escalated'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'fdea2e328d6445fb844b83d5025dd458'
                        key: {
                            test_suite: 'f993a65904b44496b8cd6062f7c7de4e'
                            test: '884043fb501d43acbc3232c18e8ecec8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fe6c9d5f592741f6a97ee033e9a6da29'
                        key: {
                            document_key: '822f88608b034090b3ef241ed6614db7'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ff604c510324414382ff09d297ae8876'
                        key: {
                            document_key: 'cc037261a02548d0bf4e1eeb29937550'
                            variable: '81e042650b3222000b7da95e93673aa2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ff9aa8fc0db44198945e1a3aa8ef20b3'
                        key: {
                            document_key: '866916f949574b159c408a1aebb49be3'
                            variable: '50bff9250b3222000b7da95e93673a9b'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'ffe1920cc2e3457ea2a0e0c98f1b4463'
                        key: {
                            category: 'x_caresetu_ai_encounter'
                            prefix: 'ENC'
                        }
                    },
                ]
            }
        }
    }
}
