"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockUsers, mockDepartments } from "@/lib/seed-data";
import { UserPlus, Shield, Building2 } from "lucide-react";

const roleColor: Record<string, string> = {
  ADMIN: "text-cyan-400 bg-cyan-950/40 border-cyan-800/60",
  COMPLIANCE_OFFICER: "text-blue-400 bg-blue-950/40 border-blue-800/60",
  DEPARTMENT_HEAD: "text-purple-400 bg-purple-950/40 border-purple-800/60",
  STAFF: "text-gray-400 bg-gray-800/60 border-gray-700",
  AUDITOR: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
  REGULATOR: "text-amber-400 bg-amber-950/40 border-amber-800/60",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "departments" | "security">("users");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Administration</h1>
          <p className="mt-0.5 font-mono text-xs text-gray-400">
            Manage users, departments, roles, and access control
          </p>
        </div>

        <Button className="text-xs">
          <UserPlus size={13} />
          Invite User
        </Button>
      </div>

      <div className="flex gap-2">
        {(["users", "departments", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-mono capitalize transition-colors ${
              tab === t
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-gray-800 text-gray-500 hover:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <Card className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-left font-mono text-[10px] uppercase text-gray-500">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Department</th>
              </tr>
            </thead>

            <tbody>
              {mockUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="flex items-center gap-2 py-2.5 pr-3">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-gray-200">{u.name}</span>
                  </td>

                  <td className="py-2.5 pr-3 text-gray-400">{u.email}</td>

                  <td className="py-2.5 pr-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${roleColor[u.role] ?? "text-gray-300 bg-gray-800 border-gray-700"}`}
                    >
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-2.5 pr-3 text-gray-400">{u.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "departments" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockDepartments.map((d) => (
            <Card key={d.id}>
              <div className="mb-2 flex items-center gap-2">
                <Building2 size={14} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-gray-100">{d.name}</h3>
              </div>

              <p className="text-[11px] text-gray-500">
                Head: {mockUsers.find((u) => u.id === d.headUserId)?.name ?? "Unassigned"}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${d.complianceScore}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-gray-400">
                  {d.complianceScore}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "security" && (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Shield size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-gray-200">
              Row-Level Security & Audit
            </h3>
          </div>

          <div className="space-y-2 text-xs text-gray-400">
            <p>• Tenant isolation enforced at query layer — no cross-entity data leakage.</p>
            <p>• All evidence writes are hashed and immutable (SHA-256).</p>
            <p>
              • Role-based access control active for 6 roles: Admin, Compliance
              Officer, Department Head, Staff, Auditor, Regulator.
            </p>
            <p>
              • Regulator role is read-only across all modules except Synthetic
              Inspection exports.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}