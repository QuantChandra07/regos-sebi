# backend/agents/workflow_agent.py
"""
Workflow Generation Agent

Generates structured workflow tasks for compliance obligations.
"""

import json
import os
from typing import List
from uuid import UUID

from schemas.workflow import WorkflowResult, WorkflowTask

# Inline prompt (no external file)
WORKFLOW_PROMPT = """
You are an expert compliance workflow designer.

Given the following obligation, break it down into actionable workflow tasks.

Return a JSON array. Each element must have:
- order: integer (1, 2, 3...)
- title: short task title (5-10 words)
- description: detailed task description (1-2 sentences)

ONLY return JSON array. No commentary.

Obligation:
{obligation_text}

Actor: {actor}
Frequency: {frequency}
Deadline: {deadline}
"""


def build_workflow_prompt(
    obligation_text: str,
    actor: str,
    frequency: str,
    deadline: str,
) -> str:
    """Build the workflow generation prompt."""
    return WORKFLOW_PROMPT.format(
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
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return '''[
                {"order": 1, "title": "Assign Owner", "description": "Assign compliance owner for this obligation."},
                {"order": 2, "title": "Prepare Evidence", "description": "Gather required documents and reports."},
                {"order": 3, "title": "Upload Evidence", "description": "Upload documents to Evidence Vault."},
                {"order": 4, "title": "Review and Approve", "description": "Obtain internal approvals."}
            ]'''
    elif provider == "openai":
        try:
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return '''[
                {"order": 1, "title": "Assign Owner", "description": "Assign compliance owner for this obligation."},
                {"order": 2, "title": "Prepare Evidence", "description": "Gather required documents and reports."},
                {"order": 3, "title": "Upload Evidence", "description": "Upload documents to Evidence Vault."},
                {"order": 4, "title": "Review and Approve", "description": "Obtain internal approvals."}
            ]'''
    else:
        return '''[
            {"order": 1, "title": "Assign Owner", "description": "Assign compliance owner for this obligation."},
            {"order": 2, "title": "Prepare Evidence", "description": "Gather required documents and reports."},
            {"order": 3, "title": "Upload Evidence", "description": "Upload documents to Evidence Vault."},
            {"order": 4, "title": "Review and Approve", "description": "Obtain internal approvals."}
        ]'''


def parse_workflow_tasks(json_str: str) -> List[WorkflowTask]:
    """Parse LLM JSON response into list of WorkflowTask objects."""
    raw = json.loads(json_str)
    tasks: List[WorkflowTask] = []

    if not isinstance(raw, list):
        raise ValueError("LLM response must be a JSON array")

    for item in raw:
        if not isinstance(item, dict):
            continue
        tasks.append(
            WorkflowTask(
                order=item.get("order", len(tasks) + 1),
                title=item.get("title", "Task"),
                description=item.get("description", ""),
            )
        )

    tasks.sort(key=lambda t: t.order)
    return tasks


def _to_uuid(obligation_id: str) -> UUID:
    """Convert any string to a valid UUID for schema compatibility."""
    try:
        return UUID(obligation_id)
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000001")


def generate_workflow_for_obligation(
    obligation_text: str,
    obligation_id: str,
    actor: str = "Unknown",
    frequency: str = None,
    deadline: str = None,
    use_llm: bool = False,
    llm_provider: str = "groq",
) -> WorkflowResult:
    """Generate workflow tasks for an obligation using LLM."""
    prompt = build_workflow_prompt(obligation_text, actor, frequency, deadline)

    if use_llm:
        json_str = call_llm(prompt, provider=llm_provider)
    else:
        json_str = '''[
            {"order": 1, "title": "Assign Owner", "description": "Assign compliance owner for this obligation."},
            {"order": 2, "title": "Prepare Evidence", "description": "Gather required documents and reports."},
            {"order": 3, "title": "Upload Evidence", "description": "Upload documents to Evidence Vault."},
            {"order": 4, "title": "Review and Approve", "description": "Obtain internal approvals."}
        ]'''

    try:
        tasks = parse_workflow_tasks(json_str)
        ob_uuid = _to_uuid(obligation_id)
        return WorkflowResult(obligation_id=ob_uuid, tasks=tasks)
    except (json.JSONDecodeError, ValueError):
        return generate_workflow_simple(obligation_text, obligation_id)


def generate_workflow_simple(obligation_text: str, obligation_id: str) -> WorkflowResult:
    """
    Simplified version without LLM - uses predefined workflow templates.
    """
    tasks = [
        WorkflowTask(
            order=1,
            title="Assign Owner",
            description="Assign a compliance owner responsible for this obligation.",
        ),
        WorkflowTask(
            order=2,
            title="Document Requirements",
            description="Identify and document all requirements for compliance.",
        ),
        WorkflowTask(
            order=3,
            title="Gather Evidence",
            description="Collect all necessary documents and evidence.",
        ),
        WorkflowTask(
            order=4,
            title="Implement Process",
            description="Set up processes and controls to meet the obligation.",
        ),
        WorkflowTask(
            order=5,
            title="Review and Approve",
            description="Obtain necessary internal approvals and sign-offs.",
        ),
        WorkflowTask(
            order=6,
            title="Monitor Compliance",
            description="Continuously monitor and ensure ongoing compliance.",
        ),
    ]

    ob_uuid = _to_uuid(obligation_id)
    return WorkflowResult(obligation_id=ob_uuid, tasks=tasks)