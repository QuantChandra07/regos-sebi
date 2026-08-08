"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Github,
  Layers3,
  Play,
  Plus,
  Server,
  Upload,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const [mode, setMode] = useState<
    "demo" | "live"
  >("demo");

  const launchDemo = () => {
    setMode("demo");
    router.push("/demo");
  };

  const openLiveWorkspace = () => {
    setMode("live");
    router.push("/live-upload");
  };

  return (
    <main
      className="bg-app grid-overlay"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-60px",
          width: 500,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 64,
          background: "rgba(5,8,15,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom:
            "1px solid rgba(56,189,248,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 4px 16px rgba(56,189,248,0.35)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8L6 4L10 8L14 4"
                stroke="#020617"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L6 8L10 12L14 8"
                stroke="#020617"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".5"
              />
            </svg>
          </div>

          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "0.02em",
            }}
          >
            REGOS-SEBI
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            About
          </button>

          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            Technology
          </button>

          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            Features
          </button>

          <a
            href="https://github.com/QuantChandra07/regos-sebi"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{
              fontSize: 13,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              textDecoration: "none",
            }}
          >
            <Github size={14} />
            GitHub
          </a>

          <div
            style={{
              width: 1,
              height: 20,
              background: "var(--c-border)",
              margin: "0 8px",
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "var(--c-text-muted)",
              fontWeight: 500,
              fontStyle: "italic",
            }}
          >
            Made for SEBI TechSprint 2026
          </span>
        </div>
      </nav>

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 48px 40px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          className="badge badge-blue"
          style={{
            marginBottom: 28,
            fontSize: 11,
            padding: "4px 14px",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--c-primary)",
              boxShadow: "0 0 8px var(--c-primary)",
              display: "inline-block",
            }}
          />

          SEBI TechSprint 2026 · Hackathon Demo
        </div>

        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.05,
            background:
              "linear-gradient(135deg, #f1f5f9 0%, #38bdf8 45%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          REGOS-SEBI
        </h1>

        <p
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "var(--c-text-dim)",
            marginTop: 16,
            marginBottom: 0,
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          AI Powered Regulatory Operating System
        </p>

        <p
          style={{
            fontSize: 15,
            color: "var(--c-text-muted)",
            marginTop: 12,
            textAlign: "center",
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Transform SEBI circulars into actionable compliance
          workflows using AI-driven clause extraction,
          obligation tracking, and risk intelligence.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginTop: 48,
            width: "100%",
            maxWidth: 740,
          }}
        >
          <button
            type="button"
            className={`mode-card${
              mode === "live" ? " selected" : ""
            }`}
            onClick={() => setMode("live")}
            style={{ textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(56,189,248,0.08)",
                  border:
                    "1px solid rgba(56,189,248,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Server
                  size={20}
                  color="#38bdf8"
                  strokeWidth={1.5}
                />
              </div>

              <div
                className={`radio-ring${
                  mode === "live" ? " on" : ""
                }`}
              />
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--c-text)",
                marginBottom: 8,
              }}
            >
              Live Backend
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: "var(--c-text-muted)",
                lineHeight: 1.6,
              }}
            >
              Run the AI compliance engine on uploaded SEBI
              PDFs in real-time.
            </div>

            <div
              className="badge badge-amber"
              style={{
                marginTop: 16,
                fontSize: 10,
                display: "inline-flex",
              }}
            >
              Requires API Connection
            </div>
          </button>

          <button
            type="button"
            className={`mode-card${
              mode === "demo" ? " selected" : ""
            }`}
            onClick={() => setMode("demo")}
            style={{ textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(56,189,248,0.1)",
                  border:
                    "1px solid rgba(56,189,248,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play
                  size={20}
                  color="#38bdf8"
                  fill="#38bdf8"
                  strokeWidth={1.5}
                />
              </div>

              <div
                className={`radio-ring${
                  mode === "demo" ? " on" : ""
                }`}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--c-text)",
                }}
              >
                Demo Mode
              </span>

              <span
                className="badge badge-green"
                style={{ fontSize: 10 }}
              >
                Recommended
              </span>
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: "var(--c-text-muted)",
                lineHeight: 1.6,
              }}
            >
              Explore a fully processed compliance workspace
              with pre-analyzed SEBI documents.
            </div>

            {mode === "demo" && (
              <div
                style={{
                  marginTop: 16,
                  padding: "8px 12px",
                  background: "rgba(56,189,248,0.06)",
                  border:
                    "1px solid rgba(56,189,248,0.14)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--c-primary)",
                }}
              >
                ✓ 419 pages · 532 clauses · 148 obligations
                pre-processed
              </div>
            )}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
            marginTop: 32,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="btn-primary btn-primary-lg"
            onClick={launchDemo}
          >
            <Play size={16} fill="currentColor" />
            Launch Demo
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              fontSize: 15,
              padding: "13px 28px",
              borderRadius: 12,
              borderColor: "rgba(16,185,129,0.35)",
              color: "#10b981",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={openLiveWorkspace}
          >
            <Upload size={15} />
            Open Live Workspace
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 40,
            marginTop: 60,
            padding: "20px 40px",
            background: "rgba(10,16,32,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:
              "1px solid rgba(56,189,248,0.08)",
            borderRadius: 16,
          }}
        >
          {[
            {
              val: "3",
              label: "SEBI Circulars",
              icon: Database,
            },
            {
              val: "532",
              label: "Clauses Extracted",
              icon: Layers3,
            },
            {
              val: "148",
              label: "Obligations Tracked",
              icon: CheckCircle2,
            },
            {
              val: "94%",
              label: "Compliance Score",
              icon: Zap,
            },
            {
              val: "~18s",
              label: "Processing Time",
              icon: Upload,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                style={{ textAlign: "center" }}
              >
                <Icon
                  size={14}
                  color="var(--c-primary)"
                  style={{ margin: "0 auto 7px" }}
                />

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--c-primary)",
                    lineHeight: 1,
                  }}
                >
                  {stat.val}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "var(--c-text-muted)",
                    marginTop: 6,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}