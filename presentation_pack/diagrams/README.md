# CareSetu AI — Architecture Diagrams & Visual Artifacts

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
| **`discharge_coordination_lifecycle`** | **Discharge Coordination Lifecycle** | Closed-loop 8-stage operational journey: Admission & Baseline $\rightarrow$ Dependency Discovery $\rightarrow$ Autonomous Chasing $\rightarrow$ Urgency Rescoring & Escalation $\rightarrow$ AI Diagnosis $\rightarrow$ Human Approval $\rightarrow$ Blocker Resolution $\rightarrow$ Timely Bed Turnover. |

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
