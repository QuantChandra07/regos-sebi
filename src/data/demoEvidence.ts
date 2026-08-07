// src/data/demoEvidence.ts

import type { DemoDocumentId } from "./demoDocuments";

export type EvidenceStatus = "Verified" | "Pending" | "Missing";
export type EvidenceId = string;

export type DemoEvidenceItem = {
  id: EvidenceId;
  documentId: DemoDocumentId;
  name: string;
  evidenceType: "Report" | "Form" | "Policy" | "Log" | "Register" | "Disclosure";
  relatedObligationIds: string[];
  status: EvidenceStatus;
};

export const demoEvidenceItems: DemoEvidenceItem[] = [
  // Stock Brokers[file:15]
  {
    id: "SB_EV_INT_AUDIT_REPORT",
    documentId: "stock-brokers",
    name: "Half-yearly Internal Audit Report",
    evidenceType: "Report",
    relatedObligationIds: ["SB_OBL_INT_AUDIT"],
    status: "Verified",
  },
  {
    id: "SB_EV_CLIENT_FUNDS_REPORT",
    documentId: "stock-brokers",
    name: "Client Funds & Securities Reconciliation Report",
    evidenceType: "Report",
    relatedObligationIds: ["SB_OBL_CLIENT_FUNDS_MONITORING"],
    status: "Pending",
  },
  {
    id: "SB_EV_CYBER_POLICY",
    documentId: "stock-brokers",
    name: "Cyber Security & Resilience Policy",
    evidenceType: "Policy",
    relatedObligationIds: ["SB_OBL_CYBER_FRAMEWORK"],
    status: "Verified",
  },
  {
    id: "SB_EV_CYBER_INCIDENT_LOGS",
    documentId: "stock-brokers",
    name: "Cyber Incident Logs",
    evidenceType: "Log",
    relatedObligationIds: [
      "SB_OBL_CYBER_FRAMEWORK",
      "SB_OBL_CYBER_INCIDENT_REPORTING",
    ],
    status: "Pending",
  },

  // Investment Advisers – annexures & reports[file:17]
  {
    id: "IA_EV_AGREEMENT_TEMPLATE",
    documentId: "investment-advisers",
    name: "IA–Client Agreement Terms (Annexure A)",
    evidenceType: "Policy",
    relatedObligationIds: ["IA_OBL_IA_CLIENT_AGREEMENT"],
    status: "Verified",
  },
  {
    id: "IA_EV_MITC_TEMPLATE",
    documentId: "investment-advisers",
    name: "MITC for Investment Advisers (Annexure B)",
    evidenceType: "Policy",
    relatedObligationIds: ["IA_OBL_IA_CLIENT_AGREEMENT"],
    status: "Verified",
  },
  {
    id: "IA_EV_COMPLAINTS_DATA",
    documentId: "investment-advisers",
    name: "Complaint Data (Annexure C)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["IA_OBL_COMPLAINT_DATA_DISCLOSURE"],
    status: "Pending",
  },
  {
    id: "IA_EV_INVESTOR_CHARTER_DOC",
    documentId: "investment-advisers",
    name: "Investor Charter for Investment Advisers (Annexure F)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["IA_OBL_INVESTOR_CHARTER_DISPLAY"],
    status: "Verified",
  },
  {
    id: "IA_EV_CHANGE_CONTROL_DECLARATION",
    documentId: "investment-advisers",
    name: "Declaration for change in control (Annexure G)",
    evidenceType: "Form",
    relatedObligationIds: ["IA_OBL_CHANGE_CONTROL_APPROVAL"],
    status: "Pending",
  },
  {
    id: "IA_EV_OUTSOURCING_POLICY",
    documentId: "investment-advisers",
    name: "Outsourcing Policy and Principles (Annexure H)",
    evidenceType: "Policy",
    relatedObligationIds: ["IA_OBL_AML_KYC_COMPLIANCE"],
    status: "Verified",
  },
  {
    id: "IA_EV_SAAS_UNDERTAKING",
    documentId: "investment-advisers",
    name: "SaaS Advisory Compliance Undertaking",
    evidenceType: "Report",
    relatedObligationIds: ["IA_OBL_SAAS_ADVISORY_COMPLIANCE"],
    status: "Missing",
  },
  {
    id: "IA_EV_CSCRF_COMPLIANCE_REPORT",
    documentId: "investment-advisers",
    name: "CSCRF Compliance Report",
    evidenceType: "Report",
    relatedObligationIds: ["IA_OBL_CSCRF_COMPLIANCE"],
    status: "Pending",
  },
  {
    id: "IA_EV_COMPLIANCE_AUDIT_REPORT",
    documentId: "investment-advisers",
    name: "Annual IA Compliance Audit Report",
    evidenceType: "Report",
    relatedObligationIds: ["IA_OBL_ANNUAL_COMPLIANCE_AUDIT"],
    status: "Missing",
  },
  {
    id: "IA_EV_CLIENT_SEGREGATION_POLICY",
    documentId: "investment-advisers",
    name: "Client Segregation Policy and PAN Mapping",
    evidenceType: "Policy",
    relatedObligationIds: ["IA_OBL_CLIENT_SEGREGATION"],
    status: "Verified",
  },

  // Investor Charter – Stock Brokers[file:13]
  {
    id: "SBCH_EV_INVESTOR_CHARTER_DOC",
    documentId: "stock-brokers-charter",
    name: "Investor Charter – Stock Brokers (Annexure A)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["SBCH_OBL_CHARER_COMMUNICATION"],
    status: "Verified",
  },
  {
    id: "SBCH_EV_CHARER_COMMUNICATION_EVIDENCE",
    documentId: "stock-brokers-charter",
    name: "Evidence of Charter communication (website, office, onboarding kit)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["SBCH_OBL_CHARER_COMMUNICATION"],
    status: "Pending",
  },
  {
    id: "SBCH_EV_COMPLAINTS_DATA_TABLE",
    documentId: "stock-brokers-charter",
    name: "Complaint Data Table (Annexure B)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["SBCH_OBL_COMPLAINT_DATA_DISCLOSURE"],
    status: "Pending",
  },
  {
    id: "SBCH_EV_SERVICE_TIMELINE_LOGS",
    documentId: "stock-brokers-charter",
    name: "Service Timeline Logs (KYC, onboarding, contract notes, settlements, grievances)",
    evidenceType: "Log",
    relatedObligationIds: [
      "SBCH_OBL_SERVICE_TIMELINES",
      "SBCH_OBL_GRIEVANCE_TIMELINE",
    ],
    status: "Missing",
  },
  {
    id: "SBCH_EV_GRIEVANCE_COMMUNICATION",
    documentId: "stock-brokers-charter",
    name: "Grievance Mechanism Communication (SCORES 2.0, SMARTODR, Exchange contacts)",
    evidenceType: "Disclosure",
    relatedObligationIds: ["SBCH_OBL_GRIEVANCE_MECHANISM_DISCLOSURE"],
    status: "Pending",
  },
  {
    id: "SBCH_EV_DEFAULT_SOP_DOC",
    documentId: "stock-brokers-charter",
    name: "Default Handling SOP and IPF Claim Documentation",
    evidenceType: "Policy",
    relatedObligationIds: ["SBCH_OBL_DEFAULT_HANDLING_INFO"],
    status: "Missing",
  },
];

export function getEvidenceByDocument(
  documentId: DemoDocumentId,
): DemoEvidenceItem[] {
  return demoEvidenceItems.filter((e) => e.documentId === documentId);
}
