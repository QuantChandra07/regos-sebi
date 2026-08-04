from langgraph.graph import StateGraph, START, END

from backend.orchestration.state import DocumentState
from backend.orchestration.nodes.upload_node import upload_node
from backend.orchestration.nodes.extraction_node import extraction_node
from backend.orchestration.nodes.regulatory_parser_node import regulatory_parser_node
from backend.orchestration.nodes.obligation_node import obligation_node
from backend.orchestration.nodes.applicability_node import applicability_node
from backend.orchestration.nodes.risk_node import risk_node
from backend.orchestration.nodes.workflow_node import workflow_node
from backend.orchestration.nodes.evidence_node import evidence_node
from backend.orchestration.nodes.gap_node import gap_node
from backend.orchestration.nodes.persistence_node import persistence_node


def build_document_graph():
    builder = StateGraph(DocumentState)

    builder.add_node("upload", upload_node)
    builder.add_node("extraction", extraction_node)
    builder.add_node("regulatory_parser", regulatory_parser_node)
    builder.add_node("obligation_agent", obligation_node)
    builder.add_node("applicability_agent", applicability_node)
    builder.add_node("risk_agent", risk_node)
    builder.add_node("workflow_agent", workflow_node)
    builder.add_node("evidence_agent", evidence_node)
    builder.add_node("gap_agent", gap_node)
    builder.add_node("persistence", persistence_node)

    builder.add_edge(START, "upload")
    builder.add_edge("upload", "extraction")
    builder.add_edge("extraction", "regulatory_parser")
    builder.add_edge("regulatory_parser", "obligation_agent")
    builder.add_edge("obligation_agent", "applicability_agent")
    builder.add_edge("applicability_agent", "risk_agent")
    builder.add_edge("risk_agent", "workflow_agent")
    builder.add_edge("workflow_agent", "evidence_agent")
    builder.add_edge("evidence_agent", "gap_agent")
    builder.add_edge("gap_agent", "persistence")
    builder.add_edge("persistence", END)

    return builder.compile()


document_graph = build_document_graph()