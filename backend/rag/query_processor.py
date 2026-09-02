"""
Query Processor — Handles language detection and translation.
Supports 22 Indian languages via deep-translator auto-detect.
"""
import logging
from typing import Tuple

from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator

# Make langdetect deterministic
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)

# All Indian languages supported by deep-translator (ISO 639-1 codes)
INDIAN_LANGUAGES = {
    "hi": "Hindi",
    "bn": "Bengali",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "gu": "Gujarati",
    "ur": "Urdu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "or": "Odia",
    "as": "Assamese",
    "ne": "Nepali",
    "sa": "Sanskrit",
    "sd": "Sindhi",
    "doi": "Dogri",
    "gom": "Konkani",
    "mai": "Maithili",
}


class QueryProcessor:
    """Processes user queries: detects language, translates if needed."""

    def __init__(self):
        self.supported_languages = set(INDIAN_LANGUAGES.keys()) | {"en"}
        # Auto-detect source language, always translate to English
        self.translator = GoogleTranslator(source="auto", target="en")

    def detect_language(self, text: str) -> str:
        """Detect the language of the input text.
        
        Uses langdetect with a fallback strategy:
        1. Try langdetect
        2. If result is not in our supported set, return 'en' (let translation auto-detect)
        """
        try:
            lang = detect(text)
            # If langdetect returns an unsupported code, fall back to auto-detect in translation
            if lang not in self.supported_languages:
                logger.info(f"langdetect returned '{lang}' (unsupported), using auto-detect in translation")
                return "auto"
            return lang
        except Exception as e:
            logger.warning(f"Language detection failed: {e}")
            return "auto"

    def translate_to_english(self, text: str, source_lang: str = "auto") -> str:
        """Translate text to English using auto-detect for source language.
        
        Args:
            text: Text to translate
            source_lang: Source language code, or 'auto' for auto-detection
        """
        if source_lang == "en":
            return text

        try:
            # Use auto-detect if source_lang is 'auto' or not recognized
            src = source_lang if source_lang in self.supported_languages else "auto"
            translated = GoogleTranslator(source=src, target="en").translate(text)
            if translated:
                logger.info(f"Translated ({src}): '{text[:50]}...' -> '{translated[:50]}...'")
                return translated
            else:
                logger.warning(f"Translation returned empty for source={src}")
                return text
        except Exception as e:
            logger.warning(f"Translation failed (source={source_lang}): {e}")
            # Retry with auto-detect if specific language failed
            if source_lang != "auto":
                try:
                    translated = GoogleTranslator(source="auto", target="en").translate(text)
                    if translated:
                        logger.info(f"Retry with auto-detect succeeded")
                        return translated
                except Exception:
                    pass
            return text

    def process_query(self, query: str) -> Tuple[str, str, str]:
        """
        Process a query: detect language, translate if needed.
        
        Supports all 22 Indian languages + English.
        Non-English queries are auto-translated to English for the RAG pipeline.
        
        Returns: (original_query, processed_query, detected_language)
        """
        lang = self.detect_language(query)

        if lang == "en":
            # Already English, no translation needed
            return query, query, "en"
        elif lang == "auto":
            # langdetect was uncertain — let translation auto-detect
            processed = self.translate_to_english(query, source_lang="auto")
            # Return 'hi' as default for non-English (frontend uses this for response language)
            return query, processed, "hi"
        else:
            # Indian language detected (hi, bn, ta, te, mr, gu, ur, kn, ml, pa, etc.)
            processed = self.translate_to_english(query, source_lang=lang)
            return query, processed, lang
