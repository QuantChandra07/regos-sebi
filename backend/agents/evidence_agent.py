# backend/agents/evidence_agent.py
"""
Evidence Suggestion Agent

Suggests evidence/documents needed to prove compliance with obligations.
"""

import json
import os
from typing import List
from uuid import UUID

from schemas.evidence import EvidenceResult

# Inline prompt (no external file)
EVIDENCE_PROMPT = """
You are an expert compliance documentation specialist.

Given the following obligation, suggest what evidence/documents would be needed to prove compliance.

Return a JSON array of strings. Each string is a document/evidence type.

Examples:
- "Compliance Certificate"
- "Internal Audit Report"
- "Board Resolution"
- "Transaction Logs"
- "Risk Assessment Report"
- "CEO/CFO Declaration"

ONLY return JSON array. No commentary.

Obligation:
{obligation_text}

Actor: {actor}
"""


def build_evidence_prompt(obligation_text: str, actor: str) -> str:
    """Build the evidence suggestion prompt."""
    return EVIDENCE_PROMPT.format(
        obligation_text=obligation_text,
        actor=actor,
    )


def call_llm(prompt: str, provider: str = "groq") -> str:
    """Call LLM API and return the raw JSON string."""
    if provider == "groq":
        try:
            from groq import Groq
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            response = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return '["Compliance Certificate", "Internal Audit Report"]'
    elif provider == "openai":
        try:
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return '["Compliance Certificate", "Internal Audit Report"]'
    else:
        return '["Compliance Certificate", "Internal Audit Report"]'


def _to_uuid(obligation_id: str) -> UUID:
    """Convert any string to a valid UUID for schema compatibility."""
    try:
        return UUID(obligation_id)
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000001")


def suggest_evidence_for_obligation(
    obligation_text: str,
    obligation_id: str,
    actor: str = "Unknown",
    use_llm: bool = False,
    llm_provider: str = "groq",
) -> EvidenceResult:
    """
    Suggest evidence/documents needed to prove compliance.
    """
    prompt = build_evidence_prompt(obligation_text, actor)

    if use_llm:
        json_str = call_llm(prompt, provider=llm_provider)
    else:
        json_str = '["Compliance Certificate", "Internal Audit Report"]'

    try:
        evidence = json.loads(json_str)
        if not isinstance(evidence, list):
            evidence = ["Supporting Documentation"]
        ob_uuid = _to_uuid(obligation_id)
        return EvidenceResult(obligation_id=ob_uuid, evidence=evidence)
    except json.JSONDecodeError:
        ob_uuid = _to_uuid(obligation_id)
        return EvidenceResult(obligation_id=ob_uuid, evidence=["Supporting Documentation"])


def suggest_evidence_simple(obligation_text: str, obligation_id: str) -> EvidenceResult:
    """
    Simplified version without LLM - uses predefined evidence templates.
    """
    text_lower = obligation_text.lower()

    evidence_map = {
        "audit": [
            "Internal Audit Report",
            "External Auditor Certificate",
            "Audit Trail Logs",
        ],
        "report": [
            "Compliance Report",
            "Board Presentation",
            "Regulatory Filing Receipt",
        ],
        "disclose": [
            "Disclosure Document",
            "Public Notice",
            "Website Publication",
        ],
        "maintain": [
            "Record Log",
            "Database Backup",
            "Document Register",
        ],
        "appoint": [
            "Appointment Letter",
            "Board Resolution",
            "SEBI Registration Certificate",
        ],
        "certify": [
            "Compliance Certificate",
            "CEO/CFO Declaration",
            "Third-party Certification",
        ],
        "file": [
            "Filing Receipt",
            "Acknowledgement Letter",
            "Submission Confirmation",
        ],
    }

    evidence = []
    for keyword, evidence_list in evidence_map.items():
        if keyword in text_lower:
            evidence.extend(evidence_list)
            break

    if not evidence:
        evidence = [
            "Compliance Certificate",
            "Internal Memo",
            "Supporting Documentation",
        ]

    ob_uuid = _to_uuid(obligation_id)
    return EvidenceResult(obligation_id=ob_uuid, evidence=evidence)