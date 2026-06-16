import type { AssetPhase } from '../../utils/assetStatus';

const PHASE_STYLE: Record<
  AssetPhase,
  { dot: string; text: string; pulse?: boolean }
> = {
  not_started: { dot: '#c4bdb4', text: '未生成' },
  generating: { dot: '#6b8f7b', text: '生成中', pulse: true },
  failed: { dot: '#9b3d3d', text: '失败' },
  pending_confirm: { dot: '#a67c52', text: '待确认' },
  confirmed: { dot: '#2d5a4a', text: '已确认' },
  pending_review: { dot: '#a67c52', text: '待复核' },
  reviewed: { dot: '#2d5a4a', text: '已复核' },
  ready: { dot: '#2d5a4a', text: '已就绪' },
};

export default function EditorialPhaseDot({ phase }: { phase: AssetPhase }) {
  const style = PHASE_STYLE[phase];
  return (
    <span className="editorial-phase">
      <span
        className={`editorial-phase-dot${style.pulse ? ' pulse' : ''}`}
        style={{ background: style.dot }}
      />
      {style.text}
    </span>
  );
}
