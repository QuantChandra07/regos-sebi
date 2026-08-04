"use client";

import useSWR from "swr";
import { fetcher } from "./api";
import type {
  CircularListResponse,
  CircularDetailResponse,
  ObligationListResponse,
  TaskListResponse,
  EvidenceListResponse,
  RiskListResponse,
  DashboardSummaryResponse,
} from "../types/api";

export function useDashboardSummary() {
  return useSWR<DashboardSummaryResponse>("/dashboard/summary", fetcher);
}

export function useCirculars(queryString = "") {
  return useSWR<CircularListResponse>(`/circulars${queryString}`, fetcher);
}

export function useCircularDetail(circularId?: string) {
  return useSWR<CircularDetailResponse>(
    circularId ? `/circulars/${circularId}` : null,
    fetcher
  );
}

export function useObligations(queryString = "") {
  return useSWR<ObligationListResponse>(`/obligations${queryString}`, fetcher);
}

export function useTasks(queryString = "") {
  return useSWR<TaskListResponse>(`/tasks${queryString}`, fetcher);
}

export function useEvidence(queryString = "") {
  return useSWR<EvidenceListResponse>(`/evidence${queryString}`, fetcher);
}

export function useRisks(queryString = "") {
  return useSWR<RiskListResponse>(`/risks${queryString}`, fetcher);
}