// ─── Script ──────────────────────────────────────────────────────────────────

export type ScriptStatus = 'uploaded' | 'analyzing' | 'done' | 'error';
export type ScriptGenre = 'romance' | 'family' | 'urban' | 'fantasy' | 'suspense' | 'comedy' | 'historical' | 'other';
export type ScriptTier = 'S' | 'A' | 'B' | 'C';

export interface Script {
  id: number;
  title: string;
  genre: ScriptGenre;
  tier: ScriptTier;
  total_episodes: number;
  status: ScriptStatus;
  created_at: string;
  updated_at: string;
  module1_status: TaskStatus;
  module2_status: TaskStatus;
  module5_status: TaskStatus;
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

export interface FieldRevision {
  value: string;
  status: FieldRevisionStatus;
  editor?: string;
  edited_at?: string;
}

export interface Module1Episode {
  episode_number: number;
  core_event: FieldRevision;
  character_change: FieldRevision;
  conflict_point: FieldRevision;
  turning_point: FieldRevision;
  hook: FieldRevision;
}

// ─── Module 2 ─────────────────────────────────────────────────────────────────

export type EmotionType =
  | 'shame'
  | 'betrayal'
  | 'suspense'
  | 'desire'
  | 'rage'
  | 'grief'
  | 'relief'
  | 'anticipation'
  | 'other';

export interface EmotionPoint {
  scene_id: string;
  emotion_type: EmotionType;
  intensity: 0 | 1 | 2 | 3 | 4 | 5;
  trigger_event: FieldRevision;
  character: string;
}

export interface Module2Episode {
  episode_number: number;
  dominant_emotion: EmotionType;
  peak_intensity: number;
  emotion_points: EmotionPoint[];
}

// ─── Module 5 — Cycle Sheet ──────────────────────────────────────────────────

export interface CycleSheetOverview {
  drama_title: FieldRevision;
  genre: FieldRevision;
  tier: FieldRevision;
  core_conflict: FieldRevision;
  protagonist_desire: FieldRevision;
  antagonist_obstacle: FieldRevision;
  resolution_type: FieldRevision;
  total_episodes: FieldRevision;
  total_core_cycles: FieldRevision;
}

export interface KeyFrame {
  episode: number;
  scene_id: string;
  description: FieldRevision;
  visual_type: string;
  commercial_value: FieldRevision;
}

export interface Paywall {
  episode: number;
  scene_id: string;
  paywall_type: 'hard' | 'soft';
  intensity: 1 | 2 | 3 | 4 | 5;
  description: FieldRevision;
  emotion_type: EmotionType;
}

export interface SubCycle {
  id: string;
  sub_cycle_type: FieldRevision;
  start_episode: number;
  end_episode: number;
  scenes: string[];
  function: FieldRevision;
  emotion_peak: FieldRevision;
  paywalls: Paywall[];
  key_frames: KeyFrame[];
}

export interface CoreCycle {
  id: string;
  cycle_number: number;
  start_episode: number;
  end_episode: number;
  theme: FieldRevision;
  narrative_phase: FieldRevision;
  sub_cycles: SubCycle[];
  interlink: FieldRevision;
}

export interface CycleSheet {
  id: number;
  script_id: number;
  version: number;
  overview: CycleSheetOverview;
  core_cycles: CoreCycle[];
  created_at: string;
  updated_at: string;
  confirmed_by?: string;
  confirmed_at?: string;
}
