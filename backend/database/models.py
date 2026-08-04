# backend/database/models.py
from datetime import datetime
from uuid import uuid4
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column

from backend.database.session import Base

if TYPE_CHECKING:
    from backend.database.models import Document, Clause


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    regulator: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reference_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    clauses: Mapped[List["Clause"]] = relationship(
        "Clause", back_populates="document", cascade="all, delete-orphan"
    )
    obligations: Mapped[List["Obligation"]] = relationship(
        "Obligation", back_populates="document", cascade="all, delete-orphan"
    )


class Clause(Base):
    __tablename__ = "clauses"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    document_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id"),
        nullable=False,
    )
    chunk_id: Mapped[str] = mapped_column(String, nullable=False)
    section: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    heading: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    page_start: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    page_end: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    document: Mapped["Document"] = relationship(
        "Document", back_populates="clauses"
    )


class Obligation(Base):
    __tablename__ = "obligations"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    source_chunk_id: Mapped[Optional[str]] = mapped_column(
        String, nullable=True
    )
    document_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id"),
        nullable=True,
    )
    actor: Mapped[str] = mapped_column(String, nullable=False)
    section: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    obligation: Mapped[str] = mapped_column(Text, nullable=False)
    frequency: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    deadline: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    risk_level: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    evidence: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    document: Mapped["Document"] = relationship(
        "Document", back_populates="obligations"
    )