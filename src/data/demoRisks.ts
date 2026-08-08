// src/data/demoRisks.ts

import type { DemoDocumentId } from "./demoDocuments";
import type { ClauseId } from "./demoClauses";
import type { ObligationId } from "./demoObligations";

export type RiskId = string;
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export type DemoRiskTopic = {
  id: RiskId;
  documentId: DemoDocumentId;
  title: string;
  description: string;
  clauseId: ClauseId;
  impactScore: number;
  likelihoodScore: number;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  relatedObligationIds: ObligationId[];
};

export const demoRisks: DemoRiskTopic[] = [
  // Stock Brokers – client funds & cyber[file:15]
  {
    id: "SB_RISK_DIVERSION_CLIENT_SECURITIES",
    documentId: "stock-brokers",
    title: "Diversion or misuse of client securities",
    description:
      "Risk that client securities are diverted or misused, triggering early warning alerts and potential defaults.",
    clauseId: "SB-17",
    impactScore: 9,
    likelihoodScore: 7,
    overallRiskScore: 8.3,
    riskLevel: "Critical",
    relatedObligationIds: ["SB_OBL_CLIENT_FUNDS_MONITORING"],
  },
  {
    id: "SB_RISK_MISUSE_CLIENT_FUNDS",
    documentId: "stock-brokers",
    title: "Misuse of client funds for proprietary purposes",
    description:
      "Risk that client money is used to fund proprietary trades or settle proprietary obligations.",
    clauseId: "SB-15",
    impactScore: 9,
    likelihoodScore: 6,
    overallRiskScore: 7.8,
    riskLevel: "Critical",
    relatedObligationIds: ["SB_OBL_CLIENT_FUNDS_MONITORING"],
  },
  {
    id: "SB_RISK_CYBER_INCIDENTS",
    documentId: "stock-brokers",
    title: "Cyber attacks on trading and back-office systems",
    description:
      "Risk of cyber incidents impacting availability, integrity, or confidentiality of broker systems.",
    clauseId: "SB-61",
    impactScore: 8,
    likelihoodScore: 6,
    overallRiskScore: 7.2,
    riskLevel: "High",
    relatedObligationIds: [
      "SB_OBL_CYBER_FRAMEWORK",
      "SB_OBL_CYBER_INCIDENT_REPORTING",
    ],
  },

  // Investment Advisers – conduct, SaaS, CSCRF, AML[file:14]
  {
    id: "IA_RISK_UNSUITABLE_ADVICE",
    documentId: "investment-advisers",
    title: "Unsuitable investment advice due to inadequate risk profiling",
    description:
      "Risk that advice is not aligned with client risk profile, causing mis-selling and poor outcomes.",
    clauseId: "IA-2",
    impactScore: 8,
    likelihoodScore: 6,
    overallRiskScore: 7.2,
    riskLevel: "High",
    relatedObligationIds: ["IA_OBL_RISK_PROFILING_CONSENT"],
  },
  {
    id: "IA_RISK_SAAS_CSCRF_TECH",
    documentId: "investment-advisers",
    title:
      "Technology and data risks from SaaS-based solutions and cybersecurity failures",
    description:
      "Risk that SaaS or weak CSCRF implementation exposes systems and client data.",
    clauseId: "IA-5",
    impactScore: 8,
    likelihoodScore: 6,
    overallRiskScore: 7.1,
    riskLevel: "High",
    relatedObligationIds: [
      "IA_OBL_SAAS_ADVISORY_COMPLIANCE",
      "IA_OBL_CSCRF_COMPLIANCE",
    ],
  },
  {
    id: "IA_RISK_AML_KYC_DEFICIENCY",
    documentId: "investment-advisers",
    title: "Deficient AML and KYC compliance",
    description:
      "Risk that inadequate AML / CFT and KYC controls allow misuse of advisory services.",
    clauseId: "IA-16",
    impactScore: 9,
    likelihoodScore: 5,
    overallRiskScore: 7.4,
    riskLevel: "High",
    relatedObligationIds: ["IA_OBL_AML_KYC_COMPLIANCE"],
  },

  // Investor Charter – communication, service, default[file:13]
  {
    id: "SBCH_RISK_CHARER_NOT_COMMUNICATED",
    documentId: "stock-brokers-charter",
    title: "Investor Charter not communicated to clients",
    description:
      "Risk that investors are unaware of their rights, service standards, and grievance mechanisms.",
    clauseId: "SBCH-3",
    impactScore: 7,
    likelihoodScore: 5,
    overallRiskScore: 6.2,
    riskLevel: "Medium",
    relatedObligationIds: ["SBCH_OBL_CHARER_COMMUNICATION"],
  },
  {
    id: "SBCH_RISK_COMPLAINT_DATA_FAILURE",
    documentId: "stock-brokers-charter",
    title: "Failure to disclose accurate investor complaint data",
    description:
      "Risk that complaint data is not disclosed or inaccurate, reducing transparency.",
    clauseId: "SBCH-9",
    impactScore: 8,
    likelihoodScore: 5,
    overallRiskScore: 6.8,
    riskLevel: "High",
    relatedObligationIds: ["SBCH_OBL_COMPLAINT_DATA_DISCLOSURE"],
  },
  {
    id: "SBCH_RISK_DEFAULT_HANDLING",
    documentId: "stock-brokers-charter",
    title: "Deficient handling of broker defaults and IPF claims",
    description:
      "Risk that investors do not receive information or support for IPF compensation in default events.",
    clauseId: "SBCH-8",
    impactScore: 9,
    likelihoodScore: 4,
    overallRiskScore: 7.1,
    riskLevel: "Critical",
    relatedObligationIds: ["SBCH_OBL_DEFAULT_HANDLING_INFO"],
  },
];

export function getRisksByDocument(
  documentId: DemoDocumentId,
): DemoRiskTopic[] {
  return demoRisks.filter((r) => r.documentId === documentId);
}
