"use client";

import {
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Network, X, ZoomIn, ZoomOut } from "lucide-react";

import Shell from "../../components/layout/Shell";

type NodeType =
  | "circular"
  | "section"
  | "clause"
  | "obligation"
  | "risk"
  | "evidence"
  | "workflow"
  | "control"
  | "department"
  | "inspection";

interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: NodeType;
  x: number;
  y: number;
  detail: {
    title: string;
    meta: Record<string, string>;
    summary: string;
  };
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

const NODE_COLOR: Record<
  NodeType,
  { bg: string; border: string; text: string }
> = {
  circular: {
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.5)",
    text: "#38bdf8",
  },
  section: {
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.4)",
    text: "#06b6d4",
  },
  clause: {
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.4)",
    text: "#a78bfa",
  },
  obligation: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.4)",
    text: "#f59e0b",
  },
  risk: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.4)",
    text: "#ef4444",
  },
  evidence: {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.4)",
    text: "#22c55e",
  },
  workflow: {
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.4)",
    text: "#818cf8",
  },
  control: {
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.4)",
    text: "#f472b6",
  },
  department: {
    bg: "rgba(20,184,166,0.1)",
    border: "rgba(20,184,166,0.4)",
    text: "#2dd4bf",
  },
  inspection: {
    bg: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.4)",
    text: "#fb923c",
  },
};

const NODES: GraphNode[] = [
  {
    id: "c1",
    label: "Master Circular",
    sublabel: "SEBI/HO/MIRSD",
    type: "circular",
    x: 560,
    y: 80,
    detail: {
      title: "Master Circular — Stock Brokers",
      meta: {
        Issued: "Oct 16, 2024",
        Pages: "419",
        Sections: "12",
        Clauses: "532",
      },
      summary:
        "Consolidated master circular covering all stock broker obligations under SEBI (Stock Brokers) Regulations, 1992. Supersedes 47 prior circulars.",
    },
  },
  {
    id: "s1",
    label: "Section 14",
    sublabel: "AML/KYC",
    type: "section",
    x: 220,
    y: 200,
    detail: {
      title: "Section 14 — AML/KYC Procedures",
      meta: { Clauses: "18", Obligations: "9", Risk: "High" },
      summary:
        "Covers Know Your Customer, Enhanced Due Diligence, Politically Exposed Persons, and Suspicious Transaction Reporting obligations.",
    },
  },
  {
    id: "s2",
    label: "Section 19",
    sublabel: "Grievance Redressal",
    type: "section",
    x: 560,
    y: 200,
    detail: {
      title: "Section 19 — Grievance Redressal",
      meta: { Clauses: "8", Obligations: "4", Risk: "Medium" },
      summary:
        "SCORES 2.0 integration, investor complaint resolution timelines, and GRO appointment requirements.",
    },
  },
  {
    id: "s3",
    label: "Section 47",
    sublabel: "Cyber Security",
    type: "section",
    x: 900,
    y: 200,
    detail: {
      title: "Section 47 — Cyber Security Framework",
      meta: { Clauses: "12", Obligations: "6", Risk: "Critical" },
      summary:
        "Annual CERT-In audit, MFA, PAM, VAPT, BCP/DR testing and SOC requirements for all registered intermediaries.",
    },
  },
  {
    id: "cl1",
    label: "Clause 14.2",
    sublabel: "ECDD for High-Risk",
    type: "clause",
    x: 100,
    y: 340,
    detail: {
      title: "Clause 14.2 — Enhanced CDD",
      meta: {
        Obligation: "OBL-014",
        Section: "14",
        Risk: "High",
      },
      summary:
        "Mandatory ECDD for PEPs, NRIs, and multi-layer beneficial ownership structures. Annual re-verification.",
    },
  },
  {
    id: "cl2",
    label: "Clause 19.7",
    sublabel: "STR Filing",
    type: "clause",
    x: 440,
    y: 340,
    detail: {
      title: "Clause 19.7 — STR Reporting",
      meta: {
        Obligation: "OBL-019",
        Section: "19",
        Risk: "Critical",
      },
      summary:
        "Suspicious Transaction Reports to FIU-IND within 7 working days. Internal escalation procedures required.",
    },
  },
  {
    id: "cl3",
    label: "Clause 47.3",
    sublabel: "Cyber Audit",
    type: "clause",
    x: 780,
    y: 340,
    detail: {
      title: "Clause 47.3 — Annual Cyber Audit",
      meta: {
        Obligation: "OBL-047",
        Section: "47",
        Risk: "Critical",
      },
      summary:
        "CERT-In empanelled auditor annual engagement. VAPT, application security, BCP/DR. Report to SEBI within 90 days of FY end.",
    },
  },
  {
    id: "cl4",
    label: "Clause 61.2",
    sublabel: "MFA & PAM",
    type: "clause",
    x: 1020,
    y: 340,
    detail: {
      title: "Clause 61.2 — MFA & PAM",
      meta: {
        Obligation: "OBL-061",
        Section: "47",
        Risk: "Critical",
      },
      summary:
        "MFA on all critical systems. PAM with session recording for admin accounts. Time-bound privileged access.",
    },
  },
  {
    id: "ob1",
    label: "OBL-014",
    sublabel: "ECDD Annual",
    type: "obligation",
    x: 100,
    y: 480,
    detail: {
      title: "OBL-014 — ECDD for High-Risk Clients",
      meta: {
        Frequency: "Annual",
        Owner: "Priya Sharma",
        Status: "In Progress",
        Deadline: "Feb 28, 2025",
      },
      summary:
        "847 high-risk clients due for re-verification. PEP and NRI priority queue.",
    },
  },
  {
    id: "ob2",
    label: "OBL-019",
    sublabel: "STR to FIU",
    type: "obligation",
    x: 440,
    y: 480,
    detail: {
      title: "OBL-019 — STR Filing within 7 Days",
      meta: {
        Frequency: "Ongoing",
        Owner: "Kiran Nair",
        Status: "Overdue",
        Risk: "Critical",
      },
      summary:
        "No automated STR detection. Critical gap. SEBI penalty up to ₹25 crore.",
    },
  },
  {
    id: "ob3",
    label: "OBL-047",
    sublabel: "CERT-In Audit",
    type: "obligation",
    x: 780,
    y: 480,
    detail: {
      title: "OBL-047 — Annual Cyber Security Audit",
      meta: {
        Frequency: "Annual",
        Owner: "Rahul Mehta",
        Status: "Not Started",
        Deadline: "Jun 30, 2025",
      },
      summary:
        "Procure CERT-In auditor by January 15. Allow time for remediation.",
    },
  },
  {
    id: "r1",
    label: "RISK-AML-03",
    sublabel: "ECDD Lapse",
    type: "risk",
    x: 100,
    y: 620,
    detail: {
      title: "RISK-AML-03 — ECDD Compliance Lapse",
      meta: {
        Impact: "High",
        Likelihood: "High",
        Score: "72/100",
      },
      summary:
        "Failure to verify 847 high-risk clients creates regulatory inspection trigger.",
    },
  },
  {
    id: "r2",
    label: "RISK-AML-07",
    sublabel: "STR Non-Filing",
    type: "risk",
    x: 440,
    y: 620,
    detail: {
      title: "RISK-AML-07 — STR Non-Filing",
      meta: {
        Impact: "Critical",
        Likelihood: "High",
        Score: "91/100",
      },
      summary:
        "FIU-IND non-compliance. Highest severity risk in portfolio.",
    },
  },
  {
    id: "r3",
    label: "RISK-CYB-12",
    sublabel: "Audit Gap",
    type: "risk",
    x: 780,
    y: 620,
    detail: {
      title: "RISK-CYB-12 — Cyber Audit Gap",
      meta: {
        Impact: "High",
        Likelihood: "Medium",
        Score: "68/100",
      },
      summary:
        "No CERT-In audit on record. SEBI circular requirement. Inspection trigger.",
    },
  },
  {
    id: "ev1",
    label: "KYC Policy",
    sublabel: "Pending",
    type: "evidence",
    x: 100,
    y: 760,
    detail: {
      title: "Evidence — KYC Policy Document",
      meta: {
        Status: "Pending",
        Vault: "EV-0045",
        LastUpdated: "Nov 12, 2024",
      },
      summary:
        "KYC policy last updated FY22. Requires refresh to reflect ECDD and PEP re-verification procedures.",
    },
  },
  {
    id: "ev2",
    label: "STR Receipts",
    sublabel: "Missing",
    type: "evidence",
    x: 440,
    y: 760,
    detail: {
      title: "Evidence — STR Filing Receipts",
      meta: {
        Status: "Missing",
        Vault: "N/A",
        Required: "Urgent",
      },
      summary:
        "No STR receipts on file. No automated STR system deployed. Immediate action required.",
    },
  },
  {
    id: "ev3",
    label: "CERT-In Report",
    sublabel: "Missing",
    type: "evidence",
    x: 780,
    y: 760,
    detail: {
      title: "Evidence — CERT-In Audit Report",
      meta: {
        Status: "Missing",
        Vault: "N/A",
        Required: "By Jun 30",
      },
      summary:
        "Auditor not yet engaged. Procurement must begin immediately.",
    },
  },
  {
    id: "wf1",
    label: "WF-008",
    sublabel: "ECDD Workflow",
    type: "workflow",
    x: 220,
    y: 620,
    detail: {
      title: "WF-008 — ECDD Re-verification",
      meta: {
        Status: "In Progress",
        Tasks: "5",
        Assignee: "Compliance",
      },
      summary:
        "Automated ECDD reminder workflow. 847 clients in queue. 15 completed.",
    },
  },
  {
    id: "wf2",
    label: "WF-019",
    sublabel: "STR Workflow",
    type: "workflow",
    x: 560,
    y: 760,
    detail: {
      title: "WF-019 — STR Filing Process",
      meta: { Status: "Not Started", Priority: "Critical" },
      summary:
        "STR detection and filing workflow. Not yet deployed.",
    },
  },
  {
    id: "ctrl1",
    label: "CTRL-AML-01",
    sublabel: "KYC Control",
    type: "control",
    x: 220,
    y: 760,
    detail: {
      title: "CTRL-AML-01 — KYC Verification Control",
      meta: {
        Type: "Preventive",
        Automated: "Partial",
        Effectiveness: "65%",
      },
      summary:
        "Client onboarding KYC check. Partially automated. ECDD component is manual.",
    },
  },
  {
    id: "dept1",
    label: "Compliance Dept",
    sublabel: "12 members",
    type: "department",
    x: 660,
    y: 480,
    detail: {
      title: "Department — Compliance",
      meta: {
        Head: "Priya Sharma",
        Size: "12",
        Obligations: "34",
      },
      summary:
        "Owns AML, KYC, SCORES, and regulatory reporting obligations.",
    },
  },
  {
    id: "insp1",
    label: "SEBI Inspection",
    sublabel: "Readiness 72%",
    type: "inspection",
    x: 560,
    y: 900,
    detail: {
      title: "SEBI Inspection Readiness",
      meta: {
        Score: "72%",
        Status: "At Risk",
        NextInspection: "Q1 FY26",
      },
      summary:
        "14 critical gaps remain. STR and MFA issues must be resolved to achieve 85% readiness threshold.",
    },
  },
];

const EDGES: GraphEdge[] = [
  { from: "c1", to: "s1" },
  { from: "c1", to: "s2" },
  { from: "c1", to: "s3" },
  { from: "s1", to: "cl1" },
  { from: "s1", to: "cl2" },
  { from: "s2", to: "cl2" },
  { from: "s3", to: "cl3" },
  { from: "s3", to: "cl4" },
  { from: "cl1", to: "ob1" },
  { from: "cl2", to: "ob2" },
  { from: "cl3", to: "ob3" },
  { from: "ob1", to: "r1" },
  { from: "ob2", to: "r2" },
  { from: "ob3", to: "r3" },
  { from: "r1", to: "ev1" },
  { from: "r2", to: "ev2" },
  { from: "r3", to: "ev3" },
  { from: "ob1", to: "wf1" },
  { from: "ob2", to: "wf2" },
  { from: "wf1", to: "ctrl1" },
  { from: "ob2", to: "dept1" },
  { from: "ob1", to: "dept1" },
  { from: "r1", to: "insp1" },
  { from: "r2", to: "insp1" },
  { from: "r3", to: "insp1" },
  { from: "ev1", to: "insp1" },
  { from: "ev2", to: "insp1" },
  { from: "ev3", to: "insp1" },
];

const LEGEND: { type: NodeType; label: string }[] = [
  { type: "circular", label: "Circular" },
  { type: "section", label: "Section" },
  { type: "clause", label: "Clause" },
  { type: "obligation", label: "Obligation" },
  { type: "risk", label: "Risk" },
  { type: "evidence", label: "Evidence" },
  { type: "workflow", label: "Workflow" },
  { type: "control", label: "Control" },
  { type: "department", label: "Department" },
  { type: "inspection", label: "Inspection" },
];

const CANVAS_W = 1200;
const CANVAS_H = 1000;

export default function ComplianceGraphPage() {
  const [zoom, setZoom] = useState(0.72);
  const [panX, setPanX] = useState(-60);
  const [panY, setPanY] = useState(-20);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodeMap = useMemo(
    () => Object.fromEntries(NODES.map((node) => [node.id, node])),
    [],
  );

  function getEdgePath(edge: GraphEdge) {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];

    if (!from || !to) return "";

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cx = (from.x + to.x) / 2 - dy * 0.1;
    const cy = (from.y + to.y) / 2 + dx * 0.1;

    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  const handleMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (
      (event.target as SVGElement | HTMLElement).closest?.(
        ".graph-node",
      )
    ) {
      return;
    }

    setDragging(true);
    setDragStart({
      x: event.clientX - panX,
      y: event.clientY - panY,
    });
  };

  const handleMouseMove = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (!dragging) return;

    setPanX(event.clientX - dragStart.x);
    setPanY(event.clientY - dragStart.y);
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (
    event: ReactWheelEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setZoom((current) =>
      Math.min(1.6, Math.max(0.3, current - event.deltaY * 0.001)),
    );
  };

  const resetView = () => {
    setZoom(0.72);
    setPanX(-60);
    setPanY(-20);
  };

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="glass-panel flex flex-col gap-3 rounded-[28px] border border-white/10 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div>
            <p className="section-label">Graph intelligence</p>

            <h1 className="page-title mt-4 flex items-center gap-2.5 !text-2xl">
              <Network size={20} className="text-cyan-300" />
              Compliance Digital Twin
            </h1>

            <p className="page-subtitle !mt-2">
              Explore circulars, sections, clauses, obligations,
              risks, evidence, workflows, controls, departments, and
              inspection readiness as one connected graph.
            </p>
          </div>

          <span className="badge badge-amber shrink-0 self-start text-[10px]">
            Demo Dataset · Illustrative Graph
          </span>
        </div>

        <div className="relative h-[640px] overflow-hidden rounded-[28px] border border-white/10 bg-[#05080f]">
          <div
            className="absolute inset-0"
            style={{
              cursor: dragging ? "grabbing" : "grab",
              background:
                "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(56,189,248,0.03) 0%, transparent 60%), #05080f",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div className="pointer-events-none absolute left-5 top-5 z-10">
              <p className="text-xs text-zinc-500">
                {NODES.length} nodes · {EDGES.length} edges · Click a
                node to inspect
              </p>
            </div>

            <div
              className="absolute top-5 z-10 flex flex-col gap-1"
              style={{ right: selected ? 340 : 20 }}
            >
              <button
                type="button"
                className="btn-icon"
                aria-label="Zoom in"
                onClick={() =>
                  setZoom((current) => Math.min(1.6, current + 0.1))
                }
              >
                <ZoomIn size={13} />
              </button>

              <button
                type="button"
                className="btn-icon"
                aria-label="Zoom out"
                onClick={() =>
                  setZoom((current) => Math.max(0.3, current - 0.1))
                }
              >
                <ZoomOut size={13} />
              </button>

              <button
                type="button"
                className="btn-icon"
                aria-label="Reset view"
                onClick={resetView}
              >
                <Maximize2 size={13} />
              </button>
            </div>

            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              style={{ display: "block" }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L0,6 L6,3 z"
                    fill="rgba(56,189,248,0.35)"
                  />
                </marker>

                <filter id="glow">
                  <feGaussianBlur
                    stdDeviation="3"
                    result="coloredBlur"
                  />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                transform={`translate(${panX}, ${panY}) scale(${zoom})`}
              >
                {EDGES.map((edge) => {
                  const edgeId = `${edge.from}-${edge.to}`;
                  const isHovered = hoveredEdge === edgeId;
                  const isRelated =
                    selected &&
                    (selected.id === edge.from ||
                      selected.id === edge.to);

                  return (
                    <path
                      key={edgeId}
                      d={getEdgePath(edge)}
                      fill="none"
                      stroke={
                        isRelated
                          ? "rgba(56,189,248,0.7)"
                          : isHovered
                            ? "rgba(56,189,248,0.4)"
                            : "rgba(56,189,248,0.12)"
                      }
                      strokeWidth={isRelated ? 1.8 : 1}
                      markerEnd="url(#arrowhead)"
                      style={{
                        transition:
                          "stroke 0.15s, stroke-width 0.15s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHoveredEdge(edgeId)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                  );
                })}

                {NODES.map((node) => {
                  const color = NODE_COLOR[node.type];
                  const isSelected = selected?.id === node.id;
                  const width = node.type === "circular" ? 140 : 110;
                  const height = node.type === "circular" ? 52 : 44;

                  return (
                    <g
                      key={node.id}
                      className="graph-node"
                      transform={`translate(${
                        node.x - width / 2
                      }, ${node.y - height / 2})`}
                      style={{ cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelected(isSelected ? null : node);
                      }}
                    >
                      <rect
                        width={width}
                        height={height}
                        rx={node.type === "circular" ? 12 : 8}
                        fill={
                          isSelected
                            ? `${color.text}18`
                            : color.bg
                        }
                        stroke={
                          isSelected ? color.text : color.border
                        }
                        strokeWidth={isSelected ? 1.8 : 1}
                        filter={
                          isSelected ? "url(#glow)" : undefined
                        }
                        style={{
                          transition: "fill 0.15s, stroke 0.15s",
                        }}
                      />

                      <text
                        x={width / 2}
                        y={height / 2 - (node.sublabel ? 5 : 0)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={
                          node.type === "circular" ? 11.5 : 10.5
                        }
                        fontWeight={700}
                        fontFamily="Outfit, sans-serif"
                        fill={color.text}
                      >
                        {node.label}
                      </text>

                      {node.sublabel ? (
                        <text
                          x={width / 2}
                          y={height / 2 + 11}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={9}
                          fontFamily="Outfit, sans-serif"
                          fill="rgba(148,163,184,0.7)"
                        >
                          {node.sublabel}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </svg>

            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex max-w-[600px] flex-wrap gap-3 rounded-xl border border-white/10 bg-[#05080f]/88 px-3.5 py-2.5 backdrop-blur-md">
              {LEGEND.map((legendItem) => (
                <div
                  key={legendItem.type}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{
                      background: NODE_COLOR[legendItem.type].border,
                    }}
                  />

                  <span className="text-[10px] font-semibold text-zinc-500">
                    {legendItem.label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="absolute bottom-4 z-10 h-[90px] w-[140px] overflow-hidden rounded-lg border border-white/10 bg-[#05080f]/92 backdrop-blur-md"
              style={{ right: selected ? 340 : 16 }}
            >
              <svg
                width="140"
                height="90"
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              >
                {NODES.map((node) => (
                  <rect
                    key={node.id}
                    x={node.x - 12}
                    y={node.y - 7}
                    width={24}
                    height={14}
                    rx={2}
                    fill={NODE_COLOR[node.type].bg}
                    stroke={NODE_COLOR[node.type].border}
                    strokeWidth={8}
                  />
                ))}

                {EDGES.map((edge) => {
                  const from = nodeMap[edge.from];
                  const to = nodeMap[edge.to];

                  if (!from || !to) return null;

                  return (
                    <line
                      key={`${edge.from}-${edge.to}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="rgba(56,189,248,0.12)"
                      strokeWidth={6}
                    />
                  );
                })}
              </svg>

              <div className="absolute bottom-1 right-1.5 text-[8px] font-semibold text-zinc-500">
                MINIMAP
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selected ? (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 280,
                }}
                className="absolute right-0 top-0 flex h-full w-[300px] flex-col overflow-y-auto border-l border-white/10 bg-[#05080f]/97 backdrop-blur-2xl"
              >
                <div className="sticky top-0 z-10 flex items-start gap-2 border-b border-white/10 bg-[#05080f]/98 p-3.5">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-sm"
                        style={{
                          background:
                            NODE_COLOR[selected.type].border,
                        }}
                      />

                      <span
                        className="text-[9px] font-bold uppercase tracking-wide"
                        style={{
                          color: NODE_COLOR[selected.type].text,
                        }}
                      >
                        {selected.type}
                      </span>
                    </div>

                    <p className="text-[15px] font-bold leading-tight text-[var(--c-text)]">
                      {selected.detail.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-icon"
                    aria-label="Close node detail"
                    onClick={() => setSelected(null)}
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="flex flex-col gap-3.5 p-4">
                  <p className="text-[13px] leading-6 text-[var(--c-text-dim)]">
                    {selected.detail.summary}
                  </p>

                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3.5">
                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                      Metadata
                    </p>

                    {Object.entries(selected.detail.meta).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="mb-1.5 flex justify-between"
                        >
                          <span className="text-xs text-zinc-500">
                            {key}
                          </span>

                          <span className="text-xs font-semibold text-[var(--c-text)]">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                      Connections
                    </p>

                    {EDGES.filter(
                      (edge) =>
                        edge.from === selected.id ||
                        edge.to === selected.id,
                    ).map((edge) => {
                      const other =
                        edge.from === selected.id
                          ? nodeMap[edge.to]
                          : nodeMap[edge.from];

                      if (!other) return null;

                      return (
                        <button
                          key={`${edge.from}-${edge.to}`}
                          type="button"
                          onClick={() => setSelected(other)}
                          className="mb-1 flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-left"
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-sm"
                            style={{
                              background: NODE_COLOR[other.type]
                                .border,
                            }}
                          />

                          <span className="flex-1 truncate text-xs text-[var(--c-text-dim)]">
                            {other.label}
                          </span>

                          <span
                            className="text-[9px] font-bold"
                            style={{
                              color: NODE_COLOR[other.type].text,
                            }}
                          >
                            {other.type}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Shell>
  );
}