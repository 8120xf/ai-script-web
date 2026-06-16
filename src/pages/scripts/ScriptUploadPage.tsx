import { useState } from 'react';
import {
  Form, Input, Select, InputNumber, Upload, Button, Card, Typography,
  Space, message, Divider,
} from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload';

const { Title, Text } = Typography;
const { Dragger } = Upload;

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
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (_values: Record<string, unknown>) => {
    if (fileList.length === 0) {
      message.error('请上传剧本 TXT 文件');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success('剧本上传成功（Mock）');
      navigate('/scripts');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/scripts')} />
        <Title level={4} style={{ margin: 0 }}>上传新剧本</Title>
      </Space>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Title level={5} style={{ marginTop: 0 }}>基础信息</Title>

          <Form.Item
            label="剧本名称"
            name="title"
            rules={[{ required: true, message: '请输入剧本名称' }]}
          >
            <Input placeholder="例：替嫁甜妻：总裁的秘密" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              label="剧本类型"
              name="genre"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select options={GENRE_OPTIONS} placeholder="选择类型" />
            </Form.Item>

            <Form.Item
              label="质量等级"
              name="tier"
              rules={[{ required: true, message: '请选择等级' }]}
            >
              <Select options={TIER_OPTIONS} placeholder="选择等级" />
            </Form.Item>

            <Form.Item
              label="总集数"
              name="total_episodes"
              rules={[{ required: true, message: '请填写集数' }]}
            >
              <InputNumber min={1} max={500} style={{ width: '100%' }} placeholder="80" />
            </Form.Item>
          </div>

          <Divider />

          <Title level={5}>上传剧本文件</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
            支持标准格式 TXT 文件，包含集数、场次、人物、旁白、动作、对白等字段。
          </Text>

          <Form.Item>
            <Dragger
              accept=".txt"
              maxCount={1}
              fileList={fileList}
              beforeUpload={(file) => {
                if (!file.name.endsWith('.txt')) {
                  message.error('仅支持 .txt 格式');
                  return Upload.LIST_IGNORE;
                }
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽 TXT 文件到此区域上传</p>
              <p className="ant-upload-hint">
                标准格式：【第X集】【场X】 角色：台词 / 旁白：旁白内容
              </p>
            </Dragger>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Space>
              <Button onClick={() => navigate('/scripts')}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                上传并保存
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
