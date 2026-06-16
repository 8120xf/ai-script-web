import type { Script, ParsePreview, ReviewStatus } from '../types';
import { MOCK_SCRIPTS, MOCK_PARSE_PREVIEWS, buildScriptTextFromTree } from './mock';

const DEFAULT_REVIEW: ReviewStatus = 'not_started';

/** 补齐 HMR / 旧 mock 数据缺失字段，避免列表或预览页渲染失败 */
export function normalizeScript(raw: Partial<Script> & Pick<Script, 'id' | 'title'>): Script {
  const fallback = MOCK_SCRIPTS.find((s) => s.id === raw.id);
  return {
    id: raw.id,
    title: raw.title,
    genre: raw.genre ?? fallback?.genre ?? 'other',
    tier: raw.tier ?? fallback?.tier,
    total_episodes: raw.total_episodes ?? fallback?.total_episodes ?? 0,
    file_type: raw.file_type ?? fallback?.file_type ?? 'txt',
    file_name: raw.file_name ?? fallback?.file_name ?? `${raw.title}.txt`,
    status: raw.status ?? fallback?.status ?? 'uploaded',
    created_at: raw.created_at ?? fallback?.created_at ?? new Date().toISOString().slice(0, 10),
    updated_at: raw.updated_at ?? fallback?.updated_at ?? new Date().toISOString().slice(0, 10),
    cycle_sheet_confirmed: raw.cycle_sheet_confirmed ?? fallback?.cycle_sheet_confirmed ?? false,
    module5_draft_only: raw.module5_draft_only ?? fallback?.module5_draft_only ?? false,
    module1_status: raw.module1_status ?? fallback?.module1_status ?? 'not_started',
    module2_status: raw.module2_status ?? fallback?.module2_status ?? 'not_started',
    module5_status: raw.module5_status ?? fallback?.module5_status ?? 'not_started',
    module1_review_status: raw.module1_review_status ?? fallback?.module1_review_status ?? DEFAULT_REVIEW,
    module2_review_status: raw.module2_review_status ?? fallback?.module2_review_status ?? DEFAULT_REVIEW,
  };
}

export function normalizeParsePreview(raw: Partial<ParsePreview> & Pick<ParsePreview, 'script_id'>): ParsePreview {
  const fallback = MOCK_PARSE_PREVIEWS[raw.script_id];
  const structure_tree = raw.structure_tree ?? fallback?.structure_tree ?? [];
  return {
    script_id: raw.script_id,
    file_name: raw.file_name ?? fallback?.file_name ?? '未知文件',
    file_type: raw.file_type ?? fallback?.file_type ?? 'txt',
    total_episodes: raw.total_episodes ?? fallback?.total_episodes ?? null,
    total_scenes: raw.total_scenes ?? fallback?.total_scenes ?? null,
    main_characters: raw.main_characters ?? fallback?.main_characters ?? null,
    episode_previews: raw.episode_previews ?? fallback?.episode_previews ?? [],
    structure_tree,
    script_text: raw.script_text
      ?? fallback?.script_text
      ?? (structure_tree.length ? buildScriptTextFromTree('剧本', structure_tree) : '（暂无剧本文本）'),
    incomplete: raw.incomplete ?? fallback?.incomplete ?? structure_tree.length === 0,
  };
}
