import { Tag, Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import type { EvidenceSupport } from '../../types';

const TOOLTIP =
  '该部分内容未经过前 10 集单本观察与情绪曲线校验，请重点人工复核。';

export function isUnsupportedEvidence(support?: EvidenceSupport, startEpisode?: number) {
  if (support === 'unsupported') return true;
  if (startEpisode !== undefined && startEpisode > 10) return true;
  return false;
}

export default function EvidenceTag({
  support,
  startEpisode,
}: {
  support?: EvidenceSupport;
  startEpisode?: number;
}) {
  if (!isUnsupportedEvidence(support, startEpisode)) return null;

  return (
    <Tooltip title={TOOLTIP}>
      <Tag
        icon={<WarningOutlined />}
        color="warning"
        style={{ fontSize: 11, marginLeft: 4 }}
      >
        未经模块 1/2 校验
      </Tag>
    </Tooltip>
  );
}
