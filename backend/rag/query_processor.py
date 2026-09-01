"""
Query Processor — Handles language detection and translation.
"""
import logging
from typing import Tuple

from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator

# Make langdetect deterministic
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)


class QueryProcessor:
    """Processes user queries: detects language, translates if needed."""

    def __init__(self):
        self.supported_languages = {"en", "hi"}
        self.translator = GoogleTranslator(source="auto", target="en")

    def detect_language(self, text: str) -> str:
        """Detect the language of the input text."""
        try:
            lang = detect(text)
            return lang
        except Exception as e:
            logger.warning(f"Language detection failed: {e}")
            return "en"

    def translate_to_english(self, text: str) -> str:
        """Translate text to English if it's not already."""
        lang = self.detect_language(text)

        if lang == "en":
            return text

        try:
            translated = GoogleTranslator(source="hi", target="en").translate(text)
            logger.info(f"Translated from Hindi: '{text[:50]}...' -> '{translated[:50]}...'")
            return translated
        except Exception as e:
            logger.warning(f"Translation failed: {e}")
            return text

    def process_query(self, query: str) -> Tuple[str, str, str]:
        """
        Process a query: detect language, translate if needed.
        Returns: (original_query, processed_query, detected_language)
        """
        lang = self.detect_language(query)

        if lang == "hi":
            processed = self.translate_to_english(query)
            return query, processed, "hi"
        else:
            return query, query, "en"
