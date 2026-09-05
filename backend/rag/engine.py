"""
RAG Engine — FAISS-based vector store and retrieval.
Uses ONNX Runtime for embeddings (lightweight, no PyTorch needed).
"""
import os
import pickle
import logging
from pathlib import Path
from typing import List, Optional
from dataclasses import dataclass

import faiss
import numpy as np

from backend.ingestion.pipeline import TextChunk

logger = logging.getLogger(__name__)


class ONNXEmbedder:
    """Lightweight embedding model using ONNX Runtime (no PyTorch)."""

    def __init__(self, model_name: str = "Xenova/all-MiniLM-L6-v2"):
        from huggingface_hub import hf_hub_download
        import onnxruntime as ort
        from transformers import AutoTokenizer

        logger.info(f"Loading ONNX embedding model: {model_name}")

        # Download ONNX model and tokenizer
        onnx_path = hf_hub_download(repo_id=model_name, filename="onnx/model.onnx")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

        # Create ONNX session with CPU optimization
        sess_options = ort.SessionOptions()
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(onnx_path, sess_options, providers=["CPUExecutionProvider"])

        # Get model dimension (384 for MiniLM-L6)
        self.dimension = self.session.get_outputs()[0].shape[-1]
        logger.info(f"ONNX model loaded: dim={self.dimension}")

    def encode(self, texts: List[str], normalize: bool = True) -> np.ndarray:
        """Encode texts to embeddings."""
        if isinstance(texts, str):
            texts = [texts]

        all_embeddings = []
        batch_size = 32

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            encoded = self.tokenizer(
                batch, padding=True, truncation=True,
                max_length=128, return_tensors="np"
            )

            inputs = {
                "input_ids": encoded["input_ids"].astype(np.int64),
                "attention_mask": encoded["attention_mask"].astype(np.int64),
            }
            # Some ONNX models also require token_type_ids
            if "token_type_ids" in [inp.name for inp in self.session.get_inputs()]:
                inputs["token_type_ids"] = np.zeros_like(encoded["input_ids"], dtype=np.int64)

            outputs = self.session.run(None, inputs)

            # Mean pooling
            token_embeddings = outputs[0]  # (batch, seq_len, dim)
            attention_mask = encoded["attention_mask"]
            mask_expanded = np.expand_dims(attention_mask, -1)
            sum_embeddings = np.sum(token_embeddings * mask_expanded, axis=1)
            sum_mask = np.clip(mask_expanded.sum(axis=1), 1e-9, None)
            embeddings = sum_embeddings / sum_mask

            if normalize:
                norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
                embeddings = embeddings / np.clip(norms, 1e-9, None)

            all_embeddings.append(embeddings.astype(np.float32))

        return np.vstack(all_embeddings)


# Global embedder instance (loaded once)
_embedder: Optional[ONNXEmbedder] = None


def get_embedder() -> ONNXEmbedder:
    """Get or create the global ONNX embedder instance."""
    global _embedder
    if _embedder is None:
        _embedder = ONNXEmbedder()
    return _embedder


@dataclass
class RetrievalResult:
    """Result from vector search."""
    chunk: TextChunk
    score: float
    rank: int


class VectorStore:
    """FAISS-based vector store for BIS standard chunks."""

    def __init__(self, persist_dir: str = None, model_name: str = "Xenova/all-MiniLM-L6-v2"):
        if persist_dir is None:
            persist_dir = str(Path(__file__).parent.parent.parent / "data" / "chroma_db")
        self.persist_dir = Path(persist_dir)
        self.persist_dir.mkdir(parents=True, exist_ok=True)

        self.index_path = self.persist_dir / "faiss.index"
        self.metadata_path = self.persist_dir / "metadata.pkl"

        # Load ONNX embedding model (lightweight, no PyTorch)
        self.embedder = get_embedder()
        self.dimension = self.embedder.dimension

        self.index: Optional[faiss.Index] = None
        self.chunks: List[TextChunk] = []

        self._load_or_create()

    def _load_or_create(self):
        """Load existing index or create new one."""
        if self.index_path.exists() and self.metadata_path.exists():
            try:
                self.index = faiss.read_index(str(self.index_path))
                with open(self.metadata_path, "rb") as f:
                    self.chunks = pickle.load(f)
                logger.info(f"Loaded FAISS index: {self.index.ntotal} vectors, {len(self.chunks)} chunks")
                return
            except Exception as e:
                logger.warning(f"Failed to load index: {e}")

        self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine sim
        self.chunks = []

    def add_chunks(self, chunks: List[TextChunk]):
        """Add chunks to the vector store."""
        if not chunks:
            return

        texts = [c.text for c in chunks]
        embeddings = self.embedder.encode(texts, normalize=True)

        self.index.add(embeddings)
        self.chunks.extend(chunks)

        self._save()
        logger.info(f"Added {len(chunks)} chunks. Total: {self.index.ntotal}")

    def search(
        self,
        query: str,
        n_results: int = 5,
        filter_is_number: str = None
    ) -> List[RetrievalResult]:
        """Search for relevant chunks."""
        if self.index is None or self.index.ntotal == 0:
            return []

        query_embedding = self.embedder.encode([query], normalize=True)

        k = min(n_results * 2, self.index.ntotal) if filter_is_number else min(n_results, self.index.ntotal)
        scores, indices = self.index.search(query_embedding, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.chunks):
                continue
            chunk = self.chunks[idx]
            if filter_is_number and chunk.is_number != filter_is_number:
                continue
            results.append(RetrievalResult(
                chunk=chunk,
                score=float(score),
                rank=len(results) + 1
            ))
            if len(results) >= n_results:
                break

        return results

    def _save(self):
        """Persist index and metadata to disk."""
        faiss.write_index(self.index, str(self.index_path))
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.chunks, f)

    def get_available_standards(self) -> List[dict]:
        """Get list of unique indexed standards."""
        seen = {}
        for chunk in self.chunks:
            if chunk.is_number not in seen:
                seen[chunk.is_number] = {
                    "is_number": chunk.is_number,
                    "title": chunk.title,
                    "chunk_count": 0
                }
            seen[chunk.is_number]["chunk_count"] += 1
        return list(seen.values())


class RAGEngine:
    """Main RAG engine combining retrieval and context assembly."""

    def __init__(self):
        self.vector_store = VectorStore()
        self.max_context_chunks = 5
        self.min_relevance_score = 0.2

    def retrieve(self, query: str, n_results: int = 5, filter_is_number: str = None) -> List[RetrievalResult]:
        """Retrieve relevant chunks for a query.
        
        Uses hybrid approach:
        1. IS number detection — direct lookup when query contains "IS XXXX"
        2. Semantic search via FAISS for everything else
        """
        import re
        
        # Detect IS number in query (e.g., "IS 1786", "IS 1786:2008")
        is_match = re.search(r'IS\s+(\d{4,5})(?::(\d{4}))?', query, re.IGNORECASE)
        
        if is_match and not filter_is_number:
            # Query contains an IS number — direct lookup in chunks
            is_num = is_match.group(1)
            is_year = is_match.group(2)
            
            # Find all chunks matching this IS number
            matched_chunks = []
            for i, chunk in enumerate(self.vector_store.chunks):
                # Match IS number (e.g., "IS 1786" matches "IS 1786:2008")
                chunk_is = chunk.is_number
                if is_num in chunk_is:
                    matched_chunks.append(RetrievalResult(
                        chunk=chunk,
                        score=0.9,  # High score for direct match
                        rank=len(matched_chunks) + 1
                    ))
            
            if matched_chunks:
                logger.info(f"Direct IS lookup: Found {len(matched_chunks)} chunks for IS {is_num}")
                return matched_chunks[:n_results]
            else:
                # Fallback to semantic search if no direct match
                logger.info(f"No direct match for IS {is_num}, falling back to semantic search")
        
        # Standard semantic search
        results = self.vector_store.search(query, n_results=n_results, filter_is_number=filter_is_number)
        filtered_results = [r for r in results if r.score >= self.min_relevance_score]
        logger.info(f"Retrieved {len(filtered_results)} relevant chunks (from query: {query[:50]})")
        return filtered_results

    def assemble_context(self, results: List[RetrievalResult]) -> str:
        """Assemble context from retrieval results for LLM prompt."""
        if not results:
            return "No relevant standards found."

        context_parts = []
        for r in results[:self.max_context_chunks]:
            header = f"[{r.chunk.is_number} - {r.chunk.title}]"
            if r.chunk.section:
                header += f" ({r.chunk.section})"
            header += f" [Page {r.chunk.page}]"
            context_parts.append(f"{header}\n{r.chunk.text}")

        return "\n\n---\n\n".join(context_parts)

    def get_available_standards(self) -> List[dict]:
        """Get available indexed standards."""
        return self.vector_store.get_available_standards()
