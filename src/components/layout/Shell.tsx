"use client";

import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { CommandPalette } from "./CommandPalette";

type AppMode = "demo" | "live";

interface ShellProps {
  children: ReactNode;
  mode?: AppMode;
  docName?: string;
  docPages?: number;
}

export function Shell({
  children,
  mode = "demo",
  docName,
  docPages,
}: ShellProps) {
  return (
    <div className="page-shell bg-background text-gray-100">
      <Sidebar mode={mode} />

      <div className="content-shell">
        <TopBar
          mode={mode}
          docName={docName}
          docPages={docPages}
        />

        <main className="content-scroll">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

export default Shell;