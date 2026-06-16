// ─── Script ──────────────────────────────────────────────────────────────────

export type ScriptStatus = 'uploaded' | 'analyzing' | 'done' | 'error';
export type ScriptGenre = 'romance' | 'family' | 'urban' | 'fantasy' | 'suspense' | 'comedy' | 'historical' | 'other';
export type ScriptTier = 'S' | 'A' | 'B' | 'C';
export type FileType = 'txt' | 'word' | 'pdf';

export interface Script {
  id: number;
  title: string;
  genre: ScriptGenre;
  tier?: ScriptTier;
  total_episodes: number;
  file_type: FileType;
  file_name: string;
  status: ScriptStatus;
  created_at: string;
  updated_at: string;
  cycle_sheet_confirmed: boolean;
  /** 模块 5 单独生成、未经模块 1/2 校验 */
  module5_draft_only: boolean;
  module1_status: TaskStatus;
  module2_status: TaskStatus;
  module5_status: TaskStatus;
  /** 前 10 集观察复核进度（字段级聚合） */
  module1_review_status: ReviewStatus;
  /** 情绪曲线复核进度 */
  module2_review_status: ReviewStatus;
}

export type ReviewStatus = 'not_started' | 'pending_review' | 'reviewed';

// ─── Parse Preview ───────────────────────────────────────────────────────────

export interface SceneStructure {
  scene_number: number;
  location?: string;
  characters: string[];
  text_preview: string;
  /** 该场次解析是否完整 */
  parse_complete: boolean;
}

export interface EpisodeStructure {
  episode_number: number;
  scenes: SceneStructure[];
}

export interface EpisodePreview {
  episode_number: number;
  scene_count?: number;
  text_preview: string;
}

export interface ParsePreview {
  script_id: number;
  file_name: string;
  file_type: FileType;
  total_episodes: number | null;
  total_scenes: number | null;
  main_characters: string[] | null;
  episode_previews: EpisodePreview[];
  /** 前几集集→场结构树（预览用） */
  structure_tree: EpisodeStructure[];
  /** 提取后的剧本文本（供在线查看） */
  script_text: string;
  incomplete: boolean;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export type TaskStatus = 'not_started' | 'pending' | 'in_progress' | 'success' | 'fail' | 'awaiting_review';

export interface AnalysisTask {
  id: number;
  script_id: number;
  module: 'module1' | 'module2' | 'module5';
  status: TaskStatus;
  created_at: string;
  finished_at?: string;
  error_msg?: string;
}

// ─── Module 1 ─────────────────────────────────────────────────────────────────

export type FieldRevisionStatus = 'ai_generated' | 'confirmed' | 'modified' | 'pending_review';

export interface FieldRevisionEntry {
  before_value: string;
  after_value: string;
  editor: string;
  edited_at: string;
  status: FieldRevisionStatus;
}

export interface FieldRevision {
  value: string;
  status: FieldRevisionStatus;
  ai_original_value?: string;
  editor?: string;
  edited_at?: string;
  revisions?: FieldRevisionEntry[];
}

export interface Module1Episode {
  episode_number: number;
  core_event: FieldRevision;
  opening_style: FieldRevision;
  main_conflict_target: FieldRevision;
  relationship_change: FieldRevision;
  info_increment: FieldRevision;
  ending_style: FieldRevision;
  streaming_clip: FieldRevision;
}

// ─── Module 2 ─────────────────────────────────────────────────────────────────

export type EmotionType =
  | 'shame'
  | 'betrayal'
  | 'misunderstanding'
  | 'oppression'
  | 'heartache'
  | 'rage'
  | 'ambiguity'
  | 'satisfaction'
  | 'suspense'
  | 'regret'
  | 'crisis'
  | 'sweetness'
  | 'other';

export type EmotionDirection = 'positive' | 'negative' | 'neutral' | 'turn';

export interface Module2Episode {
  episode_number: number;
  primary_emotion: EmotionType;
  secondary_emotions: FieldRevision;
  emotion_direction: FieldRevision;
  emotion_intensity: FieldRevision;
  peak_event: FieldRevision;
  emotion_change: FieldRevision;
  ending_emotion: FieldRevision;
  hook_intensity: FieldRevision;
  traffic_value: FieldRevision;
  evidence: FieldRevision;
}

// ─── Module 5 — Cycle Sheet ──────────────────────────────────────────────────

export type EvidenceSupport = 'module12_supported' | 'unsupported';

export type CycleSheetStatus = 'draft' | 'pending_confirm' | 'confirmed' | 'pending_review';

export interface CycleSheetOverview {
  drama_title: FieldRevision;
  genre: FieldRevision;
  analysis_scope: FieldRevision;
  selling_point: FieldRevision;
  core_conflict: FieldRevision;
  core_expectation: FieldRevision;
}

export interface Interlink {
  id: string;
  position: FieldRevision;
  before_cycle: FieldRevision;
  after_cycle: FieldRevision;
  content: FieldRevision;
  motivation: FieldRevision;
  information: FieldRevision;
  emotion_transition: FieldRevision;
  evidence: FieldRevision;
}

export interface KeyFrame {
  id: string;
  episode: number;
  scene_id: string;
  related_ref: FieldRevision;
  description: FieldRevision;
  expressed_emotions: FieldRevision;
  traffic_value: FieldRevision;
  traffic_tagline: FieldRevision;
  evidence: FieldRevision;
  evidence_support?: EvidenceSupport;
}

export interface Paywall {
  id: string;
  episode: number;
  scene_id: string;
  paywall_type: 'hard' | 'soft';
  intensity: 0 | 1 | 2 | 3 | 4 | 5;
  description: FieldRevision;
  trigger_emotions: FieldRevision;
  unreleased_content: FieldRevision;
  payment_incentive: FieldRevision;
  evidence: FieldRevision;
  evidence_support?: EvidenceSupport;
}

export interface SubCycle {
  id: string;
  coverage: FieldRevision;
  sub_cycle_type: FieldRevision;
  flow: FieldRevision;
  twist: FieldRevision;
  paywall_summary: FieldRevision;
  key_frame_summary: FieldRevision;
  primary_emotion: FieldRevision;
  secondary_emotions: FieldRevision;
  plot_function: FieldRevision;
  commercial_value: FieldRevision;
  evidence: FieldRevision;
  start_episode: number;
  end_episode: number;
  paywalls: Paywall[];
  key_frames: KeyFrame[];
  evidence_support?: EvidenceSupport;
}

export interface CoreCycle {
  id: string;
  cycle_number: number;
  start_episode: number;
  end_episode: number;
  stage_title: FieldRevision;
  stage_goal: FieldRevision;
  protagonist_goal: FieldRevision;
  main_obstacle: FieldRevision;
  emotion_escalation: FieldRevision;
  relationship_change: FieldRevision;
  stage_release: FieldRevision;
  new_hook: FieldRevision;
  commercial_value: FieldRevision;
  sub_cycles: SubCycle[];
  interlinks: Interlink[];
  evidence_support?: EvidenceSupport;
}

export interface CycleSheet {
  id: number;
  script_id: number;
  version: number;
  overview: CycleSheetOverview;
  core_cycles: CoreCycle[];
  sheet_status: CycleSheetStatus;
  ai_generated_at: string;
  created_at: string;
  updated_at: string;
  confirmed_by?: string;
  confirmed_at?: string;
}
