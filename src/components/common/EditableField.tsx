import { useState } from 'react';
import { Input, Typography, Space, Tooltip } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FieldRevisionBadge } from './StatusBadge';
import type { FieldRevision } from '../../types';

const { Text } = Typography;
const { TextArea } = Input;

interface EditableFieldProps {
  field: FieldRevision;
  multiline?: boolean;
  placeholder?: string;
  onSave?: (value: string) => Promise<void>;
  readOnly?: boolean;
}

export default function EditableField({
  field,
  multiline = false,
  placeholder = '暂无内容',
  onSave,
  readOnly = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);

  const handleSave = async () => {
    if (!onSave) return;
    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      // keep editing open on error
    }
  };

  const handleCancel = () => {
    setDraft(field.value);
    setEditing(false);
  };

  if (editing) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size={4}>
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
            onPressEnter={handleSave}
          />
        )}
        <Space size={4}>
          <Tooltip title="保存">
            <CheckOutlined
              style={{ color: '#52c41a', cursor: 'pointer' }}
              onClick={handleSave}
            />
          </Tooltip>
          <Tooltip title="取消">
            <CloseOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer' }}
              onClick={handleCancel}
            />
          </Tooltip>
        </Space>
      </Space>
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
      <Space size={4} style={{ flexShrink: 0, marginTop: 2 }}>
        <FieldRevisionBadge status={field.status} />
        {!readOnly && (
          <EditOutlined style={{ color: '#bbb', fontSize: 12 }} />
        )}
      </Space>
    </div>
  );
}
