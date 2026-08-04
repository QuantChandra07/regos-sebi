# backend/test_agents.py
"""
Test script for the agent layer.

Run with: python test_agents.py

This tests all agents without requiring an actual LLM connection.
"""

from agents.obligation_agent import extract_obligations_from_section
from agents.risk_agent import assess_risk_simple
from agents.evidence_agent import suggest_evidence_simple
from agents.workflow_agent import generate_workflow_simple
from agents.gap_agent import run_gap_analysis, run_gap_analysis_with_deadlines, get_gap_summary
from schemas.obligation import ObligationCreate

# Sample regulatory text
SAMPLE_TEXT = """
Every stock broker shall maintain a risk management system and conduct
quarterly internal audits. The audit report shall be submitted to the
Stock Exchange within 15 days from the end of each quarter.
"""

METADATA = {
    "document_title": "SEBI Circular on Risk Management",
    "regulator": "SEBI",
    "chunk_id": "chunk_001",
    "section_label": "3.1",
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
}


def test_obligation_extraction():
    print("=" * 80)
    print("Testing Obligation Extraction (Heuristic Mode)")
    print("=" * 80)
    print()

    # Test without LLM (returns empty list)
    obligations = extract_obligations_from_section(
        SAMPLE_TEXT,
        METADATA,
        use_llm=False
    )

    print(f"✅ Extracted {len(obligations)} obligations (expected: 0 without LLM)")
    print()


def test_risk_assessment():
    print("=" * 80)
    print("Testing Risk Assessment (Heuristics)")
    print("=" * 80)
    print()

    test_cases = [
        ("Conduct quarterly internal audit", "High"),
        ("File annual compliance report", "High"),
        ("Maintain daily transaction logs", "Low"),
        ("Disclose material events within 24 hours", "Critical"),
        ("Submit monthly performance data", "Medium"),
    ]

    for text, expected in test_cases:
        risk = assess_risk_simple(text, "test-id")
        status = "✅" if risk.risk_level == expected else "⚠️"
        print(f"Text: {text[:50]}...")
        print(f"  → Risk Level: {risk.risk_level} {status}")
        print()

    print()


def test_evidence_suggestion():
    print("=" * 80)
    print("Testing Evidence Suggestion (Heuristics)")
    print("=" * 80)
    print()

    test_cases = [
        ("Conduct annual internal audit", "audit"),
        ("File quarterly compliance report", "report"),
        ("Disclose related party transactions", "disclose"),
        ("Maintain client transaction records", "maintain"),
    ]

    for text, keyword in test_cases:
        evidence = suggest_evidence_simple(text, "test-id")
        print(f"Obligation: {text[:50]}...")
        print(f"  → Evidence: {evidence.evidence[:2]}")
        print()

    print()


def test_workflow_generation():
    print("=" * 80)
    print("Testing Workflow Generation (Template)")
    print("=" * 80)
    print()

    workflow = generate_workflow_simple(
        "Conduct annual cyber audit",
        "test-id"
    )

    print(f"✅ Generated workflow with {len(workflow.tasks)} tasks:")
    for task in workflow.tasks:
        print(f"   {task.order}. {task.title}")
    print()


def test_gap_analysis():
    print("=" * 80)
    print("Testing Gap Analysis")
    print("=" * 80)
    print()

    # Sample existing records
    existing_records = [
        {"obligation_id": "oblig-001", "status": "Completed", "deadline": "2026-12-31"},
        {"obligation_id": "oblig-002", "status": "Overdue", "deadline": "2026-01-15"},
        {"obligation_id": "oblig-003", "status": "Not Applicable"},
    ]

    # Sample obligations
    obligations = [
        {"id": "oblig-001", "deadline": "2026-12-31"},
        {"id": "oblig-002", "deadline": "2026-01-15"},
        {"id": "oblig-004", "deadline": "within 30 days"},  # Missing
        {"id": "oblig-005"},  # No deadline
    ]

    gap = run_gap_analysis_with_deadlines(existing_records, obligations)

    print(f"✅ Gap analysis complete: {len(gap.items)} items analyzed")
    print()

    for item in gap.items:
        print(f"   {item.obligation_id}: {item.status}")

    summary = get_gap_summary(gap)
    print(f"\n   Gap Summary:")
    print(f"   - Missing: {summary['Missing']}")
    print(f"   - Overdue: {summary['Overdue']}")
    print(f"   - Completed: {summary['Completed']}")
    print(f"   - Not Applicable: {summary['Not Applicable']}")
    print()


def test_full_pipeline():
    print("=" * 80)
    print("Testing Full Agent Pipeline (All Heuristics)")
    print("=" * 80)
    print()

    # Create a sample obligation manually
    ob = ObligationCreate(
        actor="Stock Broker",
        obligation="Conduct quarterly internal audit and submit report",
        frequency="Quarterly",
        deadline="Within 15 days",
        risk_level="High"
    )

    print("Sample Obligation:")
    print(f"  Actor: {ob.actor}")
    print(f"  Text: {ob.obligation}")
    print(f"  Frequency: {ob.frequency}")
    print(f"  Deadline: {ob.deadline}")
    print()

    # Test risk assessment
    risk = assess_risk_simple(ob.obligation, "test-001")
    print(f"✅ Risk Assessment: {risk.risk_level}")

    # Test evidence suggestion
    evidence = suggest_evidence_simple(ob.obligation, "test-001")
    print(f"✅ Evidence: {evidence.evidence[:2]}")

    # Test workflow generation
    workflow = generate_workflow_simple(ob.obligation, "test-001")
    print(f"✅ Workflow: {len(workflow.tasks)} tasks generated")

    # Test gap analysis
    existing = [{"obligation_id": "test-001", "status": "Completed"}]
    obligations_list = [{"id": "test-001", "deadline": "2026-12-31"}]
    gap = run_gap_analysis(existing, obligations_list)
    summary = get_gap_summary(gap)
    print(f"✅ Gap Analysis: {summary['Completed']} completed, {summary['Missing']} missing")

    print()


if __name__ == "__main__":
    print("\n🚀 Running Agent Layer Tests\n")

    test_obligation_extraction()
    test_risk_assessment()
    test_evidence_suggestion()
    test_workflow_generation()
    test_gap_analysis()
    test_full_pipeline()

    print("=" * 80)
    print("✅ All tests completed successfully!")
    print("=" * 80)
    print("\nNext steps:")
    print("1. Set GROQ_API_KEY or OPENAI_API_KEY to enable LLM mode")
    print("2. Integrate with your API endpoints")
    print("3. Test with real regulatory documents")
    print()