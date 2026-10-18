import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import html from '../../client/index.html'

/**
 * CareSetu AI — Discharge Command Center
 *
 * Standalone React SPA served at x_caresetu_ai_command_center.do
 * Provides the full Command Center dashboard and Encounter 360 detail view.
 *
 * UI Phase only — does not modify any backend logic, tables, or scoring rules.
 */
export const caresetu_command_center = UiPage({
    $id: Now.ID['caresetu-command-center'],
    endpoint: 'x_caresetu_ai_command_center.do',
    description: 'CareSetu AI Discharge Command Center — hospital discharge operations dashboard',
    direct: true,
    html: html,
})
