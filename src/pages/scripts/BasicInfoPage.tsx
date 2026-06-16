import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button, Descriptions, Drawer, Space, Typography, Input,
} from 'antd';
import {
  UploadOutlined, FileTextOutlined, BarChartOutlined,
  ReadOutlined, SearchOutlined,
} from '@ant-design/icons';
import ScriptWorkspace from '../../components/layout/ScriptWorkspace';
import { useScripts } from '../../context/ScriptContext';
import { FILE_TYPE_LABEL, GENRE_LABEL } from '../../utils/mock';

const { Text, Paragraph } = Typography;

export default function BasicInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scriptId = Number(id);
  const { getScript, getParsePreview } = useScripts();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const script = getScript(scriptId);
  const preview = getParsePreview(scriptId);

  if (!script || !preview) return <div>剧本不存在或尚未完成解析</div>;

  const scriptText = preview.script_text ?? '';
  const searchLower = search.trim().toLowerCase();
  const highlightedText = searchLower
    ? scriptText
        .split('\n')
        .filter((line) => !searchLower || line.toLowerCase().includes(searchLower))
        .join('\n')
    : scriptText;

  return (
    <ScriptWorkspace pageTitle="基础信息" pageSub="结构解析结果与剧本预览">
      {preview.incomplete && (
        <div className="editorial-hint" style={{ borderColor: '#e8d4c4', background: '#faf6ee', marginBottom: 16 }}>
          部分结构未识别，不影响继续分析，但可能影响 AI 输出质量。系统已尽力识别集数、场次与角色。
        </div>
      )}

      <div className="editorial-sheet-card">
        <div className="editorial-sheet-card-header">
          <h3 className="editorial-sheet-card-title">文件信息</h3>
        </div>
        <div className="editorial-sheet-card-body">
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="文件名">
              <Space>
                <FileTextOutlined />
                {preview.file_name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="文件类型">
              <span className="editorial-pill">{FILE_TYPE_LABEL[preview.file_type]}</span>
            </Descriptions.Item>
            <Descriptions.Item label="剧本类型">
              {GENRE_LABEL[script.genre] ?? script.genre}
            </Descriptions.Item>
            {script.tier && (
              <Descriptions.Item label="已有等级">
                <span className="script-card-tier">{script.tier} 级</span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="识别总集数">
              {preview.total_episodes ?? <Text type="secondary">未能识别</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="识别总场次">
              {preview.total_scenes ?? <Text type="secondary">未能识别</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="主要角色" span={2}>
              {preview.main_characters?.length ? (
                <Space wrap>
                  {preview.main_characters.map((c) => (
                    <span key={c} className="editorial-pill">{c}</span>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">未能识别</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <div className="editorial-sheet-card" style={{ marginTop: 16 }}>
        <div className="editorial-sheet-card-header">
          <h3 className="editorial-sheet-card-title">前几集结构摘要</h3>
        </div>
        <div className="editorial-sheet-card-body">
          {preview.episode_previews.map((ep) => (
            <div key={ep.episode_number} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="editorial-pill" style={{ fontFamily: 'var(--font-display)' }}>
                  第 {ep.episode_number} 集
                </span>
                {ep.scene_count !== undefined ? (
                  <Text type="secondary" style={{ fontSize: 12 }}>{ep.scene_count} 场</Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: 12 }}>场次数未识别</Text>
                )}
              </div>
              <Paragraph
                style={{
                  margin: 0,
                  padding: '12px 14px',
                  background: 'var(--color-paper-muted)',
                  borderRadius: 8,
                  border: '1px solid var(--color-border-light)',
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'var(--color-ink-secondary)',
                }}
              >
                {ep.text_preview}
              </Paragraph>
            </div>
          ))}
        </div>
      </div>

      <Space wrap style={{ marginTop: 20 }}>
        <Button
          icon={<ReadOutlined />}
          onClick={() => setViewerOpen(true)}
        >
          查看剧本
        </Button>
        <Button
          type="primary"
          icon={<BarChartOutlined />}
          onClick={() => navigate(`/scripts/${scriptId}/analyze`)}
        >
          前往分析
        </Button>
        <Button icon={<UploadOutlined />} onClick={() => navigate('/scripts/upload')}>
          重新上传
        </Button>
      </Space>

      <Drawer
        title="查看剧本"
        width={720}
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSearch('');
        }}
        extra={
          <span className="editorial-pill">{preview.file_name}</span>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索剧本内容"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--color-paper-muted)',
              borderRadius: 8,
              border: '1px solid var(--color-border-light)',
              maxHeight: 'calc(100vh - 180px)',
              overflow: 'auto',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.85,
              whiteSpace: 'pre-wrap',
              color: 'var(--color-ink)',
            }}
          >
            {highlightedText || (
              <Text type="secondary">无匹配内容</Text>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            共约 {scriptText.length.toLocaleString()} 字
            {search && ` · 显示匹配行`}
          </Text>
        </Space>
      </Drawer>
    </ScriptWorkspace>
  );
}
