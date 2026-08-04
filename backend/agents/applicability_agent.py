# backend/agents/applicability_agent.py
"""
Applicability Agent

Determines which actors (roles/parties) a regulatory obligation applies to.
"""

import json
import os
from typing import List

from schemas.applicability import ApplicabilityResult

# Inline prompt (no external file)
APPLICABILITY_PROMPT = """
You are an expert regulatory compliance assistant for Indian securities markets.

Given the following regulatory text section, identify which actors (roles/parties) this obligation applies to.

Return a JSON array of strings. Each string is an actor/role.

Examples of actors:
- "Stock Broker"
- "Clearing Member"
- "Depository Participant"
- "Merchant Banker"
- "Portfolio Manager"
- "Trustee"
- "Custodian"

ONLY return JSON array. No commentary.

Section text:
{section_text}
"""


def build_applicability_prompt(section_text: str) -> str:
    """Build the applicability prompt string."""
    return APPLICABILITY_PROMPT.format(section_text=section_text)


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
            return '["Stock Broker", "Clearing Member"]'
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
            return '["Stock Broker", "Clearing Member"]'
    else:
        return '["Stock Broker", "Clearing Member"]'


def get_applicability(
    section_text: str,
    metadata: dict | None = None,
    use_llm: bool = False,
    llm_provider: str = "groq",
) -> ApplicabilityResult:
    """
    Determine which actors (roles/parties) this obligation applies to.

    Args:
        section_text: The regulatory text to analyze.
        metadata: Unused for now (kept for future extension).
        use_llm: If True, call LLM. If False, return a stub list.
        llm_provider: "groq" or "openai".

    Returns:
        ApplicabilityResult with list of actors.
    """
    prompt = build_applicability_prompt(section_text)

    if use_llm:
        json_str = call_llm(prompt, provider=llm_provider)
    else:
        # Simple stub for testing without LLM
        json_str = '["Stock Broker", "Clearing Member"]'

    try:
        actors = json.loads(json_str)
        if not isinstance(actors, list):
            actors = ["Unknown Actor"]
        return ApplicabilityResult(actors=actors)
    except json.JSONDecodeError:
        return ApplicabilityResult(actors=["Unknown Actor"])