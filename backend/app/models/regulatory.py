from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.session import Base


class Circular(Base):
    __tablename__ = "circulars"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    regulator: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str | None] = mapped_column(String, nullable=True)
    reference_id: Mapped[str | None] = mapped_column(String, nullable=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str | None] = mapped_column(String, nullable=True)
    effective_from: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    clauses: Mapped[list["Clause"]] = relationship(
        back_populates="circular",
        cascade="all, delete-orphan",
    )
    obligations: Mapped[list["Obligation"]] = relationship(
        back_populates="circular",
        cascade="all, delete-orphan",
    )


class Clause(Base):
    __tablename__ = "clauses"
    __table_args__ = (
        UniqueConstraint("circular_id", "chunk_id", name="uq_clause_circular_chunk"),
    )

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    circular_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("circulars.id", ondelete="CASCADE"),
        nullable=False,
    )

    chunk_id: Mapped[str] = mapped_column(String, nullable=False)
    section_label: Mapped[str | None] = mapped_column(String, nullable=True)
    heading: Mapped[str | None] = mapped_column(String, nullable=True)
    page_start: Mapped[str | None] = mapped_column(String, nullable=True)
    page_end: Mapped[str | None] = mapped_column(String, nullable=True)
    category: Mapped[str | None] = mapped_column(String, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    circular: Mapped["Circular"] = relationship(back_populates="clauses")
    obligations: Mapped[list["Obligation"]] = relationship(
        back_populates="clause",
        cascade="all, delete-orphan",
    )


class Obligation(Base):
    __tablename__ = "obligations"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    circular_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("circulars.id", ondelete="CASCADE"),
        nullable=False,
    )
    clause_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clauses.id", ondelete="SET NULL"),
        nullable=True,
    )

    actor: Mapped[str] = mapped_column(String, nullable=False)
    section: Mapped[str | None] = mapped_column(String, nullable=True)
    obligation: Mapped[str] = mapped_column(Text, nullable=False)
    frequency: Mapped[str | None] = mapped_column(String, nullable=True)
    deadline: Mapped[str | None] = mapped_column(String, nullable=True)
    category: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    circular: Mapped["Circular"] = relationship(back_populates="obligations")
    clause: Mapped["Clause | None"] = relationship(back_populates="obligations")
    risk_score: Mapped["RiskScore | None"] = relationship(
        back_populates="obligation",
        uselist=False,
        cascade="all, delete-orphan",
    )
    workflow_tasks: Mapped[list["WorkflowTask"]] = relationship(
        back_populates="obligation",
        cascade="all, delete-orphan",
    )
    gap_items: Mapped[list["GapAnalysis"]] = relationship(
        back_populates="obligation",
        cascade="all, delete-orphan",
    )


class RiskLevelEnum(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    obligation_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("obligations.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    risk_level: Mapped[RiskLevelEnum] = mapped_column(
        SQLEnum(RiskLevelEnum, name="risk_level_enum"),
        nullable=False,
    )
    impact_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    likelihood_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    overall_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rationale: Mapped[str | None] = mapped_column(Text, nullable=True)

    obligation: Mapped["Obligation"] = relationship(back_populates="risk_score")


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    employees: Mapped[list["Employee"]] = relationship(
        back_populates="department",
        cascade="all, delete-orphan",
    )
    workflow_tasks: Mapped[list["WorkflowTask"]] = relationship(back_populates="department")
    compliance_statuses: Mapped[list["ComplianceStatus"]] = relationship(back_populates="department")


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    department_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
    )

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    role: Mapped[str | None] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    department: Mapped["Department | None"] = relationship(back_populates="employees")


class WorkflowTask(Base):
    __tablename__ = "workflow_tasks"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    obligation_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("obligations.id", ondelete="CASCADE"),
        nullable=False,
    )
    department_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
    )
    owner_employee_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True,
    )

    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, default="Pending")
    due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    obligation: Mapped["Obligation"] = relationship(back_populates="workflow_tasks")
    department: Mapped["Department | None"] = relationship(back_populates="workflow_tasks")
    owner: Mapped["Employee | None"] = relationship()
    evidence_items: Mapped[list["EvidenceItem"]] = relationship(
        back_populates="workflow_task",
        cascade="all, delete-orphan",
    )


class EvidenceCatalog(Base):
    __tablename__ = "evidence_catalog"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggested_for_category: Mapped[str | None] = mapped_column(String, nullable=True)


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    workflow_task_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workflow_tasks.id", ondelete="CASCADE"),
        nullable=False,
    )
    catalog_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("evidence_catalog.id", ondelete="SET NULL"),
        nullable=True,
    )
    storage_key: Mapped[str] = mapped_column(String, nullable=False)
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String, nullable=True)
    uploaded_by_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True,
    )
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    workflow_task: Mapped["WorkflowTask"] = relationship(back_populates="evidence_items")
    catalog_item: Mapped["EvidenceCatalog | None"] = relationship()
    uploaded_by: Mapped["Employee | None"] = relationship()


class Control(Base):
    __tablename__ = "controls"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    owner_department_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    owner_department: Mapped["Department | None"] = relationship()


class GapStatusEnum(str, Enum):
    MISSING = "Missing"
    OVERDUE = "Overdue"
    COMPLETED = "Completed"
    NOT_APPLICABLE = "Not Applicable"


class GapAnalysis(Base):
    __tablename__ = "gap_analysis"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    obligation_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("obligations.id", ondelete="CASCADE"),
        nullable=False,
    )
    control_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("controls.id", ondelete="SET NULL"),
        nullable=True,
    )

    status: Mapped[GapStatusEnum] = mapped_column(
        SQLEnum(GapStatusEnum, name="gap_status_enum"),
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    assessed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    assessed_by_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True,
    )

    obligation: Mapped["Obligation"] = relationship(back_populates="gap_items")
    control: Mapped["Control | None"] = relationship()
    assessed_by: Mapped["Employee | None"] = relationship()


class ComplianceStatus(Base):
    __tablename__ = "compliance_status"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    department_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="CASCADE"),
        nullable=False,
    )
    entity_type: Mapped[str | None] = mapped_column(String, nullable=True)
    entity_name: Mapped[str | None] = mapped_column(String, nullable=True)
    total_obligations: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    completed_obligations: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    overdue_obligations: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    not_applicable_obligations: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    department: Mapped["Department"] = relationship(back_populates="compliance_statuses")


