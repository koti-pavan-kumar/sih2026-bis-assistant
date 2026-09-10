"""
ManakMitra SIH 2026 Presentation Generator v2
Matches the SentiVectors winning slide style exactly.
Run: python generate_ppt_v2.py
Output: ManakMitra_SIH2026.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

# Colors
NAVY = RGBColor(0x1a, 0x3a, 0x6e)
DARK_NAVY = RGBColor(0x0d, 0x1b, 0x3e)
ORANGE = RGBColor(0xff, 0x6b, 0x35)
WHITE = RGBColor(0xff, 0xff, 0xff)
LIGHT_GRAY = RGBColor(0xf5, 0xf5, 0xf5)
MED_GRAY = RGBColor(0x99, 0x99, 0x99)
DARK_TEXT = RGBColor(0x33, 0x33, 0x33)
BLUE_LIGHT = RGBColor(0xe3, 0xf2, 0xfd)
GREEN_LIGHT = RGBColor(0xe8, 0xf5, 0xe9)
ORANGE_LIGHT = RGBColor(0xff, 0xf3, 0xe0)
PURPLE_LIGHT = RGBColor(0xf3, 0xe5, 0xf5)
ROSE_LIGHT = RGBColor(0xfc, 0xe4, 0xec)
TEAL_LIGHT = RGBColor(0xe0, 0xf2, 0xf1)
AMBER_LIGHT = RGBColor(0xff, 0xf8, 0xe1)
INDIGO_LIGHT = RGBColor(0xe8, 0xea, 0xf6)
SEC_BLUE = RGBColor(0x21, 0x96, 0xf3)
SEC_GREEN = RGBColor(0x4c, 0xaf, 0x50)
SEC_AMBER = RGBColor(0xff, 0x98, 0x00)
SEC_PURPLE = RGBColor(0x9c, 0x27, 0xb0)
SEC_INDIGO = RGBColor(0x3f, 0x51, 0xb5)
SEC_ROSE = RGBColor(0xe9, 0x1e, 0x63)
SEC_TEAL = RGBColor(0x00, 0x96, 0x88)


def add_header(slide):
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(0.85))
    bar.fill.solid(); bar.fill.fore_color.rgb = WHITE
    bar.line.color.rgb = NAVY; bar.line.width = Pt(2)

    logo = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.3), Inches(0.12), Inches(1.6), Inches(0.55))
    logo.fill.solid(); logo.fill.fore_color.rgb = WHITE
    logo.line.color.rgb = NAVY; logo.line.width = Pt(1.5)
    tf = logo.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "Resonant"; r.font.size = Pt(18); r.font.bold = True; r.font.color.rgb = NAVY

    tb = slide.shapes.add_textbox(Inches(3.5), Inches(0.12), Inches(6), Inches(0.6))
    tf = tb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "MANAKMITRA"; r.font.size = Pt(28); r.font.bold = True; r.font.color.rgb = NAVY

    sih = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.1), Inches(0.65), Inches(0.65))
    sih.fill.solid(); sih.fill.fore_color.rgb = ORANGE; sih.line.fill.background()
    tf = sih.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "SIH"; r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = WHITE

    st = slide.shapes.add_textbox(Inches(10.8), Inches(0.12), Inches(1.1), Inches(0.6))
    tf = st.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = "SMART INDIA\nHACKATHON 2026"; r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = NAVY


def add_footer(slide, num):
    ft = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.2), Inches(13.33), Inches(0.3))
    ft.fill.solid(); ft.fill.fore_color.rgb = LIGHT_GRAY; ft.line.fill.background()
    lt = slide.shapes.add_textbox(Inches(0.5), Inches(7.2), Inches(4), Inches(0.3))
    tf = lt.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = "@SIH Idea submission"; r.font.size = Pt(9); r.font.color.rgb = MED_GRAY
    rt = slide.shapes.add_textbox(Inches(12.5), Inches(7.2), Inches(0.5), Inches(0.3))
    tf = rt.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = str(num); r.font.size = Pt(9); r.font.color.rgb = MED_GRAY


def add_heading(slide, x, y, w, text, size=16, color=None):
    if color is None: color = NAVY
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(0.35))
    tf = tb.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = text; r.font.size = Pt(size); r.font.bold = True; r.font.color.rgb = color


def add_flow_box(slide, x, y, w, h, icon, title, lines, bg, border, title_color=None, text_color=None, is_white_text=False):
    if title_color is None: title_color = border
    if text_color is None: text_color = DARK_TEXT
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid(); shape.fill.fore_color.rgb = bg
    shape.line.color.rgb = border; shape.line.width = Pt(1.5)
    tf = shape.text_frame; tf.word_wrap = True; tf.margin_left = Pt(5); tf.margin_right = Pt(5); tf.margin_top = Pt(3)

    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = icon; r.font.size = Pt(18)

    p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run(); r2.text = title; r2.font.size = Pt(10); r2.font.bold = True
    r2.font.color.rgb = WHITE if is_white_text else title_color

    for line in lines:
        p3 = tf.add_paragraph(); p3.alignment = PP_ALIGN.CENTER; p3.space_before = Pt(1)
        r3 = p3.add_run(); r3.text = line; r3.font.size = Pt(8)
        r3.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc) if is_white_text else text_color


# ══════════════════════════════════════════════
#  SLIDE 1: TITLE
# ══════════════════════════════════════════════
def slide_title(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(7.5))
    bg.fill.solid(); bg.fill.fore_color.rgb = DARK_NAVY; bg.line.fill.background()

    circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.5), Inches(0.5), Inches(3), Inches(3))
    circ.fill.solid(); circ.fill.fore_color.rgb = ORANGE; circ.fill.fore_color.brightness = 0.85; circ.line.fill.background()

    badge = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.9), Inches(1.0), Inches(3.5), Inches(0.65))
    badge.fill.background(); badge.line.color.rgb = WHITE; badge.line.width = Pt(1.5)
    tf = badge.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "RESONANT"; r.font.size = Pt(16); r.font.bold = True; r.font.color.rgb = WHITE

    tb = s.shapes.add_textbox(Inches(1.5), Inches(2.0), Inches(10.3), Inches(1.2))
    tf = tb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "MANAK"; r.font.size = Pt(52); r.font.bold = True; r.font.color.rgb = WHITE
    r2 = p.add_run(); r2.text = "MITRA"; r2.font.size = Pt(52); r2.font.bold = True; r2.font.color.rgb = ORANGE

    div = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.67), Inches(3.3), Inches(2), Inches(0.04))
    div.fill.solid(); div.fill.fore_color.rgb = ORANGE; div.line.fill.background()

    sub = s.shapes.add_textbox(Inches(2), Inches(3.6), Inches(9.3), Inches(0.8))
    tf = sub.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "AI-Powered BIS Standards Compliance Assistant\nfor Indian MSMEs and Manufacturers"
    r.font.size = Pt(18); r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    tag = s.shapes.add_textbox(Inches(2), Inches(4.5), Inches(9.3), Inches(0.5))
    tf = tag.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "YOUR GUIDE TO BUREAU OF INDIAN STANDARDS"
    r.font.size = Pt(14); r.font.bold = True; r.font.color.rgb = ORANGE

    stats = [("28", "IS Standards"), ("22", "Languages"), ("25+", "BIS Offices"), ("5", "Certifications")]
    x = 3.0
    for num, label in stats:
        nb = s.shapes.add_textbox(Inches(x), Inches(5.3), Inches(1.8), Inches(0.6))
        tf = nb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = num; r.font.size = Pt(32); r.font.bold = True; r.font.color.rgb = ORANGE
        lb = s.shapes.add_textbox(Inches(x), Inches(5.85), Inches(1.8), Inches(0.4))
        tf = lb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = label; r.font.size = Pt(11); r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)
        x += 2.0

    sih = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.3), Inches(0.8), Inches(0.8))
    sih.fill.solid(); sih.fill.fore_color.rgb = ORANGE; sih.line.fill.background()
    tf = sih.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "SIH"; r.font.size = Pt(12); r.font.bold = True; r.font.color.rgb = WHITE
    sl = s.shapes.add_textbox(Inches(10.6), Inches(0.3), Inches(1.3), Inches(0.8))
    tf = sl.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = "SMART INDIA\nHACKATHON 2026"; r.font.size = Pt(11); r.font.bold = True; r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)


# ══════════════════════════════════════════════
#  SLIDE 2: PROBLEMS & SOLUTIONS
# ══════════════════════════════════════════════
def slide_problems(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(s); add_footer(s, 2)
    add_heading(s, 0.4, 1.1, 6, "Problems Faced & Their Solutions:", 16)

    problems = [
        ("Complex BIS Standards", "AI-based Simplification", "Explain technical requirements in simple language"),
        ("Scattered Information", "Unified Platform", "Bring standards, certification & lab info together"),
        ("Changing Standards", "Live Source Pipeline", "Pull info from official BIS sources automatically"),
        ("Finding Testing Labs", "Lab Directory", "Location-based finder with Google Maps directions"),
        ("Complex Certification", "Step-by-Step Guidance", "Clear process for ISI Mark, Hallmark & Eco Mark"),
        ("AI Hallucinations", "Source-Grounded RAG", "Responses based on verified BIS documents only"),
        ("Language Barrier", "22 Indian Languages", "Auto-detect, translate, RAG, translate back"),
        ("Different User Needs", "Context-Aware AI", "Tailors guidance per user product and query"),
    ]

    y = 1.5
    hdr = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(y), Inches(5.8), Inches(0.35))
    hdr.fill.solid(); hdr.fill.fore_color.rgb = NAVY; hdr.line.fill.background()
    for cx, ct in [(0.5, "Problems Faced"), (3.4, "Proposed Solutions")]:
        tb = s.shapes.add_textbox(Inches(cx), Inches(y+0.03), Inches(2.7), Inches(0.3))
        tf = tb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = ct; r.font.size = Pt(11); r.font.bold = True; r.font.color.rgb = WHITE

    y += 0.4
    for i, (pn, sn, sd) in enumerate(problems):
        bg_c = WHITE if i % 2 == 0 else LIGHT_GRAY
        row = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(y), Inches(5.8), Inches(0.42))
        row.fill.solid(); row.fill.fore_color.rgb = bg_c
        row.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0); row.line.width = Pt(0.5)

        tb = s.shapes.add_textbox(Inches(0.5), Inches(y+0.05), Inches(2.7), Inches(0.35))
        tf = tb.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]
        r = p.add_run(); r.text = pn; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(0xc0, 0x39, 0x2b)

        tb2 = s.shapes.add_textbox(Inches(3.35), Inches(y+0.02), Inches(2.8), Inches(0.4))
        tf = tb2.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]
        r = p.add_run(); r.text = sn; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = NAVY
        p2 = tf.add_paragraph(); r2 = p2.add_run(); r2.text = sd; r2.font.size = Pt(8.5); r2.font.color.rgb = DARK_TEXT
        y += 0.42

    add_heading(s, 6.8, 1.1, 6, "System Architecture:", 16)

    arch = [
        (8.2, 1.55, 2.6, 0.4, "User Query", GREEN_LIGHT, SEC_GREEN, [], False),
        (8.2, 2.1, 2.6, 0.4, "Auto-Detect, Translate (22 Lang)", BLUE_LIGHT, SEC_BLUE, [], False),
        (8.0, 2.65, 3.0, 0.45, "RAG Engine (ONNX + FAISS)", NAVY, NAVY, [], True),
        (7.0, 3.25, 2.2, 0.38, "ONNX Embeddings", PURPLE_LIGHT, SEC_PURPLE, ["all-MiniLM-L6-v2"], False),
        (9.4, 3.25, 2.2, 0.38, "FAISS Vector Store", ROSE_LIGHT, SEC_ROSE, ["28 Standards"], False),
        (8.0, 3.8, 3.0, 0.4, "Gemini 3.6 Flash (LLM)", ORANGE_LIGHT, SEC_AMBER, [], False),
        (6.8, 4.35, 1.8, 0.35, "BIS Standards (28)", INDIGO_LIGHT, SEC_INDIGO, [], False),
        (8.7, 4.35, 1.8, 0.35, "25+ BIS Offices", TEAL_LIGHT, SEC_GREEN, [], False),
        (10.6, 4.35, 1.8, 0.35, "Certifications", AMBER_LIGHT, SEC_AMBER, [], False),
        (7.5, 4.9, 3.6, 0.4, "6-Section Structured Response", GREEN_LIGHT, SEC_GREEN, [], True),
        (7.0, 5.45, 4.8, 0.35, "Chat | Standards | Offices | Certs", RGBColor(0xed, 0xe7, 0xf6), SEC_PURPLE, [], False),
    ]

    for bx, by, bw, bh, bt, bbg, bbdr, blines, bbold in arch:
        shape = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(bx), Inches(by), Inches(bw), Inches(bh))
        shape.fill.solid(); shape.fill.fore_color.rgb = bbg
        shape.line.color.rgb = bbdr; shape.line.width = Pt(1.5)
        tf = shape.text_frame; tf.word_wrap = True; tf.margin_left = Pt(4); tf.margin_right = Pt(4)
        p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = bt; r.font.size = Pt(8 if blines else 9); r.font.bold = bbold
        r.font.color.rgb = WHITE if bbold or bbg == NAVY else DARK_TEXT
        for bl in blines:
            p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER
            r2 = p2.add_run(); r2.text = bl; r2.font.size = Pt(7); r2.font.color.rgb = DARK_TEXT

    for yar in [2.0, 2.55, 3.15, 3.75, 4.3, 4.85]:
        a = s.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(9.35), Inches(yar), Inches(0.15), Inches(0.12))
        a.fill.solid(); a.fill.fore_color.rgb = MED_GRAY; a.line.fill.background()

    add_heading(s, 0.4, 6.0, 4, "How it addresses the problem:", 13)
    venn = [
        (1.0, 6.3, 1.3, 1.3, BLUE_LIGHT, SEC_BLUE, "SIMPLIFY\nCOMPLEX\nSTANDARDS"),
        (0.5, 6.55, 1.3, 1.3, GREEN_LIGHT, SEC_GREEN, "UNIFIED\nCOMPLIANCE\nPLATFORM"),
        (1.5, 6.55, 1.3, 1.3, ORANGE_LIGHT, SEC_AMBER, "MULTILINGUAL\nAI (22 Lang)"),
    ]
    for vx, vy, vw, vh, vbg, vbdr, vtxt in venn:
        c = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(vx), Inches(vy), Inches(vw), Inches(vh))
        c.fill.solid(); c.fill.fore_color.rgb = vbg; c.line.color.rgb = vbdr; c.line.width = Pt(1)
        tf = c.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = vtxt; r.font.size = Pt(7); r.font.bold = True; r.font.color.rgb = DARK_TEXT

    cen = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(1.25), Inches(6.7), Inches(0.85), Inches(0.85))
    cen.fill.solid(); cen.fill.fore_color.rgb = NAVY; cen.line.color.rgb = NAVY; cen.line.width = Pt(1.5)
    tf = cen.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "MANAK\nMITRA"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = WHITE

    add_heading(s, 3.5, 6.0, 6, "Innovation and Uniqueness:", 13)
    inn = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.5), Inches(6.35), Inches(9.3), Inches(0.85))
    inn.fill.solid(); inn.fill.fore_color.rgb = LIGHT_GRAY; inn.line.color.rgb = NAVY; inn.line.width = Pt(1)
    tf = inn.text_frame; tf.word_wrap = True; tf.margin_left = Pt(8); tf.margin_top = Pt(4)

    innovs = [
        ("Source-Grounded RAG", " - ONNX + FAISS, hallucination-free, cited responses"),
        ("Live BIS Pipeline", " - Auto-fetches new standards, always current"),
        ("22 Indian Languages", " - Auto-detect, translate, RAG, translate-back"),
        ("6-Section Responses", " - Standards, testing, offices, legal, QC, documents"),
        ("Unified Ecosystem", " - Standards + certs + labs + AI in one platform"),
    ]
    for i, (bp, np) in enumerate(innovs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph(); p.space_after = Pt(1)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(9); r.font.color.rgb = ORANGE
        r2 = p.add_run(); r2.text = bp; r2.font.size = Pt(9); r2.font.bold = True; r2.font.color.rgb = NAVY
        r3 = p.add_run(); r3.text = np; r3.font.size = Pt(9); r3.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 3: TECHNICAL APPROACH (Redesigned)
# ══════════════════════════════════════════════
def slide_technical(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(s); add_footer(s, 3)

    # Title centered
    add_heading(s, 3.5, 1.0, 6, "TECHNICAL APPROACH", 22)

    # ── LEFT: Tech Stack (like sister's clean bullet list) ──
    add_heading(s, 0.5, 1.55, 4, "Tech Stack:", 18)

    techs = [
        ("Frontend:", " React.js, Vite, Tailwind CSS"),
        ("Backend:", " Python, FastAPI, Uvicorn"),
        ("Database & Storage:", " FAISS Vector Store, JSON user store"),
        ("AI & ML:", " Google Gemini API, ONNX Runtime, Sentence Transformers"),
        ("Embeddings:", " all-MiniLM-L6-v2 (384-dim), FAISS indexing"),
        ("Document Processing:", " PDFPlumber, Text chunking, Vector indexing"),
        ("Authentication:", " JWT tokens, bcrypt password hashing"),
        ("Multilingual:", " deep-translator, langdetect (22 Indian languages)"),
        ("Deployment:", " Git/GitHub, Vercel (Frontend), Render (Backend)"),
    ]

    tb = s.shapes.add_textbox(Inches(0.5), Inches(2.0), Inches(5.5), Inches(3.5))
    tf = tb.text_frame; tf.word_wrap = True
    for i, (bp, np) in enumerate(techs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(4)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(12); r.font.color.rgb = ORANGE; r.font.bold = True
        r2 = p.add_run(); r2.text = bp; r2.font.size = Pt(13); r2.font.bold = True; r2.font.color.rgb = NAVY
        r3 = p.add_run(); r3.text = np; r3.font.size = Pt(13); r3.font.color.rgb = DARK_TEXT

    # Live URL
    lu = s.shapes.add_textbox(Inches(0.5), Inches(5.6), Inches(5.5), Inches(0.4))
    tf = lu.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = "Live prototype: "; r.font.size = Pt(14); r.font.bold = True; r.font.color.rgb = NAVY
    r2 = p.add_run(); r2.text = "manakmitra-frontend.vercel.app"; r2.font.size = Pt(14); r2.font.color.rgb = SEC_BLUE; r2.font.bold = True

    # Vertical divider
    div = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.3), Inches(1.5), Inches(0.03), Inches(5.5))
    div.fill.solid(); div.fill.fore_color.rgb = RGBColor(0xe0, 0xe0, 0xe0); div.line.fill.background()

    # ── RIGHT: Architecture Flow (like sister's clean diagram) ──
    add_heading(s, 6.8, 1.55, 6, "Architecture Flow:", 16)

    # Flow boxes
    flow_data = [
        (6.8, 2.1, 2.2, 1.0, "User", ["Enters product query", "Selects language", "Voice input (opt)"], GREEN_LIGHT, SEC_GREEN),
        (9.3, 2.1, 2.2, 1.0, "ManakMitra App", ["React + Vite", "Multilingual UI", "Chat + Dashboard"], BLUE_LIGHT, SEC_BLUE),
        (11.8, 2.1, 1.5, 1.0, "RAG Engine", ["ONNX + FAISS", "Vector search", "Context retrieval"], NAVY, NAVY),
    ]

    for fx, fy, fw, fh, ft, flines, fbg, fbdr in flow_data:
        add_flow_box(s, fx, fy, fw, fh, "", ft, flines, fbg, fbdr)

    # Arrows between top row
    for ax in [9.05, 11.55]:
        a = s.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(ax), Inches(2.5), Inches(0.25), Inches(0.15))
        a.fill.solid(); a.fill.fore_color.rgb = MED_GRAY; a.line.fill.background()

    # Second row
    add_flow_box(s, 6.8, 3.3, 2.2, 0.9, "", "BIS Retrieval", ["Fetch standards from", "bis.gov.in", "Auto-fetch pipeline"], ORANGE_LIGHT, SEC_AMBER)
    a = s.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(7.8), Inches(3.15), Inches(0.15), Inches(0.15))
    a.fill.solid(); a.fill.fore_color.rgb = MED_GRAY; a.line.fill.background()

    add_flow_box(s, 9.3, 3.3, 2.2, 0.9, "", "Gemini LLM", ["Generate 6-section", "structured response", "Source-grounded"], PURPLE_LIGHT, SEC_PURPLE)

    a = s.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(9.05), Inches(3.65), Inches(0.25), Inches(0.15))
    a.fill.solid(); a.fill.fore_color.rgb = MED_GRAY; a.line.fill.background()

    add_flow_box(s, 11.8, 3.3, 1.5, 0.9, "", "Response", ["Standards + Testing", "Offices + Certs", "Documents + QC"], GREEN_LIGHT, SEC_GREEN)

    a = s.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(12.5), Inches(4.25), Inches(0.15), Inches(0.15))
    a.fill.solid(); a.fill.fore_color.rgb = MED_GRAY; a.line.fill.background()

    # Third row - services
    services = [
        (6.8, 4.5, 1.5, 0.7, "Standards\nLibrary", INDIGO_LIGHT, SEC_INDIGO),
        (8.5, 4.5, 1.5, 0.7, "BIS Office\nFinder", TEAL_LIGHT, SEC_TEAL),
        (10.2, 4.5, 1.5, 0.7, "Certification\nGuide", AMBER_LIGHT, SEC_AMBER),
        (11.9, 4.5, 1.5, 0.7, "Analytics\nDashboard", ROSE_LIGHT, SEC_ROSE),
    ]

    for sx, sy, sw, sh, st, sbg, sbdr in services:
        shape = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(sx), Inches(sy), Inches(sw), Inches(sh))
        shape.fill.solid(); shape.fill.fore_color.rgb = sbg; shape.line.color.rgb = sbdr; shape.line.width = Pt(1)
        tf = shape.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = st; r.font.size = Pt(9); r.font.bold = True; r.font.color.rgb = DARK_TEXT

    # ── Tech Used Icons (like sister's) ──
    add_heading(s, 6.8, 5.4, 6, "Tech Used:", 13)

    tech_cats = [
        ("Frontend", ["React", "Vite", "Tailwind"], BLUE_LIGHT),
        ("Backend", ["Python", "FastAPI", "Uvicorn"], GREEN_LIGHT),
        ("AI/ML", ["Gemini", "ONNX", "FAISS", "NumPy"], ORANGE_LIGHT),
        ("Data", ["PDF", "Chunk", "Embed", "Index"], PURPLE_LIGHT),
        ("Services", ["JWT", "22Lang", "Maps", "Fetch"], TEAL_LIGHT),
    ]

    for i, (cat_name, techs_list, cat_bg) in enumerate(tech_cats):
        cx = 6.8 + i * 1.32
        cat = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(5.7), Inches(1.2), Inches(0.9))
        cat.fill.solid(); cat.fill.fore_color.rgb = cat_bg; cat.line.color.rgb = RGBColor(0xdd, 0xdd, 0xdd); cat.line.width = Pt(1)
        tf = cat.text_frame; tf.word_wrap = True; tf.margin_left = Pt(3); tf.margin_top = Pt(2)
        p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = cat_name; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = NAVY
        for t in techs_list:
            p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER; p2.space_before = Pt(1)
            r2 = p2.add_run(); r2.text = t; r2.font.size = Pt(7); r2.font.color.rgb = DARK_TEXT

    # ── Bottom Left: Phone Mockups with Screenshots ──
    add_heading(s, 0.5, 5.6, 3, "App Screenshots:", 13)

    screenshots = [
        ("screenshots/bis-offices-light.png", "BIS Offices"),
        ("screenshots/bis-offices-dark.png", "BIS Offices Dark"),
        ("screenshots/auto-fetch-light.png", "Auto-Fetch"),
        ("screenshots/auto-fetch-dark.png", "Auto-Fetch Dark"),
    ]

    base_dir = os.path.dirname(os.path.abspath(__file__))
    for i, (img_path, label) in enumerate(screenshots):
        px = 0.5 + i * 1.5
        # Phone frame
        phone = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(5.95), Inches(1.3), Inches(1.1))
        phone.fill.solid(); phone.fill.fore_color.rgb = WHITE
        phone.line.color.rgb = RGBColor(0x33, 0x33, 0x33); phone.line.width = Pt(2)

        # Try to add image
        full_path = os.path.join(base_dir, img_path)
        if os.path.exists(full_path):
            try:
                pic = s.shapes.add_picture(full_path, Inches(px + 0.05), Inches(5.98), Inches(1.2), Inches(1.0))
            except:
                pass
        else:
            # Placeholder
            tb = s.shapes.add_textbox(Inches(px + 0.1), Inches(6.2), Inches(1.1), Inches(0.5))
            tf = tb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
            r = p.add_run(); r.text = label; r.font.size = Pt(8); r.font.color.rgb = MED_GRAY

    # ── Bottom Right: Features list ──
    add_heading(s, 6.8, 5.6, 3, "Key Features:", 13)
    feats = [
        "22 Indian Languages",
        "6-Section AI Response",
        "Hallucination-Free RAG",
        "Live Auto-Fetch",
        "BIS Office Finder",
        "Certification Guide",
        "Multi-User Auth (JWT)",
        "Dark/Light Mode",
    ]
    tb = s.shapes.add_textbox(Inches(6.8), Inches(5.95), Inches(4.0), Inches(1.2))
    tf = tb.text_frame; tf.word_wrap = True
    for i, feat in enumerate(feats):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(2)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(9); r.font.color.rgb = ORANGE; r.font.bold = True
        r2 = p.add_run(); r2.text = feat; r2.font.size = Pt(9); r2.font.bold = True; r2.font.color.rgb = NAVY


# ══════════════════════════════════════════════
#  SLIDE 4: DEMO
# ══════════════════════════════════════════════
def slide_demo(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(s); add_footer(s, 4)
    add_heading(s, 0.4, 1.1, 6, "Live Demo - Key Features", 16)

    features = [
        ("Multilingual AI Chat", "Ask in Hindi, Telugu, Tamil, Bengali or 18 other Indian languages"),
        ("6-Section Response", "Standards, testing, offices, legal basis, QC, documents - every time"),
        ("Live Auto-Fetch", "Scrapes bis.gov.in for new standards and indexes automatically"),
        ("BIS Office Finder", "GPS-based nearest centre with directions and phone numbers"),
        ("Certification Guide", "Step-by-step for ISI Mark, Hallmark, Eco Mark, CMVR, MSME Udyam"),
    ]

    yf = 1.5
    for ft, fd in features:
        border = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(yf), Inches(0.06), Inches(0.6))
        border.fill.solid(); border.fill.fore_color.rgb = ORANGE; border.line.fill.background()

        card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(yf), Inches(5.7), Inches(0.6))
        card.fill.solid(); card.fill.fore_color.rgb = LIGHT_GRAY; card.line.fill.background()

        tb = s.shapes.add_textbox(Inches(0.7), Inches(yf + 0.06), Inches(5.3), Inches(0.5))
        tf = tb.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]
        r = p.add_run(); r.text = ft; r.font.size = Pt(11); r.font.bold = True; r.font.color.rgb = NAVY
        p2 = tf.add_paragraph(); r2 = p2.add_run(); r2.text = fd; r2.font.size = Pt(9.5); r2.font.color.rgb = DARK_TEXT
        yf += 0.7

    # Right: Mock screenshot
    add_heading(s, 6.8, 1.1, 6, "App Screenshots:", 16)

    # Chat mock
    cbg = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.55), Inches(5.8), Inches(2.6))
    cbg.fill.solid(); cbg.fill.fore_color.rgb = WHITE; cbg.line.color.rgb = RGBColor(0xdd, 0xdd, 0xdd); cbg.line.width = Pt(1)

    ch = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.55), Inches(5.8), Inches(0.3))
    ch.fill.solid(); ch.fill.fore_color.rgb = NAVY; ch.line.fill.background()
    tf = ch.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = "  ManakMitra"; r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = WHITE

    um = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.5), Inches(2.05), Inches(3.0), Inches(0.3))
    um.fill.solid(); um.fill.fore_color.rgb = NAVY; um.line.fill.background()
    tf = um.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = "What standards for cement?"; r.font.size = Pt(8); r.font.color.rgb = WHITE

    secs = [
        (7.0, 2.5, 5.4, 0.28, "1. IS Standards: IS 269, IS 455, IS 8112", BLUE_LIGHT, SEC_BLUE),
        (7.0, 2.85, 5.4, 0.28, "2. Testing: Compressive strength per IS 4031", PURPLE_LIGHT, SEC_PURPLE),
        (7.0, 3.2, 5.4, 0.28, "3. Where to Test: BIS Lab Delhi 011-2323", GREEN_LIGHT, SEC_GREEN),
        (7.0, 3.55, 5.4, 0.28, "4. Mandatory: Yes, under BIS Act 2016", AMBER_LIGHT, SEC_AMBER),
    ]
    for sx, sy, sw, sh, st, sbg, sbdr in secs:
        sec = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(sx), Inches(sy), Inches(sw), Inches(sh))
        sec.fill.solid(); sec.fill.fore_color.rgb = sbg; sec.line.color.rgb = sbdr; sec.line.width = Pt(1)
        tf = sec.text_frame; tf.margin_left = Pt(6); p = tf.paragraphs[0]
        r = p.add_run(); r.text = st; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = DARK_TEXT

    # Standards mock
    sbg2 = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.3), Inches(5.8), Inches(2.5))
    sbg2.fill.solid(); sbg2.fill.fore_color.rgb = WHITE; sbg2.line.color.rgb = RGBColor(0xdd, 0xdd, 0xdd); sbg2.line.width = Pt(1)

    sh2 = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(4.3), Inches(5.8), Inches(0.3))
    sh2.fill.solid(); sh2.fill.fore_color.rgb = NAVY; sh2.line.fill.background()
    tf = sh2.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = "  BIS Standards Library - 28 Standards"; r.font.size = Pt(9); r.font.bold = True; r.font.color.rgb = WHITE

    stds = [("IS 269", "Cement", "OPC"), ("IS 2062", "Steel", "Structural"), ("IS 302", "Electrical", "Appliances"),
            ("IS 14543", "Food", "Water"), ("IS 15556", "Electrical", "LED"), ("IS 3289", "Leather", "Finished")]
    for i, (sid, scat, stitle) in enumerate(stds):
        col, row = i % 3, i // 3
        cx, cy = 7.0 + col * 1.9, 4.75 + row * 1.0
        cd = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(cy), Inches(1.7), Inches(0.85))
        cd.fill.solid(); cd.fill.fore_color.rgb = WHITE; cd.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0); cd.line.width = Pt(0.5)
        tf = cd.text_frame; tf.word_wrap = True; tf.margin_left = Pt(5); tf.margin_top = Pt(3)
        p = tf.paragraphs[0]; r = p.add_run(); r.text = scat.upper(); r.font.size = Pt(7); r.font.bold = True; r.font.color.rgb = ORANGE
        p2 = tf.add_paragraph(); r2 = p2.add_run(); r2.text = sid; r2.font.size = Pt(11); r2.font.bold = True; r2.font.color.rgb = NAVY
        p3 = tf.add_paragraph(); r3 = p3.add_run(); r3.text = stitle; r3.font.size = Pt(8); r3.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 5: IMPACT
# ══════════════════════════════════════════════
def slide_impact(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(s); add_footer(s, 5)
    add_heading(s, 0.4, 1.1, 6, "Impact & Target Users", 16)

    metrics = [("63M+", "MSMEs in India"), ("28K+", "BIS Standards"), ("2.5L Cr", "Compliance Market")]
    for i, (num, label) in enumerate(metrics):
        mx = 0.4 + i * 2.1
        mc = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(mx), Inches(1.55), Inches(1.9), Inches(0.9))
        mc.fill.solid(); mc.fill.fore_color.rgb = NAVY; mc.line.fill.background()
        tf = mc.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = num; r.font.size = Pt(24); r.font.bold = True; r.font.color.rgb = ORANGE
        p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER
        r2 = p2.add_run(); r2.text = label; r2.font.size = Pt(9); r2.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    add_heading(s, 0.4, 2.6, 4, "Who Benefits?", 13)
    users = [("MSMEs & Manufacturers", "Quick standards + cert answers"), ("Construction Companies", "Steel, cement compliance"),
             ("Testing Labs", "Reference standards"), ("Quality Managers", "Stay updated via auto-fetch")]
    for i, (ut, ud) in enumerate(users):
        col, row = i % 2, i // 2
        ux, uy = 0.4 + col * 3.0, 2.95 + row * 0.9
        uc = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(ux), Inches(uy), Inches(2.8), Inches(0.75))
        uc.fill.solid(); uc.fill.fore_color.rgb = WHITE; uc.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0); uc.line.width = Pt(1)
        tb = s.shapes.add_textbox(Inches(ux + 0.15), Inches(uy + 0.1), Inches(2.5), Inches(0.55))
        tf = tb.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]
        r = p.add_run(); r.text = ut; r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = NAVY
        p2 = tf.add_paragraph(); r2 = p2.add_run(); r2.text = ud; r2.font.size = Pt(9); r2.font.color.rgb = DARK_TEXT

    add_heading(s, 7.0, 1.1, 6, "Development Roadmap", 16)
    rm_data = [("DONE", "MVP - 28 standards, 22 languages, RAG, auth", SEC_GREEN),
               ("NOW", "Scale - All 28,000+ standards, PDF viewer, WhatsApp bot", SEC_AMBER),
               ("FUTURE", "Production - PostgreSQL, mobile app, voice, BIS integration", MED_GRAY)]
    for i, (phase, desc, color) in enumerate(rm_data):
        ry = 1.55 + i * 0.8
        badge = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(ry), Inches(0.9), Inches(0.3))
        badge.fill.solid(); badge.fill.fore_color.rgb = color; badge.line.fill.background()
        tf = badge.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = phase; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = WHITE
        tb = s.shapes.add_textbox(Inches(8.0), Inches(ry), Inches(4.8), Inches(0.6))
        tf = tb.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]
        r = p.add_run(); r.text = desc; r.font.size = Pt(10); r.font.color.rgb = DARK_TEXT

    add_heading(s, 0.4, 5.0, 6, "Business Model", 13)
    biz = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(5.35), Inches(12.4), Inches(1.6))
    biz.fill.solid(); biz.fill.fore_color.rgb = LIGHT_GRAY; biz.line.color.rgb = NAVY; biz.line.width = Pt(1)
    tf = biz.text_frame; tf.word_wrap = True; tf.margin_left = Pt(10); tf.margin_top = Pt(6)
    biz_items = [("Free Tier:", " 10 queries/day for individuals"), ("MSME (Rs.499/mo):", " Unlimited + compliance calendar"),
                 ("Enterprise (Rs.4,999/mo):", " API + bulk check + support"), ("BIS Partnership:", " Official data provider"),
                 ("Govt Grant:", " MSME Samadhaan scheme")]
    for i, (bp, np) in enumerate(biz_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph(); p.space_after = Pt(2)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(10); r.font.color.rgb = ORANGE
        r2 = p.add_run(); r2.text = bp; r2.font.size = Pt(10); r2.font.bold = True; r2.font.color.rgb = NAVY
        r3 = p.add_run(); r3.text = np; r3.font.size = Pt(10); r3.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 6: FEASIBILITY & VIABILITY
# ══════════════════════════════════════════════
def slide_feasibility(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(s); add_footer(s, 5)

    # Title
    add_heading(s, 3.5, 1.0, 6, "FEASIBILITY AND VIABILITY", 22)

    # ── LEFT: Feasibility bullets ──
    add_heading(s, 0.5, 1.55, 4, "Feasibility", 18, RGBColor(0x15, 0x65, 0xc0))

    feas_items = [
        ("Technical:", " Proven tech stack - React, FastAPI, ONNX, FAISS, Gemini API. Quick to build and deploy MVP."),
        ("Data:", " BIS standards publicly available on bis.gov.in. 28 standards indexed, expandable to 28,000+."),
        ("Economic:", " Open-source tools, free cloud tiers (Render + Vercel), zero upfront cost."),
        ("Multilingual:", " deep-translator supports 22 Indian languages. Auto-detect, translate, process, translate back."),
        ("User-Friendly:", " ChatGPT-like interface - no training needed. MSMEs can ask in their own language."),
        ("Scalability:", " Modular RAG architecture. Adding new standards = adding new PDF files. No code changes."),
    ]

    tb = s.shapes.add_textbox(Inches(0.5), Inches(1.95), Inches(5.8), Inches(2.8))
    tf = tb.text_frame; tf.word_wrap = True
    for i, (bp, np) in enumerate(feas_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(5)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(11); r.font.color.rgb = ORANGE; r.font.bold = True
        r2 = p.add_run(); r2.text = bp; r2.font.size = Pt(12); r2.font.bold = True; r2.font.color.rgb = NAVY
        r3 = p.add_run(); r3.text = np; r3.font.size = Pt(12); r3.font.color.rgb = DARK_TEXT

    # Divider
    div_h = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(4.8), Inches(5.8), Inches(0.02))
    div_h.fill.solid(); div_h.fill.fore_color.rgb = RGBColor(0xe0, 0xe0, 0xe0); div_h.line.fill.background()

    # ── LEFT: Viability bullets ──
    add_heading(s, 0.5, 4.9, 4, "Viability", 18, RGBColor(0x2e, 0x7d, 0x32))

    via_items = [
        ("Market Demand:", " 63M+ MSMEs in India struggle with BIS compliance. No free AI tool exists for this."),
        ("Adoption:", " WhatsApp-like chat interface - familiar to Indian users. No app download needed (web-based)."),
        ("Sustainability:", " Freemium model - free for individuals, paid plans for MSMEs and enterprises."),
        ("Trust:", " Source-grounded RAG ensures responses cite official BIS documents. No hallucinations."),
        ("Government Alignment:", " Supports BIS Act 2016 compliance goals. Can integrate with MSME Samadhaan scheme."),
        ("Partnerships:", " Potential BIS official data provider status. Revenue share on certified leads."),
    ]

    tb = s.shapes.add_textbox(Inches(0.5), Inches(5.3), Inches(5.8), Inches(1.8))
    tf = tb.text_frame; tf.word_wrap = True
    for i, (bp, np) in enumerate(via_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(5)
        r = p.add_run(); r.text = "> "; r.font.size = Pt(11); r.font.color.rgb = ORANGE; r.font.bold = True
        r2 = p.add_run(); r2.text = bp; r2.font.size = Pt(12); r2.font.bold = True; r2.font.color.rgb = NAVY
        r3 = p.add_run(); r3.text = np; r3.font.size = Pt(12); r3.font.color.rgb = DARK_TEXT

    # Vertical divider
    div_v = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.5), Inches(1.5), Inches(0.03), Inches(5.5))
    div_v.fill.solid(); div_v.fill.fore_color.rgb = RGBColor(0xe0, 0xe0, 0xe0); div_v.line.fill.background()

    # ── RIGHT: Use Cases ──
    uc_box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(6.0), Inches(2.8))
    uc_box.fill.background(); uc_box.line.color.rgb = NAVY; uc_box.line.width = Pt(2)

    add_heading(s, 8.0, 1.6, 4, "Use Cases", 18)

    use_cases = [
        ("MSME Owner", "Quick standards check\nCertification guidance", "🏭"),
        ("Manufacturer", "Test requirements\nLab locations", "🔬"),
        ("Quality Manager", "Standards updates\nCompliance tracking", "👩\u200d💼"),
        ("Government", "BIS compliance awareness\nPolicy-aligned guidance", "🏛️"),
        ("Testing Labs", "Reference standards\nClient guidance", "🧪"),
    ]

    for i, (name, desc, icon) in enumerate(use_cases):
        ux = 6.9 + i * 1.18
        # Icon circle
        ic = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(ux + 0.15), Inches(2.1), Inches(0.6), Inches(0.6))
        ic.fill.solid(); ic.fill.fore_color.rgb = BLUE_LIGHT; ic.line.color.rgb = SEC_BLUE; ic.line.width = Pt(1)
        tf = ic.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = icon; r.font.size = Pt(16)

        # Name
        nb = s.shapes.add_textbox(Inches(ux), Inches(2.75), Inches(0.9), Inches(0.3))
        tf = nb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = name; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = NAVY

        # Desc
        db = s.shapes.add_textbox(Inches(ux), Inches(3.0), Inches(0.9), Inches(0.6))
        tf = db.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = desc; r.font.size = Pt(7); r.font.color.rgb = DARK_TEXT

    # ── RIGHT: Challenges ──
    ch_box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.5), Inches(6.0), Inches(2.5))
    ch_box.fill.background(); ch_box.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0); ch_box.line.width = Pt(2)

    add_heading(s, 8.0, 4.6, 4, "Challenges & Mitigations", 16)

    challenges = [
        ("Data Security", "🔒", "JWT auth + bcrypt\nNo PII stored server-side"),
        ("User Adoption", "📈", "WhatsApp-like UI\nNo training needed"),
        ("Scalability", "🌐", "Modular RAG design\nAdd standards = add PDFs"),
        ("Language Accuracy", "🗣️", "Auto-detect + translate\n22 Indian languages"),
        ("Data Freshness", "🔄", "Live auto-fetch pipeline\nScrapes bis.gov.in"),
    ]

    for i, (name, icon, mitigation) in enumerate(challenges):
        cx = 6.9 + i * 1.18
        # Icon
        ic = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx + 0.15), Inches(5.1), Inches(0.5), Inches(0.5))
        ic.fill.solid(); ic.fill.fore_color.rgb = PURPLE_LIGHT; ic.line.color.rgb = SEC_PURPLE; ic.line.width = Pt(1)
        tf = ic.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = icon; r.font.size = Pt(14)

        # Name
        nb = s.shapes.add_textbox(Inches(cx), Inches(5.65), Inches(0.9), Inches(0.3))
        tf = nb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = name; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = NAVY

        # Mitigation
        mb = s.shapes.add_textbox(Inches(cx), Inches(5.9), Inches(0.9), Inches(0.6))
        tf = mb.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = mitigation; r.font.size = Pt(7); r.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 7: THANK YOU
# ══════════════════════════════════════════════
def slide_thankyou(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(7.5))
    bg.fill.solid(); bg.fill.fore_color.rgb = DARK_NAVY; bg.line.fill.background()

    circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9), Inches(4), Inches(4), Inches(4))
    circ.fill.solid(); circ.fill.fore_color.rgb = ORANGE; circ.fill.fore_color.brightness = 0.88; circ.line.fill.background()

    tb = s.shapes.add_textbox(Inches(2), Inches(1.5), Inches(9.3), Inches(1.0))
    tf = tb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "THANK "; r.font.size = Pt(48); r.font.bold = True; r.font.color.rgb = WHITE
    r2 = p.add_run(); r2.text = "YOU"; r2.font.size = Pt(48); r2.font.bold = True; r2.font.color.rgb = ORANGE

    div = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.67), Inches(2.65), Inches(2), Inches(0.04))
    div.fill.solid(); div.fill.fore_color.rgb = ORANGE; div.line.fill.background()

    tag = s.shapes.add_textbox(Inches(2), Inches(2.9), Inches(9.3), Inches(0.8))
    tf = tag.text_frame; tf.word_wrap = True; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "ManakMitra - Making BIS Standards Accessible\nto Every Indian Manufacturer"
    r.font.size = Pt(18); r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    av = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.17), Inches(3.9), Inches(1.0), Inches(1.0))
    av.fill.solid(); av.fill.fore_color.rgb = RGBColor(0x30, 0x50, 0x80); av.line.color.rgb = WHITE; av.line.width = Pt(2)

    nb = s.shapes.add_textbox(Inches(4.5), Inches(5.0), Inches(4.3), Inches(0.4))
    tf = nb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "Pavan Kumar"; r.font.size = Pt(16); r.font.bold = True; r.font.color.rgb = WHITE

    rb = s.shapes.add_textbox(Inches(4.5), Inches(5.35), Inches(4.3), Inches(0.3))
    tf = rb.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "Team Lead / Full Stack Developer"; r.font.size = Pt(11); r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)

    cta = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.0), Inches(5.8), Inches(5.3), Inches(0.7))
    cta.fill.background(); cta.line.color.rgb = WHITE; cta.line.width = Pt(1)
    tf = cta.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "Try live at  "; r.font.size = Pt(12); r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)
    r2 = p.add_run(); r2.text = "manakmitra-frontend.vercel.app"; r2.font.size = Pt(14); r2.font.bold = True; r2.font.color.rgb = ORANGE

    sih = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.3), Inches(0.8), Inches(0.8))
    sih.fill.solid(); sih.fill.fore_color.rgb = ORANGE; sih.line.fill.background()
    tf = sih.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "SIH"; r.font.size = Pt(12); r.font.bold = True; r.font.color.rgb = WHITE

    sl = s.shapes.add_textbox(Inches(10.6), Inches(0.3), Inches(1.3), Inches(0.8))
    tf = sl.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = "SMART INDIA\nHACKATHON 2026"; r.font.size = Pt(11); r.font.bold = True; r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    ft = s.shapes.add_textbox(Inches(0.5), Inches(7.1), Inches(5), Inches(0.3))
    tf = ft.text_frame; p = tf.paragraphs[0]
    r = p.add_run(); r.text = "@SIH Idea submission - Team Resonant"; r.font.size = Pt(9); r.font.color.rgb = RGBColor(0x66, 0x66, 0x66)


# ══════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════
def main():
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)

    print("Creating Slide 1: Title...")
    slide_title(prs)
    print("Creating Slide 2: Problems & Solutions...")
    slide_problems(prs)
    print("Creating Slide 3: Technical Approach...")
    slide_technical(prs)
    print("Creating Slide 4: Demo...")
    slide_demo(prs)
    print("Creating Slide 5: Feasibility & Viability...")
    slide_feasibility(prs)
    print("Creating Slide 6: Impact...")
    slide_impact(prs)
    print("Creating Slide 7: Thank You...")
    slide_thankyou(prs)

    output_path = os.path.join(os.path.dirname(__file__), "ManakMitra_SIH2026_v4.pptx")
    prs.save(output_path)
    print(f"\nPresentation saved: {output_path}")
    print("7 slides, widescreen 16:9 format")
    print("Open in PowerPoint or Google Slides")


if __name__ == "__main__":
    main()
