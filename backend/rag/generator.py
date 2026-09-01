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

        # Try Gemini
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                self.llm_provider = "gemini"
                self.gemini_model = genai.GenerativeModel("gemini-2.0-flash")
                logger.info("Using Gemini 2.0 Flash")
                return
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

    def _build_prompt(self, query: str, context: str, language: str) -> str:
        """Build the system prompt for the LLM."""
        lang_instruction = "Respond in Hindi." if language == "hi" else "Respond in English."

        return f"""You are an expert on Indian Standards (BIS) published by the Bureau of Indian Standards.

Answer the user's question using ONLY the provided standard excerpts. If the context doesn't contain the answer, say so clearly.

{lang_instruction}

IMPORTANT RULES:
1. Always cite the exact IS standard number and section/clause when referencing information
2. Use the format: [IS XXXX:YYYY, Section X.X] for citations
3. If information is not in the provided context, say "The provided context does not contain information about this topic"
4. Be precise with numbers, percentages, and technical specifications
5. Structure your answer clearly with Direct Answer, Supporting Details, and Citations

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
        """Generate using Gemini."""
        prompt = self._build_prompt(query, context, language)
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini error: {e}")
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

    def extract_confidence(self, response: str, context: str) -> str:
        """Extract confidence level from response."""
        if any(phrase in response.lower() for phrase in [
            "not contain information", "cannot find", "no information",
            "does not contain", "not available in the context"
        ]):
            return "LOW"
        if len(context) > 500 and any(
            marker in response for marker in ["[IS", "Section", "Clause"]
        ):
            return "HIGH"
        return "MEDIUM"
