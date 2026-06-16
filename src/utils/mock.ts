import type {
  Script, Module1Episode, Module2Episode, CycleSheet,
  AnalysisTask, FieldRevision,
} from '../types';

const ai = (value: string): FieldRevision => ({
  value,
  status: 'ai_generated',
  editor: 'GPT-4',
  edited_at: new Date().toISOString(),
});

const confirmed = (value: string): FieldRevision => ({
  value,
  status: 'confirmed',
  editor: '张编剧',
  edited_at: new Date().toISOString(),
});

export const MOCK_SCRIPTS: Script[] = [
  {
    id: 1,
    title: '替嫁甜妻：总裁的秘密',
    genre: 'romance',
    tier: 'S',
    total_episodes: 80,
    status: 'done',
    created_at: '2024-11-01',
    updated_at: '2024-11-15',
    module1_status: 'success',
    module2_status: 'success',
    module5_status: 'awaiting_review',
  },
  {
    id: 2,
    title: '豪门弃妇：她的逆袭',
    genre: 'urban',
    tier: 'A',
    total_episodes: 60,
    status: 'analyzing',
    created_at: '2024-11-10',
    updated_at: '2024-11-20',
    module1_status: 'success',
    module2_status: 'in_progress',
    module5_status: 'not_started',
  },
  {
    id: 3,
    title: '将军的白月光',
    genre: 'historical',
    tier: 'B',
    total_episodes: 100,
    status: 'uploaded',
    created_at: '2024-11-18',
    updated_at: '2024-11-18',
    module1_status: 'not_started',
    module2_status: 'not_started',
    module5_status: 'not_started',
  },
];

export const MOCK_MODULE1: Module1Episode[] = Array.from({ length: 10 }, (_, i) => ({
  episode_number: i + 1,
  core_event: ai(`第 ${i + 1} 集：${['林曦被迫替嫁', '初遇冷漠总裁', '误会升级', '秘密曝光', '两人渐生情愫', '前任出现', '分离危机', '真相浮现', '误会消除', '情感决裂'][i]}`),
  character_change: ai(['被动服从 → 压抑自我', '强装镇定 → 内心动摇', '疏离试探', '表面冷静内心慌乱', '主动靠近', '嫉妒失措', '选择离开', '面对真相', '重建信任', '彻底崩溃'][i]),
  conflict_point: ai(['身份置换', '权力不对等', '信息不对称', '秘密揭露', '情感模糊', '第三方干扰', '主动权转移', '价值观碰撞', '原谅还是放弃', '情与理的撕裂'][i]),
  turning_point: ai(['林曦发现自己被隐瞒真相', '总裁首次展现温柔', '前任出现', '秘密公开', '她选择留下', '她选择离开', '', '', '', ''][i]),
  hook: ai(['下集看她如何应对婚礼', '总裁为何如此特殊对待她', '前任的目的是什么', '谁泄露了秘密', '他是否也有同感', '她能接受吗', '她真的走了吗', '', '', ''][i]),
}));

export const MOCK_MODULE2: Module2Episode[] = Array.from({ length: 10 }, (_, i) => ({
  episode_number: i + 1,
  dominant_emotion: (['shame', 'suspense', 'betrayal', 'suspense', 'desire', 'rage', 'grief', 'suspense', 'relief', 'betrayal'] as const)[i],
  peak_intensity: [4, 3, 5, 4, 3, 5, 4, 3, 2, 5][i],
  emotion_points: [
    {
      scene_id: `ep${i + 1}_sc01`,
      emotion_type: (['shame', 'suspense', 'betrayal', 'suspense', 'desire', 'rage', 'grief', 'suspense', 'relief', 'betrayal'] as const)[i],
      intensity: ([4, 3, 5, 4, 3, 5, 4, 3, 2, 5] as const)[i],
      trigger_event: ai('触发事件描述'),
      character: '林曦',
    },
  ],
}));

export const MOCK_CYCLE_SHEET: CycleSheet = {
  id: 1,
  script_id: 1,
  version: 1,
  created_at: '2024-11-15',
  updated_at: '2024-11-16',
  overview: {
    drama_title: confirmed('替嫁甜妻：总裁的秘密'),
    genre: confirmed('都市言情'),
    tier: confirmed('S'),
    core_conflict: ai('身份错位婚姻中的权力博弈与情感拉锯'),
    protagonist_desire: ai('林曦渴望真实的爱与被平等对待'),
    antagonist_obstacle: ai('总裁的冷漠与真实身份秘密'),
    resolution_type: ai('误会消除 + 情感升华'),
    total_episodes: ai('80'),
    total_core_cycles: ai('4'),
  },
  core_cycles: [
    {
      id: 'cc1',
      cycle_number: 1,
      start_episode: 1,
      end_episode: 20,
      theme: ai('错位入局，试探博弈'),
      narrative_phase: ai('建立冲突'),
      interlink: ai('第20集揭露身份真相，钩入第二阶段'),
      sub_cycles: [
        {
          id: 'sc1',
          sub_cycle_type: ai('被迫入局型'),
          start_episode: 1,
          end_episode: 8,
          scenes: ['ep1_sc01', 'ep1_sc02', 'ep2_sc01'],
          function: ai('建立主角困境，交代背景，制造被动入局'),
          emotion_peak: ai('第3集秘密曝光，羞耻感达峰值（4/5）'),
          paywalls: [
            {
              episode: 3,
              scene_id: 'ep3_sc04',
              paywall_type: 'hard',
              intensity: 4,
              description: ai('林曦发现自己被骗替嫁，当众崩溃'),
              emotion_type: 'shame',
            },
          ],
          key_frames: [
            {
              episode: 1,
              scene_id: 'ep1_sc01',
              description: ai('新娘换装，林曦茫然站在婚礼现场'),
              visual_type: '定场画面',
              commercial_value: ai('高情绪钩子，适合切片'),
            },
          ],
        },
      ],
    },
    {
      id: 'cc2',
      cycle_number: 2,
      start_episode: 21,
      end_episode: 45,
      theme: ai('情感拉锯，反转升温'),
      narrative_phase: ai('发展升级'),
      interlink: ai('第45集前任重现，打破平衡'),
      sub_cycles: [],
    },
  ],
};

export const MOCK_TASKS: AnalysisTask[] = [
  { id: 1, script_id: 1, module: 'module1', status: 'success', created_at: '2024-11-15', finished_at: '2024-11-15' },
  { id: 2, script_id: 1, module: 'module2', status: 'success', created_at: '2024-11-15', finished_at: '2024-11-15' },
  { id: 3, script_id: 1, module: 'module5', status: 'awaiting_review', created_at: '2024-11-16' },
];
