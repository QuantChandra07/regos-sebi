export type IntermediaryType =
  | "STOCKBROKER"
  | "INVESTMENT_ADVISER"
  | "AMC"
  | "RTA"
  | "MII";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ComplianceStatus =
  | "NOT_STARTED"
  | "IN_DESIGN"
  | "ACTIVE"
  | "COMPLIANT"
  | "BREACH";

export type Frequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "ANNUAL"
  | "EVENT_DRIVEN";

export type WorkflowColumn =
  | "PENDING"
  | "ASSIGNED"
  | "EVIDENCE_REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "COMPLETED";

export type EvidenceStatus = "NONE" | "MISSING" | "UPLOADED" | "VERIFIED";

export type EvidenceReviewStatus = "PENDING_REVIEW" | "VERIFIED" | "EXPIRED";

export type AgentRunStatus = "IDLE" | "RUNNING" | "ERROR";

export type AgentHealth = "GOOD" | "WARNING" | "CRITICAL";

export type InspectionChecklistStatus = "OK" | "GAP";

export type UserRole =
  | "ADMIN"
  | "COMPLIANCE_OFFICER"
  | "DEPARTMENT_HEAD"
  | "STAFF"
  | "AUDITOR"
  | "REGULATOR";

export interface RegulatoryDocument {
  id: string;
  circularNumber: string;
  title: string;
  issuedDate: string;
  effectiveDate: string;
  status: "NEW" | "UPDATED" | "SUPERSEDED" | "ARCHIVED";
  tags: string[];
  pdfUrl?: string;
  clauses?: Clause[];
}

export interface Clause {
  id: string;
  documentId: string;
  clauseNumber: string;
  content: string;
  applicability: IntermediaryType[];
  department: string;
  priority: RiskLevel;
  timeline: string;
  penalty?: string;
  riskLevel: RiskLevel;
  machineLogic: string;
  approved: boolean;
}

export interface Obligation {
  id: string;
  clauseId: string;
  title: string;
  sourceCircular: string;
  department: string;
  owner: string;
  frequency: Frequency;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  evidenceNeeded: string;
  nextDeadline: string;
  trigger: string;
  action: string;
  pseudoCode: string;
}

export interface WorkflowTask {
  id: string;
  obligationId: string;
  title: string;
  owner: string;
  dueDate: string;
  department: string;
  priority: RiskLevel;
  status: WorkflowColumn;
  evidenceStatus: EvidenceStatus;
  comments?: string[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  fileHash: string;
  timestamp: string;
  uploader: string;
  verifier: string;
  status: EvidenceReviewStatus;
  linkedObligationId: string;
  fileSize: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: AgentRunStatus;
  currentTask: string;
  health: AgentHealth;
  queueLength: number;
  lastExecution: string;
  latencyMs: number;
}

export interface InspectionChecklistItem {
  control: string;
  status: InspectionChecklistStatus;
}

export interface SyntheticInspectionResult {
  id: string;
  scope: string;
  readinessScore: number;
  checklist: InspectionChecklistItem[];
  questions: string[];
  gaps: string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarColor: string;
}

export interface Department {
  id: string;
  name: string;
  headUserId: string | null;
  complianceScore: number;
}

export interface RiskScore {
  id: string;
  category: string;
  score: number;
  trend: string;
  level: RiskLevel;
  owner: string;
}

export interface CopilotResponse {
  answer: string;
  sourceCirculars: string[];
  linkedObligations: string[];
  suggestedActions: string[];
}