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

const FIELD_STATUS_MAP: Record<string, { color: string; label: string; dot: string }> = {
  ai_generated: { color: 'blue', label: 'AI 生成', dot: '#5c6b7a' },
  confirmed: { color: 'success', label: '已确认', dot: '#2d5a4a' },
  modified: { color: 'warning', label: '已修改', dot: '#a67c52' },
  pending_review: { color: 'gold', label: '存疑', dot: '#8b2942' },
};

export function FieldRevisionBadge({
  status,
  highlighted,
  variant = 'tag',
}: {
  status: string;
  highlighted?: boolean;
  variant?: 'tag' | 'editorial';
}) {
  const config = FIELD_STATUS_MAP[status] ?? {
    color: 'default',
    label: status,
    dot: '#c4bdb4',
  };

  if (variant === 'editorial') {
    return (
      <span className="editorial-field-status">
        <span
          className="editorial-field-status-dot"
          style={{ background: config.dot }}
        />
        {config.label}
      </span>
    );
  }

  return (
    <Tag
      color={config.color}
      style={{
        fontSize: 11,
        margin: 0,
        ...(highlighted ? { fontWeight: 600 } : {}),
      }}
    >
      {config.label}
    </Tag>
  );
}
