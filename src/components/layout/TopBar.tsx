"use client";

import Link from "next/link";
import { Bell, Search, Upload } from "lucide-react";

type AppMode = "demo" | "live";

interface TopBarProps {
  mode?: AppMode;
  docName?: string;
  docPages?: number;
}

export default function TopBar({
  mode = "demo",
  docName,
  docPages,
}: TopBarProps) {
  const isLive = mode === "live";

  const displayDoc =
    docName ?? "Master Circular – Stock Brokers";

  const displayPages = docPages ?? 419;

  return (
    <div className="topbar">
      <div
        style={{
          position: "relative",
          flex: 1,
          maxWidth: 320,
        }}
      >
        <Search
          size={14}
          strokeWidth={1.5}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--c-text-muted)",
            pointerEvents: "none",
          }}
        />

        <input
          className="input-glass"
          placeholder="Search clauses, obligations, circulars…"
          style={{
            paddingLeft: 36,
            fontSize: 13,
          }}
        />
      </div>

      <Link
        href="/live-upload"
        className="btn-secondary"
        style={{
          fontSize: 13,
          padding: "8px 18px",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          textDecoration: "none",
        }}
      >
        <Upload size={13} strokeWidth={1.7} />
        Upload PDF
      </Link>

      <button
        type="button"
        className="btn-icon"
        aria-label="Notifications"
        style={{
          position: "relative",
        }}
      >
        <Bell size={16} strokeWidth={1.5} />

        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--c-error)",
            border:
              "1.5px solid rgba(4,7,13,0.9)",
          }}
        />
      </button>

      <button
        type="button"
        aria-label="User profile"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: 0,
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        RS
      </button>

      <div
        className={`badge ${
          isLive ? "badge-green" : "badge-blue"
        }`}
        style={{
          fontSize: 10,
          gap: 6,
          marginLeft: 2,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isLive
              ? "#22c55e"
              : "var(--c-primary)",
            boxShadow: `0 0 6px ${
              isLive
                ? "#22c55e"
                : "var(--c-primary)"
            }`,
            animation:
              "pulse-glow 2s ease-in-out infinite",
            display: "inline-block",
          }}
        />

        {isLive
          ? `Live Backend · Real SEBI Data · ${displayDoc} · ${displayPages}p`
          : `Demo Dataset · AI Processed · ${displayDoc} · ${displayPages}p · 532 Clauses · 148 Obligations`}
      </div>
    </div>
  );
}