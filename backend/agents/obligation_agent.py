# backend/agents/obligation_agent.py
"""
Obligation Extraction Agent

Extracts regulatory obligations from text sections using LLM.
"""

import json
import os
from typing import List
from uuid import UUID

from schemas.obligation import ObligationCreate

# Inline prompt (NO separate file needed)
OBLIGATION_PROMPT = """
You are an expert regulatory compliance assistant for Indian securities markets.

Given the following regulatory text section and its metadata, extract specific, actionable obligations.

Return a JSON array. Each element MUST have:
- actor (who must comply)
- section (sub-section number if available)
- obligation (clear, action-focused sentence)
- frequency (e.g., "Annual", "Monthly", "Within 1 day")
- deadline (e.g., "End of financial year", "Within 24 hours of incident")
- risk_level (Critical / High / Medium / Low)
- evidence (array of documents/proofs, e.g., ["Cyber Audit Report", "CEO Declaration"])

ONLY return JSON. No commentary.

Section text:
{section_text}

Metadata:
- Document: {document_title}
- Regulator: {regulator}
- Chunk ID: {chunk_id}
- Section: {section_label}
"""


def build_obligation_prompt(section_text: str, metadata: dict) -> str:
    """Build the obligation extraction prompt."""
    return OBLIGATION_PROMPT.format(
        section_text=section_text,
        document_title=metadata.get("document_title", ""),
        regulator=metadata.get("regulator", ""),
        chunk_id=metadata.get("chunk_id", ""),
        section_label=metadata.get("section_label", ""),
    )


def parse_obligations(json_str: str, metadata: dict) -> List[ObligationCreate]:
    """Parse LLM JSON response into list of ObligationCreate objects."""
    raw = json.loads(json_str)
    obligations: List[ObligationCreate] = []
    
    if not isinstance(raw, list):
        return []
    
    for item in raw:
        if not isinstance(item, dict):
            continue
            
        obligations.append(
            ObligationCreate(
                source_chunk_id=metadata.get("chunk_id"),
                document_id=metadata.get("document_id"),
                actor=item.get("actor", "Unknown"),
                section=item.get("section"),
                obligation=item.get("obligation", ""),
                frequency=item.get("frequency"),
                deadline=item.get("deadline"),
                risk_level=item.get("risk_level"),
                evidence=item.get("evidence") or [],
            )
        )
    return obligations


def call_llm(prompt: str, provider: str = "groq") -> str:
    """Call LLM API and return the response."""
    if provider == "groq":
        try:
            from groq import Groq
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            response = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=2000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return "[]"
    elif provider == "openai":
        try:
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=2000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return "[]"
    else:
        return "[]"


def extract_obligations_from_section(
    section_text: str,
    metadata: dict,
    use_llm: bool = False,
    llm_provider: str = "groq"
) -> List[ObligationCreate]:
    """
    Extract obligations from regulatory text section.
    
    Args:
        section_text: The regulatory text to analyze
        metadata: Dict with document_title, regulator, chunk_id, section_label, document_id
        use_llm: If True, call LLM. If False, return empty list
        llm_provider: "groq" or "openai"
    
    Returns:
        List of ObligationCreate objects
    """
    prompt = build_obligation_prompt(section_text, metadata)
    
    if use_llm:
        json_str = call_llm(prompt, provider=llm_provider)
    else:
        json_str = "[]"
    
    try:
        return parse_obligations(json_str, metadata)
    except json.JSONDecodeError:
        return []