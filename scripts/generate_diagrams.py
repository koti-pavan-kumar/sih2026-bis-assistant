"""
Generate professional diagrams for SIH 2026 PPT.
Creates PNG images that can be embedded into slides.
No emoji characters - uses text labels only.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "ppt_diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

NAVY = "#0A1628"
BLUE = "#1E3A5F"
LIGHT_BLUE = "#3B82F6"
SAFFRON = "#FF6B35"
GREEN = "#10B981"
RED = "#EF4444"
YELLOW = "#F59E0B"
PURPLE = "#8B5CF6"
GRAY = "#6B7280"
LIGHT_GRAY = "#F3F4F6"
WHITE = "#FFFFFF"


def create_architecture_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(6, 7.6, 'ManakMitra - 4-Layer RAG Architecture', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    layers = [
        (0.5, 5.8, 11, 1.4, 'LAYER 1: PRESENTATION', '#EFF6FF',
         ['React 18 + TailwindCSS Chat UI', 'Voice Input (Web Speech API)',
          'Responsive Design (Mobile + Desktop)', 'Certification Wizard']),
        (0.5, 3.9, 11, 1.4, 'LAYER 2: PROCESSING', '#FEF3C7',
         ['Language Detection (langdetect)', '18-Language Translation (deep-translator)',
          'Query Embedding (sentence-transformers)', 'LLM Generation (Ollama / Gemini / Template)']),
        (0.5, 2.0, 11, 1.4, 'LAYER 3: INTELLIGENCE', '#ECFDF5',
         ['PDF Ingestion (pdfplumber)', 'Semantic Chunking (1000-char)',
          'FAISS Vector Store (Cosine Similarity)', 'Citation Verification + Confidence Scoring']),
        (0.5, 0.1, 11, 1.4, 'LAYER 4: DATA', '#FDF2F8',
         ['18 BIS Standard PDFs', 'Chunked Text + Metadata',
          'FAISS Index (73 vectors, 384-dim)', 'Persistent Storage (data/chroma_db/)']),
    ]

    for x, y, w, h, title, color, items in layers:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                              facecolor=color, edgecolor=BLUE, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x + 0.3, y + h - 0.25, title, fontsize=11, fontweight='bold',
                color=NAVY, va='top')
        for i, item in enumerate(items):
            col = i % 2
            row = i // 2
            ax.text(x + 0.5 + col * 5.2, y + 0.7 - row * 0.35, item,
                    fontsize=9, color=GRAY, va='center')

    for y_start in [5.8, 3.9, 2.0]:
        ax.annotate('', xy=(6, y_start), xytext=(6, y_start + 0.15),
                    arrowprops=dict(arrowstyle='->', color=BLUE, lw=2))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'architecture.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: architecture.png")


def create_pipeline_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(14, 6))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(7, 5.7, 'RAG Query Processing Pipeline', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    steps = [
        (1.0, 3.5, 'User Query\n(Any Language)', LIGHT_BLUE),
        (3.2, 3.5, 'Language\nDetection', YELLOW),
        (5.4, 3.5, 'Translation\n(to English)', SAFFRON),
        (7.6, 3.5, 'Embedding\n(384-dim)', PURPLE),
        (9.8, 3.5, 'FAISS Search\n(Top-5)', GREEN),
        (12.0, 3.5, 'LLM Generate\n+ Cite', BLUE),
    ]

    for x, y, label, color in steps:
        rect = FancyBboxPatch((x - 0.85, y - 0.8), 1.7, 1.6,
                              boxstyle="round,pad=0.15", facecolor=color, edgecolor='white',
                              linewidth=2, alpha=0.9)
        ax.add_patch(rect)
        ax.text(x, y, label, fontsize=9, ha='center', va='center',
                color='white', fontweight='bold')

    for i in range(len(steps) - 1):
        ax.annotate('', xy=(steps[i+1][0] - 0.85, steps[i+1][1]),
                    xytext=(steps[i][0] + 0.85, steps[i][1]),
                    arrowprops=dict(arrowstyle='->', color=NAVY, lw=2.5))

    ax.text(7, 1.8, 'Post-Processing', fontsize=14, fontweight='bold',
            ha='center', va='center', color=NAVY)

    post_steps = [
        (3.5, 1.0, 'Extract Citations\n[IS XXXX:YYYY]', LIGHT_BLUE),
        (7.0, 1.0, 'Verify Against\nRetrieved Chunks', GREEN),
        (10.5, 1.0, 'Compute Confidence\nScore (0-100)', SAFFRON),
    ]

    for x, y, label, color in post_steps:
        rect = FancyBboxPatch((x - 1.5, y - 0.5), 3.0, 1.0,
                              boxstyle="round,pad=0.1", facecolor=color, edgecolor='white',
                              linewidth=1.5, alpha=0.8)
        ax.add_patch(rect)
        ax.text(x, y, label, fontsize=9, ha='center', va='center',
                color='white', fontweight='bold')

    ax.annotate('', xy=(7, 1.5), xytext=(7, 2.7),
                arrowprops=dict(arrowstyle='->', color=NAVY, lw=2))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'pipeline.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: pipeline.png")


def create_tech_stack_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(6, 6.6, 'Technology Stack', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    stacks = [
        (0.5, 4.5, 'Frontend', LIGHT_BLUE, ['React 18', 'TailwindCSS', 'Vite', 'Web Speech API']),
        (3.2, 4.5, 'Backend', SAFFRON, ['Python 3.10+', 'FastAPI', 'Uvicorn', 'Pydantic']),
        (5.9, 4.5, 'AI / ML', PURPLE, ['FAISS', 'sentence-transformers', 'Ollama / Gemini', 'MiniLM-L6-v2']),
        (8.6, 4.5, 'NLP', GREEN, ['langdetect', 'deep-translator', '18 Languages', 'Auto-detect']),
        (0.5, 1.5, 'Data', BLUE, ['pdfplumber', 'PDF Parsing', 'Semantic Chunking', 'Metadata Store']),
        (3.2, 1.5, 'Storage', RED, ['FAISS Index', 'Pickle Metadata', 'JSON Chunks', 'Local Files']),
        (5.9, 1.5, 'DevOps', GRAY, ['Docker', 'docker-compose', 'Nginx', 'CI/CD Ready']),
        (8.6, 1.5, 'LLM', YELLOW, ['Ollama (Offline)', 'Gemini (Cloud)', 'Template Fallback', 'Temp 0.3']),
    ]

    for x, y, title, color, items in stacks:
        rect = FancyBboxPatch((x, y), 2.4, 2.5, boxstyle="round,pad=0.15",
                              facecolor=color, edgecolor='white', linewidth=2, alpha=0.85)
        ax.add_patch(rect)
        ax.text(x + 1.2, y + 2.1, title, fontsize=11, fontweight='bold',
                ha='center', va='center', color='white')
        for i, item in enumerate(items):
            ax.text(x + 1.2, y + 1.5 - i * 0.4, item, fontsize=8,
                    ha='center', va='center', color='white')

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'techstack.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: techstack.png")


def create_impact_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(6, 6.6, 'Impact & Benefits', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    impacts = [
        (1.0, 4.5, '75M', 'MSMEs', 'Get instant access\nto BIS standards', LIGHT_BLUE),
        (4.0, 4.5, '18', 'Languages', 'Hindi, Tamil, Bengali\nand 15 more', SAFFRON),
        (7.0, 4.5, '3s', 'Response', 'vs 15 min manual\nPDF search', GREEN),
        (10.0, 4.5, 'Rs.25K', 'Saved', 'Per inquiry\nvs consultant', RED),
    ]

    for x, y, number, label, desc, color in impacts:
        rect = FancyBboxPatch((x - 1.1, y - 1.2), 2.2, 2.4,
                              boxstyle="round,pad=0.15", facecolor=color, edgecolor='white',
                              linewidth=2, alpha=0.9)
        ax.add_patch(rect)
        ax.text(x, y + 0.6, number, fontsize=22, fontweight='bold',
                ha='center', va='center', color='white')
        ax.text(x, y + 0.1, label, fontsize=10, fontweight='bold',
                ha='center', va='center', color='white')
        ax.text(x, y - 0.5, desc, fontsize=8, ha='center', va='center', color='white')

    ax.text(6, 2.8, 'Key Benefits', fontsize=14, fontweight='bold',
            ha='center', va='center', color=NAVY)

    benefits = [
        (2.0, 1.8, 'Economic', 'Saves Rs.5K-25K\nper inquiry', LIGHT_BLUE),
        (5.0, 1.8, 'Social', 'Breaks language\nbarrier', SAFFRON),
        (8.0, 1.8, 'Compliance', 'Cited, verifiable\nanswers', GREEN),
        (11.0, 1.8, 'Scalability', '20,000+ standards\ncapable', PURPLE),
    ]

    for x, y, title, desc, color in benefits:
        rect = FancyBboxPatch((x - 1.2, y - 0.7), 2.4, 1.4,
                              boxstyle="round,pad=0.1", facecolor=color, edgecolor='white',
                              linewidth=1.5, alpha=0.8)
        ax.add_patch(rect)
        ax.text(x, y + 0.25, title, fontsize=10, fontweight='bold',
                ha='center', va='center', color='white')
        ax.text(x, y - 0.25, desc, fontsize=8, ha='center', va='center', color='white')

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'impact.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: impact.png")


def create_competitive_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(12, 6))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(6, 5.6, 'Competitive Landscape', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    features = ['AI-Powered Q&A', '18 Indian Languages', 'Voice Input',
                'Source Citations', 'Offline Support', 'Confidence Scoring',
                'Anti-Hallucination', 'Certification Wizard']

    scores = {
        'ManakMitra': [1, 1, 1, 1, 1, 1, 1, 1],
        'BIS.gov.in': [0, 0, 0, 0, 0, 0, 0, 0],
        'IS Code Finder': [0, 0, 0, 0.5, 0, 0, 0, 0],
        'StackOverflow': [0.5, 0, 0, 0.5, 0, 0, 0, 0],
    }

    colors_list = [LIGHT_BLUE, GRAY, YELLOW, SAFFRON]

    for i, feat in enumerate(features):
        y = 4.8 - i * 0.55
        ax.text(2.5, y, feat, fontsize=9, ha='center', va='center', color=NAVY, fontweight='bold')

    for j, (name, color) in enumerate(zip(scores.keys(), colors_list)):
        x = 5.5 + j * 1.8
        rect = FancyBboxPatch((x - 0.7, 5.0), 1.4, 0.5, boxstyle="round,pad=0.05",
                              facecolor=color, edgecolor='white', linewidth=1, alpha=0.9)
        ax.add_patch(rect)
        ax.text(x, 5.25, name, fontsize=7, fontweight='bold', ha='center', va='center', color='white')

    for j, (name, vals) in enumerate(scores.items()):
        x = 5.5 + j * 1.8
        for i, val in enumerate(vals):
            y = 4.8 - i * 0.55
            if val == 1:
                ax.text(x, y, 'YES', fontsize=8, ha='center', va='center', color=GREEN, fontweight='bold')
            elif val == 0.5:
                ax.text(x, y, 'PARTIAL', fontsize=7, ha='center', va='center', color=YELLOW)
            else:
                ax.text(x, y, 'NO', fontsize=8, ha='center', va='center', color=RED)

    ax.text(6, 0.6, 'Overall Score:', fontsize=12, fontweight='bold', ha='center', va='center', color=NAVY)
    bar_labels = ['ManakMitra: 8/8', 'BIS.gov.in: 0/8', 'IS Code Finder: 1/8', 'StackOverflow: 1/8']
    bar_colors = [GREEN, RED, YELLOW, YELLOW]
    for i, (label, color) in enumerate(zip(bar_labels, bar_colors)):
        x = 2.0 + i * 2.8
        ax.text(x, 0.2, label, fontsize=9, ha='center', va='center', color=color, fontweight='bold')

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'competitive.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: competitive.png")


def create_demo_flow_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(14, 5))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    ax.text(7, 4.6, 'Live Demo Flow', fontsize=18, fontweight='bold',
            ha='center', va='center', color=NAVY)

    rect = FancyBboxPatch((0.3, 1.5), 2.8, 2.5, boxstyle="round,pad=0.2",
                          facecolor=LIGHT_BLUE, edgecolor='white', linewidth=2, alpha=0.9)
    ax.add_patch(rect)
    ax.text(1.7, 3.6, 'USER', fontsize=12, fontweight='bold', ha='center', va='center', color='white')
    ax.text(1.7, 3.1, 'Asks in Hindi:', fontsize=9, ha='center', va='center', color='white')
    ax.text(1.7, 2.5, '"IS 1786 mein Fe 500', fontsize=8, ha='center', va='center', color='white')
    ax.text(1.7, 2.2, 'ki tensile strength', fontsize=8, ha='center', va='center', color='white')
    ax.text(1.7, 1.9, 'kitni hai?"', fontsize=8, ha='center', va='center', color='white')

    ax.annotate('', xy=(3.5, 2.75), xytext=(3.1, 2.75),
                arrowprops=dict(arrowstyle='->', color=NAVY, lw=2.5))

    rect = FancyBboxPatch((3.8, 1.5), 2.8, 2.5, boxstyle="round,pad=0.2",
                          facecolor=PURPLE, edgecolor='white', linewidth=2, alpha=0.9)
    ax.add_patch(rect)
    ax.text(5.2, 3.6, 'PROCESSING', fontsize=12, fontweight='bold', ha='center', va='center', color='white')
    ax.text(5.2, 3.1, '1. Detect: Hindi', fontsize=9, ha='center', va='center', color='white')
    ax.text(5.2, 2.7, '2. Translate to English', fontsize=9, ha='center', va='center', color='white')
    ax.text(5.2, 2.3, '3. Embed (384-dim)', fontsize=9, ha='center', va='center', color='white')
    ax.text(5.2, 1.9, '4. FAISS search top-5', fontsize=9, ha='center', va='center', color='white')

    ax.annotate('', xy=(7.0, 2.75), xytext=(6.6, 2.75),
                arrowprops=dict(arrowstyle='->', color=NAVY, lw=2.5))

    rect = FancyBboxPatch((7.3, 1.5), 2.8, 2.5, boxstyle="round,pad=0.2",
                          facecolor=SAFFRON, edgecolor='white', linewidth=2, alpha=0.9)
    ax.add_patch(rect)
    ax.text(8.7, 3.6, 'LLM', fontsize=12, fontweight='bold', ha='center', va='center', color='white')
    ax.text(8.7, 3.1, 'Gemini 2.0 Flash', fontsize=9, ha='center', va='center', color='white')
    ax.text(8.7, 2.7, 'Generates cited', fontsize=9, ha='center', va='center', color='white')
    ax.text(8.7, 2.3, 'response with', fontsize=9, ha='center', va='center', color='white')
    ax.text(8.7, 1.9, 'IS references', fontsize=9, ha='center', va='center', color='white')

    ax.annotate('', xy=(10.5, 2.75), xytext=(10.1, 2.75),
                arrowprops=dict(arrowstyle='->', color=NAVY, lw=2.5))

    rect = FancyBboxPatch((10.8, 1.5), 2.8, 2.5, boxstyle="round,pad=0.2",
                          facecolor=GREEN, edgecolor='white', linewidth=2, alpha=0.9)
    ax.add_patch(rect)
    ax.text(12.2, 3.6, 'RESPONSE', fontsize=12, fontweight='bold', ha='center', va='center', color='white')
    ax.text(12.2, 3.1, 'As per IS 1786:2008', fontsize=8, ha='center', va='center', color='white')
    ax.text(12.2, 2.7, 'Clause 5.2.1, min', fontsize=8, ha='center', va='center', color='white')
    ax.text(12.2, 2.3, 'yield stress for Fe', fontsize=8, ha='center', va='center', color='white')
    ax.text(12.2, 1.9, '500 >= 500 MPa', fontsize=8, ha='center', va='center', color='white')

    ax.text(7, 0.8, 'Confidence: HIGH (72.5/100)  |  Citations: Verified  |  Time: 3.2s',
            fontsize=10, ha='center', va='center', color=NAVY, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor=LIGHT_GRAY, edgecolor=BLUE, linewidth=1))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'demo_flow.png'), dpi=200, bbox_inches='tight',
                facecolor=WHITE, edgecolor='none')
    plt.close()
    print("Created: demo_flow.png")


if __name__ == "__main__":
    create_architecture_diagram()
    create_pipeline_diagram()
    create_tech_stack_diagram()
    create_impact_diagram()
    create_competitive_diagram()
    create_demo_flow_diagram()
    print(f"\nAll diagrams saved to: {OUTPUT_DIR}")
