"""
ManakMitra SIH 2026 Presentation Generator
Creates a professional PowerPoint matching the SentiVectors winning slide style.
Run: python generate_ppt.py
Output: ManakMitra_SIH2026.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

# ── Colors ──
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

# Section colors for cards
SEC_BLUE = RGBColor(0x21, 0x96, 0xf3)
SEC_PURPLE = RGBColor(0x9c, 0x27, 0xb0)
SEC_GREEN = RGBColor(0x4c, 0xaf, 0x50)
SEC_AMBER = RGBColor(0xff, 0x98, 0x00)
SEC_INDIGO = RGBColor(0x3f, 0x51, 0xb5)
SEC_ROSE = RGBColor(0xe9, 0x1e, 0x63)


def add_header(slide, page_num):
    """Add consistent header bar with team logo, project title, SIH badge."""
    # Header background bar
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(0.85))
    bar.fill.solid()
    bar.fill.fore_color.rgb = WHITE
    bar.line.color.rgb = NAVY
    bar.line.width = Pt(2)

    # Team logo circle
    logo_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.3), Inches(0.12), Inches(1.6), Inches(0.55))
    logo_shape.fill.solid()
    logo_shape.fill.fore_color.rgb = WHITE
    logo_shape.line.color.rgb = NAVY
    logo_shape.line.width = Pt(1.5)
    tf = logo_shape.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Resonant"
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = NAVY

    # Project title
    title_box = slide.shapes.add_textbox(Inches(3.5), Inches(0.12), Inches(6), Inches(0.6))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "MANAKMITRA"
    r.font.size = Pt(28)
    r.font.bold = True
    r.font.color.rgb = NAVY

    # SIH badge
    sih_shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.1), Inches(0.65), Inches(0.65))
    sih_shape.fill.solid()
    sih_shape.fill.fore_color.rgb = ORANGE
    sih_shape.line.fill.background()
    tf = sih_shape.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "SIH"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = WHITE

    sih_text = slide.shapes.add_textbox(Inches(10.8), Inches(0.12), Inches(1.1), Inches(0.6))
    tf = sih_text.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run()
    r.text = "SMART INDIA\nHACKATHON 2026"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = NAVY


def add_footer(slide, page_num):
    """Add footer with @SIH Idea submission and page number."""
    footer = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.2), Inches(13.33), Inches(0.3))
    footer.fill.solid()
    footer.fill.fore_color.rgb = LIGHT_GRAY
    footer.line.fill.background()

    left_text = slide.shapes.add_textbox(Inches(0.5), Inches(7.2), Inches(4), Inches(0.3))
    tf = left_text.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "@SIH Idea submission"
    r.font.size = Pt(9)
    r.font.color.rgb = MED_GRAY

    right_text = slide.shapes.add_textbox(Inches(12.5), Inches(7.2), Inches(0.5), Inches(0.3))
    tf = right_text.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run()
    r.text = str(page_num)
    r.font.size = Pt(9)
    r.font.color.rgb = MED_GRAY


def add_section_heading(slide, left, top, width, text, size=16):
    """Add a section heading in navy blue bold."""
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(0.35))
    tf = box.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = True
    r.font.color.rgb = NAVY


def add_bullet_list(slide, left, top, width, height, items, font_size=11, bold_prefix=True):
    """Add a bullet list. Each item is (bold_part, normal_part) or just a string."""
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True

    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()

        p.space_after = Pt(4)
        p.space_before = Pt(1)

        if isinstance(item, tuple):
            # Orange bullet
            bullet_r = p.add_run()
            bullet_r.text = "● "
            bullet_r.font.size = Pt(font_size - 2)
            bullet_r.font.color.rgb = ORANGE

            # Bold part
            if item[0]:
                bold_r = p.add_run()
                bold_r.text = item[0]
                bold_r.font.size = Pt(font_size)
                bold_r.font.bold = True
                bold_r.font.color.rgb = NAVY

            # Normal part
            if item[1]:
                normal_r = p.add_run()
                normal_r.text = item[1]
                normal_r.font.size = Pt(font_size)
                normal_r.font.color.rgb = DARK_TEXT
        else:
            bullet_r = p.add_run()
            bullet_r.text = "● "
            bullet_r.font.size = Pt(font_size - 2)
            bullet_r.font.color.rgb = ORANGE

            text_r = p.add_run()
            text_r.text = item
            text_r.font.size = Pt(font_size)
            text_r.font.color.rgb = DARK_TEXT


def add_colored_card(slide, left, top, width, height, bg_color, border_color, title, lines, title_size=9, text_size=8):
    """Add a colored card with title and content lines."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)

    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(6)
    tf.margin_right = Pt(6)
    tf.margin_top = Pt(4)
    tf.margin_bottom = Pt(4)

    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    r = p.add_run()
    r.text = title
    r.font.size = Pt(title_size)
    r.font.bold = True
    r.font.color.rgb = border_color

    for line in lines:
        p = tf.add_paragraph()
        p.space_before = Pt(2)
        r = p.add_run()
        r.text = line
        r.font.size = Pt(text_size)
        r.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 1: TITLE
# ══════════════════════════════════════════════
def create_title_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank

    # Dark navy background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = DARK_NAVY
    bg.line.fill.background()

    # Orange accent circle (decorative)
    circ = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.5), Inches(0.5), Inches(3), Inches(3))
    circ.fill.solid()
    circ.fill.fore_color.rgb = RGBColor(0xff, 0x6b, 0x35)
    circ.fill.fore_color.brightness = 0.85
    circ.line.fill.background()

    # Team badge
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.9), Inches(1.0), Inches(3.5), Inches(0.65))
    badge.fill.background()
    badge.line.color.rgb = RGBColor(0xff, 0xff, 0xff)
    badge.line.width = Pt(1.5)
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "RESONANT"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # Main title
    title_box = slide.shapes.add_textbox(Inches(1.5), Inches(2.0), Inches(10.3), Inches(1.2))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "MANAK"
    r.font.size = Pt(52)
    r.font.bold = True
    r.font.color.rgb = WHITE
    r2 = p.add_run()
    r2.text = "MITRA"
    r2.font.size = Pt(52)
    r2.font.bold = True
    r2.font.color.rgb = ORANGE

    # Divider line
    divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.67), Inches(3.3), Inches(2), Inches(0.04))
    divider.fill.solid()
    divider.fill.fore_color.rgb = ORANGE
    divider.line.fill.background()

    # Subtitle
    sub = slide.shapes.add_textbox(Inches(2), Inches(3.6), Inches(9.3), Inches(0.8))
    tf = sub.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "AI-Powered BIS Standards Compliance Assistant\nfor Indian MSMEs and Manufacturers"
    r.font.size = Pt(18)
    r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    # Tagline
    tag = slide.shapes.add_textbox(Inches(2), Inches(4.5), Inches(9.3), Inches(0.5))
    tf = tag.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "YOUR GUIDE TO BUREAU OF INDIAN STANDARDS"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = ORANGE

    # Stats row
    stats = [
        ("28", "IS Standards"),
        ("22", "Languages"),
        ("25+", "BIS Offices"),
        ("5", "Certifications"),
    ]
    x_start = 3.0
    for num, label in stats:
        # Number
        num_box = slide.shapes.add_textbox(Inches(x_start), Inches(5.3), Inches(1.8), Inches(0.6))
        tf = num_box.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = num
        r.font.size = Pt(32)
        r.font.bold = True
        r.font.color.rgb = ORANGE

        # Label
        lbl_box = slide.shapes.add_textbox(Inches(x_start), Inches(5.85), Inches(1.8), Inches(0.4))
        tf = lbl_box.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = label
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)

        x_start += 2.0

    # SIH logo (right side)
    sih = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.3), Inches(0.8), Inches(0.8))
    sih.fill.solid()
    sih.fill.fore_color.rgb = ORANGE
    sih.line.fill.background()
    tf = sih.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "SIH"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = WHITE

    sih_label = slide.shapes.add_textbox(Inches(10.6), Inches(0.3), Inches(1.3), Inches(0.8))
    tf = sih_label.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run()
    r.text = "SMART INDIA\nHACKATHON 2026"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)


# ══════════════════════════════════════════════
#  SLIDE 2: PROBLEMS & SOLUTIONS
# ══════════════════════════════════════════════
def create_problems_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, 2)
    add_footer(slide, 2)

    # ── LEFT: Problems & Solutions table ──
    add_section_heading(slide, 0.4, 1.1, 6, "Problems Faced & Their Solutions:", 16)

    problems = [
        ("Complex BIS Standards", "AI-based Simplification", "Explain technical requirements in simple language"),
        ("Scattered Information", "Unified Platform", "Bring standards, certification & lab info together"),
        ("Changing Standards", "Live Source Pipeline", "Pull info from official BIS sources automatically"),
        ("Finding Testing Labs", "Lab Directory", "Location-based finder with Google Maps directions"),
        ("Complex Certification", "Step-by-Step Guidance", "Clear process for ISI Mark, Hallmark & Eco Mark"),
        ("AI Hallucinations", "Source-Grounded RAG", "Responses based on verified BIS documents only"),
        ("Language Barrier", "22 Indian Languages", "Auto-detect → translate → RAG → translate back"),
        ("Different User Needs", "Context-Aware AI", "Tailors guidance per user product and query"),
    ]

    # Table header
    y = 1.5
    header_bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(y), Inches(5.8), Inches(0.35))
    header_bg.fill.solid()
    header_bg.fill.fore_color.rgb = NAVY
    header_bg.line.fill.background()

    for col_x, col_text, col_w in [(0.45, "Problems Faced", 2.8), (3.3, "Proposed Solutions", 2.9)]:
        tb = slide.shapes.add_textbox(Inches(col_x), Inches(y + 0.03), Inches(col_w), Inches(0.3))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = col_text
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = WHITE

    y += 0.4
    for prob_name, sol_name, sol_desc in problems:
        row_bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(y), Inches(5.8), Inches(0.42))
        row_bg.fill.solid()
        row_bg.fill.fore_color.rgb = WHITE if problems.index((prob_name, sol_name, sol_desc)) % 2 == 0 else LIGHT_GRAY
        row_bg.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0)
        row_bg.line.width = Pt(0.5)

        # Problem
        tb = slide.shapes.add_textbox(Inches(0.5), Inches(y + 0.05), Inches(2.7), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = prob_name
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xc0, 0x39, 0x2b)

        # Solution
        tb = slide.shapes.add_textbox(Inches(3.35), Inches(y + 0.02), Inches(2.8), Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = sol_name
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = NAVY
        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = sol_desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = DARK_TEXT

        y += 0.42

    # ── RIGHT: Architecture Diagram ──
    add_section_heading(slide, 6.8, 1.1, 6, "System Architecture:", 16)

    arch_boxes = [
        (8.2, 1.55, 2.6, 0.4, "User Query", GREEN_LIGHT, SEC_GREEN),
        (8.2, 2.1, 2.6, 0.4, "Auto-Detect → Translate\n(22 Indian Languages)", BLUE_LIGHT, SEC_BLUE),
        (8.0, 2.65, 3.0, 0.45, "RAG Engine (ONNX + FAISS)", NAVY, NAVY, True),
        (7.0, 3.25, 2.2, 0.38, "ONNX Embeddings\nall-MiniLM-L6-v2", PURPLE_LIGHT, SEC_PURPLE),
        (9.4, 3.25, 2.2, 0.38, "FAISS Vector Store\n28 Standards", ROSE_LIGHT, SEC_ROSE),
        (8.0, 3.8, 3.0, 0.4, "Gemini 3.6 Flash (LLM)", ORANGE_LIGHT, SEC_AMBER),
        (6.8, 4.35, 1.8, 0.35, "BIS Standards (28)", INDIGO_LIGHT, SEC_INDIGO),
        (8.7, 4.35, 1.8, 0.35, "25+ BIS Offices", TEAL_LIGHT, SEC_GREEN),
        (10.6, 4.35, 1.8, 0.35, "Certifications", AMBER_LIGHT, SEC_AMBER),
        (7.5, 4.9, 3.6, 0.4, "6-Section Structured Response", GREEN_LIGHT, SEC_GREEN, True),
        (7.0, 5.45, 4.8, 0.35, "Chat | Standards | Offices | Certifications", RGBColor(0xed, 0xe7, 0xf6), SEC_PURPLE),
    ]

    for box_data in arch_boxes:
        x, y, w, h, text, bg, border = box_data[:7]
        is_bold = box_data[7] if len(box_data) > 7 else False

        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        shape.line.color.rgb = border
        shape.line.width = Pt(1.5)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(4)
        tf.margin_right = Pt(4)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = text
        r.font.size = Pt(8 if "\n" in text else 9)
        r.font.bold = is_bold
        r.font.color.rgb = WHITE if is_bold or bg == NAVY else DARK_TEXT

    # Arrows between boxes
    for y_arrow in [2.0, 2.55, 3.15, 3.75, 4.3, 4.85]:
        arrow = slide.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(9.35), Inches(y_arrow), Inches(0.15), Inches(0.12))
        arrow.fill.solid()
        arrow.fill.fore_color.rgb = MED_GRAY
        arrow.line.fill.background()

    # ── BOTTOM LEFT: Venn Diagram ──
    add_section_heading(slide, 0.4, 6.0, 4, "How it addresses the problem:", 13)

    # Simplified Venn with circles
    venn_data = [
        (1.0, 6.3, 1.3, 1.3, BLUE_LIGHT, SEC_BLUE, "SIMPLIFY\nCOMPLEX\nSTANDARDS"),
        (0.5, 6.55, 1.3, 1.3, GREEN_LIGHT, SEC_GREEN, "UNIFIED\nCOMPLIANCE\nPLATFORM"),
        (1.5, 6.55, 1.3, 1.3, ORANGE_LIGHT, SEC_AMBER, "MULTILINGUAL\nAI (22 Lang)"),
    ]
    for vx, vy, vw, vh, vbg, vborder, vtext in venn_data:
        c = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(vx), Inches(vy), Inches(vw), Inches(vh))
        c.fill.solid()
        c.fill.fore_color.rgb = vbg
        c.line.color.rgb = vborder
        c.line.width = Pt(1)
        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = vtext
        r.font.size = Pt(7)
        r.font.bold = True
        r.font.color.rgb = DARK_TEXT

    center = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(1.25), Inches(6.7), Inches(0.85), Inches(0.85))
    center.fill.solid()
    center.fill.fore_color.rgb = RGBColor(0x1a, 0x3a, 0x6e)
    center.fill.fore_color.brightness = 0.3
    center.line.color.rgb = NAVY
    center.line.width = Pt(1.5)
    tf = center.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "MANAK\nMITRA"
    r.font.size = Pt(8)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # ── BOTTOM RIGHT: Innovation ──
    add_section_heading(slide, 3.5, 6.0, 6, "Innovation and Uniqueness:", 13)

    innovations = [
        ("Source-Grounded RAG", " — ONNX + FAISS ensures hallucination-free, cited responses"),
        ("Live BIS Pipeline", " — Auto-fetches new standards, knowledge base always current"),
        ("22 Indian Languages", " — Auto-detect → translate → RAG → translate-back"),
        ("6-Section Responses", " — Standards, testing, offices, legal, QC, documents"),
        ("Unified Ecosystem", " — Standards + certification + labs + AI in one platform"),
    ]

    innov_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.5), Inches(6.35), Inches(9.3), Inches(0.85))
    innov_box.fill.solid()
    innov_box.fill.fore_color.rgb = LIGHT_GRAY
    innov_box.line.color.rgb = NAVY
    innov_box.line.width = Pt(1)

    tf = innov_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(8)
    tf.margin_top = Pt(4)
    tf.margin_bottom = Pt(4)

    for i, (bold_part, normal_part) in enumerate(innovations):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.space_after = Pt(1)

        bullet_r = p.add_run()
        bullet_r.text = "▸ "
        bullet_r.font.size = Pt(9)
        bullet_r.font.color.rgb = ORANGE

        bold_r = p.add_run()
        bold_r.text = bold_part
        bold_r.font.size = Pt(9)
        bold_r.font.bold = True
        bold_r.font.color.rgb = NAVY

        normal_r = p.add_run()
        normal_r.text = normal_part
        normal_r.font.size = Pt(9)
        normal_r.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 3: TECH STACK
# ══════════════════════════════════════════════
def create_techstack_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, 3)
    add_footer(slide, 3)

    add_section_heading(slide, 0.4, 1.1, 6, "Tech Stack & Architecture", 16)

    # Tech cards grid (2x3)
    techs = [
        ("🎨 Frontend", "React 18 + Vite\nResponsive SPA, dark/light mode", BLUE_LIGHT, SEC_BLUE),
        ("⚙️ Backend", "FastAPI + Python\nAsync API, structured endpoints", GREEN_LIGHT, SEC_GREEN),
        ("🤖 AI / LLM", "Gemini 3.6 Flash\n6-section structured responses", ORANGE_LIGHT, SEC_AMBER),
        ("🧠 Embeddings", "ONNX Runtime + FAISS\n384-dim vectors, zero hallucination", PURPLE_LIGHT, SEC_PURPLE),
        ("🚀 Deployment", "Render (backend) + Vercel (frontend)\nFree tier, auto-deploy on push", ROSE_LIGHT, SEC_ROSE),
        ("🔐 Security", "JWT tokens + bcrypt\nPer-user chat isolation", TEAL_LIGHT, RGBColor(0x00, 0x96, 0x88)),
    ]

    x_start = 0.4
    y_start = 1.55
    card_w = 3.0
    card_h = 1.1
    gap = 0.15

    for i, (title, desc, bg, border) in enumerate(techs):
        col = i % 3
        row = i // 3
        cx = x_start + col * (card_w + gap)
        cy = y_start + row * (card_h + gap)

        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(cy), Inches(card_w), Inches(card_h))
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = border
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(8)
        tf.margin_top = Pt(6)

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = border

        p2 = tf.add_paragraph()
        p2.space_before = Pt(4)
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10)
        r2.font.color.rgb = DARK_TEXT

    # Why These Technologies
    add_section_heading(slide, 0.4, 4.0, 6, "Why These Technologies?", 13)

    why_items = [
        ("ONNX over PyTorch", " — 10x smaller memory (20MB vs 500MB), same accuracy"),
        ("FAISS over Pinecone", " — Free, offline-capable, no cloud dependency"),
        ("FastAPI over Flask", " — 3x faster async for concurrent queries"),
        ("Gemini over OpenAI", " — Free tier, multilingual, no API cost"),
        ("deep-translator", " — 22 Indian languages including Telugu, Tamil, Bengali"),
    ]

    box = slide.shapes.add_textbox(Inches(0.4), Inches(4.3), Inches(5.8), Inches(2.5))
    tf = box.text_frame
    tf.word_wrap = True

    for i, (bold_part, normal_part) in enumerate(why_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(4)

        check = p.add_run()
        check.text = "✓ "
        check.font.size = Pt(10)
        check.font.color.rgb = SEC_GREEN
        check.font.bold = True

        b = p.add_run()
        b.text = bold_part
        b.font.size = Pt(10)
        b.font.bold = True
        b.font.color.rgb = NAVY

        n = p.add_run()
        n.text = normal_part
        n.font.size = Pt(10)
        n.font.color.rgb = DARK_TEXT

    # Right side: Differentiators + Scalability
    add_section_heading(slide, 6.8, 4.0, 6, "Key Differentiators", 13)

    diffs = [
        ("vs ChatGPT:", " Domain-specific RAG with verified BIS documents"),
        ("vs BIS Website:", " Plain English + multi-language, not technical jargon"),
        ("vs Consultants:", " Free, instant, 24/7 — no appointment needed"),
        ("vs Manual:", " 6-section answer in 20 sec vs hours of searching"),
    ]

    diff_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.35), Inches(6.0), Inches(1.2))
    diff_box.fill.solid()
    diff_box.fill.fore_color.rgb = LIGHT_GRAY
    diff_box.line.color.rgb = NAVY
    diff_box.line.width = Pt(1)

    tf = diff_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(8)
    tf.margin_top = Pt(6)

    for i, (bold_part, normal_part) in enumerate(diffs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(3)

        bullet = p.add_run()
        bullet.text = "▸ "
        bullet.font.size = Pt(9)
        bullet.font.color.rgb = ORANGE

        b = p.add_run()
        b.text = bold_part
        b.font.size = Pt(10)
        b.font.bold = True
        b.font.color.rgb = NAVY

        n = p.add_run()
        n.text = normal_part
        n.font.size = Pt(10)
        n.font.color.rgb = DARK_TEXT

    # Scalability Roadmap
    add_section_heading(slide, 6.8, 5.7, 6, "Scalability Roadmap", 13)

    roadmap = [
        ("Phase 1 (Done):", " Index all 28,000+ BIS standards"),
        ("Phase 2:", " PostgreSQL + Redis for production"),
        ("Phase 3:", " Mobile app + voice + WhatsApp bot"),
        ("Phase 4:", " BIS e-governance portal integration"),
    ]

    rm_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(6.05), Inches(6.0), Inches(1.05))
    rm_box.fill.solid()
    rm_box.fill.fore_color.rgb = AMBER_LIGHT
    rm_box.line.color.rgb = SEC_AMBER
    rm_box.line.width = Pt(1)

    tf = rm_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(8)
    tf.margin_top = Pt(4)

    for i, (bold_part, normal_part) in enumerate(roadmap):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(2)

        b = p.add_run()
        b.text = bold_part
        b.font.size = Pt(9.5)
        b.font.bold = True
        b.font.color.rgb = NAVY

        n = p.add_run()
        n.text = normal_part
        n.font.size = Pt(9.5)
        n.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 4: DEMO
# ══════════════════════════════════════════════
def create_demo_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, 4)
    add_footer(slide, 4)

    add_section_heading(slide, 0.4, 1.1, 6, "Live Demo — Key Features", 16)

    features = [
        ("💬", "Multilingual AI Chat", "Ask in Hindi, Telugu, Tamil, Bengali or 18 other Indian languages. Auto-detects and responds in same language."),
        ("📋", "6-Section Structured Response", "Standards, testing, BIS offices, legal basis, QC process, and documents — every time."),
        ("🔄", "Live Auto-Fetch Pipeline", "Scrapes bis.gov.in for new standards and indexes them automatically."),
        ("📍", "BIS Office Finder", "GPS-based nearest centre with directions, phone numbers, services."),
        ("📋", "Certification Guide", "Step-by-step for ISI Mark, Hallmark, Eco Mark, CMVR, MSME Udyam."),
    ]

    y_feat = 1.5
    for icon, title, desc in features:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(y_feat), Inches(5.8), Inches(0.65))
        card.fill.solid()
        card.fill.fore_color.rgb = LIGHT_GRAY
        card.line.fill.background()

        # Orange left border
        border = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(y_feat), Inches(0.06), Inches(0.65))
        border.fill.solid()
        border.fill.fore_color.rgb = ORANGE
        border.line.fill.background()

        # Icon
        icon_box = slide.shapes.add_textbox(Inches(0.55), Inches(y_feat + 0.08), Inches(0.5), Inches(0.5))
        tf = icon_box.text_frame
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = icon
        r.font.size = Pt(20)

        # Title + description
        txt_box = slide.shapes.add_textbox(Inches(1.1), Inches(y_feat + 0.08), Inches(5.0), Inches(0.55))
        tf = txt_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        b = p.add_run()
        b.text = title
        b.font.size = Pt(11)
        b.font.bold = True
        b.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = DARK_TEXT

        y_feat += 0.75

    # Right side: Mock screenshots
    add_section_heading(slide, 6.8, 1.1, 6, "App Screenshots:", 16)

    # Mock chat screenshot
    chat_bg = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.55), Inches(5.8), Inches(2.8))
    chat_bg.fill.solid()
    chat_bg.fill.fore_color.rgb = WHITE
    chat_bg.line.color.rgb = RGBColor(0xdd, 0xdd, 0xdd)
    chat_bg.line.width = Pt(1)

    # Mock header bar
    chat_header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.55), Inches(5.8), Inches(0.35))
    chat_header.fill.solid()
    chat_header.fill.fore_color.rgb = NAVY
    chat_header.line.fill.background()
    tf = chat_header.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "  🏛️ ManakMitra"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # User message
    user_msg = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.5), Inches(2.1), Inches(3.0), Inches(0.35))
    user_msg.fill.solid()
    user_msg.fill.fore_color.rgb = NAVY
    user_msg.line.fill.background()
    tf = user_msg.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run()
    r.text = "What are the standards for cement?"
    r.font.size = Pt(8)
    r.font.color.rgb = WHITE

    # AI response sections
    section_data = [
        (7.0, 2.6, 5.4, 0.3, "📋 1. Applicable IS Standards — IS 269, IS 455, IS 8112", BLUE_LIGHT, SEC_BLUE),
        (7.0, 3.0, 5.4, 0.3, "🔬 2. Testing Requirements — Compressive strength per IS 4031", PURPLE_LIGHT, SEC_PURPLE),
        (7.0, 3.4, 5.4, 0.3, "📍 3. Where to Test — BIS Lab Delhi: 011-23232323", GREEN_LIGHT, SEC_GREEN),
        (7.0, 3.8, 5.4, 0.3, "⚖️ 4. Mandatory — Yes, under BIS Act 2016", AMBER_LIGHT, SEC_AMBER),
    ]

    for sx, sy, sw, sh, stxt, sbg, sbdr in section_data:
        sec = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(sx), Inches(sy), Inches(sw), Inches(sh))
        sec.fill.solid()
        sec.fill.fore_color.rgb = sbg
        sec.line.color.rgb = sbdr
        sec.line.width = Pt(1)
        tf = sec.text_frame
        tf.margin_left = Pt(6)
        tf.margin_top = Pt(2)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = stxt
        r.font.size = Pt(8)
        r.font.bold = True
        r.font.color.rgb = DARK_TEXT

    # Mock standards grid
    std_bg = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.5), Inches(5.8), Inches(2.5))
    std_bg.fill.solid()
    std_bg.fill.fore_color.rgb = WHITE
    std_bg.line.color.rgb = RGBColor(0xdd, 0xdd, 0xdd)
    std_bg.line.width = Pt(1)

    std_header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(4.5), Inches(5.8), Inches(0.3))
    std_header.fill.solid()
    std_header.fill.fore_color.rgb = NAVY
    std_header.line.fill.background()
    tf = std_header.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "  📚 BIS Standards Library — 28 Standards Indexed"
    r.font.size = Pt(9)
    r.font.bold = True
    r.font.color.rgb = WHITE

    standards = [
        ("IS 269", "Cement", "Ordinary Portland Cement"),
        ("IS 2062", "Steel", "Structural Steel"),
        ("IS 302", "Electrical", "Household Appliances"),
        ("IS 14543", "Food", "Packaged Drinking Water"),
        ("IS 15556", "Electrical", "LED Lamps"),
        ("IS 3289", "Leather", "Finished Leather"),
    ]

    sx_start = 7.0
    sy_start = 4.95
    for i, (sid, scat, stitle) in enumerate(standards):
        col = i % 3
        row = i // 3
        cx = sx_start + col * 1.9
        cy = sy_start + row * 1.1

        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(cy), Inches(1.7), Inches(0.95))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0)
        card.line.width = Pt(0.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(6)
        tf.margin_top = Pt(4)

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = scat.upper()
        r.font.size = Pt(7)
        r.font.bold = True
        r.font.color.rgb = ORANGE

        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = sid
        r2.font.size = Pt(11)
        r2.font.bold = True
        r2.font.color.rgb = NAVY

        p3 = tf.add_paragraph()
        r3 = p3.add_run()
        r3.text = stitle
        r3.font.size = Pt(8)
        r3.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 5: IMPACT & ROADMAP
# ══════════════════════════════════════════════
def create_impact_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, 5)
    add_footer(slide, 5)

    add_section_heading(slide, 0.4, 1.1, 6, "Impact & Target Users", 16)

    # Metrics row
    metrics = [("63M+", "MSMEs in India"), ("28K+", "BIS Standards"), ("₹2.5L Cr", "Compliance Market")]
    for i, (num, label) in enumerate(metrics):
        mx = 0.4 + i * 2.1
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(mx), Inches(1.55), Inches(1.9), Inches(0.9))
        card.fill.solid()
        card.fill.fore_color.rgb = NAVY
        card.line.fill.background()

        tf = card.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = num
        r.font.size = Pt(24)
        r.font.bold = True
        r.font.color.rgb = ORANGE

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        r2 = p2.add_run()
        r2.text = label
        r2.font.size = Pt(9)
        r2.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    # Target users
    add_section_heading(slide, 0.4, 2.6, 4, "Who Benefits?", 13)

    users = [
        ("🏭", "MSMEs & Manufacturers", "Quick standards + certification answers"),
        ("🏗️", "Construction Companies", "Steel, cement compliance guidance"),
        ("🔬", "Testing Labs", "Reference standards for procedures"),
        ("👩‍💼", "Quality Managers", "Stay updated via auto-fetch"),
    ]

    for i, (icon, title, desc) in enumerate(users):
        col = i % 2
        row = i // 2
        ux = 0.4 + col * 3.0
        uy = 2.95 + row * 1.0

        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(ux), Inches(uy), Inches(2.8), Inches(0.85))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(0xe0, 0xe0, 0xe0)
        card.line.width = Pt(1)

        icon_box = slide.shapes.add_textbox(Inches(ux + 0.1), Inches(uy + 0.12), Inches(0.4), Inches(0.4))
        tf = icon_box.text_frame
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = icon
        r.font.size = Pt(20)

        txt = slide.shapes.add_textbox(Inches(ux + 0.55), Inches(uy + 0.08), Inches(2.1), Inches(0.7))
        tf = txt.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = NAVY
        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = DARK_TEXT

    # Roadmap (right side)
    add_section_heading(slide, 7.0, 1.1, 6, "Development Roadmap", 16)

    roadmap = [
        ("✓ DONE", "MVP — Working Prototype", "28 standards, 22 languages, RAG, auth, 6-section responses, BIS finder, cert guides", SEC_GREEN),
        ("NOW", "Scale — Full BIS Coverage", "Index all 28,000+ standards, PDF viewer, WhatsApp bot", SEC_AMBER),
        ("FUTURE", "Production — Enterprise", "PostgreSQL + Redis, mobile app, voice, BIS integration, SaaS", MED_GRAY),
    ]

    for i, (phase, title, desc, color) in enumerate(roadmap):
        ry = 1.55 + i * 0.85

        # Phase badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(ry), Inches(1.1), Inches(0.3))
        badge.fill.solid()
        badge.fill.fore_color.rgb = color
        badge.line.fill.background()
        tf = badge.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = phase
        r.font.size = Pt(8)
        r.font.bold = True
        r.font.color.rgb = WHITE

        # Content
        txt = slide.shapes.add_textbox(Inches(8.2), Inches(ry - 0.02), Inches(4.6), Inches(0.75))
        tf = txt.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = NAVY
        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = DARK_TEXT

    # Business model
    add_section_heading(slide, 0.4, 5.1, 6, "Business Model & Monetization", 13)

    biz_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(5.45), Inches(12.4), Inches(1.55))
    biz_box.fill.solid()
    biz_box.fill.fore_color.rgb = LIGHT_GRAY
    biz_box.line.color.rgb = NAVY
    biz_box.line.width = Pt(1)

    biz_items = [
        ("Free Tier:", " 10 queries/day for individual users — basic compliance questions"),
        ("MSME Plan (₹499/mo):", " Unlimited queries + compliance calendar + document generator"),
        ("Enterprise (₹4,999/mo):", " API access + bulk standard check + dedicated support"),
        ("BIS Partnership:", " Official data provider status — revenue share on certified leads"),
        ("Government Grant:", " Apply under MSME Samadhaan scheme for funding"),
    ]

    tf = biz_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(10)
    tf.margin_top = Pt(6)

    for i, (bold_part, normal_part) in enumerate(biz_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(2)

        bullet = p.add_run()
        bullet.text = "✦ "
        bullet.font.size = Pt(10)
        bullet.font.color.rgb = ORANGE

        b = p.add_run()
        b.text = bold_part
        b.font.size = Pt(10)
        b.font.bold = True
        b.font.color.rgb = NAVY

        n = p.add_run()
        n.text = normal_part
        n.font.size = Pt(10)
        n.font.color.rgb = DARK_TEXT


# ══════════════════════════════════════════════
#  SLIDE 6: THANK YOU
# ══════════════════════════════════════════════
def create_thankyou_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # Dark background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = DARK_NAVY
    bg.line.fill.background()

    # Decorative circle
    circ = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9), Inches(4), Inches(4), Inches(4))
    circ.fill.solid()
    circ.fill.fore_color.rgb = ORANGE
    circ.fill.fore_color.brightness = 0.88
    circ.line.fill.background()

    # Thank You text
    ty = slide.shapes.add_textbox(Inches(2), Inches(1.5), Inches(9.3), Inches(1.0))
    tf = ty.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "THANK "
    r.font.size = Pt(48)
    r.font.bold = True
    r.font.color.rgb = WHITE
    r2 = p.add_run()
    r2.text = "YOU"
    r2.font.size = Pt(48)
    r2.font.bold = True
    r2.font.color.rgb = ORANGE

    # Divider
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.67), Inches(2.65), Inches(2), Inches(0.04))
    div.fill.solid()
    div.fill.fore_color.rgb = ORANGE
    div.line.fill.background()

    # Tagline
    tag = slide.shapes.add_textbox(Inches(2), Inches(2.9), Inches(9.3), Inches(0.8))
    tf = tag.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "ManakMitra — Making BIS Standards Accessible\nto Every Indian Manufacturer"
    r.font.size = Pt(18)
    r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    # Team member
    avatar = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.17), Inches(3.9), Inches(1.0), Inches(1.0))
    avatar.fill.solid()
    avatar.fill.fore_color.rgb = RGBColor(0x30, 0x50, 0x80)
    avatar.line.color.rgb = RGBColor(0xff, 0xff, 0xff)
    avatar.line.width = Pt(2)
    tf = avatar.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "👨‍💻"
    r.font.size = Pt(28)

    name_box = slide.shapes.add_textbox(Inches(4.5), Inches(5.0), Inches(4.3), Inches(0.4))
    tf = name_box.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Pavan Kumar"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = WHITE

    role_box = slide.shapes.add_textbox(Inches(4.5), Inches(5.35), Inches(4.3), Inches(0.3))
    tf = role_box.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Team Lead / Full Stack Developer"
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)

    # CTA
    cta = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.0), Inches(5.8), Inches(5.3), Inches(0.7))
    cta.fill.background()
    cta.line.color.rgb = RGBColor(0xff, 0xff, 0xff)
    cta.line.width = Pt(1)
    tf = cta.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Try live at  "
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(0xaa, 0xaa, 0xaa)
    r2 = p.add_run()
    r2.text = "manakmitra-frontend.vercel.app"
    r2.font.size = Pt(14)
    r2.font.bold = True
    r2.font.color.rgb = ORANGE

    # SIH logo
    sih = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(12.0), Inches(0.3), Inches(0.8), Inches(0.8))
    sih.fill.solid()
    sih.fill.fore_color.rgb = ORANGE
    sih.line.fill.background()
    tf = sih.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "SIH"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = WHITE

    sih_label = slide.shapes.add_textbox(Inches(10.6), Inches(0.3), Inches(1.3), Inches(0.8))
    tf = sih_label.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run()
    r.text = "SMART INDIA\nHACKATHON 2026"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0xcc, 0xcc, 0xcc)

    # Footer
    footer = slide.shapes.add_textbox(Inches(0.5), Inches(7.1), Inches(5), Inches(0.3))
    tf = footer.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "@SIH Idea submission — Team Resonant"
    r.font.size = Pt(9)
    r.font.color.rgb = RGBColor(0x66, 0x66, 0x66)


# ══════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════
def main():
    prs = Presentation()
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)

    print("Creating Slide 1: Title...")
    create_title_slide(prs)

    print("Creating Slide 2: Problems & Solutions...")
    create_problems_slide(prs)

    print("Creating Slide 3: Tech Stack...")
    create_techstack_slide(prs)

    print("Creating Slide 4: Demo...")
    create_demo_slide(prs)

    print("Creating Slide 5: Impact & Roadmap...")
    create_impact_slide(prs)

    print("Creating Slide 6: Thank You...")
    create_thankyou_slide(prs)

    output_path = os.path.join(os.path.dirname(__file__), "ManakMitra_SIH2026.pptx")
    prs.save(output_path)
    print(f"\nPresentation saved: {output_path}")
    print(f"   6 slides, widescreen 16:9 format")
    print(f"   Open in PowerPoint or Google Slides")


if __name__ == "__main__":
    main()
