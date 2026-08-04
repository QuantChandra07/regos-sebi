# backend/routers/obligations.py
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, HTTPException, status

from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.database.crud import (
    create_obligations,
    list_obligations,
    get_obligation_by_id,
    delete_obligation,
)
from schemas.obligation import ObligationCreate, ObligationUpdate, ObligationResponse

router = APIRouter(prefix="/obligations", tags=["Obligations CRUD"])


@router.post("/", response_model=List[ObligationResponse], status_code=status.HTTP_201_CREATED)
def create_multiple_obligations(
    payload: List[ObligationCreate],
    db: Session = Depends(get_db),
    document_id: Optional[UUID] = Query(None),
) -> List[ObligationResponse]:
    """
    Create multiple obligations at once.
    """
    doc_id_str = str(document_id) if document_id else None
    return create_obligations(db, payload, document_id=doc_id_str)


@router.get("/", response_model=List[ObligationResponse])
def get_obligations(
    db: Session = Depends(get_db),
    document_id: Optional[UUID] = Query(None),
    actor: Optional[str] = Query(None),
) -> List[ObligationResponse]:
    """
    List all obligations with optional filters.
    """
    doc_id_str = str(document_id) if document_id else None
    return list_obligations(db, document_id=doc_id_str, actor=actor)


@router.get("/{obligation_id}", response_model=ObligationResponse)
def get_obligation(
    obligation_id: UUID,
    db: Session = Depends(get_db),
) -> ObligationResponse:
    """
    Get a single obligation by ID.
    """
    obj = get_obligation_by_id(db, str(obligation_id))
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obligation not found"
        )
    return obj


@router.delete("/{obligation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_single_obligation(
    obligation_id: UUID,
    db: Session = Depends(get_db),
) -> None:
    """
    Delete an obligation by ID.
    """
    success = delete_obligation(db, str(obligation_id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obligation not found"
        )
