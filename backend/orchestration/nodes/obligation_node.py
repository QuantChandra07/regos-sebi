from orchestration.state import DocumentState, Obligation

def obligation_node(state: DocumentState) -> dict:
    all_obligations = []

    try:
        from agents.obligation_agent import extract_obligations_from_section

        for clause in state.clauses:
            metadata = {
                "chunk_id": clause.chunk_id,
                "section_label": clause.section_label or "",
                "document_title": state.circular.title if state.circular else "",
                "regulator": state.circular.regulator if state.circular else "SEBI",
                "document_id": state.document_id,
            }
            extracted = extract_obligations_from_section(clause.text, metadata)

            for ob in extracted:
                all_obligations.append(
                    Obligation(
                        clause_chunk_id=clause.chunk_id,
                        actor=getattr(ob, "actor", "Regulated Entity"),
                        section=getattr(ob, "section", None),
                        obligation=getattr(ob, "obligation", clause.text[:200]),
                        frequency=getattr(ob, "frequency", None),
                        deadline=getattr(ob, "deadline", None),
                        category=None,
                    )
                )
    except Exception:
        for clause in state.clauses:
            all_obligations.append(
                Obligation(
                    clause_chunk_id=clause.chunk_id,
                    actor="Regulated Entity",
                    section=clause.section_label,
                    obligation=clause.text[:300],
                )
            )

    return {"obligations": all_obligations, "status": "OBLIGATIONS_EXTRACTED"}
