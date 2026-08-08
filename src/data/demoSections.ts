// src/data/demoSections.ts

import type { DemoDocumentId } from "./demoDocuments";

export type DemoSectionId = string;

export type DemoSection = {
  id: DemoSectionId;
  documentId: DemoDocumentId;
  sectionNumber?: number | string;
  title: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  applicable: boolean;
  summary: string;
};

export const demoSections: DemoSection[] = [
  // Stock Brokers – core sections[file:15]
  {
    id: "SB_SEC_61",
    documentId: "stock-brokers",
    sectionNumber: 61,
    title: "Cyber Security and Cyber Resilience Framework",
    riskLevel: "High",
    applicable: true,
    summary:
      "Prescribes cyber security and resilience requirements for broker trading and back-office systems.",
  },
  {
    id: "SB_SEC_72",
    documentId: "stock-brokers",
    sectionNumber: 72,
    title: "Exclusive e-mail ID for redressal of Investor Complaints",
    riskLevel: "Medium",
    applicable: true,
    summary:
      "Requires brokers to maintain and disclose an exclusive email ID for investor complaints.",
  },
  {
    id: "SB_SEC_75",
    documentId: "stock-brokers",
    sectionNumber: 75,
    title: "Publishing Investor Charter and complaints on broker websites",
    riskLevel: "Medium",
    applicable: true,
    summary:
      "Mandates brokers to publish Investor Charter and complaint data on their websites.",
  },

  // Investment Advisers – key sections[file:14]
  {
    id: "IA_SEC_GUIDELINES",
    documentId: "investment-advisers",
    sectionNumber: "I",
    title: "Guidelines for Investment Advisers",
    riskLevel: "High",
    applicable: true,
    summary:
      "Defines core conduct, client segregation, agreements, fees, and supervision requirements for IAs.",
  },
  {
    id: "IA_SEC_INV_COMPLAINTS",
    documentId: "investment-advisers",
    sectionNumber: "V",
    title: "Investor Complaints – SCORES and ODR",
    riskLevel: "Medium",
    applicable: true,
    summary:
      "Covers grievance redressal through SCORES platform and Online Dispute Resolution.",
  },
  {
    id: "IA_SEC_CSCRF",
    documentId: "investment-advisers",
    sectionNumber: "CSCRF",
    title: "Cybersecurity and Cyber Resilience Framework",
    riskLevel: "High",
    applicable: true,
    summary:
      "Extends CSCRF requirements to IAs using technology platforms and SaaS-based solutions.",
  },

  // Investor Charter – Stock Brokers[file:13]
  {
    id: "SBCH_SEC_CHARTER",
    documentId: "stock-brokers-charter",
    sectionNumber: "Annexure A",
    title: "Investor Charter – Stock Brokers",
    riskLevel: "Medium",
    applicable: true,
    summary:
      "Defines vision, services, rights, timelines, dos/don’ts, and grievance channels for investors dealing with stock brokers.",
  },
  {
    id: "SBCH_SEC_COMPLAINT_FORMAT",
    documentId: "stock-brokers-charter",
    sectionNumber: "Annexure B",
    title: "Complaint Data Disclosure Format",
    riskLevel: "High",
    applicable: true,
    summary:
      "Prescribes the format and trend tables for complaint data to be displayed on broker websites.",
  },
];

export function getSectionsByDocument(
  documentId: DemoDocumentId,
): DemoSection[] {
  return demoSections.filter((s) => s.documentId === documentId);
}
