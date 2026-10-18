import { Role } from '@servicenow/sdk/core'
export const coordinatorRole = Role({
    $id: Now.ID['caresetu-coordinator-role'],
    name: 'x_caresetu_ai.coordinator',
    description: 'CareSetu care coordinator — read/write patient encounters and risk scores.',
})

export const chargeNurseRole = Role({
    $id: Now.ID['caresetu-charge-nurse-role'],
    name: 'x_caresetu_ai.charge_nurse',
    description: 'CareSetu charge nurse — coordinator access plus escalation visibility and assignment.',
    // NOTE: Role inclusion (charge_nurse includes coordinator) must be configured
    // manually on the instance via System Security → Roles after deploy.
    // The SDK Role() API does not support an `includes` property in 4.13.3.
})
 