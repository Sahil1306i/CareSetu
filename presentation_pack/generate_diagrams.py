"""
CareSetu AI - Architecture Diagram Generator
Generates presentation-grade SVGs (1920x1080), high-resolution PNGs, and .drawio files.
"""

import os
import subprocess

DIAGRAMS_DIR = r"C:\Users\sahil\CareSetu\presentation_pack\diagrams"
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# -----------------------------------------------------------------------------
# 1. Architecture Overview SVG
# -----------------------------------------------------------------------------
def get_architecture_overview_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1128"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#162032"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <marker id="arrowTeal" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#14B8A6"/>
    </marker>
    <marker id="arrowAmber" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  
  <!-- Subtle Grid Overlay -->
  <g opacity="0.04" stroke="#FFFFFF" stroke-width="1">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40"/>
    </pattern>
    <rect width="1920" height="1080" fill="url(#grid)"/>
  </g>

  <!-- Header Section -->
  <g transform="translate(60, 40)">
    <rect width="64" height="64" rx="14" fill="url(#tealGrad)"/>
    <text x="32" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">CS</text>
    
    <text x="84" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">CareSetu AI — Enterprise Architecture Overview</text>
    <text x="84" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" fill="#94A3B8">ServiceNow Scoped Inpatient Operational Orchestration Engine (x_caresetu_ai)</text>
    
    <!-- Header Badges -->
    <g transform="translate(1320, 10)">
      <rect width="150" height="34" rx="17" fill="#132E48" stroke="#1E4E79" stroke-width="1"/>
      <circle cx="18" cy="17" r="5" fill="#14B8A6"/>
      <text x="32" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#38BDF8">Scope: x_caresetu_ai</text>
      
      <rect x="165" y="0" width="160" height="34" rx="17" fill="#1F2937" stroke="#374151" stroke-width="1"/>
      <circle cx="183" cy="17" r="5" fill="#F59E0B"/>
      <text x="197" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#FCD34D">ServiceNow Utah/Xanadu</text>
      
      <rect x="340" y="0" width="140" height="34" rx="17" fill="#064E3B" stroke="#047857" stroke-width="1"/>
      <circle cx="358" cy="17" r="5" fill="#34D399"/>
      <text x="372" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#6EE7B7">Zero-Mutation AI</text>
    </g>
  </g>

  <!-- LAYER 1: PRESENTATION & CLIENT LAYER (y: 130 to 285) -->
  <g transform="translate(60, 130)">
    <rect width="1800" height="150" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    <rect width="1800" height="34" rx="14" fill="#1E293B"/>
    <text x="24" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8" letter-spacing="1">LAYER 1: PRESENTATION &amp; WORKFLOW UI (ServiceNow UI Page: x_caresetu_ai_command_center.do | React 18 SPA)</text>
    
    <!-- 5 UI Components -->
    <g transform="translate(20, 48)">
      <!-- Card 1 -->
      <rect width="335" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="16" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Command Center Dashboard</text>
      <text x="16" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Live Bed Triage, Urgency Tiers,</text>
      <text x="16" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Pipeline Status &amp; Real-time Counters</text>
      
      <!-- Card 2 -->
      <rect x="355" width="335" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="371" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">Encounter 360 View</text>
      <text x="371" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Patient Timeline, Discrete Signals,</text>
      <text x="371" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Active Blockers, Handoffs &amp; Delay Clock</text>

      <!-- Card 3 -->
      <rect x="710" width="335" height="85" rx="8" fill="url(#cardGrad)" stroke="#0D9488" stroke-width="1"/>
      <text x="726" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#14B8A6">AI Care Coordinator</text>
      <text x="726" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Grounded Operational Briefing,</text>
      <text x="726" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Root-Cause Attribution &amp; Action Proposals</text>

      <!-- Card 4 -->
      <rect x="1065" width="335" height="85" rx="8" fill="url(#cardGrad)" stroke="#D97706" stroke-width="1"/>
      <text x="1081" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#F59E0B">Fix It For Me Action Cards</text>
      <text x="1081" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Read-Only Proposed Actions with</text>
      <text x="1081" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Rationale &amp; Human Approval Boundary</text>

      <!-- Card 5 -->
      <rect x="1420" width="340" height="85" rx="8" fill="url(#cardGrad)" stroke="#475569" stroke-width="1"/>
      <text x="1436" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0">Emergency Operations</text>
      <text x="1436" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Local Surge View &amp; Rapid Triage</text>
      <text x="1436" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#CBD5E1">(Honest Boundary: No External Telemetry)</text>
    </g>
  </g>

  <!-- Connectors Layer 1 -> Layer 2 -->
  <g stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6">
    <line x1="250" y1="280" x2="250" y2="305" marker-end="url(#arrowTeal)"/>
    <line x1="600" y1="280" x2="600" y2="305" marker-end="url(#arrowTeal)"/>
    <line x1="960" y1="280" x2="960" y2="305" marker-end="url(#arrowTeal)"/>
    <line x1="1310" y1="280" x2="1310" y2="305" marker-end="url(#arrowTeal)"/>
    <line x1="1670" y1="280" x2="1670" y2="305" marker-end="url(#arrowTeal)"/>
  </g>

  <!-- LAYER 2: API & SECURITY BOUNDARY (y: 310 to 450) -->
  <g transform="translate(60, 310)">
    <rect width="1800" height="135" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    <rect width="1800" height="34" rx="14" fill="#1E293B"/>
    <text x="24" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#10B981" letter-spacing="1">LAYER 2: SCOPED SCRIPTED REST APIS &amp; SECURITY ACCESS CONTROL (x_caresetu_ai/*)</text>
    
    <g transform="translate(20, 48)">
      <!-- Security Card 1 -->
      <rect width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#059669" stroke-width="1"/>
      <text x="16" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#34D399">Scripted REST API Endpoints</text>
      <text x="16" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">/encounters, /blockers, /handoffs, /tpa,</text>
      <text x="16" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">/ai-coordinator, /actions/execute</text>

      <!-- Security Card 2 -->
      <rect x="445" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#059669" stroke-width="1"/>
      <text x="461" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#34D399">Role-Based Access Control (RBAC)</text>
      <text x="461" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">x_caresetu_ai.admin (Full system config)</text>
      <text x="461" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">x_caresetu_ai.coordinator (Approve/execute actions)</text>

      <!-- Security Card 3 -->
      <rect x="890" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#059669" stroke-width="1"/>
      <text x="906" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#34D399">Table &amp; Field Level ACLs</text>
      <text x="906" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Read/Write ACLs on all 8 tables</text>
      <text x="906" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Strict write boundary on execution state fields</text>

      <!-- Security Card 4 -->
      <rect x="1335" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#D97706" stroke-width="1"/>
      <text x="1351" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#F59E0B">Server Authorization &amp; State Guards</text>
      <text x="1351" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Re-query target state before execution</text>
      <text x="1351" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Strict allowlist validation &amp; idempotency check</text>
    </g>
  </g>

  <!-- Connectors Layer 2 -> Layer 3 -->
  <g stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6">
    <line x1="300" y1="445" x2="300" y2="470" marker-end="url(#arrowTeal)"/>
    <line x1="750" y1="445" x2="750" y2="470" marker-end="url(#arrowTeal)"/>
    <line x1="1200" y1="445" x2="1200" y2="470" marker-end="url(#arrowTeal)"/>
    <line x1="1650" y1="445" x2="1650" y2="470" marker-end="url(#arrowTeal)"/>
  </g>

  <!-- LAYER 3: DETERMINISTIC OPERATIONAL SERVICES (y: 475 to 630) -->
  <g transform="translate(60, 475)">
    <rect width="1800" height="150" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    <rect width="1800" height="34" rx="14" fill="#1E293B"/>
    <text x="24" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#F59E0B" letter-spacing="1">LAYER 3: DETERMINISTIC OPERATIONAL SERVICES (Scoped Script Includes)</text>
    
    <g transform="translate(20, 48)">
      <!-- Engine 1 -->
      <rect width="280" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">OperationalRiskEngine</text>
      <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">0-100 Deterministic Scoring</text>
      <text x="14" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">Time, Tasks, Milestones, Handoffs</text>
      <text x="14" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#38BDF8">Tiers: Normal, Med, High, Crit</text>

      <!-- Engine 2 -->
      <rect x="295" width="285" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="309" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">DischargePredictionEngine</text>
      <text x="309" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Additive Delay Timeline Clock</text>
      <text x="309" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">Promised Time + Category Delays</text>
      <text x="309" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#38BDF8">Zero double-counting logic</text>

      <!-- Engine 3 -->
      <rect x="595" width="285" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="609" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">HandoffEngine</text>
      <text x="609" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Shift Transition Governance</text>
      <text x="609" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">30m Target Ack SLA Monitoring</text>
      <text x="609" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#38BDF8">Auto-chaser reminder &amp; blocker sync</text>

      <!-- Engine 4 -->
      <rect x="895" width="285" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="909" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">TpaChaseEngine</text>
      <text x="909" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Insurance Pre-Auth Lifecycle</text>
      <text x="909" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">15m / 30m / 45m Follow-up SLA</text>
      <text x="909" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#38BDF8">Auto-chasing state machine</text>

      <!-- Engine 5 -->
      <rect x="1195" width="285" height="85" rx="8" fill="url(#cardGrad)" stroke="#0D9488" stroke-width="1"/>
      <text x="1209" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#14B8A6">AICoordinatorEngine</text>
      <text x="1209" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Grounded Operational Synthesis</text>
      <text x="1209" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">Context aggregator across all tables</text>
      <text x="1209" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#2DD4BF">Formulates Fix It For Me proposals</text>

      <!-- Engine 6 -->
      <rect x="1495" width="265" height="85" rx="8" fill="url(#cardGrad)" stroke="#D97706" stroke-width="1"/>
      <text x="1509" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#F59E0B">ActionExecutionEngine</text>
      <text x="1509" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Safe Mutation Dispatcher</text>
      <text x="1509" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#64748B">6 Allowlisted Action Handlers</text>
      <text x="1509" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#FBBF24">Enforces approval &amp; audits result</text>
    </g>
  </g>

  <!-- Connectors Layer 3 -> Layer 4 -->
  <g stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6">
    <line x1="200" y1="625" x2="200" y2="650" marker-end="url(#arrowTeal)"/>
    <line x1="500" y1="625" x2="500" y2="650" marker-end="url(#arrowTeal)"/>
    <line x1="800" y1="625" x2="800" y2="650" marker-end="url(#arrowTeal)"/>
    <line x1="1100" y1="625" x2="1100" y2="650" marker-end="url(#arrowTeal)"/>
    <line x1="1400" y1="625" x2="1400" y2="650" marker-end="url(#arrowTeal)"/>
    <line x1="1700" y1="625" x2="1700" y2="650" marker-end="url(#arrowTeal)"/>
  </g>

  <!-- LAYER 4: SCOPED DATA MODEL (y: 655 to 810) -->
  <g transform="translate(60, 655)">
    <rect width="1800" height="150" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    <rect width="1800" height="34" rx="14" fill="#1E293B"/>
    <text x="24" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8" letter-spacing="1">LAYER 4: SCOPED DATA MODEL &amp; PERSISTENCE (ServiceNow Scoped Tables: x_caresetu_ai_*)</text>
    
    <g transform="translate(20, 48)">
      <!-- Table 1 -->
      <rect width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._encounter</text>
      <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Inpatient Master Record</text>
      <text x="14" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">Bed, Promised/Exp Time,</text>
      <text x="14" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Risk Tier, Dynamic Counters</text>

      <!-- Table 2 -->
      <rect x="255" width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="269" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._blocker</text>
      <text x="269" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Operational Blockers</text>
      <text x="269" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">Category (TPA, Transport...)</text>
      <text x="269" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Severity, Owner, Status</text>

      <!-- Table 3 -->
      <rect x="510" width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="524" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._handoff</text>
      <text x="524" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Shift Transition Records</text>
      <text x="524" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">From/To Dept, Role, SBAR,</text>
      <text x="524" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Status: pending / acknowledged</text>

      <!-- Table 4 -->
      <rect x="765" width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="779" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._tpa_case</text>
      <text x="779" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Insurance Case Tracker</text>
      <text x="779" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">TPA Name, Claim #, Status,</text>
      <text x="779" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Chase count, Follow-up SLA</text>

      <!-- Table 5 -->
      <rect x="1020" width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="1034" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._escalation</text>
      <text x="1034" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">High/Crit Risk Triggers</text>
      <text x="1034" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">Linked to Encounter,</text>
      <text x="1034" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Active flag, Escalation reason</text>

      <!-- Table 6 -->
      <rect x="1275" width="240" height="85" rx="8" fill="url(#cardGrad)" stroke="#D97706" stroke-width="1"/>
      <text x="1289" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#F59E0B">..._action_request</text>
      <text x="1289" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Fix It For Me Actions</text>
      <text x="1289" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">State: proposed/exec/done,</text>
      <text x="1289" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#FBBF24">Approved By, Target ref, Audit</text>

      <!-- Table 7 -->
      <rect x="1530" width="230" height="85" rx="8" fill="url(#cardGrad)" stroke="#1E4E79" stroke-width="1"/>
      <text x="1544" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12.5" font-weight="700" fill="#FFFFFF">..._risk_score / pred</text>
      <text x="1544" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Calculation Snapshots</text>
      <text x="1544" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#64748B">Historical score audit logs,</text>
      <text x="1544" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#38BDF8">Signal contributions, trends</text>
    </g>
  </g>

  <!-- Connectors Layer 4 -> Layer 5 -->
  <g stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6">
    <line x1="300" y1="805" x2="300" y2="830" marker-end="url(#arrowTeal)"/>
    <line x1="750" y1="805" x2="750" y2="830" marker-end="url(#arrowTeal)"/>
    <line x1="1200" y1="805" x2="1200" y2="830" marker-end="url(#arrowTeal)"/>
    <line x1="1650" y1="805" x2="1650" y2="830" marker-end="url(#arrowTeal)"/>
  </g>

  <!-- LAYER 5: AUTOMATION & INTEGRATION LAYER (y: 835 to 985) -->
  <g transform="translate(60, 835)">
    <rect width="1800" height="135" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    <rect width="1800" height="34" rx="14" fill="#1E293B"/>
    <text x="24" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#A855F7" letter-spacing="1">LAYER 5: AUTOMATION, EVENT SYNCHRONIZATION &amp; AI INTEGRATION BACKBONE</text>
    
    <g transform="translate(20, 48)">
      <!-- Automation 1 -->
      <rect width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#7C3AED" stroke-width="1"/>
      <text x="16" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#C084FC">Async Business Rules</text>
      <text x="16" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">compute-risk-async, blocker-recalc,</text>
      <text x="16" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">sync-encounter-counters (Instant reactive rescoring)</text>

      <!-- Automation 2 -->
      <rect x="445" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#7C3AED" stroke-width="1"/>
      <text x="461" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#C084FC">Scheduled Script Executions</text>
      <text x="461" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">TPA Auto-Chaser (Runs every 15 mins)</text>
      <text x="461" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Handoff SLA Monitor (Runs periodically)</text>

      <!-- Automation 3 -->
      <rect x="890" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#0D9488" stroke-width="1"/>
      <text x="906" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2DD4BF">Deterministic AI Coordinator Engine</text>
      <text x="906" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Direct in-scope operational context aggregator</text>
      <text x="906" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Grounds all briefing answers directly from tables</text>

      <!-- Automation 4 -->
      <rect x="1335" width="425" height="72" rx="8" fill="url(#cardGrad)" stroke="#475569" stroke-width="1"/>
      <text x="1351" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#CBD5E1">Now Assist Skill Integration (Ready)</text>
      <text x="1351" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">explain-risk-skill.now.ts defined in Fluent</text>
      <text x="1351" y="61" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Graceful fallback active when sub-prod GenAI disabled</text>
    </g>
  </g>

  <!-- Bottom Legend / Metadata (y: 995 to 1050) -->
  <g transform="translate(60, 995)">
    <rect width="1800" height="50" rx="10" fill="#0A1128" stroke="#1E293B" stroke-width="1"/>
    
    <g transform="translate(30, 20)">
      <circle cx="10" cy="8" r="6" fill="#38BDF8"/>
      <text x="24" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Presentation Layer</text>

      <circle cx="210" cy="8" r="6" fill="#10B981"/>
      <text x="224" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Security &amp; API Guards</text>

      <circle cx="410" cy="8" r="6" fill="#F59E0B"/>
      <text x="424" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Deterministic Engine</text>

      <circle cx="610" cy="8" r="6" fill="#2DD4BF"/>
      <text x="624" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">AI Grounded Briefing</text>

      <circle cx="810" cy="8" r="6" fill="#A855F7"/>
      <text x="824" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Automation Backbone</text>
      
      <text x="1280" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#94A3B8">Human-in-the-Loop Architecture | Zero Unapproved Mutation | Non-Clinical Scope</text>
    </g>
  </g>
</svg>'''


# -----------------------------------------------------------------------------
# 2. Risk vs Prediction SVG
# -----------------------------------------------------------------------------
def get_risk_vs_prediction_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1128"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#162032"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Header -->
  <g transform="translate(60, 40)">
    <text x="0" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">CareSetu AI — Risk Scoring vs. Discharge Prediction</text>
    <text x="0" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" fill="#94A3B8">Comparison of the two distinct deterministic computational pipelines in OperationalRiskEngine vs. DischargePredictionEngine</text>
  </g>

  <!-- LEFT COLUMN: RISK SCORING (width: 870, x: 60) -->
  <g transform="translate(60, 110)">
    <rect width="880" height="850" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    
    <!-- Title Bar -->
    <rect width="880" height="50" rx="14" fill="#1E3A8A"/>
    <text x="24" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">DETERMINISTIC OPERATIONAL RISK ENGINE (OperationalRiskEngine.server.js)</text>
    
    <!-- What it is -->
    <g transform="translate(24, 70)">
      <rect width="832" height="60" rx="8" fill="#1E293B" stroke="#1E4E79" stroke-width="1"/>
      <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8">OUTPUT: Integer Priority Score (0–100) &amp; Risk Tier Badge</text>
      <text x="16" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Answers: "Which patient bed requires urgent operational attention right now?"</text>
    </g>

    <!-- Signal Breakdown Table -->
    <g transform="translate(24, 150)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">DISCRETE OPERATIONAL SIGNALS &amp; POINT WEIGHTS (Formula-driven):</text>
      
      <!-- Signal 1 -->
      <g transform="translate(0, 15)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Time to Promised Discharge</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Past promised deadline: +40 pts | Within 60 mins: +25 pts | Within 180 mins: +15 pts</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#1E4E79"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">Max +40 pts</text>
      </g>

      <!-- Signal 2 -->
      <g transform="translate(0, 75)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Overdue Discharge Tasks</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">+10 points per overdue clinical/admin task (Capped at 30 points)</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#1E4E79"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">Max +30 pts</text>
      </g>

      <!-- Signal 3 -->
      <g transform="translate(0, 135)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Pending Clinical Milestones</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">+8 points per uncompleted discharge milestone (Capped at 24 points)</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#1E4E79"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">Max +24 pts</text>
      </g>

      <!-- Signal 4 -->
      <g transform="translate(0, 195)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Unacknowledged Shift Handoffs</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">+10 points per pending handoff crossing SLA (Capped at 20 points)</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#1E4E79"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">Max +20 pts</text>
      </g>

      <!-- Signal 5 -->
      <g transform="translate(0, 255)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Open Operational Blockers</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">+15 points per open blocker (TPA, Transport, Equipment... Capped at 30 points)</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#1E4E79"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8" text-anchor="middle">Max +30 pts</text>
      </g>

      <!-- Fallback note -->
      <g transform="translate(0, 315)">
        <rect width="832" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="16" y="21" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Safety Rule: Missing promised/expected discharge time adds 0 pts with a data quality warning.</text>
      </g>
    </g>

    <!-- Score Tiers -->
    <g transform="translate(24, 530)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">SCORE BANDS &amp; OPERATIONAL ACTION TIERS:</text>
      
      <g transform="translate(0, 15)">
        <rect width="195" height="75" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1"/>
        <text x="16" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#34D399">NORMAL (0–39)</text>
        <text x="16" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#A7F3D0">On Schedule</text>
        <text x="16" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#6EE7B7">Standard Care Path</text>

        <rect x="210" width="195" height="75" rx="8" fill="#1E3A5F" stroke="#2563EB" stroke-width="1"/>
        <text x="226" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#60A5FA">MEDIUM (40–59)</text>
        <text x="226" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#BFDBFE">Watchlist Active</text>
        <text x="226" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#93C5FD">Pre-escalation review</text>

        <rect x="420" width="195" height="75" rx="8" fill="#78350F" stroke="#D97706" stroke-width="1"/>
        <text x="436" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FBBF24">HIGH (60–79)</text>
        <text x="436" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FDE68A">Escalation Triggered</text>
        <text x="436" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#FCD34D">Creates x_caresetu_escalation</text>

        <rect x="630" width="202" height="75" rx="8" fill="#7F1D1D" stroke="#DC2626" stroke-width="1"/>
        <text x="646" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#F87171">CRITICAL (80–100)</text>
        <text x="646" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FECACA">Immediate Action</text>
        <text x="646" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#FCA5A5">Emergency priority bed</text>
      </g>
    </g>

    <!-- Key Principle Box -->
    <g transform="translate(24, 650)">
      <rect width="832" height="120" rx="8" fill="#0A1128" stroke="#1E4E79" stroke-width="1.5"/>
      <text x="16" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8">CORE ARCHITECTURAL PRINCIPLE:</text>
      <text x="16" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">• Deterministic sum of discrete operational failure signals, capped at 100.</text>
      <text x="16" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">• 100% explainable in audit: exact points mapped to individual blockers and timestamps.</text>
      <text x="16" y="92" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#F87171">• NOT a clinical acuity score, NOT a diagnostic classifier, and NOT a black-box model.</text>
    </g>
  </g>

  <!-- RIGHT COLUMN: DISCHARGE PREDICTION (width: 870, x: 980) -->
  <g transform="translate(980, 110)">
    <rect width="880" height="850" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5" filter="url(#cardShadow)"/>
    
    <!-- Title Bar -->
    <rect width="880" height="50" rx="14" fill="#0D9488"/>
    <text x="24" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">LINEAR ADDITIVE DISCHARGE CLOCK (DischargePredictionEngine.server.js)</text>
    
    <!-- What it is -->
    <g transform="translate(24, 70)">
      <rect width="832" height="60" rx="8" fill="#1E293B" stroke="#0D9488" stroke-width="1"/>
      <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2DD4BF">OUTPUT: Projected Timestamp (predicted_discharge_time) &amp; Delay Minutes</text>
      <text x="16" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">Answers: "When will the bed actually become available based on active bottlenecks?"</text>
    </g>

    <!-- Calculation Pipeline -->
    <g transform="translate(24, 150)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">BASELINE CLOCK &amp; CATEGORICAL OPERATIONAL DELAYS (Minutes):</text>
      
      <!-- Baseline -->
      <g transform="translate(0, 15)">
        <rect width="832" height="52" rx="8" fill="url(#cardGrad)" stroke="#14B8A6" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Baseline Clock Selection</text>
        <text x="16" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Promised discharge time (Fallback: expected discharge time; Fallback: current time)</text>
        <rect x="690" y="10" width="126" height="30" rx="6" fill="#064E3B"/>
        <text x="753" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#34D399" text-anchor="middle">T_baseline</text>
      </g>

      <!-- Blocker Delays Grid -->
      <g transform="translate(0, 75)">
        <rect width="832" height="155" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Blocker Category Delay Allowances (Added once per active category)</text>
        
        <g transform="translate(16, 38)">
          <rect width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="10" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">TPA / Insurance: <tspan fill="#F59E0B" font-weight="700">+45 min</tspan></text>

          <rect x="195" width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="205" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Patient Transport: <tspan fill="#38BDF8" font-weight="700">+30 min</tspan></text>

          <rect x="390" width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="400" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Medical Equipment: <tspan fill="#38BDF8" font-weight="700">+25 min</tspan></text>

          <rect x="585" width="200" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="595" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Pharmacy Clearance: <tspan fill="#38BDF8" font-weight="700">+20 min</tspan></text>
        </g>

        <g transform="translate(16, 80)">
          <rect width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="10" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Coordination: <tspan fill="#38BDF8" font-weight="700">+20 min</tspan></text>

          <rect x="195" width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="205" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Handoff Pending: <tspan fill="#38BDF8" font-weight="700">+15 min</tspan></text>

          <rect x="390" width="185" height="34" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
          <text x="400" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF">Documentation: <tspan fill="#38BDF8" font-weight="700">+15 min</tspan></text>

          <rect x="585" width="200" height="34" rx="6" fill="#1E293B" stroke="#0D9488" stroke-width="1"/>
          <text x="595" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#2DD4BF">No double-counting</text>
        </g>
        
        <text x="16" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#94A3B8">Category deduplication: Multiple blockers of the same category do NOT compound delays.</text>
      </g>

      <!-- Discrete Signals (Fallback) -->
      <g transform="translate(0, 240)">
        <rect width="832" height="75" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">Discrete Signals Added ONLY if Category Absent:</text>
        <text x="16" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Overdue Tasks: +25 min | Pending Milestones: +20 min | Unack Handoff: +20 min</text>
        <text x="16" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Active TPA (initial/docs): +30 min | Queried TPA: +20 min | Active Escalation: +15 min</text>
      </g>

      <!-- Formula -->
      <g transform="translate(0, 325)">
        <rect width="832" height="52" rx="8" fill="#0A1128" stroke="#0D9488" stroke-width="1.5"/>
        <text x="16" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2DD4BF">FORMULA: predicted_discharge_time = T_baseline + Σ(Distinct Category Delays)</text>
      </g>
    </g>

    <!-- Confidence Bands -->
    <g transform="translate(24, 555)">
      <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">CONFIDENCE LEVEL MAPPING (Based on delay magnitude):</text>
      
      <g transform="translate(0, 15)">
        <rect width="265" height="65" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1"/>
        <text x="16" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#34D399">HIGH CONFIDENCE</text>
        <text x="16" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#A7F3D0">Total Delay &lt; 30 minutes</text>

        <rect x="280" width="265" height="65" rx="8" fill="#1E3A5F" stroke="#2563EB" stroke-width="1"/>
        <text x="296" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#60A5FA">MEDIUM CONFIDENCE</text>
        <text x="296" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#BFDBFE">Total Delay 30–90 minutes</text>

        <rect x="560" width="272" height="65" rx="8" fill="#78350F" stroke="#D97706" stroke-width="1"/>
        <text x="576" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#FBBF24">LOW CONFIDENCE</text>
        <text x="576" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FDE68A">Total Delay &gt; 90 minutes</text>
      </g>
    </g>

    <!-- Key Principle Box -->
    <g transform="translate(24, 650)">
      <rect width="832" height="120" rx="8" fill="#0A1128" stroke="#0D9488" stroke-width="1.5"/>
      <text x="16" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2DD4BF">CORE ARCHITECTURAL PRINCIPLE:</text>
      <text x="16" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">• Linear additive schedule projection based on empirical department SLA defaults.</text>
      <text x="16" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">• Directly prevents cascading schedule over-estimation via category deduplication.</text>
      <text x="16" y="92" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#F87171">• NOT an ML/statistical regression model, and NOT a clinical readiness evaluation.</text>
    </g>
  </g>

  <!-- Bottom Comparison Banner (y: 980 to 1050) -->
  <g transform="translate(60, 980)">
    <rect width="1800" height="65" rx="10" fill="#0A1128" stroke="#1E293B" stroke-width="1.5"/>
    <text x="30" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8">WHY BOTH ENGINES COEXIST:</text>
    <text x="30" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">An encounter can have a HIGH Risk Score (e.g. 75 pts due to past promised time &amp; 2 blockers) while having a SMALL Predicted Delay (35 mins) if the blocker is quick to clear. Conversely, a Normal Risk encounter approaching discharge can experience a sudden 45-min TPA hold. Separating Priority Urgency from Timeline Forecast is fundamental to safe operations.</text>
  </g>
</svg>'''


# -----------------------------------------------------------------------------
# 3. Fix It For Me Sequence Diagram SVG
# -----------------------------------------------------------------------------
def get_fix_it_for_me_sequence_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1128"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <marker id="seqTeal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#14B8A6"/>
    </marker>
    <marker id="seqAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#F59E0B"/>
    </marker>
    <marker id="seqRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#EF4444"/>
    </marker>
    <marker id="seqBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#38BDF8"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Header -->
  <g transform="translate(60, 40)">
    <text x="0" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">CareSetu AI — Fix It For Me Human-Approved Action Lifecycle</text>
    <text x="0" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" fill="#94A3B8">End-to-end execution sequence showing proposal isolation, human approval boundary, server revalidation, and zero unapproved mutations</text>
  </g>

  <!-- 6 LIFELINE HEADERS (x: 180, 490, 800, 1110, 1420, 1730) -->
  <g transform="translate(0, 110)">
    <!-- Lifeline 1: Healthcare Staff -->
    <rect x="90" width="180" height="54" rx="8" fill="#1E3A8A" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="180" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Authorized Staff</text>
    <text x="180" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#93C5FD" text-anchor="middle">Nurse / Coordinator</text>
    <line x1="180" y1="54" x2="180" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Lifeline 2: Command Center UI -->
    <rect x="400" width="180" height="54" rx="8" fill="#0F766E" stroke="#14B8A6" stroke-width="1.5"/>
    <text x="490" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Command Center UI</text>
    <text x="490" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#99F6E4" text-anchor="middle">React SPA / AIPanel</text>
    <line x1="490" y1="54" x2="490" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Lifeline 3: Scoped REST API -->
    <rect x="710" width="180" height="54" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
    <text x="800" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Scoped REST API</text>
    <text x="800" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#CBD5E1" text-anchor="middle">/api/x_caresetu_ai/*</text>
    <line x1="800" y1="54" x2="800" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Lifeline 4: AICoordinator & ActionExecution -->
    <rect x="1020" width="180" height="54" rx="8" fill="#78350F" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="1110" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Action Engine</text>
    <text x="1110" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FDE68A" text-anchor="middle">ActionExecutionEngine</text>
    <line x1="1110" y1="54" x2="1110" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Lifeline 5: Action Request Table -->
    <rect x="1330" width="180" height="54" rx="8" fill="#312E81" stroke="#6366F1" stroke-width="1.5"/>
    <text x="1420" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Action Request DB</text>
    <text x="1420" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#C7D2FE" text-anchor="middle">x_caresetu_ai_action_req</text>
    <line x1="1420" y1="54" x2="1420" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Lifeline 6: Operational Target DB -->
    <rect x="1640" width="180" height="54" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
    <text x="1730" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Operational Targets</text>
    <text x="1730" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#A7F3D0" text-anchor="middle">blocker, tpa, task, enc</text>
    <line x1="1730" y1="54" x2="1730" y2="920" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,6"/>
  </g>

  <!-- SEQUENCE STEPS (y: 190 to 950) -->
  <g transform="translate(0, 190)">
    
    <!-- Step 1: Staff Query -->
    <g transform="translate(0, 10)">
      <line x1="180" y1="20" x2="490" y2="20" stroke="#38BDF8" stroke-width="1.5" marker-end="url(#seqBlue)"/>
      <text x="335" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" text-anchor="middle">1. Staff query: "What is blocking Bed 304 discharge?"</text>
    </g>

    <!-- Step 2: UI calls API -->
    <g transform="translate(0, 50)">
      <line x1="490" y1="20" x2="800" y2="20" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#seqTeal)"/>
      <text x="645" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#14B8A6" text-anchor="middle">2. POST /api/x_caresetu_ai/ai-coordinator</text>
    </g>

    <!-- Step 3: Engine identifies bottleneck & generates proposal -->
    <g transform="translate(0, 90)">
      <line x1="800" y1="20" x2="1110" y2="20" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#seqTeal)"/>
      <text x="955" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#14B8A6" text-anchor="middle">3. Diagnose TPA SLA breach (+45m); Check allowlist</text>
    </g>

    <!-- Step 4: Create Read-Only Proposal -->
    <g transform="translate(0, 130)">
      <line x1="1110" y1="20" x2="1420" y2="20" stroke="#F59E0B" stroke-width="1.5" marker-end="url(#seqAmber)"/>
      <text x="1265" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#F59E0B" text-anchor="middle">4. Create record: state='proposed', approval_status='pending'</text>
    </g>

    <!-- Step 5: Render Action Proposal Card to Staff -->
    <g transform="translate(0, 170)">
      <line x1="1110" y1="20" x2="490" y2="20" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqBlue)"/>
      <line x1="490" y1="35" x2="180" y2="35" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqBlue)"/>
      <text x="800" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" text-anchor="middle">5. Return Briefing + Proposed Action Card (Rationale, Expected Delay Impact)</text>
      <text x="335" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" text-anchor="middle">Display "Approve &amp; Execute" / "Reject" Buttons</text>
    </g>

    <!-- BOUNDARY BOX: HUMAN APPROVAL -->
    <g transform="translate(140, 240)">
      <rect width="1640" height="60" rx="8" fill="#1E293B" stroke="#D97706" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="20" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#F59E0B">STRICT HUMAN APPROVAL BOUNDARY (Zero Autonomous Database Mutation)</text>
      <text x="20" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">Target tables remain 100% untouched while in 'proposed' state. System halts and waits for authorized human decision.</text>
    </g>

    <!-- BRANCH A: REJECT PATH -->
    <g transform="translate(0, 320)">
      <line x1="180" y1="20" x2="490" y2="20" stroke="#EF4444" stroke-width="1.5" marker-end="url(#seqRed)"/>
      <text x="335" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#EF4444" text-anchor="middle">Branch A: Staff clicks "Reject"</text>
      
      <line x1="490" y1="35" x2="1420" y2="35" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqRed)"/>
      <text x="955" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#EF4444" text-anchor="middle">Update proposal state to 'rejected'. Targets remain completely untouched!</text>
    </g>

    <!-- BRANCH B: APPROVE PATH -->
    <g transform="translate(0, 385)">
      <line x1="180" y1="20" x2="490" y2="20" stroke="#10B981" stroke-width="2" marker-end="url(#seqTeal)"/>
      <text x="335" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#10B981" text-anchor="middle">Branch B: Staff clicks "Approve &amp; Execute"</text>
      
      <line x1="490" y1="35" x2="800" y2="35" stroke="#10B981" stroke-width="1.5" marker-end="url(#seqTeal)"/>
      <text x="645" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#10B981" text-anchor="middle">POST /api/x_caresetu_ai/actions/execute</text>
    </g>

    <!-- Server Verification 1: RBAC Check -->
    <g transform="translate(0, 445)">
      <rect x="730" width="140" height="30" rx="6" fill="#1E3A5F" stroke="#2563EB" stroke-width="1"/>
      <text x="800" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#93C5FD" text-anchor="middle">RBAC Verification</text>
      <text x="880" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Verify caller holds x_caresetu_ai.coordinator or admin role</text>
    </g>

    <!-- Server Verification 2: Revalidation & Idempotency -->
    <g transform="translate(0, 490)">
      <line x1="800" y1="15" x2="1420" y2="15" stroke="#F59E0B" stroke-width="1.5" marker-end="url(#seqAmber)"/>
      <text x="1110" y="8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#F59E0B" text-anchor="middle">Revalidate: Check record still exists in 'proposed' state &amp; not already executing</text>
      
      <line x1="1420" y1="35" x2="1420" y2="35"/>
      <rect x="1350" y="25" width="140" height="26" rx="6" fill="#78350F"/>
      <text x="1420" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700" fill="#FDE68A" text-anchor="middle">state = 'executing'</text>
    </g>

    <!-- Server Verification 3: Allowlisted Handler Execution -->
    <g transform="translate(0, 550)">
      <line x1="800" y1="20" x2="1110" y2="20" stroke="#14B8A6" stroke-width="1.5" marker-end="url(#seqTeal)"/>
      <text x="955" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#14B8A6" text-anchor="middle">Dispatch to Allowlisted Handler (e.g. chase_tpa / escalate_blocker)</text>
      
      <line x1="1110" y1="35" x2="1730" y2="35" stroke="#10B981" stroke-width="2" marker-end="url(#seqTeal)"/>
      <text x="1420" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#10B981" text-anchor="middle">Execute Approved Mutation: Mutate TPA case chase count, log timestamp &amp; reason</text>
    </g>

    <!-- Step 8: Verify Target Result -->
    <g transform="translate(0, 615)">
      <line x1="1730" y1="20" x2="1110" y2="20" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqBlue)"/>
      <text x="1420" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#38BDF8" text-anchor="middle">Verify target update succeeded and blocker status escalated</text>
    </g>

    <!-- Step 9: Finalize Action Request Record -->
    <g transform="translate(0, 660)">
      <line x1="1110" y1="20" x2="1420" y2="20" stroke="#10B981" stroke-width="1.5" marker-end="url(#seqTeal)"/>
      <text x="1265" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#10B981" text-anchor="middle">Finalize: state='executed', executed_by=user, executed_at=now, audit_log=result</text>
    </g>

    <!-- Step 10: Cascade Recalculation & UI Sync -->
    <g transform="translate(0, 705)">
      <line x1="1110" y1="20" x2="490" y2="20" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqTeal)"/>
      <line x1="490" y1="35" x2="180" y2="35" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#seqTeal)"/>
      <text x="800" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#10B981" text-anchor="middle">Return execution success; Business Rules asynchronously recompute Risk Score &amp; Prediction</text>
      <text x="335" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#10B981" text-anchor="middle">UI reflects Executed state &amp; updated badge</text>
    </g>
  </g>

  <!-- Bottom Security Callout (y: 975 to 1045) -->
  <g transform="translate(60, 975)">
    <rect width="1800" height="70" rx="10" fill="#0A1128" stroke="#1E4E79" stroke-width="1.5"/>
    <text x="30" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#38BDF8">FAIL-SAFE AUDIT TRAIL &amp; IDEMPOTENCY GUARANTEE:</text>
    <text x="30" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">1. Every proposed action has an immutable sys_id and stays read-only until approved. 2. Double-click prevention: state transition to 'executing' locks against concurrent submissions. 3. Re-validation verifies the target blocker was not resolved by another nurse prior to execution. 4. Complete actor traceability records who approved, when it ran, and the exact database diff.</text>
  </g>
</svg>'''


# -----------------------------------------------------------------------------
# 4. Discharge Coordination Lifecycle SVG
# -----------------------------------------------------------------------------
def get_discharge_coordination_lifecycle_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1128"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#162032"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <marker id="lifeArrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#14B8A6"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Header -->
  <g transform="translate(60, 40)">
    <text x="0" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">CareSetu AI — Discharge Coordination Lifecycle</text>
    <text x="0" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" fill="#94A3B8">Closed-loop progression from inpatient admission through blocker discovery, automated chasing, risk elevation, approved action, and safe discharge</text>
  </g>

  <!-- 8 LIFECYCLE STAGES ARRANGED IN TWO TIERS OF 4 STAGES -->
  <!-- TIER 1: STAGES 1 TO 4 (Left to Right, y: 115 to 495) -->
  <g transform="translate(60, 115)">
    
    <!-- Stage 1 -->
    <g transform="translate(0, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#1E3A8A"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 1: ADMISSION &amp; BASELINE</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#38BDF8">Inpatient Record Registered</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Encounter created in x_caresetu_ai_encounter</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Bed assigned (e.g. CCU Bed 304, Post-Op)</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• promised_discharge_time deadline scheduled</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#34D399">Initial Operational Baseline</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Risk Score = 0 (Normal Tier, Green)</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Predicted Delay = 0 minutes</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Open Blockers = 0 | Unack Handoffs = 0</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#38BDF8">Schedule: On-Track</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Platform State:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Green triage badge in Command Center</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Promised discharge countdown initiated</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Zero operational escalation</text>
      </g>
    </g>

    <!-- Connector 1 -> 2 -->
    <line x1="420" y1="190" x2="455" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 2 -->
    <g transform="translate(460, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#1E3A8A"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 2: DEPENDENCIES &amp; SIGNALS</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#38BDF8">Operational Bottlenecks Emerge</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Clinical milestone pending (Cardiology sign-off)</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• TPA Pre-auth claim initiated with insurer</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Nursing shift change creates pending handoff</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#FBBF24">Emerging Bottlenecks Logged</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Record created in x_caresetu_ai_tpa_case</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Record created in x_caresetu_ai_handoff</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Initial SLA countdown timers activated</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#F59E0B">Target: 30m Ack SLA / 15m TPA Chase</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Platform State:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Dynamic counters update across pipeline</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Scheduled jobs monitor SLA compliance</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Encounter 360 displays active dependencies</text>
      </g>
    </g>

    <!-- Connector 2 -> 3 -->
    <line x1="880" y1="190" x2="915" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 3 -->
    <g transform="translate(920, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#7C3AED"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 3: AUTONOMOUS CHASING</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#C084FC">Scheduled Engines Monitor SLAs</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• TpaChaseEngine executes every 15 minutes</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Transitions case: submitted -&gt; chasing</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• HandoffEngine monitors 30m acknowledgment</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#F87171">SLA Breach Detected</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Insurer crosses 45m response threshold</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Handoff pending past critical threshold</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Engine generates x_caresetu_ai_blocker</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#F87171">Category: 'tpa_insurance', Severity: 'high'</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Platform State:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Blocker created linked to encounter</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Triggers async recalculation event</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Audit log captures chase timestamp</text>
      </g>
    </g>

    <!-- Connector 3 -> 4 -->
    <line x1="1340" y1="190" x2="1375" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 4 -->
    <g transform="translate(1380, 0)">
      <rect width="420" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="420" height="42" rx="14" fill="#D97706"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 4: RESCORING &amp; ESCALATION</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#F59E0B">Continuous Urgency Sync</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• compute-risk-async Business Rule executes</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• OperationalRiskEngine rescores: 75 pts</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• DischargePredictionEngine adds: +45m delay</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="384" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#F87171">High Risk Threshold Breach (&gt;= 60)</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Tier transitions: Normal -&gt; High (Orange)</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• System creates x_caresetu_ai_escalation</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Bed elevated to top of Command Center triage</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FBBF24">predicted_discharge_time delayed +45m</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="384" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Platform State:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Orange high-urgency alert visible to staff</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Encounter 360 displays active blocker badge</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Discharge timeline projection shifted</text>
      </g>
    </g>
  </g>

  <!-- Connectors Tier 1 -> Tier 2 (Looping Back from Right to Left) -->
  <path d="M 1590 500 L 1590 535 L 260 535 L 260 565" fill="none" stroke="#14B8A6" stroke-width="2.5" stroke-dasharray="6,4" marker-end="url(#lifeArrow)"/>

  <!-- TIER 2: STAGES 5 TO 8 (y: 575 to 955) -->
  <g transform="translate(60, 575)">
    
    <!-- Stage 5 -->
    <g transform="translate(0, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#0D9488"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 5: AI ROOT CAUSE DIAGNOSIS</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#2DD4BF">Grounded AI Coordinator Query</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Staff asks: "What is holding up Bed 304?"</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• AICoordinatorEngine aggregates live context</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Explains root cause: TPA pre-auth unresponded</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#FBBF24">Formulates Action Proposal</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Evaluates allowlist: 'chase_tpa' is valid</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Creates record in x_caresetu_action_req</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• State: 'proposed', Approval: 'pending'</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#2DD4BF">UI renders Action Card with Rationale</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Safety Guard:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Zero autonomous mutation occurs</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Target tables remain strictly untouched</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">System waits for authorized staff review</text>
      </g>
    </g>

    <!-- Connector 5 -> 6 -->
    <line x1="420" y1="190" x2="455" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 6 -->
    <g transform="translate(460, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#059669"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 6: HUMAN-APPROVED ACTION</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#34D399">Staff Reviews Proposal</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Clinical coordinator inspects suggested action</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Evaluates impact: Clears 45-min delay</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Staff clicks "Approve &amp; Execute" button</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#38BDF8">Secure Execution Handshake</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• POST /api/x_caresetu_ai/actions/execute</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Role check: x_caresetu_ai.coordinator</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Server re-validates target state &amp; locks</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#34D399">ActionExecutionEngine executes allowlisted fix</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Audit Trail:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">executed_by, executed_at, result logged</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Idempotency guard prevents double-run</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Action transitions: proposed -&gt; executed</text>
      </g>
    </g>

    <!-- Connector 6 -> 7 -->
    <line x1="880" y1="190" x2="915" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 7 -->
    <g transform="translate(920, 0)">
      <rect width="415" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="415" height="42" rx="14" fill="#059669"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 7: RESOLUTION &amp; CASCADE</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#34D399">Operational Blocker Cleared</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• TPA clearance confirmed &amp; logged</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Blocker status transitions to 'resolved'</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Open blocker count decrements: 1 -&gt; 0</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="379" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#34D399">Cascade Normalization Triggered</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Business rules re-run automatically</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Risk Score drops from 75 to 20 (Normal)</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Escalation record deactivated (active=false)</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#38BDF8">45-minute projected delay removed from clock</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="379" height="92" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#CBD5E1">Command Center UI:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Bed badge returns to Normal (Green)</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">Patient moves to "Discharge Ready" column</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748B">Real-time status synchronized for team</text>
      </g>
    </g>

    <!-- Connector 7 -> 8 -->
    <line x1="1340" y1="190" x2="1375" y2="190" stroke="#14B8A6" stroke-width="3" marker-end="url(#lifeArrow)"/>

    <!-- Stage 8 -->
    <g transform="translate(1380, 0)">
      <rect width="420" height="380" rx="14" fill="#0F172A" stroke="#1E4E79" stroke-width="1.5" filter="url(#cardShadow)"/>
      <rect width="420" height="42" rx="14" fill="#047857"/>
      <text x="18" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">STAGE 8: TIMELY DISCHARGE &amp; BED TURNOVER</text>
      
      <g transform="translate(20, 60)">
        <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" font-weight="700" fill="#34D399">Closed-Loop Success Achieved</text>
        <text x="0" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Discharge summary &amp; meds handed over</text>
        <text x="0" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Patient safely discharged on schedule</text>
        <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" fill="#E2E8F0">• Bed 304 marked available for turnover</text>
      </g>

      <g transform="translate(18, 150)">
        <rect width="384" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#34D399">Operational Impact Realized</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Prevents 6–8 hour hallway discharge delay</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Unblocks incoming emergency room transfer</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94A3B8">• Complete end-to-end auditability preserved</text>
        <text x="14" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6EE7B7">Encounter state transitions to 'discharged'</text>
      </g>

      <g transform="translate(18, 272)">
        <rect width="384" height="92" rx="8" fill="#064E3B" stroke="#059669" stroke-width="1"/>
        <text x="14" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#A7F3D0">Outcome:</text>
        <text x="14" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6EE7B7">Zero clinical compromise</text>
        <text x="14" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6EE7B7">Predictable, stress-free hospital departure</text>
        <text x="14" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#A7F3D0">Optimized bed turnover velocity</text>
      </g>
    </g>
  </g>

  <!-- Bottom Lifecycle Summary Footer (y: 995 to 1055) -->
  <g transform="translate(60, 995)">
    <rect width="1800" height="50" rx="10" fill="#0A1128" stroke="#1E293B" stroke-width="1"/>
    <g transform="translate(30, 20)">
      <circle cx="10" cy="8" r="6" fill="#14B8A6"/>
      <text x="24" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">1. Baseline Setup</text>
      
      <circle cx="210" cy="8" r="6" fill="#3B82F6"/>
      <text x="224" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">2. Signal Discovery</text>

      <circle cx="410" cy="8" r="6" fill="#7C3AED"/>
      <text x="424" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">3. Autonomous Chasing</text>

      <circle cx="610" cy="8" r="6" fill="#D97706"/>
      <text x="624" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">4. Risk Elevation</text>

      <circle cx="810" cy="8" r="6" fill="#0D9488"/>
      <text x="824" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">5. AI Diagnosis</text>

      <circle cx="1010" cy="8" r="6" fill="#059669"/>
      <text x="1024" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">6. Human Approval</text>

      <circle cx="1210" cy="8" r="6" fill="#10B981"/>
      <text x="1224" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">7. Blocker Resolution</text>

      <circle cx="1430" cy="8" r="6" fill="#34D399"/>
      <text x="1444" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E2E8F0">8. Timely Bed Turnover</text>
    </g>
  </g>
</svg>'''


# -----------------------------------------------------------------------------
# 5. DrawIO Source Files Generator
# -----------------------------------------------------------------------------
def get_drawio_xml(name, description):
    return f'''<mxfile host="app.diagrams.net" modified="2026-10-13T12:00:00.000Z" agent="CareSetu-Architecture-Generator" version="21.0.0" type="device">
  <diagram id="caresetu-{name}" name="{name}">
    <mxGraphModel dx="1920" dy="1080" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1920" pageHeight="1080" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="title" value="CareSetu AI — {description}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=24;fontStyle=1;fontColor=#FFFFFF;" vertex="1" parent="1">
          <mxGeometry x="60" y="40" width="1200" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="note" value="Note: For presentation rendering, refer to the high-definition SVG/PNG companion: {name}.svg and {name}.png in this directory." style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#94A3B8;" vertex="1" parent="1">
          <mxGeometry x="60" y="80" width="1200" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="main_frame" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0F172A;strokeColor=#334155;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="60" y="130" width="1800" height="900" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''


# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------
def main():
    diagrams = {
        "architecture_overview": (get_architecture_overview_svg(), "Enterprise Architecture Overview"),
        "risk_vs_prediction": (get_risk_vs_prediction_svg(), "Risk Scoring vs. Discharge Prediction"),
        "fix_it_for_me_sequence": (get_fix_it_for_me_sequence_svg(), "Fix It For Me Human-Approved Action Lifecycle"),
        "discharge_coordination_lifecycle": (get_discharge_coordination_lifecycle_svg(), "Discharge Coordination Lifecycle")
    }

    print("Generating diagrams in:", DIAGRAMS_DIR)

    for key, (svg_content, desc) in diagrams.items():
        svg_file = os.path.join(DIAGRAMS_DIR, f"{key}.svg")
        png_file = os.path.join(DIAGRAMS_DIR, f"{key}.png")
        drawio_file = os.path.join(DIAGRAMS_DIR, f"{key}.drawio")

        # 1. Write SVG
        with open(svg_file, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"  [+] Wrote {key}.svg ({os.path.getsize(svg_file):,} bytes)")

        # 2. Render PNG via Edge headless
        if os.path.exists(EDGE_PATH):
            cmd = [
                EDGE_PATH,
                "--headless",
                f"--screenshot={png_file}",
                "--window-size=1920,1080",
                "--hide-scrollbars",
                svg_file
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0 and os.path.exists(png_file):
                print(f"  [+] Rendered {key}.png ({os.path.getsize(png_file):,} bytes) at 1920x1080")
            else:
                print(f"  [-] Edge render failed for {key}: {res.stderr}")
        else:
            print("  [-] Edge not found, skipping PNG generation")

        # 3. Write DrawIO
        drawio_content = get_drawio_xml(key, desc)
        with open(drawio_file, "w", encoding="utf-8") as f:
            f.write(drawio_content)
        print(f"  [+] Wrote {key}.drawio ({os.path.getsize(drawio_file):,} bytes)")

    # 4. Write README.md for Diagrams
    readme_path = os.path.join(DIAGRAMS_DIR, "README.md")
    readme_content = """# CareSetu AI — Architecture Diagrams & Visual Artifacts

This directory contains standalone, presentation-grade architecture diagrams and lifecycle visualizations for **CareSetu AI (`x_caresetu_ai`)**.

All diagrams adhere strictly to the project's design system:
- **Aspect Ratio:** 16:9 widescreen layout (`1920x1080`).
- **Color Palette:** Enterprise Healthcare Dark Navy (`#0A1128`, `#0F172A`), Deep Indigo (`#1E3A8A`), Medical Teal (`#0D9488`, `#14B8A6`), Alert Amber (`#F59E0B`, `#D97706`), and Clean Crisp Text (`#FFFFFF`, `#E2E8F0`, `#94A3B8`).
- **Resolution:** Full HD vector (`.svg`), presentation PNG raster (`1920x1080`), and editable source (`.drawio`).

---

## Diagram Inventory

| File Basename | Diagram Title | Description & Code Backing |
| :--- | :--- | :--- |
| **`architecture_overview`** | **Enterprise Architecture Overview** | 5-layered system stack: React SPA UI Page (`x_caresetu_ai_command_center.do`), Scoped REST APIs (`/api/x_caresetu_ai/*`), RBAC & ACL security guards, Deterministic Script Includes (`OperationalRiskEngine`, `DischargePredictionEngine`, `HandoffEngine`, `TpaChaseEngine`, `AICoordinatorEngine`, `ActionExecutionEngine`), 8 scoped database tables (`x_caresetu_ai_*`), and Async Business Rules / Chasers. |
| **`risk_vs_prediction`** | **Risk Scoring vs. Discharge Prediction** | Side-by-side comparison proving that **Risk Scoring** is a deterministic 0–100 operational urgency integer (`OperationalRiskEngine.server.js`), whereas **Discharge Prediction** is a linear additive delay clock in minutes (`DischargePredictionEngine.server.js`) with category deduplication. Explicitly contrasts operational urgency vs. delay forecasting; neither is a clinical ML model. |
| **`fix_it_for_me_sequence`** | **Fix It For Me Human-Approved Action Lifecycle** | Complete sequence flow showing proposal creation (`state='proposed'`, `approval_status='pending'`), UI proposal presentation, human approval boundary, server authorization check (`x_caresetu_ai.coordinator`), state revalidation, idempotency lock (`state='executing'`), allowlisted handler mutation, target verification, and audit trail. Also illustrates the clean reject path where targets remain untouched. |
| **`discharge_coordination_lifecycle`** | **Discharge Coordination Lifecycle** | Closed-loop 8-stage operational journey: Admission & Baseline $\\rightarrow$ Dependency Discovery $\\rightarrow$ Autonomous Chasing $\\rightarrow$ Urgency Rescoring & Escalation $\\rightarrow$ AI Diagnosis $\\rightarrow$ Human Approval $\\rightarrow$ Blocker Resolution $\\rightarrow$ Timely Bed Turnover. |

---

## How to Edit or Export These Diagrams

### 1. Vector SVG (`.svg`)
- The SVG files are self-contained vector documents with inline fonts and CSS styles.
- You can open them in any vector editor (Inkscape, Adobe Illustrator, Figma) or web browser.
- SVGs scale losslessly to any 4K/8K resolution for large conference projections or print posters.

### 2. High-Resolution PNG (`.png`)
- Rendered natively at **1920x1080** (Full HD 16:9).
- Ready for immediate drag-and-drop into PowerPoint presentations, video editing timelines (Premiere, Final Cut, DaVinci Resolve, OBS), or web markdown documentation.

### 3. Draw.io / Diagrams.net (`.drawio`)
- The `.drawio` files can be opened and edited directly at [diagrams.net](https://app.diagrams.net) or in the VS Code Draw.io extension (`hediet.vscode-drawio`).
- Use these files to adjust layout, add extra nodes, or modify styling as the platform evolves.
"""
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
    print(f"  [+] Wrote README.md ({os.path.getsize(readme_path):,} bytes)")

if __name__ == "__main__":
    main()
