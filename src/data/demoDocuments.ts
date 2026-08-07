// src/data/demoDocuments.ts

export type DemoDocumentId =
  | "stock-brokers"
  | "investment-advisers"
  | "stock-brokers-charter";

export type DemoDocumentMeta = {
  id: DemoDocumentId;
  title: string;
  circularNumber?: string;
  issueDate?: string; // YYYY-MM-DD
  regulator: string;
  pages: number;
  coverage: "High" | "Medium" | "Low";
  riskAreasEstimate: number;
  entityTypes: string[];
  expectedControls: string[];
};

export const demoDocuments: DemoDocumentMeta[] = [
  // Master Circular for Stock Brokers (Aug 09, 2024)[file:15]
  {
    id: "stock-brokers",
    title: "Master Circular for Stock Brokers",
    circularNumber: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/110",
    issueDate: "2024-08-09",
    regulator: "SEBI",
    pages: 419,
    coverage: "High",
    riskAreasEstimate: 58,
    entityTypes: [
      "Stock Brokers",
      "Trading Members",
      "Clearing Members",
      "Depository Participants",
      "SEBI Regulated Entities",
    ],
    expectedControls: [
      "Cyber Security & Resilience",
      "Client Protection",
      "Client Funds & Securities Safeguarding",
      "AML & KYC Compliance",
      "Risk Management & Supervision",
      "Investor Grievance Redressal",
      "System Audit & Internal Audit",
    ],
  },

  // Master Circular for Investment Advisers (Feb 06, 2026)[file:14]
  {
    id: "investment-advisers",
    title: "Master Circular for Investment Advisers",
    circularNumber: "HO/38/12/11(2)2026-MIRSD-POD/I/4300/2026",
    issueDate: "2026-02-06",
    regulator: "SEBI",
    pages: 99,
    coverage: "Medium",
    riskAreasEstimate: 32,
    entityTypes: [
      "Investment Advisers",
      "Investment Adviser Administration and Supervisory Body (IAASB)",
    ],
    expectedControls: [
      "Conduct & Suitability of Advice",
      "Client-level Segregation of Advisory & Distribution",
      "IA–Client Agreements & MITC",
      "Fee Caps & Centralised Fee Collection (CeFCoM)",
      "Deposit Requirements & Registration Transition",
      "Administration & Supervision via IAASB",
      "Technology & SaaS Controls",
      "Cybersecurity & Cyber Resilience (CSCRF)",
      "Investor Complaints (SCORES & ODR)",
      "Investor Charter & Complaint Disclosure",
      "Change in Control & Fit & Proper",
      "Advertisement Code & Brand Usage",
      "AML & KYC Obligations",
      "Outsourcing & Regulatory Sandbox",
      "Reporting Requirements & Annexures",
    ],
  },

  // Investor Charter for Stock Brokers (Feb 21, 2025)[file:13]
  {
    id: "stock-brokers-charter",
    title: "Investor Charter for Stock Brokers",
    circularNumber: "SEBI/HO/MIRSD/MIRSD-PoD1/P/CIR/2025/22",
    issueDate: "2025-02-21",
    regulator: "SEBI",
    pages: 11,
    coverage: "Low",
    riskAreasEstimate: 10,
    entityTypes: ["Stock Brokers", "Recognized Stock Exchanges"],
    expectedControls: [
      "Investor Charter Communication",
      "Investor Complaint Disclosure",
      "Service Standards & Timelines",
      "Grievance Redressal Mechanism (SCORES 2.0 & SMARTODR)",
      "Default Handling & Investor Protection Fund (IPF)",
      "Rights & Obligations Communication",
    ],
  },
];

export function getDemoDocument(id: DemoDocumentId): DemoDocumentMeta | undefined {
  return demoDocuments.find((doc) => doc.id === id);
}
