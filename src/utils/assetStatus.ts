import type { Script, TaskStatus, ReviewStatus } from '../types';

export type AssetPhase =
  | 'not_started'
  | 'generating'
  | 'failed'
  | 'pending_confirm'
  | 'confirmed'
  | 'pending_review'
  | 'reviewed'
  | 'ready';

export interface AssetStatusRow {
  label: string;
  phase: AssetPhase;
  detail?: string;
}

const PHASE_TAG: Record<AssetPhase, { color: string; text: string }> = {
  not_started: { color: 'default', text: '未生成' },
  generating: { color: 'processing', text: '生成中' },
  failed: { color: 'error', text: '失败' },
  pending_confirm: { color: 'warning', text: '待确认' },
  confirmed: { color: 'success', text: '已确认' },
  pending_review: { color: 'orange', text: '待复核' },
  reviewed: { color: 'success', text: '已复核' },
  ready: { color: 'success', text: '已就绪' },
};

export function getPhaseTag(phase: AssetPhase) {
  return PHASE_TAG[phase];
}

function mapReviewPhase(
  taskStatus: TaskStatus,
  reviewStatus: ReviewStatus | undefined,
): AssetPhase {
  if (taskStatus === 'not_started') return 'not_started';
  if (taskStatus === 'pending' || taskStatus === 'in_progress') return 'generating';
  if (taskStatus === 'fail') return 'failed';
  if (reviewStatus === 'reviewed') return 'reviewed';
  return 'pending_review';
}

function mapStructurePhase(script: Script): AssetPhase {
  const { module5_status, cycle_sheet_confirmed } = script;
  if (module5_status === 'not_started') return 'not_started';
  if (module5_status === 'pending' || module5_status === 'in_progress') return 'generating';
  if (module5_status === 'fail') return 'failed';
  if (cycle_sheet_confirmed) return 'confirmed';
  return 'pending_confirm';
}

/** 列表「资产状态」列：方案 A（不含基础信息） */
export function getAssetStatusRows(script: Script): AssetStatusRow[] {
  return [
    {
      label: '前 10 集观察报告',
      phase: mapReviewPhase(script.module1_status, script.module1_review_status),
    },
    {
      label: '情绪曲线',
      phase: mapReviewPhase(script.module2_status, script.module2_review_status),
    },
    {
      label: '情节结构',
      phase: mapStructurePhase(script),
    },
  ];
}
