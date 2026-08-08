from orchestration.state import DocumentState, WorkflowTask


def workflow_node(state: DocumentState) -> dict:
    tasks = []

    try:
        from backend.agents.workflow_agent import generate_workflow_for_obligation

        for ob in state.obligations:
            result = generate_workflow_for_obligation(ob.obligation, obligation_id=ob.id)
            for task in getattr(result, "tasks", []):
                tasks.append(
                    WorkflowTask(
                        obligation_id=ob.id,
                        order_index=getattr(task, "order", 1),
                        title=getattr(task, "title", "Review obligation"),
                        description=getattr(task, "description", None),
                    )
                )
    except Exception:
        for i, ob in enumerate(state.obligations, start=1):
            tasks.append(
                WorkflowTask(
                    obligation_id=ob.id,
                    order_index=1,
                    title=f"Review obligation {i}",
                    description=ob.obligation[:200],
                )
            )

    return {"workflows": tasks, "status": "WORKFLOWS_GENERATED"}
