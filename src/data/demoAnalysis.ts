// src/data/demoAnalysis.ts

import type { DemoDocumentId } from "./demoDocuments";

export type DemoAnalysis = {
  documentId: DemoDocumentId;
  pagesProcessed: number;
  textChunks: number;
  clausesIdentified: number;
  obligations: number;
  highRiskClauses: number;
  departmentsAffected: number;
  workflowsGenerated: number;
  evidenceRequirements: number;
  knowledgeGraphNodes: number;
  inspectionReadinessScore: number;
  complianceScore: number;
  openObligations: number;
  criticalRisks: number;
  evidencePending: number;
  controlsGenerated: number;
  aiConfidence: number;
};

export const demoAnalysisByDocumentId: Record<DemoDocumentId, DemoAnalysis> = {
  // Stock Brokers Master Circular[file:15]
  "stock-brokers": {
    documentId: "stock-brokers",
    pagesProcessed: 419,
    textChunks: 7842,
    clausesIdentified: 532,
    obligations: 148,
    highRiskClauses: 17,
    departmentsAffected: 8,
    workflowsGenerated: 31,
    evidenceRequirements: 64,
    knowledgeGraphNodes: 1276,
    inspectionReadinessScore: 94,
    complianceScore: 92,
    openObligations: 63,
    criticalRisks: 8,
    evidencePending: 19,
    controlsGenerated: 154,
    aiConfidence: 97,
  },

  // Investment Advisers Master Circular[file:14]
  "investment-advisers": {
    documentId: "investment-advisers",
    pagesProcessed: 99,
    textChunks: 1850,
    clausesIdentified: 40,
    obligations: 95,
    highRiskClauses: 10,
    departmentsAffected: 6,
    workflowsGenerated: 22,
    evidenceRequirements: 40,
    knowledgeGraphNodes: 620,
    inspectionReadinessScore: 90,
    complianceScore: 88,
    openObligations: 27,
    criticalRisks: 5,
    evidencePending: 12,
    controlsGenerated: 96,
    aiConfidence: 95,
  },

  // Investor Charter for Stock Brokers[file:13]
  "stock-brokers-charter": {
    documentId: "stock-brokers-charter",
    pagesProcessed: 11,
    textChunks: 220,
    clausesIdentified: 10,
    obligations: 24,
    highRiskClauses: 6,
    departmentsAffected: 4,
    workflowsGenerated: 10,
    evidenceRequirements: 18,
    knowledgeGraphNodes: 280,
    inspectionReadinessScore: 93,
    complianceScore: 91,
    openObligations: 7,
    criticalRisks: 3,
    evidencePending: 5,
    controlsGenerated: 42,
    aiConfidence: 96,
  },
};

export function getDemoAnalysis(documentId: DemoDocumentId): DemoAnalysis {
  return demoAnalysisByDocumentId[documentId];
}
