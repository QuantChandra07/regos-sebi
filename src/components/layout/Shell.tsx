import React from "react";
import Sidebar from "./Sidebar";
import { Header } from "./Header";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell bg-background text-gray-100">
      <Sidebar />

      <div className="content-shell">
        <Header />

        <main className="content-scroll">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}