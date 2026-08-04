from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.get("")
def list_evidence():
    return {
        "items": [
            {
                "id": "ev-001",
                "workflow_task_id": "task-001",
                "catalog_id": None,
                "storage_key": "evidence/ev-001.pdf",
                "file_name": "internal-audit-report-q1.pdf",
                "mime_type": "application/pdf",
                "uploaded_by_id": None,
                "uploaded_at": "2026-08-01T12:00:00",
                "review_status": "PENDING_REVIEW",
            },
            {
                "id": "ev-002",
                "workflow_task_id": "task-002",
                "catalog_id": None,
                "storage_key": "evidence/ev-002.xlsx",
                "file_name": "incident-log.xlsx",
                "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "uploaded_by_id": None,
                "uploaded_at": "2026-08-01T12:30:00",
                "review_status": "VERIFIED",
            },
        ]
    }


@router.post("/upload")
async def upload_evidence(task_id: str | None = Form(default=None), file: UploadFile = File(...)):
    return {
        "ok": True,
        "task_id": task_id,
        "file_name": file.filename,
        "mime_type": file.content_type,
    }