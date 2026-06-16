import { Popover, Typography, Timeline, Tag, Space } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import type { FieldRevision } from '../../types';

const { Text } = Typography;

const STATUS_LABEL: Record<string, string> = {
  ai_generated: 'AI 生成',
  confirmed: '已确认',
  modified: '已修改',
  pending_review: '存疑',
};

export default function RevisionHistoryPopover({ field }: { field: FieldRevision }) {
  const revisions = field.revisions ?? [];
  const aiOriginal = field.ai_original_value ?? field.value;
  const hasHistory = revisions.length > 0 || aiOriginal !== field.value;

  if (!hasHistory && !field.ai_original_value) return null;

  const content = (
    <div style={{ maxWidth: 320 }}>
      <Text type="secondary" style={{ fontSize: 12 }}>AI 原始内容</Text>
      <div style={{ marginBottom: 8, fontSize: 12, whiteSpace: 'pre-wrap' }}>{aiOriginal}</div>
      {revisions.length > 0 && (
        <>
          <Text type="secondary" style={{ fontSize: 12 }}>修改记录</Text>
          <Timeline
            style={{ marginTop: 8, maxHeight: 200, overflow: 'auto' }}
            items={revisions.map((r, i) => ({
              key: i,
              children: (
                <Space direction="vertical" size={2}>
                  <Text style={{ fontSize: 11 }}>{r.editor} · {new Date(r.edited_at).toLocaleString()}</Text>
                  <Tag style={{ fontSize: 10 }}>{STATUS_LABEL[r.status] ?? r.status}</Tag>
                  <Text delete style={{ fontSize: 11, display: 'block' }}>{r.before_value}</Text>
                  <Text style={{ fontSize: 11, display: 'block' }}>{r.after_value}</Text>
                </Space>
              ),
            }))}
          />
        </>
      )}
    </div>
  );

  return (
    <Popover title="修改留痕" content={content} trigger="click">
      <HistoryOutlined
        style={{ color: '#1677ff', fontSize: 12, cursor: 'pointer' }}
        onClick={(e) => e.stopPropagation()}
      />
    </Popover>
  );
}
