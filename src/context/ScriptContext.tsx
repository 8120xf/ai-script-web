import {
  createContext, useContext, useState, useCallback, type ReactNode,
} from 'react';
import type { Script, ParsePreview, ScriptGenre, FileType } from '../types';
import {
  MOCK_SCRIPTS, MOCK_PARSE_PREVIEWS, buildMockParsePreview,
} from '../utils/mock';
import { normalizeParsePreview, normalizeScript } from '../utils/normalize';

interface AddScriptInput {
  title: string;
  genre: ScriptGenre;
  tier?: string;
  file_name: string;
  file_type: FileType;
}

interface ScriptContextValue {
  scripts: Script[];
  parsePreviews: Record<number, ParsePreview>;
  getScript: (id: number) => Script | undefined;
  getParsePreview: (id: number) => ParsePreview | undefined;
  addScript: (input: AddScriptInput) => number;
  confirmCycleSheet: (scriptId: number, confirmedBy: string) => void;
}

const ScriptContext = createContext<ScriptContextValue | null>(null);

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [scripts, setScripts] = useState<Script[]>(() =>
    MOCK_SCRIPTS.map((s) => normalizeScript(s)),
  );
  const [parsePreviews, setParsePreviews] = useState<Record<number, ParsePreview>>(() => {
    const entries = Object.entries(MOCK_PARSE_PREVIEWS).map(([id, p]) => [
      Number(id),
      normalizeParsePreview(p),
    ] as const);
    return Object.fromEntries(entries);
  });
  const [nextId, setNextId] = useState(() =>
    Math.max(...MOCK_SCRIPTS.map((s) => s.id), 0) + 1,
  );

  const getScript = useCallback(
    (id: number) => {
      const found = scripts.find((s) => s.id === id);
      return found ? normalizeScript(found) : undefined;
    },
    [scripts],
  );

  const getParsePreview = useCallback(
    (id: number) => {
      const raw = parsePreviews[id];
      return raw ? normalizeParsePreview(raw) : undefined;
    },
    [parsePreviews],
  );

  const addScript = useCallback((input: AddScriptInput) => {
    const id = nextId;
    const now = new Date().toISOString().slice(0, 10);
    const preview = buildMockParsePreview(id, input.file_name, input.file_type, input.title);

    const script: Script = {
      id,
      title: input.title,
      genre: input.genre,
      tier: input.tier as Script['tier'],
      total_episodes: preview.total_episodes ?? 0,
      file_type: input.file_type,
      file_name: input.file_name,
      status: 'uploaded',
      created_at: now,
      updated_at: now,
      cycle_sheet_confirmed: false,
      module5_draft_only: false,
      module1_status: 'not_started',
      module2_status: 'not_started',
      module5_status: 'not_started',
      module1_review_status: 'not_started',
      module2_review_status: 'not_started',
    };

    setScripts((prev) => [normalizeScript(script), ...prev.map(normalizeScript)]);
    setParsePreviews((prev) => ({ ...prev, [id]: normalizeParsePreview(preview) }));
    setNextId((n) => n + 1);
    return id;
  }, [nextId]);

  const confirmCycleSheet = useCallback((scriptId: number, confirmedBy: string) => {
    setScripts((prev) =>
      prev.map((s) =>
        s.id === scriptId
          ? {
              ...s,
              cycle_sheet_confirmed: true,
              module5_status: s.module5_status === 'awaiting_review' ? 'success' : s.module5_status,
              updated_at: new Date().toISOString().slice(0, 10),
            }
          : s,
      ),
    );
    void confirmedBy;
  }, []);

  return (
    <ScriptContext.Provider
      value={{
        scripts,
        parsePreviews,
        getScript,
        getParsePreview,
        addScript,
        confirmCycleSheet,
      }}
    >
      {children}
    </ScriptContext.Provider>
  );
}

export function useScripts() {
  const ctx = useContext(ScriptContext);
  if (!ctx) throw new Error('useScripts must be used within ScriptProvider');
  return {
    ...ctx,
    scripts: ctx.scripts.map(normalizeScript),
    getScript: (id: number) => {
      const found = ctx.scripts.find((s) => s.id === id);
      return found ? normalizeScript(found) : undefined;
    },
  };
}

/** 列表点击剧名默认进入分析任务页 */
export function getScriptFlowPath(script: Script): string {
  return `/scripts/${script.id}/analyze`;
}
