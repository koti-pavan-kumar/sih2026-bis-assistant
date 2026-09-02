"""
LLM Response Generator — Generates cited responses using Ollama or Gemini.
"""
import os
import re
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)


class LLMGenerator:
    """Generates responses using local Ollama or cloud Gemini."""

    def __init__(self):
        self.llm_provider = None
        self.ollama_url = None
        self.ollama_model = None
        self.gemini_model = None
        self._detect_llm()

    def _detect_llm(self):
        """Auto-detect available LLM."""
        # Try Ollama
        ollama_host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
        if not ollama_host.startswith("http"):
            ollama_host = f"http://{ollama_host}"

        for attempt in range(3):
            try:
                resp = httpx.get(f"{ollama_host}/api/tags", timeout=5.0)
                if resp.status_code == 200:
                    data = resp.json()
                    models = data.get("models", [])
                    if models:
                        self.llm_provider = "ollama"
                        self.ollama_url = ollama_host
                        self.ollama_model = models[0]["name"]
                        logger.info(f"Using Ollama ({self.ollama_model}) at {ollama_host}")
                        return
            except Exception:
                if attempt < 2:
                    import time
                    time.sleep(2)

        # Try Gemini (with model fallback chain)
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                # Try models in order of preference
                for model_name in ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]:
                    try:
                        self.gemini_model = genai.GenerativeModel(model_name)
                        self.llm_provider = "gemini"
                        logger.info(f"Using Gemini ({model_name})")
                        return
                    except Exception:
                        continue
            except Exception as e:
                logger.warning(f"Gemini init failed: {e}")

        logger.warning("No LLM available. Using template responses.")

    def generate(self, query: str, context: str, language: str = "en") -> str:
        """Generate a response using the available LLM."""
        if self.llm_provider == "ollama":
            return self._generate_ollama(query, context, language)
        elif self.llm_provider == "gemini":
            return self._generate_gemini(query, context, language)
        else:
            return self._generate_template(query, context, language)

    # Language code to language name mapping
    LANGUAGE_NAMES = {
        "en": "English", "hi": "Hindi", "bn": "Bengali", "ta": "Tamil",
        "te": "Telugu", "mr": "Marathi", "gu": "Gujarati", "ur": "Urdu",
        "kn": "Kannada", "ml": "Malayalam", "pa": "Punjabi", "or": "Odia",
        "as": "Assamese", "ne": "Nepali", "sa": "Sanskrit", "ks": "Kashmiri",
        "bo": "Bodo", "sd": "Sindhi", "doi": "Dogri", "ki": "Konkani",
        "mai": "Maithili"
    }

    def _build_prompt(self, query: str, context: str, language: str) -> str:
        """Build the system prompt for the LLM."""
        lang_name = self.LANGUAGE_NAMES.get(language, "English")
        lang_instruction = f"Respond in {lang_name}."

        return f"""You are an expert on Indian Standards (BIS) published by the Bureau of Indian Standards.

Answer the user's question using ONLY the provided standard excerpts. If the context doesn't contain the answer, say so clearly.

{lang_instruction}

IMPORTANT RULES:
1. Always cite the exact IS standard number and section/clause when referencing information
2. Use the format: [IS XXXX:YYYY, Section X.X] for citations
3. If information is not in the provided context, say "The provided context does not contain information about this topic"
4. Be precise with numbers, percentages, and technical specifications
5. Structure your answer clearly with Direct Answer, Supporting Details, and Citations
6. Translate technical terms accurately when responding in non-English languages

Context from BIS Standards:
{context}

User Question: {query}

Provide a clear, structured answer with source citations."""

    def _generate_ollama(self, query: str, context: str, language: str) -> str:
        """Generate using Ollama."""
        prompt = self._build_prompt(query, context, language)
        try:
            resp = httpx.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.ollama_model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.3, "num_predict": 2048}
                },
                timeout=60.0
            )
            if resp.status_code == 200:
                return resp.json().get("response", "")
        except Exception as e:
            logger.error(f"Ollama error: {e}")
        return self._generate_template(query, context, language)

    def _generate_gemini(self, query: str, context: str, language: str) -> str:
        """Generate using Gemini via REST API (avoids deprecated library issues)."""
        prompt = self._build_prompt(query, context, language)
        gemini_key = os.getenv("GEMINI_API_KEY")
        
        # Try REST API directly (more reliable than deprecated google.generativeai)
        for model_name in ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                data = {"contents": [{"parts": [{"text": prompt}]}]}
                resp = httpx.post(url, json=data, timeout=60.0)
                if resp.status_code == 200:
                    result = resp.json()
                    text = result["candidates"][0]["content"]["parts"][0]["text"]
                    if model_name != self.gemini_model.model_name if self.gemini_model else True:
                        logger.info(f"Using Gemini ({model_name})")
                    return text
                else:
                    logger.warning(f"Gemini {model_name} returned {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                logger.warning(f"Gemini {model_name} error: {e}")
                continue
        
        return self._generate_template(query, context, language)

    def _generate_template(self, query: str, context: str, language: str) -> str:
        """Template fallback when no LLM is available."""
        return f"""Based on the available BIS standard excerpts, here is the relevant information:

**Query:** {query}

**Context found:**
{context[:1500]}{'...' if len(context) > 1500 else ''}

*Note: Start Ollama (ollama serve) for AI-powered responses.*"""

    def extract_citations(self, response: str) -> list:
        """Extract IS citations from the response."""
        patterns = [
            r'\[IS\s+(\d+)(?::(\d{4}))?(?:,\s*Section\s+([\d.]+))?\]',
            r'IS\s+(\d+)(?::(\d{4}))?(?:\s*,?\s*(?:Clause|Section)\s+([\d.]+))',
        ]
        citations = []
        for pattern in patterns:
            for match in re.finditer(pattern, response):
                is_num = f"IS {match.group(1)}"
                if match.group(2):
                    is_num += f":{match.group(2)}"
                section = match.group(3) if match.lastindex >= 3 and match.group(3) else ""
                citations.append({"standard": is_num, "section": section})
        return citations

    def verify_citations(self, citations: list, retrieval_results: list) -> list:
        """Verify extracted citations against actual retrieved chunks.
        
        Returns list of citations with verified status:
        [{standard, section, verified: bool, reason: str}]
        """
        # Build set of retrieved IS numbers
        retrieved_is_numbers = set()
        for r in retrieval_results:
            is_num = r.chunk.is_number  # e.g., "IS 269:2015"
            is_base = is_num.split(":")[0] if ":" in is_num else is_num  # e.g., "IS 269"
            retrieved_is_numbers.add(is_base)
            retrieved_is_numbers.add(is_num)
        
        verified = []
        for c in citations:
            std = c.get("standard", "")
            section = c.get("section", "")
            
            # Check if this standard was in retrieved chunks
            is_verified = any(std in num or num in std for num in retrieved_is_numbers)
            
            # Check if section exists in any retrieved chunk (if specified)
            section_verified = True
            if section and is_verified:
                # Look for section in chunk text
                for r in retrieval_results:
                    is_match = std in r.chunk.is_number or r.chunk.is_number in std
                    if is_match and section in r.chunk.text:
                        section_verified = True
                        break
                else:
                    section_verified = False
            
            verified.append({
                "standard": std,
                "section": section,
                "verified": is_verified and section_verified,
                "reason": "Found in retrieved chunks" if (is_verified and section_verified) 
                          else "Standard not in retrieved chunks" if not is_verified
                          else f"Section {section} not found in text"
            })
        
        return verified

    def compute_confidence(
        self,
        response: str,
        retrieval_results: list,
        citations: list
    ) -> dict:
        """Compute verified confidence score based on actual retrieval data.
        
        Uses:
        1. Average FAISS similarity score from retrieved chunks
        2. Citation verification against chunk metadata
        3. Response quality indicators
        
        Returns dict with level (HIGH/MEDIUM/LOW), score (0-100), and details.
        """
        # 1. Compute average retrieval score (FAISS inner product, normalized)
        if retrieval_results:
            avg_score = sum(r.score for r in retrieval_results) / len(retrieval_results)
            top_score = max(r.score for r in retrieval_results)
        else:
            avg_score = 0.0
            top_score = 0.0
        
        # 2. Verify citations against actual retrieved chunks
        retrieved_is_numbers = set()
        for r in retrieval_results:
            # Extract IS number from chunk metadata
            is_num = r.chunk.is_number  # e.g., "IS 269:2015"
            is_base = is_num.split(":")[0] if ":" in is_num else is_num  # e.g., "IS 269"
            retrieved_is_numbers.add(is_base)
            retrieved_is_numbers.add(is_num)
        
        verified_citations = []
        unverified_citations = []
        for c in citations:
            std = c.get("standard", "")
            # Check if this standard was actually in retrieved chunks
            if any(std in num or num in std for num in retrieved_is_numbers):
                verified_citations.append(c)
            else:
                unverified_citations.append(c)
        
        # 3. Compute score components
        score = 0.0
        
        # Component 1: Retrieval quality (0-40 points)
        # FAISS inner product scores range from 0 to ~1 for normalized vectors
        retrieval_score = min(avg_score * 50, 40)  # Cap at 40
        score += retrieval_score
        
        # Component 2: Citation verification (0-30 points)
        if citations:
            verified_ratio = len(verified_citations) / len(citations) if citations else 0
            citation_score = verified_ratio * 30
        else:
            # No citations extracted - could be legitimate (no specific clause) or bad
            citation_score = 10 if avg_score > 0.3 else 5
        score += citation_score
        
        # Component 3: Response quality (0-30 points)
        quality_score = 0
        response_lower = response.lower()
        
        # Check for honest "no info" responses (boost for honesty)
        no_info_phrases = [
            "not contain information", "cannot find", "no information",
            "does not contain", "not available in the context",
            "not available", "no relevant"
        ]
        if any(phrase in response_lower for phrase in no_info_phrases):
            # Honest admission of ignorance - HIGH confidence in honesty
            quality_score = 25  # High for honest responses
        else:
            # Has a substantive answer
            if len(response) > 100:
                quality_score += 10  # Reasonable length
            if any(marker in response for marker in ["[IS", "Section", "Clause"]):
                quality_score += 10  # Has citations
            if avg_score > 0.4:
                quality_score += 10  # Strong retrieval match
        score += min(quality_score, 30)
        
        # 4. Determine level
        score = min(score, 100)
        if score >= 70:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"
        
        # 5. Build details for debugging/display
        details = {
            "retrieval_score": round(avg_score, 3),
            "top_chunk_score": round(top_score, 3),
            "chunks_found": len(retrieval_results),
            "citations_extracted": len(citations),
            "citations_verified": len(verified_citations),
            "citations_unverified": len(unverified_citations),
            "final_score": round(score, 1)
        }
        
        return {
            "level": level,
            "score": round(score, 1),
            "details": details
        }
