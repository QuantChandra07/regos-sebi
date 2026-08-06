# database/crud.py
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.regulatory import Obligation
from schemas.obligation import ObligationCreate, ObligationResponse


def create_obligations(
    db: Session,
    obligations: List[ObligationCreate],
    document_id: Optional[str] = None,
) -> List[Obligation]:
    db_objs: List[Obligation] = []
    for ob in obligations:
        db_obj = Obligation(
            source_chunk_id=ob.source_chunk_id,
            document_id=document_id,
            actor=ob.actor,
            section=ob.section,
            obligation=ob.obligation,
            frequency=ob.frequency,
            deadline=ob.deadline,
            risk_level=ob.risk_level,
            evidence=ob.evidence,
        )
        db.add(db_obj)
        db_objs.append(db_obj)

    db.commit()
    for obj in db_objs:
        db.refresh(obj)
    return db_objs


def list_obligations(
    db: Session,
    document_id: Optional[str] = None,
    actor: Optional[str] = None,
) -> List[Obligation]:
    stmt = select(Obligation)

    if document_id:
        stmt = stmt.where(Obligation.document_id == document_id)
    if actor:
        stmt = stmt.where(Obligation.actor == actor)

    stmt = stmt.order_by(Obligation.created_at.desc())
    return list(db.scalars(stmt).all())


def get_obligation_by_id(
    db: Session,
    obligation_id: str,
) -> Optional[Obligation]:
    from uuid import UUID
    try:
        uuid_obj = UUID(obligation_id) if isinstance(obligation_id, str) else obligation_id
    except (ValueError, TypeError):
        return None
    
    stmt = select(Obligation).where(Obligation.id == uuid_obj)
    return db.scalar(stmt)


def delete_obligation(
    db: Session,
    obligation_id: str,
) -> bool:
    obj = get_obligation_by_id(db, obligation_id)
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False
