"""Render docs/slide-*.html with headless Edge and match them against the
pasted images inside 'SIH format My Team.pptx' by downscaled pixel distance.

Purpose: establish which HTML slide produced which pasted image, so the images
can be replaced with fresh renders of the corrected HTML.

Usage: python scripts/render_slides.py [--render-only | --match-only]
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")
ROOT = Path(__file__).parent.parent          # bis-assistant/
WORKSPACE = ROOT.parent                      # workspace root
RENDERS = WORKSPACE / "deck_images" / "renders"
IMGDIR = WORKSPACE / "deck_images"
SIZE = (1440, 810)  # the slides' designed dimensions (.slide {width:1440px;height:810px})


def render_all():
    RENDERS.mkdir(parents=True, exist_ok=True)
    htmls = sorted((ROOT / "docs").glob("slide-*.html"))
    for html in htmls:
        out = RENDERS / f"{html.stem}.png"
        profile = Path(tempfile.gettempdir()) / f"edge-shot-{html.stem}"
        cmd = [
            str(EDGE), "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1",
            f"--user-data-dir={profile}",
            f"--window-size={SIZE[0]},{SIZE[1]}",
            f"--screenshot={out}",
            html.resolve().as_uri(),
        ]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        ok = out.exists() and out.stat().st_size > 0
        print(f"{'OK ' if ok else 'FAIL'} {html.name}  ({r.returncode}) {r.stderr[-120:] if not ok else ''}")


def dist(a: Path, b: Path) -> float:
    ia = Image.open(a).convert("L").resize((160, 90))
    ib = Image.open(b).convert("L").resize((160, 90))
    pa, pb = list(ia.getdata()), list(ib.getdata())
    return sum(abs(x - y) for x, y in zip(pa, pb)) / len(pa)


def match():
    images = sorted(p for p in IMGDIR.glob("slide*.png"))
    renders = sorted(RENDERS.glob("*.png"))
    if not renders:
        print("no renders - run --render-only first")
        return
    print("\nBest HTML match per pasted deck image (lower = more similar):\n")
    for img in images:
        scores = sorted((dist(img, r), r.stem) for r in renders)
        tail = ", ".join(f"{name}:{s:.1f}" for s, name in scores[:3])
        print(f"  {img.name:14} -> {scores[0][1]:28} (top3: {tail})")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--all"
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if mode in ("--all", "--render-only"):
        render_all()
    if mode in ("--all", "--match-only"):
        match()


if __name__ == "__main__":
    main()
