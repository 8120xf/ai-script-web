import { Tag } from 'antd';
import type { TaskStatus, ScriptStatus } from '../../types';

const TASK_STATUS_MAP: Record<TaskStatus, { color: string; label: string }> = {
  not_started: { color: 'default', label: '未开始' },
  pending: { color: 'processing', label: '排队中' },
  in_progress: { color: 'processing', label: '分析中' },
  success: { color: 'success', label: '已完成' },
  fail: { color: 'error', label: '失败' },
  awaiting_review: { color: 'warning', label: '待复核' },
};

const SCRIPT_STATUS_MAP: Record<ScriptStatus, { color: string; label: string }> = {
  uploaded: { color: 'default', label: '已上传' },
  analyzing: { color: 'processing', label: '分析中' },
  done: { color: 'success', label: '已完成' },
  error: { color: 'error', label: '异常' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = TASK_STATUS_MAP[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}

export function ScriptStatusBadge({ status }: { status: ScriptStatus }) {
  const config = SCRIPT_STATUS_MAP[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}

export function FieldRevisionBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    ai_generated: { color: 'blue', label: 'AI 生成' },
    confirmed: { color: 'green', label: '已确认' },
    modified: { color: 'orange', label: '人工修改' },
    pending_review: { color: 'gold', label: '待复核' },
  };
  const config = map[status] ?? { color: 'default', label: status };
  return (
    <Tag color={config.color} style={{ fontSize: 11 }}>
      {config.label}
    </Tag>
  );
}
