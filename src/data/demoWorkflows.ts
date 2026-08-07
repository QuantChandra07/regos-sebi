// src/data/demoWorkflows.ts

import type { DemoDocumentId } from "./demoDocuments";
import type { ObligationId } from "./demoObligations";

export type WorkflowStatus =
  | "NOT_STARTED"
  | "IN_DESIGN"
  | "ACTIVE"
  | "COMPLIANT";

export type WorkflowId = string;

export type DemoWorkflowTask = {
  id: WorkflowId;
  documentId: DemoDocumentId;
  obligationId: ObligationId;
  title: string;
  description: string;
  department: string;
  status: WorkflowStatus;
  dueDate?: string;
  evidenceItemIds: string[];
};

export const demoWorkflows: DemoWorkflowTask[] = [
  // Stock Brokers – audits, funds, cyber[file:15]
  {
    id: "SB_WF_INT_AUDIT_PLAN",
    documentId: "stock-brokers",
    obligationId: "SB_OBL_INT_AUDIT",
    title: "Plan half-yearly internal audits",
    description:
      "Define scope, appoint auditor, and schedule half-yearly internal audits.",
    department: "Compliance",
    status: "ACTIVE",
    dueDate: "2025-09-30",
    evidenceItemIds: ["SB_EV_INT_AUDIT_REPORT"],
  },
  {
    id: "SB_WF_CLIENT_FUNDS_MONITORING",
    documentId: "stock-brokers",
    obligationId: "SB_OBL_CLIENT_FUNDS_MONITORING",
    title: "Implement daily client funds monitoring",
    description:
      "Configure systems to monitor client funds and generate misuse alerts.",
    department: "Risk",
    status: "ACTIVE",
    evidenceItemIds: ["SB_EV_CLIENT_FUNDS_REPORT"],
  },
  {
    id: "SB_WF_CYBER_FRAMEWORK_IMPLEMENT",
    documentId: "stock-brokers",
    obligationId: "SB_OBL_CYBER_FRAMEWORK",
    title: "Implement cyber security framework",
    description:
      "Roll out cyber security controls, incident detection, and resilience measures.",
    department: "IT",
    status: "IN_DESIGN",
    evidenceItemIds: ["SB_EV_CYBER_POLICY", "SB_EV_CYBER_INCIDENT_LOGS"],
  },

  // Investment Advisers – key workflows[file:17]
  {
    id: "IA_WF_CLIENT_SEGREGATION_SETUP",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_CLIENT_SEGREGATION",
    title: "Implement client-level advisory/distribution segregation",
    description:
      "Configure systems to enforce client-level segregation at group / family level.",
    department: "Compliance",
    status: "ACTIVE",
    evidenceItemIds: ["IA_EV_CLIENT_SEGREGATION_POLICY"],
  },
  {
    id: "IA_WF_AGREEMENT_TEMPLATE_ROLLOUT",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_IA_CLIENT_AGREEMENT",
    title: "Roll out IA–client agreements and MITC",
    description:
      "Adopt Annexure A / B templates and update client onboarding flows.",
    department: "Compliance",
    status: "ACTIVE",
    evidenceItemIds: ["IA_EV_AGREEMENT_TEMPLATE", "IA_EV_MITC_TEMPLATE"],
  },
  {
    id: "IA_WF_ANNUAL_COMPLIANCE_AUDIT",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_ANNUAL_COMPLIANCE_AUDIT",
    title: "Conduct annual IA compliance audit",
    description:
      "Schedule audit, gather evidence, produce report, submit to IAASB / SEBI, and publish status.",
    department: "Compliance",
    status: "IN_DESIGN",
    dueDate: "2026-10-31",
    evidenceItemIds: ["IA_EV_COMPLIANCE_AUDIT_REPORT"],
  },
  {
    id: "IA_WF_SAAS_ADVISORY_COMPLIANCE",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_SAAS_ADVISORY_COMPLIANCE",
    title: "Implement SaaS advisory controls and reporting",
    description:
      "Assess SaaS solutions, implement data residency controls, and prepare compliance undertakings.",
    department: "IT",
    status: "ACTIVE",
    evidenceItemIds: ["IA_EV_SAAS_UNDERTAKING"],
  },
  {
    id: "IA_WF_CSCRF_IMPLEMENTATION",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_CSCRF_COMPLIANCE",
    title: "Implement CSCRF cyber security controls",
    description:
      "Deploy CSCRF controls, test resilience, and maintain compliance reports.",
    department: "IT",
    status: "IN_DESIGN",
    evidenceItemIds: ["IA_EV_CSCRF_COMPLIANCE_REPORT"],
  },
  {
    id: "IA_WF_INVESTOR_CHARTER_AND_COMPLAINTS",
    documentId: "investment-advisers",
    obligationId: "IA_OBL_INVESTOR_CHARTER_DISPLAY",
    title: "Publish IA Investor Charter and complaint data",
    description:
      "Update website and app with Investor Charter and monthly complaint statistics.",
    department: "Compliance",
    status: "ACTIVE",
    evidenceItemIds: ["IA_EV_INVESTOR_CHARTER_DOC", "IA_EV_COMPLAINTS_DATA"],
  },

  // Investor Charter – Stock Brokers workflows[file:16][file:13]
  {
    id: "SBCH_WF_CHARER_COMMUNICATION",
    documentId: "stock-brokers-charter",
    obligationId: "SBCH_OBL_CHARER_COMMUNICATION",
    title: "Roll out Investor Charter communication",
    description:
      "Update website, office display, onboarding kits, and email templates with the updated Investor Charter.",
    department: "Compliance",
    status: "ACTIVE",
    evidenceItemIds: [
      "SBCH_EV_INVESTOR_CHARTER_DOC",
      "SBCH_EV_CHARER_COMMUNICATION_EVIDENCE",
    ],
  },
  {
    id: "SBCH_WF_COMPLAINT_DATA_REPORTING",
    documentId: "stock-brokers-charter",
    obligationId: "SBCH_OBL_COMPLAINT_DATA_DISCLOSURE",
    title: "Publish monthly complaint data on website",
    description:
      "Aggregate complaint data, populate Annexure B format, and publish by the 7th of succeeding month.",
    department: "Compliance",
    status: "ACTIVE",
    evidenceItemIds: ["SBCH_EV_COMPLAINTS_DATA_TABLE"],
  },
  {
    id: "SBCH_WF_SERVICE_TIMELINE_MONITORING",
    documentId: "stock-brokers-charter",
    obligationId: "SBCH_OBL_SERVICE_TIMELINES",
    title: "Monitor broker service timelines",
    description:
      "Monitor KYC, onboarding, contract notes, settlements, and grievance resolution against Charter timelines.",
    department: "Operations",
    status: "IN_DESIGN",
    evidenceItemIds: ["SBCH_EV_SERVICE_TIMELINE_LOGS"],
  },
  {
    id: "SBCH_WF_GRIEVANCE_MECHANISM",
    documentId: "stock-brokers-charter",
    obligationId: "SBCH_OBL_GRIEVANCE_MECHANISM_DISCLOSURE",
    title: "Implement grievance mechanism and disclosures",
    description:
      "Inform investors of broker grievance email, Exchange contacts, SCORES 2.0, and SMARTODR.",
    department: "Client Service",
    status: "ACTIVE",
    evidenceItemIds: ["SBCH_EV_GRIEVANCE_COMMUNICATION"],
  },
  {
    id: "SBCH_WF_DEFAULT_HANDLING",
    documentId: "stock-brokers-charter",
    obligationId: "SBCH_OBL_DEFAULT_HANDLING_INFO",
    title: "Coordinate default handling and IPF communication",
    description:
      "Follow SOP for broker defaults, issue notices, invite claims, and guide investors on IPF process.",
    department: "Legal",
    status: "NOT_STARTED",
    evidenceItemIds: ["SBCH_EV_DEFAULT_SOP_DOC"],
  },
];

export function getWorkflowsByDocument(
  documentId: DemoDocumentId,
): DemoWorkflowTask[] {
  return demoWorkflows.filter((wf) => wf.documentId === documentId);
}
