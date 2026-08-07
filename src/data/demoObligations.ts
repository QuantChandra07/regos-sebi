// src/data/demoObligations.ts

import type { DemoDocumentId } from "./demoDocuments";
import type { ClauseId } from "./demoClauses";

export type ObligationId = string;

export type ObligationFrequency =
  | "Ongoing"
  | "Annual"
  | "Half-Yearly"
  | "Quarterly"
  | "Monthly"
  | "Event-Based";

export type ObligationCategory =
  | "Registration"
  | "Supervision"
  | "ClientFunds"
  | "ClientRelationship"
  | "Technology"
  | "CyberSecurity"
  | "AML_KYC"
  | "InvestorProtection"
  | "DefaultManagement"
  | "Conduct"
  | "Reporting";

export type ObligationRiskLevel = "Critical" | "High" | "Medium" | "Low";

export type DemoObligation = {
  id: ObligationId;
  documentId: DemoDocumentId;
  clauseId: ClauseId;
  sectionNumber?: string;
  actor: string;
  obligationText: string;
  frequency: ObligationFrequency;
  deadline?: string;
  category: ObligationCategory;
  riskLevel: ObligationRiskLevel;
};

export const demoObligations: DemoObligation[] = [
  // Stock Brokers – key obligations[file:15]
  {
    id: "SB_OBL_INT_AUDIT",
    documentId: "stock-brokers",
    clauseId: "SB-13",
    sectionNumber: "13.2.1",
    actor: "Stock Broker",
    obligationText:
      "Carry out complete internal audit on a half-yearly basis through an independent qualified professional.",
    frequency: "Half-Yearly",
    deadline: "Submit audit report within 2 months from end of half-year",
    category: "Supervision",
    riskLevel: "High",
  },
  {
    id: "SB_OBL_CLIENT_FUNDS_MONITORING",
    documentId: "stock-brokers",
    clauseId: "SB-15",
    sectionNumber: "15.5",
    actor: "Stock Broker",
    obligationText:
      "Implement enhanced supervision and daily monitoring to ensure client funds and securities are not misused for proprietary purposes.",
    frequency: "Ongoing",
    category: "ClientFunds",
    riskLevel: "Critical",
  },
  {
    id: "SB_OBL_CYBER_FRAMEWORK",
    documentId: "stock-brokers",
    clauseId: "SB-61",
    actor: "Stock Broker",
    obligationText:
      "Implement cyber security and resilience measures for trading and back-office systems in line with SEBI’s cyber framework.",
    frequency: "Ongoing",
    category: "CyberSecurity",
    riskLevel: "Critical",
  },
  {
    id: "SB_OBL_CYBER_INCIDENT_REPORTING",
    documentId: "stock-brokers",
    clauseId: "SB-61",
    actor: "Stock Broker",
    obligationText:
      "Report significant cyber incidents to exchanges / SEBI in the prescribed incident reporting format.",
    frequency: "Event-Based",
    category: "CyberSecurity",
    riskLevel: "High",
  },
  {
    id: "SB_OBL_INVESTOR_CHARTER_PUBLISH",
    documentId: "stock-brokers",
    clauseId: "SB-75",
    actor: "Stock Broker",
    obligationText:
      "Publish Investor Charter and investor complaints data on the broker’s website as per prescribed format.",
    frequency: "Ongoing",
    category: "InvestorProtection",
    riskLevel: "Medium",
  },

  // Investment Advisers – key obligations[file:14]
  {
    id: "IA_OBL_CLIENT_SEGREGATION",
    documentId: "investment-advisers",
    clauseId: "IA-1",
    sectionNumber: "1(i)",
    actor: "Investment Adviser",
    obligationText:
      "Ensure client-level segregation of advisory and distribution activities at group / family level.",
    frequency: "Ongoing",
    category: "Conduct",
    riskLevel: "High",
  },
  {
    id: "IA_OBL_IA_CLIENT_AGREEMENT",
    documentId: "investment-advisers",
    clauseId: "IA-32",
    sectionNumber: "Annexure A",
    actor: "Investment Adviser",
    obligationText:
      "Execute IA–client agreements using standardized terms and MITC as per Annexures A and B.",
    frequency: "Event-Based",
    category: "ClientRelationship",
    riskLevel: "High",
  },
  {
    id: "IA_OBL_ANNUAL_COMPLIANCE_AUDIT",
    documentId: "investment-advisers",
    clauseId: "IA-1",
    sectionNumber: "1(xiv)",
    actor: "Investment Adviser",
    obligationText:
      "Conduct annual compliance audit and submit report to IAASB / SEBI, and publish status.",
    frequency: "Annual",
    category: "Supervision",
    riskLevel: "High",
  },
  {
    id: "IA_OBL_SCORES_ODR_DISCLOSURE",
    documentId: "investment-advisers",
    clauseId: "IA-6",
    actor: "Investment Adviser",
    obligationText:
      "Prominently display grievance redressal information about SCORES and ODR platforms.",
    frequency: "Ongoing",
    category: "InvestorProtection",
    riskLevel: "Medium",
  },
  {
    id: "IA_OBL_INVESTOR_CHARTER_DISPLAY",
    documentId: "investment-advisers",
    clauseId: "IA-35",
    actor: "Investment Adviser",
    obligationText:
      "Bring the Investor Charter for IAs to the notice of clients via website, app, and office display.",
    frequency: "Ongoing",
    category: "InvestorProtection",
    riskLevel: "Medium",
  },
  {
    id: "IA_OBL_COMPLAINT_DATA_DISCLOSURE",
    documentId: "investment-advisers",
    clauseId: "IA-34",
    actor: "Investment Adviser",
    obligationText:
      "Disclose complaint data on website and app by the 7th of each month in Annexure C format.",
    frequency: "Monthly",
    category: "Reporting",
    riskLevel: "Medium",
  },
  {
    id: "IA_OBL_SAAS_ADVISORY_COMPLIANCE",
    documentId: "investment-advisers",
    clauseId: "IA-5",
    actor: "Investment Adviser",
    obligationText:
      "Comply with SaaS advisory and MoE&IT / CERT-In guidelines, and report compliance periodically.",
    frequency: "Half-Yearly",
    category: "Technology",
    riskLevel: "High",
  },
  {
    id: "IA_OBL_CSCRF_COMPLIANCE",
    documentId: "investment-advisers",
    clauseId: "IA-18",
    actor: "Investment Adviser",
    obligationText:
      "Implement CSCRF cybersecurity and resilience controls and maintain compliance reports.",
    frequency: "Ongoing",
    category: "CyberSecurity",
    riskLevel: "High",
  },
  {
    id: "IA_OBL_AML_KYC_COMPLIANCE",
    documentId: "investment-advisers",
    clauseId: "IA-16",
    actor: "Investment Adviser",
    obligationText:
      "Implement AML / CFT standards and KYC norms in line with SEBI guidelines.",
    frequency: "Ongoing",
    category: "AML_KYC",
    riskLevel: "High",
  },

  // Investor Charter – Stock Brokers[file:13]
  {
    id: "SBCH_OBL_CHARER_COMMUNICATION",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-3",
    actor: "Stock Broker",
    obligationText:
      "Bring the Investor Charter for Stock Brokers to clients via website, office display, onboarding kit, and communications.",
    frequency: "Ongoing",
    category: "InvestorProtection",
    riskLevel: "Medium",
  },
  {
    id: "SBCH_OBL_COMPLAINT_DATA_DISCLOSURE",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-9",
    actor: "Stock Broker",
    obligationText:
      "Disclose complaint data and disposal status on website by the 7th of the succeeding month in Annexure B format.",
    frequency: "Monthly",
    deadline: "By 7th of succeeding month",
    category: "Reporting",
    riskLevel: "Medium",
  },
  {
    id: "SBCH_OBL_SERVICE_TIMELINES",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-5",
    actor: "Stock Broker",
    obligationText:
      "Adhere to specified timelines for KYC, onboarding, contract notes, settlements, and grievance redressal.",
    frequency: "Ongoing",
    category: "Conduct",
    riskLevel: "High",
  },
  {
    id: "SBCH_OBL_GRIEVANCE_TIMELINE",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-5",
    actor: "Stock Broker",
    obligationText:
      "Redress investor grievances within 21 calendar days from receipt of complaint.",
    frequency: "Event-Based",
    deadline: "Within 21 calendar days",
    category: "InvestorProtection",
    riskLevel: "High",
  },
  {
    id: "SBCH_OBL_GRIEVANCE_MECHANISM_DISCLOSURE",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-7",
    actor: "Stock Broker",
    obligationText:
      "Inform investors about grievance channels including broker email, Exchange, SCORES 2.0, and SMARTODR.",
    frequency: "Ongoing",
    category: "InvestorProtection",
    riskLevel: "Medium",
  },
  {
    id: "SBCH_OBL_DEFAULT_HANDLING_INFO",
    documentId: "stock-brokers-charter",
    clauseId: "SBCH-8",
    actor: "Stock Exchange",
    obligationText:
      "Communicate broker default events, invite claims, and provide IPF norms, forms, SOPs, and status tracking to investors.",
    frequency: "Event-Based",
    category: "DefaultManagement",
    riskLevel: "Critical",
  },
];

export function getObligationsByDocument(
  documentId: DemoDocumentId,
): DemoObligation[] {
  return demoObligations.filter((o) => o.documentId === documentId);
}
