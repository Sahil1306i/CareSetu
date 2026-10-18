import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { coordinatorRole, chargeNurseRole } from '../roles/caresetu-roles.now'

/**
 * CareSetu AI — Application Navigator Menu
 *
 * Defines the top-level 'CareSetu AI' section in the ServiceNow Application Navigator (All menu)
 * and the 'Command Center' module linking directly to the React SPA UI Page.
 *
 * Visibility is granted to CareSetu coordinators and charge nurses (and platform admins).
 */
export const caresetuAppMenu = ApplicationMenu({
    $id: Now.ID['caresetu-app-menu'],
    title: 'CareSetu AI',
    hint: 'CareSetu AI — Hospital Discharge Command Center',
    description: 'CareSetu AI hospital discharge operations and patient encounter management',
    roles: [coordinatorRole, chargeNurseRole],
    active: true,
})

export const caresetuCommandCenterModule = Record({
    $id: Now.ID['caresetu-command-center-module'],
    table: 'sys_app_module',
    data: {
        title: 'Command Center',
        application: caresetuAppMenu,
        link_type: 'DIRECT',
        query: 'x_caresetu_ai_command_center.do',
        hint: 'CareSetu AI — Hospital Discharge Command Center',
        roles: ['x_caresetu_ai.coordinator', 'x_caresetu_ai.charge_nurse'],
        active: true,
        order: 100,
    },
})
