# backend/agents/risk_agent.py
"""
Risk Assessment Agent

Assesses the risk level of regulatory obligations using LLM or heuristics.
"""

import json
import os
from typing import Optional
from uuid import UUID

from schemas.risk import RiskResult

# Inline prompt (no external file)
RISK_PROMPT = """
You are an expert regulatory compliance risk assessor.

Given the following obligation, assess its risk level based on:
- Potential financial impact
- Regulatory penalty severity
- Reputational damage
- Frequency of violation

Return a JSON object with:
- risk_level: "Critical" | "High" | "Medium" | "Low"
- reasoning: brief explanation

ONLY return JSON. No commentary.

Obligation:
{obligation_text}

Metadata:
- Actor: {actor}
- Frequency: {frequency}
- Deadline: {deadline}
"""


def build_risk_prompt(
    obligation_text: str,
    actor: str = "Unknown",
    frequency: Optional[str] = None,
    deadline: Optional[str] = None,
) -> str:
    """Build the risk assessment prompt."""
    return RISK_PROMPT.format(
        obligation_text=obligation_text,
        actor=actor,
        frequency=frequency or "Not specified",
        deadline=deadline or "Not specified",
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
                max_tokens=300,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return '{"risk_level": "Medium", "reasoning": "LLM unavailable"}'
    elif provider == "openai":
        try:
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=300,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return '{"risk_level": "Medium", "reasoning": "LLM unavailable"}'
    else:
        return '{"risk_level": "Medium", "reasoning": "Unknown provider"}'


def _to_uuid(obligation_id: str) -> UUID:
    """Convert any string to a valid UUID for schema compatibility."""
    try:
        return UUID(obligation_id)
    except ValueError:
        # Fallback to a fixed dummy UUID for tests / non-UUID strings
        return UUID("00000000-0000-0000-0000-000000000001")


def assess_risk_for_obligation(
    obligation_text: str,
    obligation_id: str,
    actor: str = "Unknown",
    frequency: Optional[str] = None,
    deadline: Optional[str] = None,
    use_llm: bool = False,
    llm_provider: str = "groq",
) -> RiskResult:
    """
    Assess the risk level of an obligation using LLM.
    """
    if use_llm:
        prompt = build_risk_prompt(obligation_text, actor, frequency, deadline)
        json_str = call_llm(prompt, provider=llm_provider)

        try:
            result = json.loads(json_str)
            risk_level = result.get("risk_level", "Medium")

            allowed = ["Critical", "High", "Medium", "Low"]
            if risk_level not in allowed:
                risk_level = "Medium"

            ob_uuid = _to_uuid(obligation_id)
            return RiskResult(obligation_id=ob_uuid, risk_level=risk_level)
        except (json.JSONDecodeError, KeyError):
            ob_uuid = _to_uuid(obligation_id)
            return RiskResult(obligation_id=ob_uuid, risk_level="Medium")
    else:
        return assess_risk_simple(obligation_text, obligation_id)


ALLOWED_RISK_LEVELS = ["Critical", "High", "Medium", "Low"]


def assess_risk_simple(obligation_text: str, obligation_id: str) -> RiskResult:
    """
    Simplified risk assessment using keyword matching heuristics.
    """
    text_lower = obligation_text.lower()

    risk_patterns = {
        "Critical": [
            "immediate",
            "within 24 hours",
            "real-time",
            "instant",
            "critical",
            "emergency",
            "within 1 hour",
            "without delay",
        ],
        "High": [
            "annual",
            "quarterly",
            "board",
            "audit",
            "penalty",
            "material",
            "significant",
            "within 7 days",
            "within 15 days",
        ],
        "Medium": [
            "monthly",
            "periodic",
            "report",
            "disclose",
            "notify",
            "within 30 days",
            "regular",
            "routine filing",
        ],
        "Low": [
            "daily",
            "routine",
            "administrative",
            "record",
            "maintain",
            "within 60 days",
            "within 90 days",
            "as needed",
        ],
    }

    for level, keywords in risk_patterns.items():
        if any(keyword in text_lower for keyword in keywords):
            ob_uuid = _to_uuid(obligation_id)
            return RiskResult(obligation_id=ob_uuid, risk_level=level)

    ob_uuid = _to_uuid(obligation_id)
    return RiskResult(obligation_id=ob_uuid, risk_level="Medium")