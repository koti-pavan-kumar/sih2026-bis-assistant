"""
BIS Auto-Fetcher — Automatically discovers and downloads new BIS standards.
Scrapes bis.gov.in for new standard announcements, downloads PDFs,
and ingests them into the FAISS vector index.

Usage:
    fetcher = BISAutoFetcher()
    result = fetcher.fetch_and_ingest()
    print(result)
"""
import os
import re
import json
import logging
import hashlib
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple

import httpx

logger = logging.getLogger(__name__)


class BISAutoFetcher:
    """Automatically fetches new BIS standards from bis.gov.in."""

    def __init__(self, data_dir: str = None):
        if data_dir is None:
            data_dir = str(Path(__file__).parent.parent.parent / "data")
        self.data_dir = Path(data_dir)
        self.raw_dir = self.data_dir / "raw"
        self.raw_dir.mkdir(parents=True, exist_ok=True)

        # Track fetched items to avoid duplicates
        self.fetched_log = self.data_dir / "fetched_standards.json"
        self.fetched_items = self._load_fetched_log()

        # BIS URLs to check
        self.BIS_URLS = [
            "https://www.bis.gov.in/whats-new/?lang=en",
        ]

        # Headers to mimic a browser
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }

    def _load_fetched_log(self) -> dict:
        """Load the log of previously fetched items."""
        if self.fetched_log.exists():
            try:
                with open(self.fetched_log, "r") as f:
                    return json.load(f)
            except Exception:
                return {"fetched": [], "last_check": None}
        return {"fetched": [], "last_check": None}

    def _save_fetched_log(self):
        """Save the fetched log."""
        self.fetched_log.parent.mkdir(parents=True, exist_ok=True)
        with open(self.fetched_log, "w") as f:
            json.dump(self.fetched_items, f, indent=2, default=str)

    def _get_item_id(self, title: str, url: str = "") -> str:
        """Generate a unique ID for a fetched item."""
        content = f"{title}:{url}"
        return hashlib.md5(content.encode()).hexdigest()[:12]

    def scrape_whats_new(self) -> List[Dict]:
        """Scrape the BIS 'What's New' page for new standards."""
        items = []

        for url in self.BIS_URLS:
            try:
                logger.info(f"Scraping: {url}")
                resp = httpx.get(url, headers=self.headers, timeout=30.0, follow_redirects=True)
                if resp.status_code != 200:
                    logger.warning(f"Failed to fetch {url}: {resp.status_code}")
                    continue

                html = resp.text

                # Extract items from the page
                # BIS What's New page has entries like:
                # "Grant of All India First Licence for "Product Name" as per IS XXXXX: YYYY"
                # with Type: pdf and Download links

                # Pattern 1: Look for IS standard references in the page
                is_pattern = re.compile(
                    r'IS\s+(\d+)(?::\s*(\d{4}))?'
                )

                # Find all IS numbers mentioned
                is_matches = is_pattern.findall(html)

                # Pattern 2: Look for downloadable PDF links
                # BIS pages often have links like /sites/default/files/.../IS_XXXX.pdf
                pdf_pattern = re.compile(
                    r'href=["\']([^"\']*\.pdf[^"\']*)["\']',
                    re.IGNORECASE
                )
                pdf_matches = pdf_pattern.findall(html)

                # Pattern 3: Look for "Published On" dates
                date_pattern = re.compile(
                    r'Published On:\s*(\d{1,2}\s+\w+,\s*\d{4})'
                )
                date_matches = date_pattern.findall(html)

                # Pattern 4: Look for standard titles near IS numbers
                # BIS format: "Grant of All India First Licence for "Product" as per IS XXXXX: YYYY"
                title_pattern = re.compile(
                    r'(?:Grant|New|Revised|Published).*?(?:IS\s+(\d+)(?::\s*(\d{4}))?)',
                    re.IGNORECASE | re.DOTALL
                )
                title_matches = title_pattern.findall(html)

                # Build items from matches
                seen_is = set()
                for is_num, year in is_matches:
                    is_key = f"IS {is_num}"
                    if is_key not in seen_is:
                        seen_is.add(is_key)
                        # Try to find the PDF link for this standard
                        pdf_url = self._find_pdf_for_standard(is_num, pdf_matches)

                        items.append({
                            "is_number": is_key,
                            "year": year if year else "",
                            "pdf_url": pdf_url,
                            "source_url": url,
                            "found_date": datetime.now().isoformat(),
                        })

                logger.info(f"Found {len(items)} standards from {url}")

            except Exception as e:
                logger.error(f"Error scraping {url}: {e}")
                continue

        return items

    def _find_pdf_for_standard(self, is_num: str, pdf_urls: List[str]) -> Optional[str]:
        """Try to find a PDF URL for a specific IS standard."""
        for url in pdf_urls:
            # Check if the URL contains the IS number
            if is_num in url:
                # Make it absolute if relative
                if url.startswith("/"):
                    return f"https://www.bis.gov.in{url}"
                elif url.startswith("http"):
                    return url
        return None

    def download_pdf(self, url: str, filename: str) -> Optional[str]:
        """Download a PDF from URL and save to data/raw/."""
        try:
            filepath = self.raw_dir / filename
            if filepath.exists():
                logger.info(f"Already exists: {filename}")
                return str(filepath)

            logger.info(f"Downloading: {url}")
            resp = httpx.get(url, headers=self.headers, timeout=60.0, follow_redirects=True)

            if resp.status_code == 200 and len(resp.content) > 1000:
                # Verify it's actually a PDF
                if resp.content[:4] == b'%PDF' or 'pdf' in resp.headers.get('content-type', ''):
                    with open(filepath, 'wb') as f:
                        f.write(resp.content)
                    logger.info(f"Downloaded: {filename} ({len(resp.content)} bytes)")
                    return str(filepath)
                else:
                    logger.warning(f"Not a valid PDF: {filename}")
                    return None
            else:
                logger.warning(f"Download failed: {url} (status={resp.status_code})")
                return None

        except Exception as e:
            logger.error(f"Error downloading {url}: {e}")
            return None

    def fetch_and_ingest(self) -> Dict:
        """Main method: scrape, download, and ingest new standards.

        Returns dict with results:
        {
            "new_standards_found": int,
            "downloaded": int,
            "ingested": int,
            "already_existed": int,
            "errors": list,
            "standards": list
        }
        """
        results = {
            "new_standards_found": 0,
            "downloaded": 0,
            "ingested": 0,
            "already_existed": 0,
            "errors": [],
            "standards": [],
        }

        # Step 1: Scrape BIS website
        logger.info("Step 1: Scraping BIS website for new standards...")
        try:
            items = self.scrape_whats_new()
            results["new_standards_found"] = len(items)
        except Exception as e:
            results["errors"].append(f"Scraping failed: {str(e)}")
            return results

        if not items:
            logger.info("No new standards found on BIS website.")
            return results

        # Step 2: Filter out already fetched items
        new_items = []
        for item in items:
            item_id = self._get_item_id(item["is_number"], item.get("pdf_url", ""))
            if item_id not in self.fetched_items["fetched"]:
                new_items.append(item)
            else:
                results["already_existed"] += 1

        logger.info(f"Found {len(new_items)} new standards ({results['already_existed']} already fetched)")

        if not new_items:
            return results

        # Step 3: Download PDFs (if URLs available)
        downloaded_files = []
        for item in new_items:
            if item.get("pdf_url"):
                filename = f"{item['is_number'].replace(' ', '_')}.pdf"
                filepath = self.download_pdf(item["pdf_url"], filename)
                if filepath:
                    downloaded_files.append((item, filepath))
                    results["downloaded"] += 1
                else:
                    results["errors"].append(f"Failed to download {item['is_number']}")
            else:
                # No PDF URL found — mark as fetched but not downloaded
                item_id = self._get_item_id(item["is_number"])
                self.fetched_items["fetched"].append({
                    "id": item_id,
                    "is_number": item["is_number"],
                    "fetched_at": datetime.now().isoformat(),
                    "pdf_downloaded": False,
                    "reason": "No direct PDF URL found on BIS page",
                })

        # Step 4: Ingest downloaded PDFs
        if downloaded_files:
            logger.info(f"Step 4: Ingesting {len(downloaded_files)} PDFs...")
            try:
                from backend.ingestion.pipeline import DocumentIngestionPipeline
                from backend.rag.engine import VectorStore

                pipeline = DocumentIngestionPipeline()
                vector_store = VectorStore()

                for item, filepath in downloaded_files:
                    try:
                        chunks = pipeline.ingest_pdf(filepath)
                        if chunks:
                            vector_store.add_chunks(chunks)
                            results["ingested"] += len(chunks)
                            results["standards"].append({
                                "is_number": item["is_number"],
                                "chunks": len(chunks),
                                "source": "bis.gov.in (auto-fetched)",
                            })
                            logger.info(f"Ingested {item['is_number']}: {len(chunks)} chunks")
                        else:
                            results["errors"].append(f"No chunks extracted from {item['is_number']}")
                    except Exception as e:
                        results["errors"].append(f"Ingestion failed for {item['is_number']}: {str(e)}")

            except Exception as e:
                results["errors"].append(f"Ingestion pipeline failed: {str(e)}")

        # Step 5: Update fetched log
        for item in new_items:
            item_id = self._get_item_id(item["is_number"], item.get("pdf_url", ""))
            self.fetched_items["fetched"].append({
                "id": item_id,
                "is_number": item["is_number"],
                "fetched_at": datetime.now().isoformat(),
                "pdf_downloaded": bool(item.get("pdf_url")),
                "source_url": item.get("source_url", ""),
            })

        self.fetched_items["last_check"] = datetime.now().isoformat()
        self._save_fetched_log()

        logger.info(f"Fetch complete: {results['downloaded']} downloaded, {results['ingested']} chunks ingested")
        return results

    def check_for_updates(self) -> Dict:
        """Quick check — scrape and report what's new without downloading.

        Returns dict with:
        {
            "last_check": str,
            "new_items": list,
            "total_fetched": int,
        }
        """
        items = self.scrape_whats_new()

        new_items = []
        for item in items:
            item_id = self._get_item_id(item["is_number"], item.get("pdf_url", ""))
            if item_id not in [f["id"] for f in self.fetched_items["fetched"]]:
                new_items.append(item)

        return {
            "last_check": self.fetched_items.get("last_check", "Never"),
            "new_items": new_items,
            "total_fetched": len(self.fetched_items["fetched"]),
            "standards_indexed": self._count_indexed_standards(),
        }

    def _count_indexed_standards(self) -> int:
        """Count how many standards are currently indexed."""
        try:
            from backend.rag.engine import RAGEngine
            rag = RAGEngine()
            return len(rag.get_available_standards())
        except Exception:
            return 0

    def get_fetched_history(self) -> List[Dict]:
        """Get the history of all fetched items."""
        return self.fetched_items.get("fetched", [])


# CLI entry point
if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(Path(__file__).parent.parent.parent))

    logging.basicConfig(level=logging.INFO, format="%(asctime)s — %(message)s")

    fetcher = BISAutoFetcher()

    if len(sys.argv) > 1 and sys.argv[1] == "--check":
        # Just check for updates
        result = fetcher.check_for_updates()
        print(json.dumps(result, indent=2, default=str))
    else:
        # Full fetch and ingest
        result = fetcher.fetch_and_ingest()
        print(json.dumps(result, indent=2, default=str))
