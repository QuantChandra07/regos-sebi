import type {
  CircularListResponse,
  CircularDetailResponse,
  ObligationListResponse,
  TaskListResponse,
  EvidenceListResponse,
  RiskListResponse,
  DashboardSummaryResponse,
} from "../types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

export const fetcher = async <T,>(url: string): Promise<T> => apiFetch<T>(url);

export async function getDashboardSummary() {
  return apiFetch<DashboardSummaryResponse>("/dashboard/summary");
}

export async function getCirculars(params?: {
  intermediary_type?: string;
  from_date?: string;
  to_date?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.intermediary_type) qs.set("intermediary_type", params.intermediary_type);
  if (params?.from_date) qs.set("from_date", params.from_date);
  if (params?.to_date) qs.set("to_date", params.to_date);

  return apiFetch<CircularListResponse>(`/circulars${qs.toString() ? `?${qs}` : ""}`);
}

export async function getCircularDetail(circularId: string) {
  return apiFetch<CircularDetailResponse>(`/circulars/${circularId}`);
}

export async function getObligations(params?: { circular_id?: string }) {
  const qs = new URLSearchParams();
  if (params?.circular_id) qs.set("circular_id", params.circular_id);

  return apiFetch<ObligationListResponse>(`/obligations${qs.toString() ? `?${qs}` : ""}`);
}

export async function getTasks(params?: { department?: string }) {
  const qs = new URLSearchParams();
  if (params?.department) qs.set("department", params.department);

  return apiFetch<TaskListResponse>(`/tasks${qs.toString() ? `?${qs}` : ""}`);
}

export async function getEvidence(params?: { obligation_id?: string; task_id?: string }) {
  const qs = new URLSearchParams();
  if (params?.obligation_id) qs.set("obligation_id", params.obligation_id);
  if (params?.task_id) qs.set("task_id", params.task_id);

  return apiFetch<EvidenceListResponse>(`/evidence${qs.toString() ? `?${qs}` : ""}`);
}

export async function getRisks(params?: { circular_id?: string }) {
  const qs = new URLSearchParams();
  if (params?.circular_id) qs.set("circular_id", params.circular_id);

  return apiFetch<RiskListResponse>(`/risks${qs.toString() ? `?${qs}` : ""}`);
}

export async function uploadEvidence(formData: FormData) {
  const res = await fetch(`${API_BASE}/evidence/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text}`);
  }

  return res.json();
}