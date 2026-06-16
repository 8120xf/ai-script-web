import { useEffect, useRef, useState } from 'react';
import { Input, Typography, Space, Button, Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { FieldRevisionBadge } from './StatusBadge';
import RevisionHistoryPopover from './RevisionHistoryPopover';
import type { FieldRevision } from '../../types';

const { Text } = Typography;
const { TextArea } = Input;

interface EditableFieldProps {
  field: FieldRevision;
  multiline?: boolean;
  placeholder?: string;
  /** 确认：未改内容→已确认，有改动→已修改 */
  onConfirm?: (value: string) => Promise<void>;
  /** @deprecated 同 onConfirm，供 Cycle Sheet 等页面兼容 */
  onSave?: (value: string) => Promise<void>;
  /** 标记存疑（可同时保存当前编辑内容）；仅 buttons 模式展示 */
  onDoubt?: (value: string) => Promise<void>;
  readOnly?: boolean;
  /** icon：仅对号确认；buttons：确认 / 存疑 / 取消 */
  confirmMode?: 'icon' | 'buttons';
  /** 点击编辑区域外关闭编辑（不保存） */
  closeOnClickOutside?: boolean;
}

export default function EditableField({
  field,
  multiline = false,
  placeholder = '暂无内容',
  onConfirm,
  onSave,
  onDoubt,
  readOnly = false,
  confirmMode = 'buttons',
  closeOnClickOutside = false,
}: EditableFieldProps) {
  const confirmHandler = onConfirm ?? onSave;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const [submitting, setSubmitting] = useState(false);
  const editRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(field.value);
    }
  }, [field.value, editing]);

  const handleCancel = () => {
    setDraft(field.value);
    setEditing(false);
  };

  useEffect(() => {
    if (!editing || !closeOnClickOutside) return undefined;

    const onPointerDown = (e: PointerEvent) => {
      const root = editRootRef.current;
      if (root && !root.contains(e.target as Node)) {
        handleCancel();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [editing, closeOnClickOutside, field.value]);

  const handleConfirm = async () => {
    if (!confirmHandler || submitting) return;
    setSubmitting(true);
    try {
      await confirmHandler(draft);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDoubt = async () => {
    if (!onDoubt || submitting) return;
    setSubmitting(true);
    try {
      await onDoubt(draft);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isDoubtful = field.status === 'pending_review';

  if (editing) {
    return (
      <div
        ref={editRootRef}
        style={{ width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {multiline ? (
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
            ) : (
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
            )}
          </div>
          {confirmMode === 'icon' ? (
            <Tooltip title="确认">
              <Button
                type="text"
                size="small"
                loading={submitting}
                icon={<CheckOutlined style={{ color: '#52c41a', fontSize: 16 }} />}
                onClick={handleConfirm}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
            </Tooltip>
          ) : null}
        </div>
        {confirmMode === 'buttons' && (
          <Space size={4} wrap style={{ marginTop: 6 }}>
            <Button type="primary" size="small" loading={submitting} onClick={handleConfirm}>
              {onDoubt ? '确认' : '保存'}
            </Button>
            {onDoubt && (
              <Button size="small" loading={submitting} onClick={handleDoubt}>
                存疑
              </Button>
            )}
            <Button type="text" size="small" disabled={submitting} onClick={handleCancel}>
              取消
            </Button>
          </Space>
        )}
      </div>
    );
  }

  return (
    <div
      className="editable-field"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        minHeight: 22,
        cursor: readOnly ? 'default' : 'pointer',
        padding: isDoubtful ? '4px 6px' : undefined,
        margin: isDoubtful ? '-4px -6px' : undefined,
        borderRadius: isDoubtful ? 4 : undefined,
        background: isDoubtful ? '#fffbe6' : undefined,
        border: isDoubtful ? '1px solid #ffe58f' : undefined,
      }}
      onClick={() => !readOnly && setEditing(true)}
    >
      <div style={{ flex: 1 }}>
        {field.value ? (
          <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{field.value}</Text>
        ) : (
          <Text type="secondary">{placeholder}</Text>
        )}
      </div>
      <Space size={4} style={{ flexShrink: 0, marginTop: 2 }} onClick={(e) => e.stopPropagation()}>
        <RevisionHistoryPopover field={field} />
        <FieldRevisionBadge status={field.status} highlighted={isDoubtful} />
      </Space>
    </div>
  );
}
