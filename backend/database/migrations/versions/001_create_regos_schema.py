# backend/database/migrations/versions/001_create_regos_schema.py
"""create regos core schema

Revision ID: 001_create_regos_schema
Revises:
Create Date: 2026-07-31 14:30:00.000000
"""

from typing import Sequence, Union
from uuid import uuid4

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = "001_create_regos_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # circulars
    op.create_table(
        "circulars",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("regulator", sa.String(), nullable=False),
        sa.Column("category", sa.String(), nullable=True),
        sa.Column("reference_id", sa.String(), nullable=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("entity_type", sa.String(), nullable=True),
        sa.Column("effective_from", sa.DateTime(), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
    )

    # clauses
    op.create_table(
        "clauses",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("circular_id", UUID(as_uuid=True), sa.ForeignKey("circulars.id", ondelete="CASCADE"), nullable=False),
        sa.Column("chunk_id", sa.String(), nullable=False),
        sa.Column("section_label", sa.String(), nullable=True),
        sa.Column("heading", sa.String(), nullable=True),
        sa.Column("page_start", sa.String(), nullable=True),
        sa.Column("page_end", sa.String(), nullable=True),
        sa.Column("category", sa.String(), nullable=True),
        sa.Column("text", sa.Text(), nullable=False),
    )
    op.create_unique_constraint(
        "uq_clause_circular_chunk",
        "clauses",
        ["circular_id", "chunk_id"],
    )

    # obligations
    op.create_table(
        "obligations",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("circular_id", UUID(as_uuid=True), sa.ForeignKey("circulars.id", ondelete="CASCADE"), nullable=False),
        sa.Column("clause_id", UUID(as_uuid=True), sa.ForeignKey("clauses.id", ondelete="SET NULL"), nullable=True),
        sa.Column("actor", sa.String(), nullable=False),
        sa.Column("section", sa.String(), nullable=True),
        sa.Column("obligation", sa.Text(), nullable=False),
        sa.Column("frequency", sa.String(), nullable=True),
        sa.Column("deadline", sa.String(), nullable=True),
        sa.Column("category", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # risk_scores
    op.create_table(
        "risk_scores",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("obligation_id", UUID(as_uuid=True), sa.ForeignKey("obligations.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("risk_level", sa.Enum("Critical", "High", "Medium", "Low", name="risk_level_enum"), nullable=False),
        sa.Column("impact_score", sa.Integer(), nullable=True),
        sa.Column("likelihood_score", sa.Integer(), nullable=True),
        sa.Column("overall_score", sa.Integer(), nullable=True),
        sa.Column("rationale", sa.Text(), nullable=True),
    )

    # departments
    op.create_table(
        "departments",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
    )

    # employees
    op.create_table(
        "employees",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("department_id", UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("role", sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
    )

    # workflow_tasks
    op.create_table(
        "workflow_tasks",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("obligation_id", UUID(as_uuid=True), sa.ForeignKey("obligations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("department_id", UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("owner_employee_id", UUID(as_uuid=True), sa.ForeignKey("employees.id", ondelete="SET NULL"), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, default="Pending"),
        sa.Column("due_date", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
    )

    # evidence_catalog
    op.create_table(
        "evidence_catalog",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("suggested_for_category", sa.String(), nullable=True),
    )

    # evidence_items
    op.create_table(
        "evidence_items",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("workflow_task_id", UUID(as_uuid=True), sa.ForeignKey("workflow_tasks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("catalog_id", UUID(as_uuid=True), sa.ForeignKey("evidence_catalog.id", ondelete="SET NULL"), nullable=True),
        sa.Column("storage_key", sa.String(), nullable=False),
        sa.Column("file_name", sa.String(), nullable=False),
        sa.Column("mime_type", sa.String(), nullable=True),
        sa.Column("uploaded_by_id", UUID(as_uuid=True), sa.ForeignKey("employees.id", ondelete="SET NULL"), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
    )

    # controls
    op.create_table(
        "controls",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner_department_id", UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
    )

    # gap_analysis
    op.create_table(
        "gap_analysis",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("obligation_id", UUID(as_uuid=True), sa.ForeignKey("obligations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("control_id", UUID(as_uuid=True), sa.ForeignKey("controls.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", sa.Enum("Missing", "Overdue", "Completed", "Not Applicable", name="gap_status_enum"), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("assessed_at", sa.DateTime(), nullable=False),
        sa.Column("assessed_by_id", UUID(as_uuid=True), sa.ForeignKey("employees.id", ondelete="SET NULL"), nullable=True),
    )

    # compliance_status
    op.create_table(
        "compliance_status",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column("department_id", UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("entity_type", sa.String(), nullable=True),
        sa.Column("entity_name", sa.String(), nullable=True),
        sa.Column("total_obligations", sa.Integer(), nullable=False, default=0),
        sa.Column("completed_obligations", sa.Integer(), nullable=False, default=0),
        sa.Column("overdue_obligations", sa.Integer(), nullable=False, default=0),
        sa.Column("not_applicable_obligations", sa.Integer(), nullable=False, default=0),
        sa.Column("calculated_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("compliance_status")
    op.drop_table("gap_analysis")
    op.drop_table("controls")
    op.drop_table("evidence_items")
    op.drop_table("evidence_catalog")
    op.drop_table("workflow_tasks")
    op.drop_table("employees")
    op.drop_table("departments")
    op.drop_table("risk_scores")
    op.drop_table("obligations")
    op.drop_constraint("uq_clause_circular_chunk", "clauses", type_="unique")
    op.drop_table("clauses")
    op.drop_table("circulars")