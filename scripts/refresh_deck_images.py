"""Refresh the pasted content-slide images inside 'SIH format My Team.pptx'.

The submitted template deck carries full-slide PNG renders of docs/slide-*.html
on slides 2-5. Those renders predate the credibility fixes (wrong corpus
numbers, absolute hallucination claims, empty mitigation boxes, dead demo URL).
This script re-renders the corrected HTML, resizes each render to the exact
pixel dimensions of the image it replaces (so PowerPoint geometry is
unchanged), and swaps the picture blob in place.

Mapping (by template slide -> html source):
  slide 2 (2 stacked pictures) -> docs/slide-problems-solutions.html
  slide 3                       -> docs/slide-technical.html
  slide 4 (2 stacked pictures) -> docs/slide-feasibility.html
  slide 5                       -> docs/slide-impact-benefits.html

Prerequisite: renders in deck_images/renders/ (scripts/render_slides.py).
Usage: python scripts/refresh_deck_images.py [--dry-run]
"""
import io
import sys
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
from pptx.oxml.ns import qn

ROOT = Path(__file__).parent.parent          # bis-assistant/
WORKSPACE = ROOT.parent
DECK = WORKSPACE / "SIH format My Team.pptx"
RENDERS = WORKSPACE / "deck_images" / "renders"

SLIDE_TO_HTML = {
    2: "slide-problems-solutions.png",
    3: "slide-technical.png",
    4: "slide-feasibility.png",
    5: "slide-impact-benefits.png",
}


def main():
    dry = "--dry-run" in sys.argv
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    prs = Presentation(str(DECK))
    swapped = 0
    for si, slide in enumerate(prs.slides, 1):
        if si not in SLIDE_TO_HTML:
            continue
        render_path = RENDERS / SLIDE_TO_HTML[si]
        if not render_path.exists():
            print(f"MISSING RENDER {render_path}")
            return 1
        render = Image.open(render_path).convert("RGB")
        for sh in slide.shapes:
            if sh.shape_type != MSO_SHAPE_TYPE.PICTURE:
                continue
            w, h = sh.image.size          # target pixel dimensions
            resized = render.resize((w, h), Image.LANCZOS)
            buf = io.BytesIO()
            resized.save(buf, format="PNG")
            tmp = RENDERS / f"_swap_s{si}_{w}x{h}.png"
            tmp.write_bytes(buf.getvalue())
            if dry:
                print(f"DRY slide{si}: {sh.name} {w}x{h} <- {render_path.name}")
                continue
            _img_part, rId = slide.part.get_or_add_image_part(str(tmp))
            blip = sh._element.blipFill.blip
            blip.set(qn("r:embed"), rId)
            swapped += 1
            print(f"OK  slide{si}: {sh.name} {w}x{h} <- {render_path.name}")
    if not dry and swapped:
        prs.save(str(DECK))
        print(f"\nSaved {DECK.name} ({swapped} images swapped)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
