import type {
  CircularListResponse,
  CircularDetailResponse,
  ObligationListResponse,
  TaskListResponse,
  EvidenceListResponse,
  RiskListResponse,
  DashboardSummaryResponse,
} from "../types/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

function buildUrl(path: string): string {
  const normalizedBase = API_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    if (typeof body === "string" && body.trim()) {
      message = body;
    } else if (
      typeof body === "object" &&
      body !== null &&
      "detail" in body
    ) {
      message = String(
        (body as { detail: unknown }).detail,
      );
    }

    throw new Error(message);
  }

  return body as T;
}

export async function apiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

/**
 * Generic fetcher for SWR or other data-fetching hooks.
 */
export const fetcher = async <T,>(
  path: string,
): Promise<T> => {
  return apiGet<T>(path);
};

/**
 * Retrieval
 */

export type SearchRequest = {
  query: string;
  filters?: Record<string, unknown>;
  top_k?: number;
};

export type SearchResult = {
  id?: string;
  score?: number;
  rerank_score?: number;
  text?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
};

export type SearchResponse<T = SearchResult> = {
  query: string;
  results: T[];
};

export async function searchChunks<T = SearchResult>(
  request: SearchRequest,
): Promise<SearchResponse<T>> {
  return apiPost<SearchResponse<T>>(
    "/retrieval/search",
    request,
  );
}

/**
 * Dashboard
 */

export async function getDashboardSummary() {
  return apiGet<DashboardSummaryResponse>(
    "/dashboard/summary",
  );
}

/**
 * Circulars
 */

export async function getCirculars(params?: {
  intermediary_type?: string;
  from_date?: string;
  to_date?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.intermediary_type) {
    qs.set(
      "intermediary_type",
      params.intermediary_type,
    );
  }

  if (params?.from_date) {
    qs.set("from_date", params.from_date);
  }

  if (params?.to_date) {
    qs.set("to_date", params.to_date);
  }

  const query = qs.toString();

  return apiGet<CircularListResponse>(
    `/circulars${query ? `?${query}` : ""}`,
  );
}

export async function getCircularDetail(
  circularId: string,
) {
  return apiGet<CircularDetailResponse>(
    `/circulars/${encodeURIComponent(circularId)}`,
  );
}

/**
 * Obligations
 */

export async function getObligations(params?: {
  circular_id?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.circular_id) {
    qs.set("circular_id", params.circular_id);
  }

  const query = qs.toString();

  return apiGet<ObligationListResponse>(
    `/obligations${query ? `?${query}` : ""}`,
  );
}

/**
 * Workflow tasks
 *
 * This uses /tasks because that is the path in your
 * current frontend API client. If Swagger shows
 * /workflow instead, change TASKS_PATH below.
 */

const TASKS_PATH = "/workflow";

export async function getTasks(params?: {
  department?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.department) {
    qs.set("department", params.department);
  }

  const query = qs.toString();

  return apiGet<TaskListResponse>(
    `${TASKS_PATH}${query ? `?${query}` : ""}`,
  );
}

/**
 * Evidence
 */

export async function getEvidence(params?: {
  obligation_id?: string;
  task_id?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.obligation_id) {
    qs.set("obligation_id", params.obligation_id);
  }

  if (params?.task_id) {
    qs.set("task_id", params.task_id);
  }

  const query = qs.toString();

  return apiGet<EvidenceListResponse>(
    `/evidence${query ? `?${query}` : ""}`,
  );
}

export async function uploadEvidence<T = unknown>(
  formData: FormData,
): Promise<T> {
  return apiUpload<T>("/evidence/upload", formData);
}

/**
 * Risks
 */

export async function getRisks(params?: {
  circular_id?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.circular_id) {
    qs.set("circular_id", params.circular_id);
  }

  const query = qs.toString();

  return apiGet<RiskListResponse>(
    `/risks${query ? `?${query}` : ""}`,
  );
}
