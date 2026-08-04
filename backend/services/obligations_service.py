# services/obligations_service.py
from typing import Any, Dict, List, Optional
from backend.data.parsed.chunks import get_chunk_by_id
import sys
import os

# Add parent directory to path to import agents
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import your AgentRouter
# Adjust the import path based on your actual structure
try:
    from agents.agent_router import AgentRouter
    agent_router = AgentRouter()
    AGENT_AVAILABLE = True
except ImportError:
    agent_router = None
    AGENT_AVAILABLE = False
    print("⚠️  AgentRouter not found. Obligations extraction will not work.")


class ObligationExtractionError(Exception):
    """Custom exception for obligation extraction errors."""
    pass


def run_obligation_pipeline_for_chunk(chunk_id: str) -> Dict[str, Any]:
    """
    Run the obligations extraction pipeline for a single chunk.
    
    Args:
        chunk_id: The ID of the chunk to process
        
    Returns:
        Dict containing chunk metadata and extracted obligations
        
    Raises:
        ObligationExtractionError: If extraction fails
        ValueError: If chunk not found
    """
    if not AGENT_AVAILABLE:
        raise ObligationExtractionError(
            "AgentRouter not available. Cannot extract obligations."
        )
    
    # Step 1: Fetch the chunk
    chunk = get_chunk_by_id(chunk_id)
    
    # Step 2: Prepare metadata for the agent
    section_text = chunk.text
    metadata = {
        "chunk_id": chunk.id,
        "section_label": chunk.section,
        "document_title": chunk.document_title,
        "regulator": chunk.regulator,
        "document_id": chunk.document_id,
        "page_start": chunk.page_start,
        "page_end": chunk.page_end,
        "category": chunk.category,
    }
    
    # Step 3: Call the agent pipeline
    try:
        result = agent_router.process_section(section_text, metadata)
    except Exception as e:
        raise ObligationExtractionError(
            f"Agent processing failed for chunk {chunk_id}: {str(e)}"
        )
    
    # Step 4: Normalize the result
    # Adjust this based on what process_section actually returns
    obligations = result
    if hasattr(result, 'obligations'):
        obligations = result.obligations
    elif hasattr(result, 'model_dump'):
        obligations = result.model_dump()
    elif hasattr(result, 'dict'):
        obligations = result.dict()
    
    return {
        "chunk_id": chunk.id,
        "section_label": chunk.section,
        "document_title": chunk.document_title,
        "regulator": chunk.regulator,
        "page_start": chunk.page_start,
        "page_end": chunk.page_end,
        "obligations": obligations,
    }


def run_obligation_pipeline_for_multiple_chunks(
    chunk_ids: List[str],
) -> List[Dict[str, Any]]:
    """
    Run obligation extraction for multiple chunks.
    
    Args:
        chunk_ids: List of chunk IDs to process
        
    Returns:
        List of results for each chunk
    """
    results = []
    errors = []
    
    for chunk_id in chunk_ids:
        try:
            result = run_obligation_pipeline_for_chunk(chunk_id)
            results.append(result)
        except Exception as e:
            errors.append({
                "chunk_id": chunk_id,
                "error": str(e)
            })
    
    return {
        "results": results,
        "errors": errors,
    }