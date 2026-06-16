import { useState } from 'react';
import {
  Form, Input, Select, Upload, Button, Divider,
  message,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload';
import { useScripts } from '../../context/ScriptContext';
import { detectFileType } from '../../utils/mock';
import type { ScriptGenre } from '../../types';

const { Dragger } = Upload;

const ACCEPT = '.txt,.doc,.docx,.pdf';

const GENRE_OPTIONS = [
  { label: '都市言情', value: 'romance' },
  { label: '家庭伦理', value: 'family' },
  { label: '都市逆袭', value: 'urban' },
  { label: '玄幻', value: 'fantasy' },
  { label: '悬疑', value: 'suspense' },
  { label: '喜剧', value: 'comedy' },
  { label: '古装', value: 'historical' },
  { label: '其他', value: 'other' },
];

const TIER_OPTIONS = [
  { label: 'S 级（爆款）', value: 'S' },
  { label: 'A 级（优质）', value: 'A' },
  { label: 'B 级（普通）', value: 'B' },
  { label: 'C 级（待提升）', value: 'C' },
];

export default function ScriptUploadPage() {
  const navigate = useNavigate();
  const { addScript } = useScripts();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (fileList.length === 0) {
      message.error('请上传剧本文件');
      return;
    }
    const file = fileList[0];
    const fileType = detectFileType(file.name);
    if (!fileType) {
      message.error('仅支持 TXT、Word（.doc/.docx）、PDF 格式');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const newId = addScript({
        title: values.title as string,
        genre: values.genre as ScriptGenre,
        tier: values.tier as string | undefined,
        file_name: file.name,
        file_type: fileType,
      });
      message.success('上传成功');
      navigate(`/scripts/${newId}/info`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-page">
      <button
        type="button"
        className="upload-page-back"
        onClick={() => navigate('/scripts')}
      >
        ← 剧本列表
      </button>

      <h1 className="upload-page-title">上传新剧本</h1>
      <p className="upload-page-sub">
        填写基础信息并上传文件，系统将自动解析结构
      </p>

      <div className="upload-form-card">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <h2 className="upload-section-title">基础信息</h2>

          <Form.Item
            label="剧本名称"
            name="title"
            rules={[{ required: true, message: '请输入剧本名称' }]}
          >
            <Input placeholder="例：替嫁甜妻：总裁的秘密" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              label="剧本类型"
              name="genre"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select options={GENRE_OPTIONS} placeholder="选择类型" />
            </Form.Item>

            <Form.Item label="已有等级（选填）" name="tier">
              <Select options={TIER_OPTIONS} placeholder="若无则留空" allowClear />
            </Form.Item>
          </div>

          <Divider style={{ borderColor: 'var(--color-border-light)' }} />

          <h2 className="upload-section-title">上传剧本文件</h2>
          <span className="upload-section-hint">
            支持 TXT、Word（.doc / .docx）、PDF。系统会提取文本并尽力识别结构，不对内容格式做模板校验。
          </span>

          <Form.Item>
            <Dragger
              accept={ACCEPT}
              maxCount={1}
              fileList={fileList}
              beforeUpload={(file) => {
                if (!detectFileType(file.name)) {
                  message.error('仅支持 TXT、Word、PDF 格式');
                  return Upload.LIST_IGNORE;
                }
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
              style={{
                background: 'var(--color-paper-muted)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: 'var(--color-accent)' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持 .txt · .doc / .docx · .pdf</p>
            </Dragger>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Button onClick={() => navigate('/scripts')} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              上传并解析
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
