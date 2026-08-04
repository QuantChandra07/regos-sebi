import type {
  RegulatoryDocument,
  Clause,
  Obligation,
  WorkflowTask,
  EvidenceItem,
  AgentStatus,
  AppUser,
  Department,
  RiskScore,
  SyntheticInspectionResult,
} from "@/types";



export const mockUsers: AppUser[] = [
  {
    id: "usr-001",
    name: "Rohan Mehta",
    email: "rohan.mehta@regossebi.in",
    role: "ADMIN",
    department: "Compliance",
    avatarColor: "#06B6D4",
  },
  {
    id: "usr-002",
    name: "Ananya Roy",
    email: "ananya.roy@regossebi.in",
    role: "COMPLIANCE_OFFICER",
    department: "Operations",
    avatarColor: "#3B82F6",
  },
  {
    id: "usr-003",
    name: "Vikram Mehta",
    email: "vikram.mehta@regossebi.in",
    role: "DEPARTMENT_HEAD",
    department: "Technology",
    avatarColor: "#8B5CF6",
  },
  {
    id: "usr-004",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@regossebi.in",
    role: "STAFF",
    department: "Legal",
    avatarColor: "#6B7280",
  },
  {
    id: "usr-005",
    name: "Karan Shah",
    email: "karan.shah@regossebi.in",
    role: "AUDITOR",
    department: "Internal Audit",
    avatarColor: "#10B981",
  },
  {
    id: "usr-006",
    name: "Priya Nair",
    email: "priya.nair@regossebi.in",
    role: "REGULATOR",
    department: "SEBI Liaison",
    avatarColor: "#F59E0B",
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dept-001",
    name: "Compliance",
    headUserId: "usr-001",
    complianceScore: 97,
  },
  {
    id: "dept-002",
    name: "Operations",
    headUserId: "usr-002",
    complianceScore: 93,
  },
  {
    id: "dept-003",
    name: "Technology",
    headUserId: "usr-003",
    complianceScore: 89,
  },
  {
    id: "dept-004",
    name: "Legal",
    headUserId: "usr-004",
    complianceScore: 95,
  },
  {
    id: "dept-005",
    name: "Internal Audit",
    headUserId: "usr-005",
    complianceScore: 98,
  },
  {
    id: "dept-006",
    name: "SEBI Liaison",
    headUserId: "usr-006",
    complianceScore: 96,
  },
];

export const mockCirculars: RegulatoryDocument[] = [
  {
    id: "doc-001",
    circularNumber: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/102",
    title:
      "Master Circular for Stock Brokers - Cybersecurity & Cyber Resiliency Framework",
    issuedDate: "2024-05-15",
    effectiveDate: "2024-06-01",
    status: "NEW",
    tags: ["Stockbrokers", "Cybersecurity", "IT Infrastructure", "Audit"],
  },
  {
    id: "doc-002",
    circularNumber: "SEBI/HO/IMD/IMD-PoD-2/P/CIR/2024/088",
    title:
      "Master Circular for Investment Advisers - Fee Disclosure & Client Onboarding",
    issuedDate: "2024-04-10",
    effectiveDate: "2024-05-01",
    status: "UPDATED",
    tags: ["Investment Advisers", "KYC", "Fee Disclosure", "Compliance"],
  },
  {
    id: "doc-003",
    circularNumber: "SEBI/HO/CFD/CFD-PoD-1/P/CIR/2025/021",
    title: "Operational Risk Governance and Board Escalation Framework",
    issuedDate: "2025-01-12",
    effectiveDate: "2025-02-01",
    status: "NEW",
    tags: ["Risk", "Governance", "Board Reporting"],
  },
];

export const mockClauses: Clause[] = [
  {
    id: "cls-101",
    documentId: "doc-001",
    clauseNumber: "Clause 4.2.1",
    content:
      "All Stockbrokers shall perform vulnerability assessments and penetration testing (VAPT) at least twice a fiscal year and submit the report to Exchange within 30 days of completion.",
    applicability: ["STOCKBROKER"],
    department: "Technology",
    priority: "HIGH",
    timeline: "Semi-Annual",
    penalty: "Financial disincentive & administrative action under Chapter V.",
    riskLevel: "CRITICAL",
    machineLogic:
      "IF entity_type == 'STOCKBROKER' THEN schedule_vapt(frequency='BI_ANNUAL') AND require_report_submission(deadline_days=30)",
    approved: true,
  },
  {
    id: "cls-102",
    documentId: "doc-002",
    clauseNumber: "Clause 8.1.4",
    content:
      "Investment Advisers must maintain digital audit trails for all fee receipts and client risk profiling assessments for a minimum period of 8 years.",
    applicability: ["INVESTMENT_ADVISER"],
    department: "Operations",
    priority: "MEDIUM",
    timeline: "Continuous",
    penalty: "Suspension of Registration under Intermediaries Regulations.",
    riskLevel: "HIGH",
    machineLogic:
      "IF document_type IN ['FEE_RECEIPT', 'RISK_PROFILE'] THEN enforce_retention_policy(years=8, immutable=TRUE)",
    approved: true,
  },
  {
    id: "cls-103",
    documentId: "doc-003",
    clauseNumber: "Clause 3.3.2",
    content:
      "All material operational risk incidents shall be escalated to the Board Risk Committee within 24 hours of classification.",
    applicability: ["STOCKBROKER", "AMC", "RTA"],
    department: "Risk",
    priority: "HIGH",
    timeline: "Event Driven",
    penalty: "Supervisory action for delayed disclosure and governance lapses.",
    riskLevel: "HIGH",
    machineLogic:
      "IF incident.material == TRUE THEN notify_board_risk_committee(within_hours=24)",
    approved: true,
  },
];

export const mockObligations: Obligation[] = [
  {
    id: "obl-201",
    clauseId: "cls-101",
    title: "Bi-Annual VAPT & Audit Submission",
    sourceCircular: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/102",
    department: "Technology",
    owner: "Vikram Mehta (CISO)",
    frequency: "EVENT_DRIVEN",
    status: "ACTIVE",
    riskLevel: "CRITICAL",
    evidenceNeeded:
      "CERT-In empaneled VAPT Report, Executive Summary, Board Resolution",
    nextDeadline: "2026-08-31",
    trigger: "Bi-Annual Schedule Hit",
    action: "Conduct VAPT external scan and compile remediation report.",
    pseudoCode:
      "ON schedule.bi_annual DO execute_vapt_scan() THEN notify(roles=['CISO','COMPLIANCE'])",
  },
  {
    id: "obl-202",
    clauseId: "cls-102",
    title: "Immutable 8-Year Audit Trail for IA Fees",
    sourceCircular: "SEBI/HO/IMD/IMD-PoD-2/P/CIR/2024/088",
    department: "Operations",
    owner: "Ananya Roy (Ops Lead)",
    frequency: "DAILY",
    status: "COMPLIANT",
    riskLevel: "HIGH",
    evidenceNeeded:
      "WORM Storage Logs, Automated Backup Verification Checksums",
    nextDeadline: "2026-07-31",
    trigger: "Client Fee Transaction Event",
    action:
      "Persist transaction metadata to WORM vault with SHA-256 digital signature.",
    pseudoCode:
      "ON fee_received(event) DO vault.write_immutable(event.payload, ttl_years=8)",
  },
  {
    id: "obl-203",
    clauseId: "cls-103",
    title: "Board Escalation for Material Risk Incidents",
    sourceCircular: "SEBI/HO/CFD/CFD-PoD-1/P/CIR/2025/021",
    department: "Risk",
    owner: "Neha Kapoor (Risk Manager)",
    frequency: "EVENT_DRIVEN",
    status: "ACTIVE",
    riskLevel: "HIGH",
    evidenceNeeded: "Incident Register, Escalation Email Trail, Board Note",
    nextDeadline: "2026-07-28",
    trigger: "Material Incident Classification",
    action:
      "Escalate incident summary and impact analysis to Board Risk Committee.",
    pseudoCode:
      "ON incident.material DO create_board_pack() AND notify(board_risk_committee)",
  },
];

export const mockTasks: WorkflowTask[] = [
  {
    id: "task-301",
    obligationId: "obl-201",
    title: "Engage CERT-In Auditor for H2 VAPT",
    owner: "Vikram Mehta",
    dueDate: "2026-08-10",
    department: "Technology",
    priority: "CRITICAL",
    status: "ASSIGNED",
    evidenceStatus: "MISSING",
    comments: ["Awaiting external auditor confirmation"],
  },
  {
    id: "task-302",
    obligationId: "obl-202",
    title: "Verify July WORM Storage Hashes",
    owner: "Ananya Roy",
    dueDate: "2026-08-01",
    department: "Operations",
    priority: "MEDIUM",
    status: "EVIDENCE_REQUESTED",
    evidenceStatus: "UPLOADED",
    comments: ["Hash verification submitted", "Pending reviewer sign-off"],
  },
  {
    id: "task-303",
    obligationId: "obl-203",
    title: "Prepare Board Escalation Note",
    owner: "Neha Kapoor",
    dueDate: "2026-07-28",
    department: "Risk",
    priority: "HIGH",
    status: "UNDER_REVIEW",
    evidenceStatus: "NONE",
  },
];

export const mockEvidence: EvidenceItem[] = [
  {
    id: "ev-401",
    name: "CERT_In_Empaneled_VAPT_Scope_Doc.pdf",
    fileHash:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "2026-07-20 14:32:10 UTC",
    uploader: "vikram.m@broker.in",
    verifier: "compliance.officer@broker.in",
    status: "VERIFIED",
    linkedObligationId: "obl-201",
    fileSize: "4.2 MB",
  },
  {
    id: "ev-402",
    name: "WORM_Storage_Verification_July.csv",
    fileHash:
      "b2a1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b811",
    timestamp: "2026-07-22 09:15:00 UTC",
    uploader: "ananya.r@broker.in",
    verifier: "ops.audit@broker.in",
    status: "PENDING_REVIEW",
    linkedObligationId: "obl-202",
    fileSize: "1.1 MB",
  },
];

export const mockAgents: AgentStatus[] = [
  {
    id: "ag-1",
    name: "Regulatory Watch Agent",
    status: "RUNNING",
    currentTask: "Polling SEBI circular RSS feeds & Webhooks",
    health: "GOOD",
    queueLength: 0,
    lastExecution: "2 mins ago",
    latencyMs: 142,
  },
  {
    id: "ag-2",
    name: "Clause Intelligence Agent",
    status: "IDLE",
    currentTask: "Awaiting new regulatory ingestion event",
    health: "GOOD",
    queueLength: 0,
    lastExecution: "1 hour ago",
    latencyMs: 890,
  },
  {
    id: "ag-3",
    name: "Risk Prediction Agent",
    status: "RUNNING",
    currentTask: "Recalculating Inspection Defensibility Index",
    health: "GOOD",
    queueLength: 3,
    lastExecution: "30 secs ago",
    latencyMs: 420,
  },
];

export const mockRiskScores: RiskScore[] = [
  {
    id: "risk-001",
    category: "Cybersecurity",
    score: 84,
    trend: "+6",
    level: "HIGH",
    owner: "Technology",
  },
  {
    id: "risk-002",
    category: "Operational Controls",
    score: 61,
    trend: "-2",
    level: "MEDIUM",
    owner: "Operations",
  },
  {
    id: "risk-003",
    category: "Regulatory Reporting",
    score: 39,
    trend: "-8",
    level: "LOW",
    owner: "Compliance",
  },
  {
    id: "risk-004",
    category: "Inspection Readiness",
    score: 72,
    trend: "+4",
    level: "HIGH",
    owner: "Risk",
  },
];

export const mockEventLog = [
  {
    id: "evt-001",
    ts: "2026-07-18T10:15:00Z",
    type: "OBLIGATION_CREATED",
    detail: "Bi-Annual VAPT Audit Submission obligation created.",
  },
  {
    id: "evt-002",
    ts: "2026-07-20T14:32:10Z",
    type: "EVIDENCE_UPLOADED",
    detail: "CERT-In empaneled VAPT scope document uploaded.",
  },
  {
    id: "evt-003",
    ts: "2026-07-22T09:10:00Z",
    type: "STATUS_CHANGED",
    detail: "Obligation status moved to ACTIVE.",
  },
  {
    id: "evt-004",
    ts: "2026-07-23T16:45:00Z",
    type: "RISK_RECALCULATED",
    detail: "Technology department risk score recalculated after evidence review.",
  },
];
export const mockInspections: SyntheticInspectionResult[] = [
  {
    id: "insp-001",
    scope: "Cybersecurity",
    readinessScore: 84,
    checklist: [
      { control: "VAPT policy documentation", status: "OK" },
      { control: "Patch management evidence", status: "GAP" },
      { control: "SOC monitoring review logs", status: "OK" },
    ],
    questions: [
      "Provide the latest VAPT report and remediation tracker.",
      "Show evidence of log monitoring and incident escalation.",
      "How frequently are privileged access reviews performed?",
    ],
    gaps: [
      "Patch evidence is incomplete for the last review cycle.",
    ],
  },
  {
    id: "insp-002",
    scope: "Client Onboarding (KYC)",
    readinessScore: 79,
    checklist: [
      { control: "KYC checklist completeness", status: "OK" },
      { control: "PEP / sanctions screening logs", status: "OK" },
      { control: "Exception approval trail", status: "GAP" },
    ],
    questions: [
      "Provide KYC onboarding samples for the review period.",
      "Show sanctions screening logs and escalation notes.",
      "Who approves onboarding exceptions and where is it recorded?",
    ],
    gaps: [
      "Exception approvals are not consistently documented.",
    ],
  },
  {
    id: "insp-003",
    scope: "Margin Reporting",
    readinessScore: 81,
    checklist: [
      { control: "Daily margin computation records", status: "OK" },
      { control: "Exchange submission evidence", status: "OK" },
      { control: "Late adjustment exception log", status: "GAP" },
    ],
    questions: [
      "Provide margin files submitted during the selected period.",
      "Show proof of reconciliation against exchange output.",
      "How are late client adjustments tracked and approved?",
    ],
    gaps: [
      "Late adjustment exception log is incomplete.",
    ],
  },
  {
    id: "insp-004",
    scope: "Investor Grievance",
    readinessScore: 88,
    checklist: [
      { control: "Complaint intake records", status: "OK" },
      { control: "Resolution turnaround tracking", status: "OK" },
      { control: "Escalation register", status: "OK" },
    ],
    questions: [
      "Provide complaint aging analysis for the selected period.",
      "Show the escalation path for unresolved cases.",
      "How is closure evidence retained?",
    ],
    gaps: [],
  },
  {
    id: "insp-005",
    scope: "Algo Trading",
    readinessScore: 73,
    checklist: [
      { control: "Algo approval documentation", status: "OK" },
      { control: "Kill switch test records", status: "GAP" },
      { control: "Order-to-trade surveillance review", status: "GAP" },
    ],
    questions: [
      "Provide algo approval and change control records.",
      "Show latest kill switch testing evidence.",
      "How are surveillance exceptions investigated?",
    ],
    gaps: [
      "Kill switch testing evidence is missing.",
      "Surveillance review documentation is incomplete.",
    ],
  },
];


