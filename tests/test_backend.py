"""Unit tests for BIS Standards AI Assistant backend."""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from backend.rag.query_processor import QueryProcessor
from backend.rag.generator import LLMGenerator


class TestQueryProcessor:
    """Tests for language detection and translation."""

    def setup_method(self):
        self.processor = QueryProcessor()

    def test_english_query_unchanged(self):
        """English queries should pass through without translation."""
        query = "What is the tensile strength of Fe 500?"
        original, processed, lang = self.processor.process_query(query)
        assert original == query
        assert processed == query
        assert lang == "en"

    def test_hindi_query_detected(self):
        """Hindi query should be detected and translated."""
        query = "\u0938\u0940\u092e\u0947\u0902\u091f \u092e\u0947\u0902 \u0915\u094d\u0932\u094b\u0930\u093e\u0907\u0921 \u0915\u093f\u0924\u0928\u093e?"
        original, processed, lang = self.processor.process_query(query)
        assert original == query
        assert lang == "hi"
        assert len(processed) > 0  # Should be translated

    def test_supported_languages_count(self):
        """Should support at least 18 Indian languages."""
        assert len(self.processor.supported_languages) >= 18

    def test_detector_is_deterministic(self):
        """Language detection should be deterministic."""
        query = "\u0938\u0940\u092e\u0947\u0902\u091f \u092e\u0947\u0902 \u0915\u094d\u0932\u094b\u0930\u093e\u0907\u0921?"
        lang1 = self.processor.detect_language(query)
        lang2 = self.processor.detect_language(query)
        assert lang1 == lang2


class TestLLMGenerator:
    """Tests for LLM detection and response generation."""

    def setup_method(self):
        self.generator = LLMGenerator()

    def test_template_fallback(self):
        """Should generate template response when no LLM available."""
        response = self.generator.generate(
            query="test query",
            context="test context",
            language="en"
        )
        assert len(response) > 0
        assert "test query" in response

    def test_citation_extraction(self):
        """Should extract citations from response text."""
        response = "As per [IS 269:2015, Section 5.3], the chloride content..."
        citations = self.generator.extract_citations(response)
        assert len(citations) >= 1
        assert citations[0]["standard"] == "IS 269:2015"

    def test_citation_extraction_no_citations(self):
        """Should return empty list when no citations found."""
        response = "This is a response without any citations."
        citations = self.generator.extract_citations(response)
        assert len(citations) == 0

    def test_confidence_computation(self):
        """Should compute confidence based on real data."""
        # Create mock retrieval results
        from backend.rag.engine import RetrievalResult
        from backend.ingestion.pipeline import TextChunk

        chunk = TextChunk(
            text="Test chunk",
            is_number="IS 269:2015",
            title="Test Standard",
            section="Section 5",
            page=1
        )
        results = [RetrievalResult(chunk=chunk, score=0.7, rank=1)]
        citations = [{"standard": "IS 269:2015", "section": "5"}]

        confidence = self.generator.compute_confidence(
            "Response with [IS 269:2015, Section 5]",
            results,
            citations
        )
        assert "level" in confidence
        assert confidence["level"] in ["HIGH", "MEDIUM", "LOW"]
        assert confidence["score"] > 0

    def test_citation_verification(self):
        """Should verify citations against retrieved chunks."""
        from backend.rag.engine import RetrievalResult
        from backend.ingestion.pipeline import TextChunk
    
        chunk = TextChunk(
            text="As per IS 269:2015 Section 5.3, the chloride limit...",
            is_number="IS 269:2015",
            title="Test Standard",
            section="Section 5",
            page=1
        )
        results = [RetrievalResult(chunk=chunk, score=0.7, rank=1)]

        # Test verified citation (section exists in text)
        citations = [{"standard": "IS 269:2015", "section": "5.3"}]
        verification = self.generator.verify_citations(citations, results)
        assert verification[0]["verified"] is True

        # Test unverified citation (wrong standard)
        citations_fake = [{"standard": "IS 9999:2020", "section": "1"}]
        verification_fake = self.generator.verify_citations(citations_fake, results)
        assert verification_fake[0]["verified"] is False


class TestAPIHealth:
    """Tests for API health endpoint."""

    def test_health_endpoint(self):
        """Health endpoint should return valid response."""
        from fastapi.testclient import TestClient
        from backend.api.main import app

        client = TestClient(app)
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert data["indexed_chunks"] > 0
        assert data["standards"] > 0

    def test_standards_endpoint(self):
        """Standards endpoint should return list."""
        from fastapi.testclient import TestClient
        from backend.api.main import app

        client = TestClient(app)
        resp = client.get("/api/standards")
        assert resp.status_code == 200
        data = resp.json()
        assert "standards" in data
        assert len(data["standards"]) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
