export type UUID = string;

export interface Circular {
  id: UUID;
  regulator: string;
  category?: string | null;
  reference_id?: string | null;
  title: string;
  entity_type?: string | null;
  effective_from?: string | null;
  uploaded_at?: string | null;
  /** Legacy backend field aliases retained for existing screens. */
  referenceid?: string | null;
  entitytype?: string | null;
  effectivefrom?: string | null;
  uploadedat?: string | null;
}

export interface Clause {
  id?: UUID;
  circular_id?: UUID;
  chunk_id: string;
  section_label?: string | null;
  heading?: string | null;
  page_start?: string | null;
  page_end?: string | null;
  category?: string | null;
  text: string;
}

export interface Obligation {
  id: UUID;
  circular_id?: UUID | null;
  clause_id?: UUID | null;
  actor: string;
  section?: string | null;
  obligation: string;
  frequency?: string | null;
  deadline?: string | null;
  category?: string | null;
  risk_level?: "Critical" | "High" | "Medium" | "Low" | null;
  /** Legacy backend field alias retained for existing screens. */
  risklevel?: string | null;
  status?: string | null;
}

export interface WorkflowTask {
  id: UUID;
  obligation_id: UUID;
  department_id?: UUID | null;
  owner_employee_id?: UUID | null;
  order_index: number;
  title: string;
  description?: string | null;
  status: "NOT_STARTED" | "IN_DESIGN" | "ACTIVE" | "COMPLIANT" | "Pending" | "In Progress" | "Completed" | "Overdue";
  due_date?: string | null;
  completed_at?: string | null;
  department_name?: string | null;
  /** Legacy backend field aliases retained for existing screens. */
  duedate?: string | null;
  evidencestatus?: string | null;
  ownername?: string | null;
  priority?: string | null;
  comments?: string[];
}

export interface EvidenceItem {
  id: UUID;
  workflow_task_id: UUID;
  catalog_id?: UUID | null;
  storage_key: string;
  file_name: string;
  mime_type?: string | null;
  uploaded_by_id?: UUID | null;
  uploaded_at?: string | null;
  review_status?: "PENDING_REVIEW" | "VERIFIED" | "REJECTED" | null;
  /** Legacy backend field aliases retained for existing screens. */
  uploadedat?: string | null;
  createdat?: string | null;
}

export interface RiskScore {
  id?: UUID;
  obligation_id: UUID;
  risk_level: "Critical" | "High" | "Medium" | "Low";
  impact_score?: number | null;
  likelihood_score?: number | null;
  overall_score?: number | null;
  rationale?: string | null;
}

export interface DepartmentComplianceScore {
  department: string;
  score: number;
}

export interface DashboardSummary {
  new_circulars_this_month: number;
  obligations_found: number;
  high_critical_obligations: number;
  tasks_open: number;
  tasks_completed: number;
  compliance_scores: DepartmentComplianceScore[];
}

export interface CircularDetailResponse {
  circular: Circular;
  clauses: Clause[];
  obligations: Obligation[];
}

export interface CircularListResponse {
  items: Circular[];
}

export interface ObligationListResponse {
  items: Obligation[];
}

export interface TaskListResponse {
  items: WorkflowTask[];
}

export interface EvidenceListResponse {
  items: EvidenceItem[];
}

export interface RiskListResponse {
  items: RiskScore[];
}

export interface DashboardSummaryResponse {
  summary: DashboardSummary;
}
