from __future__ import annotations

import json
import re
from typing import Any, Dict, List

from backend.app.services.rag_llm import chat_with_context


OBLIGATION_SYSTEM_PROMPT = """You are a SEBI compliance analyst. Extract EVERY distinct regulatory obligation
from the given text. Return ONLY a valid JSON array, with no explanation, no markdown formatting, no code fences.

Each obligation object must have exactly these fields:
- "actor": who must comply (e.g. "Stock Broker", "Investment Adviser")
- "section": the exact section/sub-section number referenced (e.g. "61.54")
- "obligation": short description of the required action
- "frequency": how often it must be done (e.g. "Annual", "Half-yearly", "One-time", "Within 6 hours", "Not specified")
- "deadline": specific deadline or trigger condition, if mentioned (else "Not specified")
- "evidence": document/report/proof required, if mentioned (else "Not specified")
- "risk_level": one of "Critical", "High", "Medium", "Low" based on regulatory severity/urgency language

If the text contains no obligations (e.g. it is only a definition or heading), return an empty array: []
"""


def _extract_json_array(raw: str) -> List[Dict[str, Any]]:
    raw = raw.strip()
    # Strip markdown code fences if present
    raw = re.sub(r"^```(json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()

    try:
        data = json.loads(raw)
        if isinstance(data, list):
            return data
        return []
    except json.JSONDecodeError:
        # Try to locate the first [...] block
        match = re.search(r"\[.*\]", raw, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(0))
                if isinstance(data, list):
                    return data
            except json.JSONDecodeError:
                pass
        return []


async def extract_obligations(chunk_text: str, chunk_metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
    if not chunk_text or len(chunk_text.strip()) < 20:
        return []

    user_prompt = (
        f"Regulatory text:\n\n{chunk_text}\n\n"
        f"Extract all obligations as a JSON array following the schema exactly."
    )

    raw = await chat_with_context(
        system_prompt=OBLIGATION_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        context_chunks=[],  # text is already inside user_prompt
        temperature=0.0,
    )

    obligations = _extract_json_array(raw)

    for ob in obligations:
        ob["source_chunk_id"] = chunk_metadata.get("chunk_id")
        ob["document_id"] = chunk_metadata.get("document_id")
        ob["document_name"] = chunk_metadata.get("document_name") or chunk_metadata.get("document_id")
        ob["page_start"] = chunk_metadata.get("page_start")
        ob["page_end"] = chunk_metadata.get("page_end")

    return obligations


