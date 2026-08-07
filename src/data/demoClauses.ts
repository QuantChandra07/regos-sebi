// src/data/demoClauses.ts

import type { DemoDocumentId } from "./demoDocuments";

export type ClauseId = string;

export type DemoClause = {
  id: ClauseId;
  documentId: DemoDocumentId;
  sectionGroup: string;
  title: string;
  pageStart?: number;
  pageEnd?: number;
};

export const demoClauses: DemoClause[] = [
  // STOCK BROKERS – sample TOC-based clauses[file:15]
  {
    id: "SB-1",
    documentId: "stock-brokers",
    sectionGroup: "REGISTRATION OF STOCK BROKERS",
    title: "Registration of Brokers – Verification of antecedents of the applicant",
    pageStart: 10,
  },
  {
    id: "SB-13",
    documentId: "stock-brokers",
    sectionGroup: "SUPERVISION & OVERSIGHT",
    title:
      "Oversight of Members (Stock Brokers / Trading Members / Clearing Members of Stock Exchanges and Clearing Corporations)",
    pageStart: 19,
  },
  {
    id: "SB-15",
    documentId: "stock-brokers",
    sectionGroup: "SUPERVISION & OVERSIGHT",
    title: "Enhanced Supervision of Stock Brokers / Depository Participants",
    pageStart: 24,
  },
  {
    id: "SB-16",
    documentId: "stock-brokers",
    sectionGroup: "SUPERVISION & OVERSIGHT",
    title: "Annual System Audit of Stock Brokers / Trading Members",
    pageStart: 38,
  },
  {
    id: "SB-17",
    documentId: "stock-brokers",
    sectionGroup: "SUPERVISION & OVERSIGHT",
    title: "Early Warning Mechanism to prevent diversion of client securities",
    pageStart: 42,
  },
  {
    id: "SB-18",
    documentId: "stock-brokers",
    sectionGroup: "SUPERVISION & OVERSIGHT",
    title:
      "Enhanced obligations and responsibilities on Qualified Stock Brokers (QSBs)",
    pageStart: 46,
  },
  {
    id: "SB-20",
    documentId: "stock-brokers",
    sectionGroup: "DEALINGS WITH CLIENT",
    title: "Simplification and rationalization of trading account opening process",
    pageStart: 58,
  },
  {
    id: "SB-24",
    documentId: "stock-brokers",
    sectionGroup: "DEALINGS WITH CLIENT",
    title: "Collateral deposited by Clients with Brokers",
    pageStart: 69,
  },
  {
    id: "SB-61",
    documentId: "stock-brokers",
    sectionGroup: "TECHNOLOGY RELATED PROVISIONS",
    title: "Cyber Security and Cyber resilience framework for Stock Brokers",
    pageStart: 166,
  },
  {
    id: "SB-62",
    documentId: "stock-brokers",
    sectionGroup: "TECHNOLOGY RELATED PROVISIONS",
    title:
      "Reporting for Artificial Intelligence (AI) and Machine Learning (ML) applications and systems",
    pageStart: 180,
  },
  {
    id: "SB-72",
    documentId: "stock-brokers",
    sectionGroup: "INVESTOR GRIEVANCE REDRESSAL",
    title: "Exclusive e-mail ID for redressal of Investor Complaints",
    pageStart: 201,
  },
  {
    id: "SB-75",
    documentId: "stock-brokers",
    sectionGroup: "INVESTOR GRIEVANCE REDRESSAL",
    title:
      "Publishing Investor Charter and disclosure of Investor Complaints by Stock Brokers on their websites",
    pageStart: 202,
  },
  {
    id: "SB-76",
    documentId: "stock-brokers",
    sectionGroup: "DEFAULT RELATED PROVISIONS",
    title:
      "Standard operating procedure in the cases of Trading Member / Clearing Member leading to default",
    pageStart: 203,
  },

  // INVESTMENT ADVISERS – key TOC clauses[file:14]
  {
    id: "IA-1",
    documentId: "investment-advisers",
    sectionGroup: "GUIDELINES FOR INVESTMENT ADVISERS",
    title: "Guidelines for Investment Advisers",
    pageStart: 6,
  },
  {
    id: "IA-2",
    documentId: "investment-advisers",
    sectionGroup:
      "MEASURES TO STRENGTHEN THE CONDUCT OF INVESTMENT ADVISERS",
    title: "Measures to strengthen the conduct of Investment Advisers",
    pageStart: 24,
  },
  {
    id: "IA-3",
    documentId: "investment-advisers",
    sectionGroup:
      "ADMINISTRATION AND SUPERVISION OF INVESTMENT ADVISERS",
    title:
      "Framework for administration and supervision of Research Analysts and Investment Advisers",
    pageStart: 26,
  },
  {
    id: "IA-5",
    documentId: "investment-advisers",
    sectionGroup: "TECHNOLOGY RELATED",
    title:
      "Advisory for Financial Sector Organizations regarding SaaS based solutions",
    pageStart: 29,
  },
  {
    id: "IA-6",
    documentId: "investment-advisers",
    sectionGroup: "INVESTOR COMPLAINTS",
    title:
      "Redressal of investor grievances through SCORES platform and ODR platform",
    pageStart: 30,
  },
  {
    id: "IA-7",
    documentId: "investment-advisers",
    sectionGroup: "INVESTOR COMPLAINTS",
    title: "Investor Charter for Investment Advisers",
    pageStart: 31,
  },
  {
    id: "IA-10",
    documentId: "investment-advisers",
    sectionGroup: "MISCELLANEOUS",
    title: "Advertisement code and usage of brand name / trade name",
    pageStart: 37,
  },
  {
    id: "IA-16",
    documentId: "investment-advisers",
    sectionGroup: "MISCELLANEOUS",
    title:
      "Guidelines on Anti-Money Laundering (AML) Standards and Combating the Financing of Terrorism",
    pageStart: 48,
  },
  {
    id: "IA-18",
    documentId: "investment-advisers",
    sectionGroup: "MISCELLANEOUS",
    title:
      "Cybersecurity and Cyber Resilience Framework (CSCRF) for SEBI Regulated Entities",
    pageStart: 53,
  },
  {
    id: "IA-30",
    documentId: "investment-advisers",
    sectionGroup: "REPORTING REQUIREMENTS",
    title: "Periodic reporting format for Investment Advisers",
    pageStart: 56,
  },
  {
    id: "IA-34",
    documentId: "investment-advisers",
    sectionGroup: "ANNEXURES",
    title: "Annexure C – Complaint Data to be displayed by IAs",
    pageStart: 67,
  },
  {
    id: "IA-35",
    documentId: "investment-advisers",
    sectionGroup: "ANNEXURES",
    title:
      "Annexure F – Investor Charter in respect of Investment Advisers",
    pageStart: 77,
  },

  // INVESTOR CHARTER – Stock Brokers[file:13]
  {
    id: "SBCH-1",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Vision",
    pageStart: 3,
  },
  {
    id: "SBCH-2",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Mission",
    pageStart: 3,
  },
  {
    id: "SBCH-3",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Services provided to investors by stockbrokers",
    pageStart: 3,
  },
  {
    id: "SBCH-4",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Rights of Investors",
    pageStart: 3,
  },
  {
    id: "SBCH-5",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Various activities of Stock Brokers with timelines",
    pageStart: 4,
  },
  {
    id: "SBCH-6",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "DOs and DON’Ts for Investors",
    pageStart: 5,
  },
  {
    id: "SBCH-7",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title: "Grievance Redressal Mechanism",
    pageStart: 7,
  },
  {
    id: "SBCH-8",
    documentId: "stock-brokers-charter",
    sectionGroup: "INVESTOR CHARTER – STOCK BROKERS",
    title:
      "Handling of investor claims / complaints in case of default of Trading Member / Clearing Member",
    pageStart: 8,
  },
  {
    id: "SBCH-9",
    documentId: "stock-brokers-charter",
    sectionGroup: "COMPLAINT DISCLOSURE FORMAT",
    title:
      "Format for Investor Complaints Data to be displayed by Stock Brokers",
    pageStart: 10,
  },
];

export function getClausesByDocument(documentId: DemoDocumentId): DemoClause[] {
  return demoClauses.filter((c) => c.documentId === documentId);
}
