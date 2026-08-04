"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockUsers, mockDepartments } from "@/lib/seed-data";
import { UserPlus, Shield, Building2 } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
};

function Button({ size = "md", className = "", ...props }: ButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : size === "lg"
      ? "px-4 py-2 text-sm"
      : "px-3.5 py-2 text-sm";

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 transition hover:bg-cyan-500/20 ${sizeClasses} ${className}`}
      {...props}
    />
  );
}

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
          <p className="text-xs text-gray-400 font-mono mt-0.5">Manage users, departments, roles, and access control</p>
        </div>
        <Button size="sm"><UserPlus size={13} /> Invite User</Button>
      </div>

      <div className="flex gap-2">
        {(["users", "departments", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors capitalize ${
              tab === t ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "text-gray-500 border-gray-800 hover:text-gray-300"
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
              <tr className="text-left text-gray-500 font-mono uppercase text-[10px] border-b border-gray-800">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Department</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2.5 pr-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: u.avatarColor }}>
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-gray-200">{u.name}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-gray-400">{u.email}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${roleColor[u.role]}`}>{u.role.replace(/_/g, " ")}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-gray-400">{u.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "departments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDepartments.map((d) => (
            <Card key={d.id}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-gray-100">{d.name}</h3>
              </div>
              <p className="text-[11px] text-gray-500">Head: {mockUsers.find((u) => u.id === d.headUserId)?.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${d.complianceScore}%` }} />
                </div>
                <span className="text-[10px] font-mono text-gray-400">{d.complianceScore}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "security" && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-gray-200">Row-Level Security & Audit</h3>
          </div>
          <div className="space-y-2 text-xs text-gray-400">
            <p>• Tenant isolation enforced at query layer — no cross-entity data leakage.</p>
            <p>• All evidence writes are hashed and immutable (SHA-256).</p>
            <p>• Role-based access control active for 6 roles: Admin, Compliance Officer, Department Head, Staff, Auditor, Regulator.</p>
            <p>• Regulator role is read-only across all modules except Synthetic Inspection exports.</p>
          </div>
        </Card>
      )}
    </div>
  );
}