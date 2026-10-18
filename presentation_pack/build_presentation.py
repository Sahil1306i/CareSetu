"""
CareSetu AI - Hackathon Presentation Deck Builder
Generates CareSetu_AI_Presentation.pptx (16:9 widescreen, 12 slides, speaker notes, enterprise styling).
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_PPTX = r"C:\Users\sahil\CareSetu\presentation_pack\CareSetu_AI_Presentation.pptx"
DIAGRAMS_DIR = r"C:\Users\sahil\CareSetu\presentation_pack\diagrams"
SCREENSHOTS_DIR = r"C:\Users\sahil\CareSetu\presentation_pack\screenshots"

# Color Palette (Enterprise Healthcare Navy & Teal)
C_DARK_BG    = RGBColor(10, 17, 40)     # #0A1128
C_PANEL_BG   = RGBColor(15, 23, 42)     # #0F172A
C_CARD_BG    = RGBColor(30, 41, 59)     # #1E293B
C_CARD_BORDER= RGBColor(51, 65, 85)     # #334155
C_TEAL       = RGBColor(20, 184, 166)   # #14B8A6
C_LIGHT_BLUE = RGBColor(56, 189, 248)   # #38BDF8
C_AMBER      = RGBColor(245, 158, 11)   # #F59E0B
C_RED        = RGBColor(239, 68, 68)    # #EF4444
C_GREEN      = RGBColor(16, 185, 129)   # #10B981
C_WHITE      = RGBColor(255, 255, 255)  # #FFFFFF
C_TEXT_LIGHT = RGBColor(226, 232, 240)  # #E2E8F0
C_TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8

FONT_HEADING = "Segoe UI"
FONT_BODY    = "Segoe UI"

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = C_DARK_BG

def add_header(slide, category, title, subtitle):
    # Category badge
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category.upper()
    p_cat.font.name = FONT_HEADING
    p_cat.font.size = Pt(11)
    p_cat.font.bold = True
    p_cat.font.color.rgb = C_TEAL

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title
    p_title.font.name = FONT_HEADING
    p_title.font.size = Pt(24)
    p_title.font.bold = True
    p_title.font.color.rgb = C_WHITE

    # Subtitle
    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.4))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = subtitle
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = C_TEXT_MUTED

def add_speaker_notes(slide, timing, narration, screen_cue, pointer_cue):
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.text = f"TIMING: {timing}\n\nLIVE APPLICATION SCREEN: {screen_cue}\nWHAT TO POINT AT: {pointer_cue}\n\nSUGGESTED NARRATION:\n{narration}"

def add_card(slide, left, top, width, height, title, items, border_color=C_CARD_BORDER, title_color=C_TEAL):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = C_CARD_BG
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1.5)

    tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p0 = tf.paragraphs[0]
    p0.text = title
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = title_color
    p0.space_after = Pt(8)

    for item in items:
        p = tf.add_paragraph()
        p.text = f"• {item}"
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_TEXT_LIGHT
        p.space_after = Pt(4)

def add_bottom_banner(slide, text, accent_label="KEY TAKEAWAY:"):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.6), Inches(11.733), Inches(0.55))
    shape.fill.solid()
    shape.fill.fore_color.rgb = C_PANEL_BG
    shape.line.color.rgb = C_CARD_BORDER
    shape.line.width = Pt(1)

    tb = slide.shapes.add_textbox(Inches(1.0), Inches(6.65), Inches(11.333), Inches(0.45))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    
    r1 = p.add_run()
    r1.text = f"{accent_label} "
    r1.font.name = FONT_HEADING
    r1.font.size = Pt(11)
    r1.font.bold = True
    r1.font.color.rgb = C_LIGHT_BLUE

    r2 = p.add_run()
    r2.text = text
    r2.font.name = FONT_BODY
    r2.font.size = Pt(11)
    r2.font.color.rgb = C_TEXT_LIGHT


def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    print("Building CareSetu AI Presentation Deck...")

    # =========================================================================
    # SLIDE 1: Title & Value Proposition
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Big Title Block
    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(2.2))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "CARESETU AI"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Autonomous Inpatient Discharge Orchestration on ServiceNow"
    p1_sub.font.name = FONT_HEADING
    p1_sub.font.size = Pt(22)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = C_TEAL
    p1_sub.space_before = Pt(8)

    p1_tag = tf1.add_paragraph()
    p1_tag.text = "Connecting fragmented department silos to eliminate discharge delays with grounded AI, deterministic urgency, and human-approved action."
    p1_tag.font.name = FONT_BODY
    p1_tag.font.size = Pt(14)
    p1_tag.font.color.rgb = C_TEXT_LIGHT
    p1_tag.space_before = Pt(12)

    # 3 Value Cards
    add_card(s1, Inches(0.8), Inches(3.8), Inches(3.6), Inches(2.4),
             "Zero-Mutation AI Boundary",
             ["AI never mutates databases autonomously",
              "Pre-approved proposals require authorized staff sign-off",
              "Server-side state revalidation & idempotency guards",
              "Strict non-clinical operational boundary"],
             border_color=C_TEAL, title_color=C_TEAL)

    add_card(s1, Inches(4.8), Inches(3.8), Inches(3.6), Inches(2.4),
             "Deterministic Urgency",
             ["Transparent 0–100 integer operational risk score",
              "Linear additive delay clock with category deduplication",
              "Separates urgency priority from timeline projection",
              "100% explainable & audit-ready logic"],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_card(s1, Inches(8.8), Inches(3.8), Inches(3.733), Inches(2.4),
             "Native ServiceNow Architecture",
             ["Scoped application: x_caresetu_ai",
              "React 18 SPA embedded in UI Page",
              "Scoped REST APIs, ACLs, and RBAC security",
              "Scheduled chasers for TPA & shift handoff SLAs"],
             border_color=C_AMBER, title_color=C_AMBER)

    add_bottom_banner(s1, "ServiceNow Hackathon 2026 | Application Scope: x_caresetu_ai | Instance: act-hck-4161-0029.lab.service-now.com", accent_label="PROJECT METADATA:")
    add_speaker_notes(s1, "0:00 – 0:35 (35 sec)",
                      "Judges, welcome to CareSetu AI. 'CareSetu' translates to 'The Care Bridge'. Today we are presenting a production-ready, scoped ServiceNow application designed to solve one of healthcare's most pervasive, costly problems: the hours patients spend trapped in hospital beds after they have already been clinically cleared to go home. We do this not with black-box AI, but through deterministic operational orchestration, grounded AI briefing, and strictly human-approved execution.",
                      "Title Slide (CareSetu AI Deck)",
                      "Point to the three core tenets: Zero-Mutation AI, Deterministic Urgency, Native ServiceNow Architecture.")

    # =========================================================================
    # SLIDE 2: Personal Story - Nanaji's 8-Hour Delay
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Human Reality of Discharge Delays", "Eight Hours in a Post-Operative Hallway", "The problem in hospitals today isn't clinical care. It is broken operational coordination.")

    add_card(s2, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.3),
             "The Personal Genesis",
             ["My grandfather (Nanaji) recently underwent open-heart surgery.",
              "At 10:00 AM, his surgeon completed rounds and declared him medically ready for discharge.",
              "His vitals were stable, his surgical wound was healing, and he was eager to return home to his family.",
              "Yet, he sat in a recovery chair in a drafty hallway until 6:00 PM — eight hours after clinical clearance.",
              "He wasn't waiting on medical care. He was waiting on paperwork, transport, and insurance phone calls.",
              "Every nurse was exhausted, every family member was anxious, and nobody had end-to-end visibility."],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_card(s2, Inches(6.8), Inches(2.0), Inches(5.733), Inches(4.3),
             "The Silent Hospital Cascades",
             ["TPA Insurance clearance sat unworked in a shared email inbox.",
              "Cardiology physical discharge summary was waiting on a shift change.",
              "Post-acute durable medical equipment delivery was never dispatched.",
              "Downstairs in the Emergency Department, critical cardiac patients were held on gurneys because Nanaji's bed was registered as 'occupied'.",
              "This delay did not stem from a lack of dedication by medical staff.",
              "It stemmed from disconnected systems, unowned operational blockers, and absence of proactive follow-up."],
             border_color=C_AMBER, title_color=C_AMBER)

    add_bottom_banner(s2, "Hospitals don't lack heroic clinicians. They lack closed-loop operational coordination across department silos.", accent_label="THE CORE LESSON:")
    add_speaker_notes(s2, "0:35 – 1:20 (45 sec)",
                      "This project started from a deeply personal experience. A few months ago, my grandfather, my Nanaji, had open-heart surgery. His clinical care was world-class. At 10:00 AM, his surgeon signed off and said he was ready to go home. But Nanaji didn't leave until 6:00 PM. For eight hours, an elderly heart surgery patient sat in a hallway chair waiting. Why? Because the TPA pre-authorization sat unreviewed, pharmacy paperwork stalled, and nursing handoff had no tracking. Downstairs, emergency patients waited for that very bed. That is why we built CareSetu AI.",
                      "Personal Story Slide",
                      "Point to the contrast between medical sign-off at 10 AM vs. physical departure at 6 PM.")

    # =========================================================================
    # SLIDE 3: Problem Statement
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "The Systemic Problem", "Why Discharge Delays Paralyze Modern Hospitals", "Department silos, invisible bottlenecks, and absence of accountability create hospital gridlock.")

    add_card(s3, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.3),
             "1. Fragmented Silos",
             ["Nursing, Pharmacy, Transport, Billing, and Insurers operate in disconnected tools.",
              "No single person or dashboard sees the cross-department dependency chain.",
              "Communication relies on ad-hoc phone calls and hallway sticky notes.",
              "Status updates occur only when an angry family member inquires."],
             border_color=C_RED, title_color=C_RED)

    add_card(s3, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.3),
             "2. Invisible Blockers",
             ["Operational deadlines pass silently without automated alerts.",
              "TPA/Insurance queries sit unanswered for hours without follow-up timers.",
              "Shift handoffs go unacknowledged across department transitions.",
              "Delay only surfaces when the patient is already past promised departure."],
             border_color=C_AMBER, title_color=C_AMBER)

    add_card(s3, Inches(8.8), Inches(2.0), Inches(3.733), Inches(4.3),
             "3. Cascading Gridlock",
             ["Discharge delays trigger Emergency Department boarding and hallway admissions.",
              "Surgeons cancel scheduled procedures due to lack of inpatient bed availability.",
              "Severe staff fatigue and nurse burnout from manual chasing.",
              "In a 400-bed hospital, a 3-hour delay wastes ~1,200 bed-hours every single day."],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_bottom_banner(s3, "Discharge coordination is not a clinical diagnosis problem — it is an enterprise workflow and service orchestration problem.", accent_label="KEY INSIGHT:")
    add_speaker_notes(s3, "1:20 – 1:55 (35 sec)",
                      "This isn't just Nanaji's hospital. It is virtually every major medical center. Inpatient discharge is an operational black box. When a clinical clearance happens, at least four separate operational tracks must align: insurance pre-auth, pharmacy delivery, transport dispatch, and shift handoffs. Today, these operate in complete isolation. Nobody owns the dependency clock, nobody chases unacknowledged handoffs, and bed turnover velocity drops by 30 to 40 percent.",
                      "Problem Statement Slide",
                      "Highlight the three cards: Department Silos, Invisible Blockers, and Cascading Gridlock.")

    # =========================================================================
    # SLIDE 4: CareSetu Approach & Architectural Principles
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "The CareSetu Paradigm", "Closed-Loop Operational Orchestration on ServiceNow", "Four grounded architectural principles transforming hospital workflow.")

    add_card(s4, Inches(0.8), Inches(2.0), Inches(5.6), Inches(2.0),
             "1. Explainable Deterministic Urgency",
             ["Transparent 0–100 integer operational risk rules.",
              "Linear additive timeline clock with category deduplication.",
              "Zero black-box guessing: every point maps to a code-backed blocker.",
              "Separates priority urgency from projected delay minutes."],
             border_color=C_TEAL, title_color=C_TEAL)

    add_card(s4, Inches(6.8), Inches(2.0), Inches(5.733), Inches(2.0),
             "2. Grounded AI Briefings",
             ["AI Care Coordinator aggregates live ServiceNow table records.",
              "Answers natural language queries strictly using in-scope table state.",
              "Never hallucinates clinical diagnoses or unsupported operational claims.",
              "Fluent Now Assist Skill ready; deterministic fallback active."],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_card(s4, Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.0),
             "3. Fix It For Me (Human-Approved)",
             ["AI formulates read-only proposals for allowlisted operational fixes.",
              "Zero autonomous database mutation: targets remain 100% untouched.",
              "Authorized staff reviews rationale and clicks 'Approve & Execute'.",
              "Server authorization check, target revalidation & idempotency lock."],
             border_color=C_AMBER, title_color=C_AMBER)

    add_card(s4, Inches(6.8), Inches(4.3), Inches(5.733), Inches(2.0),
             "4. Autonomous Background Schedulers",
             ["TPA Auto-Chaser executes every 15m to monitor insurance pre-auth SLAs.",
              "HandoffEngine tracks 30-minute shift acknowledgment deadlines.",
              "Async business rules recalculate risk & prediction on any data change.",
              "Automatic escalation record creation when risk crosses High tier (>= 60)."],
             border_color=C_GREEN, title_color=C_GREEN)

    add_bottom_banner(s4, "ServiceNow is the ideal System of Action: providing auditable records, enterprise RBAC, and deterministic event engines.", accent_label="PLATFORM FIT:")
    add_speaker_notes(s4, "1:55 – 2:35 (40 sec)",
                      "CareSetu AI solves this by deploying ServiceNow as the central operational nerve center. Our design rests on four pillars: First, Explainable Deterministic Urgency — no hallucinated risk numbers, but an exact 0 to 100 formula. Second, Grounded AI Briefings — natural language status grounded directly in live scoped tables. Third, 'Fix It For Me' — our signature human-approved action lifecycle where the AI proposes a solution, but an authorized human must approve before any database mutation occurs. And fourth, Autonomous Schedulers that chase insurance cases and shift handoffs before deadlines breach.",
                      "Solution Principles Slide",
                      "Point to Pillar 3 (Fix It For Me) and emphasize the human-approval boundary.")

    # =========================================================================
    # SLIDE 5: Architecture Overview Diagram
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "System Architecture", "End-to-End Enterprise Architecture Overview", "5-layer scoped ServiceNow stack: Presentation, Security APIs, Operational Engines, Data Model, Automation.")

    arch_img_path = os.path.join(DIAGRAMS_DIR, "architecture_overview.png")
    if os.path.exists(arch_img_path):
        s5.shapes.add_picture(arch_img_path, Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.55))

    add_bottom_banner(s5, "Presentation: React 18 SPA in UI Page | Security: Scoped REST APIs & ACLs | Engines: 6 Script Includes | Data: 8 Scoped Tables", accent_label="LAYER SUMMARY:")
    add_speaker_notes(s5, "2:35 – 3:15 (40 sec)",
                      "Let's look at our architecture. The entire system is packaged in the scoped application 'x_caresetu_ai'. At the presentation tier, we host a responsive React 18 Single Page Application inside a ServiceNow UI Page. The client communicates exclusively through Scoped Scripted REST APIs guarded by ServiceNow Role-Based Access Control and ACLs. Beneath that sit six deterministic Script Includes: OperationalRiskEngine, DischargePredictionEngine, HandoffEngine, TpaChaseEngine, AICoordinatorEngine, and ActionExecutionEngine. All persistence is managed in eight scoped tables, synchronized asynchronously via Business Rules.",
                      "Architecture Overview Diagram (architecture_overview.png)",
                      "Point from top (React UI Page) down through Scoped REST APIs to the Deterministic Engines and Scoped Tables.")

    # =========================================================================
    # SLIDE 6: Risk Scoring vs. Discharge Prediction Diagram
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Computational Logic", "Deterministic Risk Scoring vs. Discharge Prediction", "Separating Operational Priority Urgency (0–100) from Delay Timeline Clock (+Minutes).")

    rvp_img_path = os.path.join(DIAGRAMS_DIR, "risk_vs_prediction.png")
    if os.path.exists(rvp_img_path):
        s6.shapes.add_picture(rvp_img_path, Inches(0.8), Inches(1.9), Inches(11.733), Inches(4.55))

    add_bottom_banner(s6, "Deterministic integer score (0–100) drives triage urgency; Linear additive clock (+Minutes) drives schedule transparency. Neither is an ML model.", accent_label="CODE-BACKED LOGIC:")
    add_speaker_notes(s6, "3:15 – 3:55 (40 sec)",
                      "A critical architectural achievement in CareSetu AI is the clean separation between Risk Scoring and Discharge Prediction. OperationalRiskEngine calculates an integer from 0 to 100 based on exact mathematical rules: past due time, overdue tasks, pending milestones, unacknowledged handoffs, and open blockers. It drives our four urgency tiers: Normal, Medium, High, and Critical. In contrast, DischargePredictionEngine is an additive delay clock in minutes with category deduplication to prevent double-counting. An encounter can have a High Risk score while having a short 30-minute delay, or vice versa. Keeping urgency distinct from schedule delay is essential for safe triage.",
                      "Risk vs Prediction Diagram (risk_vs_prediction.png)",
                      "Point to Left Column (0-100 Risk Rules) vs Right Column (Additive Delay Minutes).")

    # =========================================================================
    # SLIDE 7: Command Center & Discharge Pipeline (Real Screenshots)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Live Platform Demonstration", "Command Center & Discharge Pipeline", "Real-time bed triage, urgency badges, and bottleneck visibility across all active inpatient beds.")

    cc_img_path = os.path.join(SCREENSHOTS_DIR, "01_command_center.png")
    dp_img_path = os.path.join(SCREENSHOTS_DIR, "02_discharge_pipeline.png")

    if os.path.exists(cc_img_path):
        s7.shapes.add_picture(cc_img_path, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.55))
    if os.path.exists(dp_img_path):
        s7.shapes.add_picture(dp_img_path, Inches(6.8), Inches(1.9), Inches(5.733), Inches(4.55))

    add_bottom_banner(s7, "Real live application captures: Left = Command Center Dashboard with Triage Badges | Right = Pipeline View by Stage", accent_label="LIVE SYSTEM:")
    add_speaker_notes(s7, "3:55 – 4:40 (45 sec)",
                      "Now let's switch to the live application. Here you see the CareSetu Command Center. Across the top, leadership sees total active encounters, discharges scheduled today, open operational blockers, and active escalations. Below, every inpatient bed is triaged by operational risk. Notice Bed 304 highlighted in orange: High Risk, 75 points. When we toggle to the Discharge Pipeline view on the right, patients are organized into clear workflow columns: Scheduled, Milestone Pending, Blocker Active, Escalated, and Discharge Ready. Async Business Rules keep this entire view updated without manual data entry.",
                      "Live Command Center UI Page (x_caresetu_ai_command_center.do)",
                      "Point to Bed 304 High Urgency badge, top metric counters, and the pipeline stage columns.")

    # =========================================================================
    # SLIDE 8: Encounter 360 & Operational Signals (Real Screenshot)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Patient Deep-Dive", "Encounter 360: Full Operational Telemetry", "Comprehensive 360-degree visibility into blockers, clinical milestones, shift handoffs, and delay clock.")

    enc_img_path = os.path.join(SCREENSHOTS_DIR, "03_encounter_360.png")
    if os.path.exists(enc_img_path):
        s8.shapes.add_picture(enc_img_path, Inches(0.8), Inches(1.9), Inches(7.5), Inches(4.55))

    add_card(s8, Inches(8.6), Inches(1.9), Inches(3.933), Inches(4.55),
             "Encounter 360 Signals",
             ["Patient Context: Synthetic test record ENC1000007 (Bed 304)",
              "Promised Discharge Deadline vs. Projected Delay Clock (+45m)",
              "Discrete Signal Breakdown: Exact points contributing to 75 Risk Score",
              "Active Blockers Tab: TPA Pre-auth delay categorized with owner & SLA",
              "Milestones Tab: Cardiology sign-off vs. post-acute equipment",
              "Shift Handoffs Tab: Sender, receiver, SBAR summary, and ACK countdown timer",
              "Zero PHI: Strictly synthetic data for compliant testing"],
             border_color=C_TEAL, title_color=C_TEAL)

    add_bottom_banner(s8, "Encounter 360 consolidates fragmented department telemetry into a single, real-time operational pane.", accent_label="TELEMETRY:")
    add_speaker_notes(s8, "4:40 – 5:20 (40 sec)",
                      "Drilling into Bed 304 opens Encounter 360. Here, the clinical coordinator sees everything affecting this patient's departure. At the top: promised discharge deadline versus our projected delay clock. Below: four dedicated operational panels. The Blockers tab reveals the exact bottleneck — TPA Pre-Auth unresponded for 45 minutes. The Milestones tab shows cardiology clearance is signed, but equipment dispatch is waiting. And the Handoffs tab displays the shift transition note with a ticking 30-minute acknowledgment SLA timer. No phone calls needed; everything is visible in one place.",
                      "Live Encounter 360 Page (view=encounter-detail)",
                      "Point to the Predicted Discharge Clock, the active TPA Blocker badge, and the Handoff SLA timer.")

    # =========================================================================
    # SLIDE 9: AI Care Coordinator - Grounded Briefings (Real Screenshot)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Conversational Intelligence", "AI Care Coordinator: Grounded Operational Briefings", "Instant, plain-language operational summaries grounded directly in ServiceNow tables without hallucinations.")

    chat_img_path = os.path.join(SCREENSHOTS_DIR, "04_ai_coordinator_chat.png")
    if os.path.exists(chat_img_path):
        s9.shapes.add_picture(chat_img_path, Inches(0.8), Inches(1.9), Inches(7.5), Inches(4.55))

    add_card(s9, Inches(8.6), Inches(1.9), Inches(3.933), Inches(4.55),
             "Grounding & Safety",
             ["Query: 'What is the current status of Bed 304?'",
              "Live Table Context: Aggregates records from encounter, blocker, tpa_case, and handoff tables",
              "Grounded Synthesis: Directly names Star Health TPA pre-auth as the primary bottleneck",
              "Root-Cause Attribution: Explains the exact +45m delay contribution",
              "Non-Clinical Boundary: Strictly addresses operational blockers; never offers medical advice",
              "Fluent Integration Ready: Now Assist Skill defined in code; in-scope deterministic engine guarantees zero downtime"],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_bottom_banner(s9, "The AI Care Coordinator never guesses or hallucinates: every sentence is verified against active ServiceNow records.", accent_label="AI GOVERNANCE:")
    add_speaker_notes(s9, "5:20 – 6:00 (40 sec)",
                      "When staff need an immediate briefing, they open the AI Care Coordinator. Here, a charge nurse asks: 'What is holding up Bed 304?' In milliseconds, the AI analyzes live records across all four scoped tables and answers: 'Bed 304 is delayed by 45 minutes due to an unapproved TPA pre-authorization case with Star Health, alongside a pending shift handoff.' Crucially, this AI is strictly grounded in ServiceNow database state. It cannot hallucinate clinical facts, and it never provides medical advice. It is a tireless, explainable operational assistant.",
                      "AI Care Coordinator Panel (AIPanel opened in Command Center)",
                      "Point to the user query and the grounded, structured briefing response highlighting Star Health TPA.")

    # =========================================================================
    # SLIDE 10: Fix It For Me - Human-Approved Action Lifecycle
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Safe Operational Mutations", "'Fix It For Me': Human-Approved Action Lifecycle", "AI identifies bottlenecks and proposes allowlisted fixes. Authorized humans approve. Server validates and executes.")

    action_img_path = os.path.join(SCREENSHOTS_DIR, "05_fix_it_for_me_action.png")
    seq_img_path = os.path.join(DIAGRAMS_DIR, "fix_it_for_me_sequence.png")

    if os.path.exists(action_img_path):
        s10.shapes.add_picture(action_img_path, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.55))
    if os.path.exists(seq_img_path):
        s10.shapes.add_picture(seq_img_path, Inches(6.8), Inches(1.9), Inches(5.733), Inches(4.55))

    add_bottom_banner(s10, "Proposal State Isolation -> Role Verification (coordinator/admin) -> Revalidation -> Allowlisted Execution -> Immutable Audit Trail", accent_label="SAFETY PIPELINE:")
    add_speaker_notes(s10, "6:00 – 6:45 (45 sec)",
                      "Now comes CareSetu's hallmark capability: 'Fix It For Me'. Notice on the left screen: the AI doesn't just describe the problem; it formulates a specific, pre-approved action card: 'Chase TPA Pre-Authorization & Escalate Blocker'. It explains the rationale and the delay impact. While in 'proposed' state, the database remains completely untouched. Only when an authorized coordinator clicks 'Approve & Execute' does the server-side pipeline engage. As shown in the sequence diagram on the right: our Scripted REST API verifies the user's role, re-validates that the blocker hasn't already been resolved, locks idempotency, executes the allowlisted handler, and logs an immutable audit trail. If the nurse clicks 'Reject', the action is archived and target tables remain 100% untouched.",
                      "AI Care Coordinator Action Card & Fix It For Me Sequence Diagram",
                      "Point to the 'Approve & Execute' button on the left, then trace the sequence steps on the right.")

    # =========================================================================
    # SLIDE 11: Automation Engines & Honest Production Boundaries
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Automation & System Boundaries", "Autonomous Schedulers & Honest Production Limits", "Clear distinction between verified working engines and unconfigured external integrations.")

    add_card(s11, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.3),
             "Verified Implemented Engines",
             ["TpaChaseEngine: Scheduled job runs every 15m; checks submission SLAs (15m/30m/45m intervals); logs chase attempts and updates follow-up counters.",
              "HandoffEngine: Manages shift transitions; monitors 30-minute ACK SLA; auto-generates reminders and escalates unacknowledged handoffs into blockers.",
              "OperationalRiskEngine: Async Business Rules recompute 0–100 risk score on any blocker, task, milestone, or handoff update.",
              "DischargePredictionEngine: Dynamically recalculates predicted discharge time and delay minutes using category deduplication.",
              "Escalation Synchronization: Automatically creates and deactivates x_caresetu_ai_escalation records at risk >= 60 threshold."],
             border_color=C_GREEN, title_color=C_GREEN)

    add_card(s11, Inches(6.8), Inches(2.0), Inches(5.733), Inches(4.3),
             "Honest Production Boundaries",
             ["Authoritative Hospital EHR Telemetry: Not integrated; demo operates strictly on scoped synthetic records (ENC1000007).",
              "External Insurer Live Clearinghouse: External payer API not configured; TPA chaser executes internal operational tracking lifecycle.",
              "Emergency Operations Module: Surge view and rapid blocker triage are fully implemented in UI and data, but hospital-wide bed census telemetry is unconfigured.",
              "Now Assist Platform Activation: Fluent skill config is written; in-scope grounded aggregator is active as the reliable fallback.",
              "Strict Non-Clinical Scope: CareSetu never diagnoses illness, never recommends drug dosages, and never overrides physician authority."],
             border_color=C_AMBER, title_color=C_AMBER)

    add_bottom_banner(s11, "Engineering integrity: We explicitly document working capabilities vs. unconfigured external hospital integrations.", accent_label="TRANSPARENCY:")
    add_speaker_notes(s11, "6:45 – 7:25 (40 sec)",
                      "As enterprise platform engineers, we believe in radical transparency. Everything on the left is fully implemented, verified, and running in ServiceNow right now: our 15-minute TPA Auto-Chaser, 30-minute Handoff SLA engine, async risk rescoring, and escalation synchronizer. On the right, we explicitly declare what is NOT configured: we do not claim live connections to external insurance company APIs — our chaser tracks internal workflow SLAs. We do not claim hospital-wide telemetry — we use synthetic test encounters. And we maintain a strict non-clinical boundary: CareSetu manages operational logistics, never clinical treatment.",
                      "Lifecycle & Boundaries Slide",
                      "Point to the green Working Engines panel, then highlight the honest boundaries on the right.")

    # =========================================================================
    # SLIDE 12: Impact Hypothesis, Guardrails & Conclusion
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Impact & Vision", "Restoring Time to Patients and Beds", "The right care, in the right bed, at the right hour.")

    add_card(s12, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.3),
             "Operational Impact",
             ["Target 45–60 minute reduction in average discharge turnaround time.",
              "Unblocks ~1,000+ bed-hours per month in a 400-bed facility.",
              "Reduces hallway boarding and emergency department gridlock.",
              "Cuts nurse administrative chasing by an estimated 50%."],
             border_color=C_TEAL, title_color=C_TEAL)

    add_card(s12, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.3),
             "Enterprise Healthcare Guardrails",
             ["Role-Based Access Control: admin, coordinator, and user segregation.",
              "Human approval boundary: zero autonomous mutation.",
              "Full idempotency & audit logging on every action execution.",
              "HIPAA & synthetic testing: zero real patient PHI."],
             border_color=C_LIGHT_BLUE, title_color=C_LIGHT_BLUE)

    add_card(s12, Inches(8.8), Inches(2.0), Inches(3.733), Inches(4.3),
             "The Road Ahead",
             ["FHIR R4 & HL7 v2 connectors for enterprise EHR synchronization.",
              "External insurer portal webhooks for automated pre-auth confirmation.",
              "Multi-hospital network capacity balancing across regional health systems.",
              "Native Now Assist GenAI activation for ambient ward briefing."],
             border_color=C_AMBER, title_color=C_AMBER)

    add_bottom_banner(s12, "When hospitals run on connected operational workflows, patients like Nanaji go home the hour they are healed — not hours later.", accent_label="THE MISSION:")
    add_speaker_notes(s12, "7:25 – 8:00 (35 sec)",
                      "In conclusion: CareSetu AI transforms inpatient discharge from a chaotic, fragmented waiting game into a deterministic, auditable, and collaborative operational workflow. By pairing explainable urgency calculations with grounded AI briefings and human-approved action, we restore thousands of bed-hours to healthcare systems. Most importantly, we ensure that when patients like Nanaji are healed, they get to go home to their families the hour they are cleared — not eight hours later. Thank you, and we welcome your questions.",
                      "Conclusion & Vision Slide",
                      "Conclude presentation with warmth and confidence; invite judge questions.")

    # Save presentation
    prs.save(OUTPUT_PPTX)
    print(f"[+] Successfully built presentation deck: {OUTPUT_PPTX} ({os.path.getsize(OUTPUT_PPTX):,} bytes)")

if __name__ == "__main__":
    build_deck()
