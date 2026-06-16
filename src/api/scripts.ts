import client from './client';
import type { Script, AnalysisTask, Module1Episode, Module2Episode, CycleSheet } from '../types';

export interface CreateScriptPayload {
  title: string;
  genre: string;
  tier: string;
  total_episodes: number;
  file: File;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Scripts ──────────────────────────────────────────────────────────────────

export const listScripts = (params?: { page?: number; page_size?: number; search?: string }) =>
  client.get('/api/scripts', { params }) as Promise<PaginatedResponse<Script>>;

export const getScript = (id: number) =>
  client.get(`/api/scripts/${id}`) as Promise<Script>;

export const createScript = (payload: CreateScriptPayload) => {
  const form = new FormData();
  form.append('title', payload.title);
  form.append('genre', payload.genre);
  form.append('tier', payload.tier);
  form.append('total_episodes', String(payload.total_episodes));
  form.append('file', payload.file);
  return client.post('/api/scripts', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<Script>;
};

export const deleteScript = (id: number) =>
  client.delete(`/api/scripts/${id}`) as Promise<void>;

// ─── Analysis Tasks ───────────────────────────────────────────────────────────

export const runAnalysis = (script_id: number, modules: ('module1' | 'module2' | 'module5')[]) =>
  client.post(`/api/scripts/${script_id}/analyze`, { modules }) as Promise<AnalysisTask[]>;

export const getTaskStatus = (script_id: number) =>
  client.get(`/api/scripts/${script_id}/tasks`) as Promise<AnalysisTask[]>;

// ─── Module 1 ─────────────────────────────────────────────────────────────────

export const getModule1 = (script_id: number) =>
  client.get(`/api/scripts/${script_id}/module1`) as Promise<Module1Episode[]>;

export const updateModule1Field = (
  script_id: number,
  episode: number,
  field: string,
  value: string
) =>
  client.patch(`/api/scripts/${script_id}/module1/${episode}/${field}`, { value }) as Promise<Module1Episode>;

// ─── Module 2 ─────────────────────────────────────────────────────────────────

export const getModule2 = (script_id: number) =>
  client.get(`/api/scripts/${script_id}/module2`) as Promise<Module2Episode[]>;

export const updateModule2Field = (
  script_id: number,
  episode: number,
  field: string,
  value: string
) =>
  client.patch(`/api/scripts/${script_id}/module2/${episode}/${field}`, { value }) as Promise<Module2Episode>;

// ─── Module 5 — Cycle Sheet ───────────────────────────────────────────────────

export const getCycleSheet = (script_id: number) =>
  client.get(`/api/scripts/${script_id}/cyclesheet`) as Promise<CycleSheet>;

export const updateCycleSheetField = (
  script_id: number,
  path: string,
  value: string
) =>
  client.patch(`/api/scripts/${script_id}/cyclesheet/field`, { path, value }) as Promise<CycleSheet>;

export const confirmCycleSheet = (script_id: number, confirmed_by: string) =>
  client.post(`/api/scripts/${script_id}/cyclesheet/confirm`, { confirmed_by }) as Promise<CycleSheet>;

export const exportCycleSheet = (script_id: number, format: 'word' | 'json') =>
  client.get(`/api/scripts/${script_id}/cyclesheet/export`, {
    params: { format },
    responseType: 'blob',
  }) as Promise<Blob>;
