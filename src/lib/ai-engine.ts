import type { Clause, Obligation, RiskLevel } from "@/types";
import { mockClauses, mockObligations } from "@/lib/seed-data";

export type CopilotResponse = {
  answer: string;
  sourceCirculars: string[];
  linkedObligations: string[];
  suggestedActions: string[];
};

type MockRiskScore = {
  owner: string;
  score: number;
  trend: string;
  level: RiskLevel;
};

const mockRiskScores: MockRiskScore[] = [
  { owner: "Technology", score: 82, trend: "+4", level: "CRITICAL" },
  { owner: "Operations", score: 61, trend: "-2", level: "HIGH" },
  { owner: "Compliance", score: 44, trend: "0", level: "MEDIUM" },
  { owner: "Trading", score: 38, trend: "+1", level: "LOW" },
];

export async function computeRiskScore(
  department: string
): Promise<{
  score: number;
  trend: "UP" | "DOWN" | "STABLE";
  level: RiskLevel;
}> {
  await new Promise((res) => setTimeout(res, 700));

  const match = mockRiskScores.find(
    (item) => item.owner.toLowerCase() === department.toLowerCase()
  );

  if (match) {
    return {
      score: match.score,
      trend: match.trend.startsWith("+")
        ? "UP"
        : match.trend.startsWith("-")
        ? "DOWN"
        : "STABLE",
      level: match.level,
    };
  }

  const normalized = department.trim().toLowerCase();
  const hash = normalized
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const score = 25 + (hash % 65);

  let level: RiskLevel = "LOW";
  if (score >= 75) level = "CRITICAL";
  else if (score >= 60) level = "HIGH";
  else if (score >= 40) level = "MEDIUM";

  return {
    score,
    trend: "STABLE",
    level,
  };
}

export async function extractClausesFromDoc(
  documentId: string
): Promise<Clause[]> {
  await new Promise((res) => setTimeout(res, 800));
  return mockClauses.filter((c) => c.documentId === documentId);
}

export async function extractObligationsFromClause(
  clauseId: string
): Promise<Obligation[]> {
  await new Promise((res) => setTimeout(res, 600));
  return mockObligations.filter((o) => o.clauseId === clauseId);
}

export async function askCopilot(query: string): Promise<CopilotResponse> {
  await new Promise((res) => setTimeout(res, 1000));

  const lower = query.toLowerCase();

  if (lower.includes("cybersecurity") || lower.includes("vapt")) {
    return {
      answer:
        "Based on SEBI Master Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/102, stockbrokers must undergo VAPT bi-annually through a CERT-In empaneled auditor. Current status for your entity shows 1 active task due in 20 days with evidence pending verification.",
      sourceCirculars: [
        "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/102 (Clause 4.2.1)",
      ],
      linkedObligations: ["obl-201"],
      suggestedActions: ["Request Audit Logs", "Assign Urgent Task to CISO"],
    };
  }

  return {
    answer: `Analysis complete for query: "${query}". All active SEBI obligations across Technology, Operations, and Compliance departments were scanned. Current system compliance score is at 96% with 1 critical deadline approaching for VAPT audit submission.`,
    sourceCirculars: ["SEBI Master Circular 2024 (General Corpus)"],
    linkedObligations: ["obl-201", "obl-202"],
    suggestedActions: ["Simulate Inspection", "Generate Board Compliance Pack"],
  };
}
