"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  LockKeyhole,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  mockDepartments,
  mockUsers,
} from "../../lib/seed-data";

type AdminTab = "users" | "departments" | "security";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  COMPLIANCE_OFFICER: "Compliance Officer",
  DEPARTMENT_HEAD: "Department Head",
  STAFF: "Staff",
  AUDITOR: "Auditor",
  REGULATOR: "Regulator",
};

const roleBadgeLabels: Record<string, string> = {
  ADMIN: "ADMIN",
  COMPLIANCE_OFFICER: "COMPLIANCE",
  DEPARTMENT_HEAD: "DEPARTMENT HEAD",
  STAFF: "STAFF",
  AUDITOR: "AUDITOR",
  REGULATOR: "REGULATOR",
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
  const [tab, setTab] = useState<AdminTab>("users");

  return (
    <Shell
      mode="demo"
      docName="Administration"
      docPages={419}
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">Workspace governance</p>

            <h1 className="page-title mt-4">
              Administration
            </h1>

            <p className="page-subtitle max-w-3xl">
              Manage users, departments, roles, access boundaries,
              and security controls for the RegOS-SEBI workspace.
            </p>
          </div>

          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Shield
                  size={18}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <p className="section-label">Access control</p>

                <p className="mt-2 text-lg font-semibold text-white">
                  RBAC active
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Six workspace roles are available for controlled
                  access to compliance data.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <AdminMetric
                label="Users"
                value={mockUsers.length}
              />

              <AdminMetric
                label="Departments"
                value={mockDepartments.length}
              />
            </div>
          </Card>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <AdminTabButton
              active={tab === "users"}
              label="Users"
              icon={<Users size={13} />}
              onClick={() => setTab("users")}
            />

            <AdminTabButton
              active={tab === "departments"}
              label="Departments"
              icon={<Building2 size={13} />}
              onClick={() => setTab("departments")}
            />

            <AdminTabButton
              active={tab === "security"}
              label="Security"
              icon={<LockKeyhole size={13} />}
              onClick={() => setTab("security")}
            />
          </div>
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

          <button
            type="button"
            onClick={() => {
              window.alert(
                "User invitation is available when the identity service is connected.",
              );
            }}
            className="btn-primary text-xs"
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-mono capitalize transition-colors ${
              tab === t
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-gray-800 text-gray-500 hover:text-gray-300"
            }`}
          >
            <UserPlus size={13} />
            Invite User
          </button>
        </div>

        {tab === "users" ? <UsersPanel /> : null}

        {tab === "departments" ? (
          <DepartmentsPanel />
        ) : null}

        {tab === "security" ? <SecurityPanel /> : null}
      </div>
    </Shell>
  );
}

function UsersPanel() {
  return (
    <Card className="overflow-hidden rounded-[28px] p-0">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Workspace users
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Role and department assignments
          </p>
        </div>

        <Badge label={`${mockUsers.length} USERS`} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <th className="px-5 py-3 font-semibold">
                Name
              </th>
              <th className="px-5 py-3 font-semibold">
                Email
              </th>
              <th className="px-5 py-3 font-semibold">
                Role
              </th>
              <th className="px-5 py-3 font-semibold">
                Department
              </th>
              <th className="px-5 py-3 font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-cyan-500/[0.03]"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{
                        backgroundColor: user.avatarColor,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>

                    <span className="text-sm font-medium text-zinc-200">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3.5 text-xs text-zinc-500">
                  {user.email}
                </td>

                <td className="px-5 py-3.5">
                  <Badge
                    label={
                      roleBadgeLabels[user.role] ||
                      user.role.replace(/_/g, " ")
                    }
                  />
                </td>

                <td className="px-5 py-3.5 text-xs text-zinc-400">
                  {user.department}
                </td>

                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DepartmentsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {mockDepartments.map((department) => {
        const head = mockUsers.find(
          (user) => user.id === department.headUserId,
        );

        return (
          <Card
            key={department.id}
            className="rounded-[24px] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10">
                  <Building2
                    size={15}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {department.name}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    {head
                      ? `Head: ${head.name}`
                      : "Head not assigned"}
                  </p>
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

              <Badge label="ACTIVE" />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                  Compliance score
                </span>

                <span className="font-mono text-xs font-semibold text-cyan-300">
                  {department.complianceScore}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                  style={{
                    width: `${department.complianceScore}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function SecurityPanel() {
  const controls = [
    "Tenant isolation is enforced at the query layer.",
    "Evidence writes are hashed and immutable.",
    "Role-based access control is active for six roles.",
    "Regulator access is read-only across operational modules.",
    "Audit events are retained for administrative review.",
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="rounded-[28px] p-5 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10">
            <Shield
              size={17}
              className="text-cyan-300"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Row-level security and audit
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Workspace protection controls
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
        </div>

        <div className="mt-5 space-y-3">
          {controls.map((control) => (
            <div
              key={control}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <p className="text-sm leading-6 text-zinc-400">
                {control}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[28px] border-amber-500/15 bg-amber-500/[0.04] p-5">
        <p className="section-label">Implementation note</p>

        <p className="mt-3 text-sm font-semibold text-white">
          Connect the identity service
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          The current page displays seeded workspace data. Invite,
          role changes, tenant isolation, and audit events should be
          connected to your FastAPI authentication and RBAC APIs
          before production use.
        </p>
      </Card>
    </div>
  );
}

function AdminTabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${
        active
          ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
          : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function AdminMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}