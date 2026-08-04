# backend/agents/gap_agent.py
"""
Gap Analysis Agent

Performs gap analysis between existing compliance records and required obligations.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any
import re
from uuid import UUID

from schemas.gap import GapAnalysisResult, GapStatus, GapStatusType


def _to_uuid(obligation_id: str) -> UUID:
    """Convert any string to a valid UUID for schema compatibility."""
    try:
        return UUID(obligation_id)
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000001")


def run_gap_analysis(
    existing_records: List[Dict[str, Any]],
    obligations: List[Dict[str, Any]]
) -> GapAnalysisResult:
    """
    Perform gap analysis between existing compliance records and required obligations.

    Args:
        existing_records: List of existing compliance records from DB
            Each record should have: {"obligation_id": str, "status": str}
        obligations: List of obligations to check against
            Each obligation should have: {"id": str, ...}

    Returns:
        GapAnalysisResult with list of GapStatus items
    """
    existing_map = {
        record.get("obligation_id"): record
        for record in existing_records
    }

    items: List[GapStatus] = []

    for ob in obligations:
        ob_id = ob.get("id")
        existing = existing_map.get(ob_id)

        if existing is None:
            status: GapStatusType = "Missing"
        elif existing.get("status") == "Completed":
            status = "Completed"
        elif existing.get("status") == "Overdue":
            status = "Overdue"
        elif existing.get("status") == "Not Applicable":
            status = "Not Applicable"
        else:
            status = "Missing"

        items.append(
            GapStatus(
                obligation_id=_to_uuid(ob_id),
                status=status,
            )
        )

    return GapAnalysisResult(items=items)


def _extract_days_from_deadline(deadline_str: str) -> int | None:
    """
    Extract number of days from relative deadline strings.

    Examples:
        "within 30 days" -> 30
        "within 24 hours" -> 1
        "within 1 week" -> 7
    """
    match = re.search(r'within\s+(\d+)\s*(day|hour|week|month)', deadline_str.lower())
    if match:
        value = int(match.group(1))
        unit = match.group(2)

        if unit == "hour":
            return value // 24
        elif unit == "week":
            return value * 7
        elif unit == "month":
            return value * 30
        else:
            return value
    return None


def run_gap_analysis_with_deadlines(
    existing_records: List[Dict[str, Any]],
    obligations: List[Dict[str, Any]]
) -> GapAnalysisResult:
    """
    Enhanced gap analysis that considers deadlines for overdue detection.

    Args:
        existing_records: List of existing compliance records from DB
        obligations: List of obligations to check against

    Returns:
        GapAnalysisResult with list of GapStatus items
    """
    existing_map = {
        record.get("obligation_id"): record
        for record in existing_records
    }

    items: List[GapStatus] = []
    today = datetime.utcnow().date()

    for ob in obligations:
        ob_id = ob.get("id")
        deadline_str = ob.get("deadline")
        existing = existing_map.get(ob_id)

        if existing and existing.get("status") == "Completed":
            status: GapStatusType = "Completed"
        elif existing and existing.get("status") == "Not Applicable":
            status = "Not Applicable"
        elif deadline_str:
            try:
                if "within" in deadline_str.lower():
                    days = _extract_days_from_deadline(deadline_str)
                    if days is not None and days < 0:
                        status = "Overdue"
                    else:
                        status = "Missing"
                else:
                    deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
                    if deadline < today:
                        status = "Overdue"
                    else:
                        status = "Missing"
            except (ValueError, TypeError):
                status = "Missing"
        else:
            status = "Missing"

        items.append(
            GapStatus(
                obligation_id=_to_uuid(ob_id),
                status=status,
            )
        )

    return GapAnalysisResult(items=items)


def get_gap_summary(gap_result: GapAnalysisResult) -> Dict[str, int]:
    """
    Get a summary count of each gap status.

    Args:
        gap_result: Result from run_gap_analysis

    Returns:
        Dict with counts: {"Missing": 5, "Overdue": 2, "Completed": 10, "Not Applicable": 1}
    """
    summary = {
        "Missing": 0,
        "Overdue": 0,
        "Completed": 0,
        "Not Applicable": 0,
    }

    for item in gap_result.items:
        if item.status in summary:
            summary[item.status] += 1

    return summary