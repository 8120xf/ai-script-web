import type {
  Script, Module1Episode, Module2Episode, CycleSheet,
  AnalysisTask, FieldRevision, ParsePreview, FileType, EpisodeStructure,
  EmotionType,
} from '../types';
import { createAiField, createConfirmedField } from './fieldRevision';

const ai = (value: string): FieldRevision => createAiField(value);
const confirmed = (value: string): FieldRevision => createConfirmedField(value);

const M1_OPENINGS = ['冲突直入', '悬念开场', '日常铺垫', '倒叙回忆', '对话切入', '动作开场', '旁白交代', '闪回对比', '情绪铺垫', '信息揭示'];
const M1_CONFLICTS = ['家族压力', '身份错位', '权力不对等', '第三方介入', '秘密威胁', '情感拉扯', '利益冲突', '误会加深', '价值观碰撞', '决裂前夜'];
const M1_RELATIONS = ['陌生 → 试探', '对立 → 松动', '依赖 → 独立', '信任 → 怀疑', '距离 → 靠近', '亲密 → 疏离', '被动 → 主动', '隐瞒 → 坦诚', '修复 → 稳定', '决裂'];
const M1_INFO = ['替嫁真相未明', '总裁身份线索', '前任动机浮现', '家族秘史片段', '合同条款曝光', '关键证人出现', '误会源头确认', '情感立场明确', '最终选择临近', '结局伏笔'];
const M1_ENDINGS = ['悬念钩子', '情感余韵', '冲突升级', '反转预告', '分离危机', '和解信号', '新敌出现', '真相一角', '情绪高点', ' cliffhanger'];
const M1_CLIPS = ['婚礼替嫁现场', '总裁冷面对峙', '雨中追车', '宴会当众羞辱', '密室对峙', '机场离别', '签字离婚', '真相大白', '拥抱和解', '终极决裂'];

export const MOCK_SCRIPTS: Script[] = [
  {
    id: 1,
    title: '替嫁甜妻：总裁的秘密',
    genre: 'romance',
    tier: 'S',
    total_episodes: 80,
    file_type: 'txt',
    file_name: '替嫁甜妻.txt',
    status: 'done',
    created_at: '2024-11-01',
    updated_at: '2024-11-15',
    cycle_sheet_confirmed: false,
    module5_draft_only: false,
    module1_status: 'success',
    module2_status: 'success',
    module5_status: 'awaiting_review',
    module1_review_status: 'pending_review',
    module2_review_status: 'pending_review',
  },
  {
    id: 2,
    title: '豪门弃妇：她的逆袭',
    genre: 'urban',
    tier: 'A',
    total_episodes: 60,
    file_type: 'word',
    file_name: '豪门弃妇.docx',
    status: 'analyzing',
    created_at: '2024-11-10',
    updated_at: '2024-11-20',
    cycle_sheet_confirmed: false,
    module5_draft_only: false,
    module1_status: 'success',
    module2_status: 'in_progress',
    module5_status: 'not_started',
    module1_review_status: 'reviewed',
    module2_review_status: 'not_started',
  },
  {
    id: 3,
    title: '将军的白月光',
    genre: 'historical',
    total_episodes: 100,
    file_type: 'pdf',
    file_name: '将军的白月光.pdf',
    status: 'uploaded',
    created_at: '2024-11-18',
    updated_at: '2024-11-18',
    cycle_sheet_confirmed: false,
    module5_draft_only: false,
    module1_status: 'not_started',
    module2_status: 'not_started',
    module5_status: 'not_started',
    module1_review_status: 'not_started',
    module2_review_status: 'not_started',
  },
];

const STRUCTURE_TREE_SAMPLE_1: EpisodeStructure[] = [
  {
    episode_number: 1,
    scenes: [
      {
        scene_number: 1,
        location: '婚礼现场 · 日 · 内',
        characters: ['林曦', '伴娘', '司仪'],
        text_preview: '林曦被推着走上红毯，发现新郎不是原定人选。她强装镇定完成仪式，内心慌乱。',
        parse_complete: true,
      },
      {
        scene_number: 2,
        location: '婚礼现场 · 日 · 内',
        characters: ['林曦', '陆景深'],
        text_preview: '陆景深冷漠递来一份协议：「履行你的义务就好。」林曦签字时看见条款中的隐藏内容。',
        parse_complete: true,
      },
      {
        scene_number: 3,
        location: '婚车 · 日 · 内',
        characters: ['林曦', '司机'],
        text_preview: '婚车驶向陆家，林曦透过车窗看见城市天际线，意识到自己已无法回头。',
        parse_complete: true,
      },
    ],
  },
  {
    episode_number: 2,
    scenes: [
      {
        scene_number: 1,
        location: '陆家新房 · 夜 · 内',
        characters: ['林曦', '陆景深'],
        text_preview: '新房对峙。林曦追问替嫁真相，陆景深只回应：「你早就该知道。」',
        parse_complete: true,
      },
      {
        scene_number: 2,
        location: '陆家新房 · 夜 · 内',
        characters: ['林曦'],
        text_preview: '陆景深离开后，林曦独自打开协议副本，发现其中一页被刻意撕去。',
        parse_complete: true,
      },
    ],
  },
];

const STRUCTURE_TREE_SAMPLE_2: EpisodeStructure[] = [
  {
    episode_number: 1,
    scenes: [
      {
        scene_number: 1,
        location: '豪门老宅 · 夜 · 外',
        characters: ['沈清歌', '管家'],
        text_preview: '雨夜，沈清歌被赶出老宅，只带走一只旧行李箱。',
        parse_complete: true,
      },
      {
        scene_number: 2,
        location: '街道 · 夜 · 外',
        characters: ['沈清歌'],
        text_preview: '她在雨里走了很久，接到一条陌生短信：「来我们公司，给你机会。」',
        parse_complete: true,
      },
    ],
  },
  {
    episode_number: 2,
    scenes: [
      {
        scene_number: 1,
        location: '写字楼 · 日 · 内',
        characters: ['沈清歌', 'HR'],
        text_preview: '沈清歌入职 rival 公司，签下保密协议。',
        parse_complete: true,
      },
      {
        scene_number: 2,
        location: '会议室 · 日 · 内',
        characters: ['沈清歌', '顾北辰'],
        text_preview: '首次项目会议，顾北辰认出她的身份，当众质疑她的能力。',
        parse_complete: true,
      },
    ],
  },
];

const STRUCTURE_TREE_SAMPLE_3: EpisodeStructure[] = [
  {
    episode_number: 1,
    scenes: [
      {
        scene_number: 1,
        location: '边关营帐 · 夜 · 内',
        characters: ['萧将军', '副将'],
        text_preview: '（PDF 提取）将军收到京城来函，神色凝重，下令备马。',
        parse_complete: true,
      },
      {
        scene_number: 2,
        location: '边关营帐 · 夜 · 内',
        characters: ['萧将军'],
        text_preview: '独白回忆少年时与白月光在宫墙下的约定。',
        parse_complete: false,
      },
    ],
  },
  {
    episode_number: 2,
    scenes: [
      {
        scene_number: 1,
        location: '回京官道 · 日 · 外',
        characters: ['萧将军', '随从'],
        text_preview: '回京途中遇袭，随从受伤，队伍被迫改道。',
        parse_complete: true,
      },
    ],
  },
];

const MOCK_SCRIPT_TEXT_1 = `【第1集】【场1】婚礼现场 · 日 · 内

旁白：今天，是林家大小姐林诗雨的大婚之日。然而站在红毯尽头的，却是她的妹妹林曦。

林曦：（内心）为什么是我……

陆景深：（冷漠）签字。

【第1集】【场2】婚礼现场 · 日 · 内

司仪：新郎新娘交换戒指——

林曦看向陆景深，对方眼中没有任何温度。

陆景深：别误会，这只是一笔交易。

【第1集】【场3】婚车 · 日 · 内

林曦：（望着窗外）林家，我再也不会回来了。

司机：小姐，陆家到了。

【第2集】【场1】陆家新房 · 夜 · 内

林曦：这份协议……为什么有一页被撕掉了？

陆景深：不该问的别问。

林曦：我不是你的工具！

陆景深：（停顿）你早就是。

（以下省略，全文共 80 集……）`;

const MOCK_SCRIPT_TEXT_2 = `第1集

场1 豪门老宅 · 夜 · 外

旁白：沈清歌怎么也没想到，自己会在雨夜被赶出沈家。

管家：小姐，请吧。

沈清歌：（握紧行李箱）我会回来的。

场2 街道 · 夜 · 外

沈清歌在雨中行走，手机响起。

短信：来 rival 公司，我们给你机会。

第2集

场1 写字楼 · 日 · 内

HR：欢迎加入。这是保密协议。

沈清歌：我只需要一个机会。

场2 会议室 · 日 · 内

顾北辰：沈清歌？沈家弃女也配来这？

沈清歌：（抬头）配不配，项目见真章。

（以下省略，全文共 60 集……）`;

const MOCK_SCRIPT_TEXT_3 = `（PDF 提取文本）

第一幕 · 边关营帐 · 夜

副将：将军，京城来函。

萧将军：（展开信函，神色凝重）备马，明日回京。

第二幕 · 回京官道 · 日

随从：将军，前方有埋伏！

萧将军：护住文书，杀出重围！

（PDF 部分页面 OCR 质量较低，后续场次可能存在识别缺失……）`;

export const MOCK_PARSE_PREVIEWS: Record<number, ParsePreview> = {
  1: {
    script_id: 1,
    file_name: '替嫁甜妻.txt',
    file_type: 'txt',
    total_episodes: 80,
    total_scenes: 1240,
    main_characters: ['林曦', '陆景深', '苏婉清', '陆母'],
    incomplete: false,
    episode_previews: [
      { episode_number: 1, scene_count: 8, text_preview: '【第1集】【场1】婚礼现场，林曦被迫替嫁，陆景深冷漠注视……' },
      { episode_number: 2, scene_count: 7, text_preview: '【第2集】【场1】新房对峙，林曦发现合同条款中的秘密……' },
    ],
    structure_tree: STRUCTURE_TREE_SAMPLE_1,
    script_text: MOCK_SCRIPT_TEXT_1,
  },
  2: {
    script_id: 2,
    file_name: '豪门弃妇.docx',
    file_type: 'word',
    total_episodes: 60,
    total_scenes: 890,
    main_characters: ['沈清歌', '顾北辰', '林诗雨'],
    incomplete: false,
    episode_previews: [
      { episode_number: 1, scene_count: 6, text_preview: '第1集 沈清歌被赶出豪门，雨夜独自离开老宅……' },
      { episode_number: 2, scene_count: 5, text_preview: '第2集 她入职 rival 公司，与顾北辰首次交锋……' },
    ],
    structure_tree: STRUCTURE_TREE_SAMPLE_2,
    script_text: MOCK_SCRIPT_TEXT_2,
  },
  3: {
    script_id: 3,
    file_name: '将军的白月光.pdf',
    file_type: 'pdf',
    total_episodes: 100,
    total_scenes: null,
    main_characters: ['萧将军', '白月光', '皇帝'],
    incomplete: true,
    episode_previews: [
      { episode_number: 1, text_preview: '（PDF 提取）第一幕：边关营帐，将军收到京城来函……' },
      { episode_number: 2, text_preview: '（PDF 提取）第二幕：回京途中，偶遇旧时玩伴……' },
    ],
    structure_tree: STRUCTURE_TREE_SAMPLE_3,
    script_text: MOCK_SCRIPT_TEXT_3,
  },
};

export const GENRE_LABEL: Record<string, string> = {
  romance: '都市言情',
  family: '家庭伦理',
  urban: '都市逆袭',
  fantasy: '玄幻',
  suspense: '悬疑',
  comedy: '喜剧',
  historical: '古装',
  other: '其他',
};

export const FILE_TYPE_LABEL: Record<FileType, string> = {
  txt: 'TXT',
  word: 'Word',
  pdf: 'PDF',
};

export const MOCK_MODULE1: Module1Episode[] = Array.from({ length: 10 }, (_, i) => ({
  episode_number: i + 1,
  core_event: ai(`第 ${i + 1} 集：${['林曦被迫替嫁', '初遇冷漠总裁', '误会升级', '秘密曝光', '两人渐生情愫', '前任出现', '分离危机', '真相浮现', '误会消除', '情感决裂'][i]}`),
  opening_style: ai(M1_OPENINGS[i]),
  main_conflict_target: ai(M1_CONFLICTS[i]),
  relationship_change: ai(M1_RELATIONS[i]),
  info_increment: ai(M1_INFO[i]),
  ending_style: ai(M1_ENDINGS[i]),
  streaming_clip: ai(M1_CLIPS[i]),
}));

export const MOCK_MODULE2: Module2Episode[] = Array.from({ length: 10 }, (_, i) => {
  const emotions: EmotionType[] = ['shame', 'suspense', 'betrayal', 'oppression', 'ambiguity', 'rage', 'heartache', 'suspense', 'sweetness', 'crisis'];
  const intensities = [4, 3, 5, 4, 3, 5, 4, 3, 2, 5];
  const directions = ['负向', '中性', '负向', '负向', '正向', '负向', '负向', '转折', '正向', '负向'];
  const e = emotions[i];
  const labels: Record<EmotionType, string> = {
    shame: '羞辱感', betrayal: '背叛感', misunderstanding: '误会感', oppression: '压迫感',
    heartache: '心疼感', rage: '愤怒感', ambiguity: '暧昧感', satisfaction: '爽感',
    suspense: '悬念感', regret: '后悔感', crisis: '危机感', sweetness: '甜感', other: '其他',
  };
  return {
    episode_number: i + 1,
    primary_emotion: e,
    secondary_emotions: ai(i % 2 === 0 ? '愤怒感、心疼感' : '悬念感'),
    emotion_direction: ai(directions[i]),
    emotion_intensity: ai(String(intensities[i])),
    peak_event: ai(`第 ${i + 1} 集：${['当众羞辱', '秘密撞破', '背叛曝光', '压迫升级', '暧昧试探', '爆发冲突', '分离危机', '真相一角', '和解信号', '终极对决'][i]}`),
    emotion_change: ai(['羞耻→愤怒', '好奇→紧张', '信任→崩溃', '压抑→爆发', '试探→心动', '冷静→失控', '希望→绝望', '怀疑→明朗', '疏离→靠近', '爱→决裂'][i]),
    ending_emotion: ai(labels[emotions[Math.min(i + 1, 9)]] ?? '悬念感'),
    hook_intensity: ai(String(Math.min(5, intensities[i] + (i % 3 === 0 ? 1 : 0)))),
    traffic_value: ai(i < 3 ? '高，开篇强钩子适合投流' : i >= 7 ? '中，情绪峰值适合切片' : '中'),
    evidence: ai(`第 ${i + 1} 集场 2–4`),
  };
});

export const MOCK_CYCLE_SHEET: CycleSheet = {
  id: 1,
  script_id: 1,
  version: 1,
  sheet_status: 'pending_confirm',
  ai_generated_at: '2024-11-16 20:00',
  created_at: '2024-11-15',
  updated_at: '2024-11-16',
  overview: {
    drama_title: confirmed('替嫁甜妻：总裁的秘密'),
    genre: confirmed('都市言情、甜宠'),
    analysis_scope: ai('全剧'),
    selling_point: ai('替嫁错位 + 霸总护短 + 身份秘密，具备强投流钩子'),
    core_conflict: ai('身份错位婚姻中的权力博弈与情感拉锯，女主在羞辱与渴望尊严之间挣扎'),
    core_expectation: ai('观众期待女主逆袭、男主持续护短、反派被打脸，以及真相揭开后的情感升华'),
  },
  core_cycles: [
    {
      id: 'cc1',
      cycle_number: 1,
      start_episode: 1,
      end_episode: 20,
      stage_title: ai('低位羞辱建立与男主介入'),
      stage_goal: ai('建立女主低位处境，并让男主第一次介入女主困境'),
      protagonist_goal: ai('林曦想摆脱羞辱并获得基本尊严'),
      main_obstacle: ai('家族压力、总裁冷漠、女配敌意'),
      emotion_escalation: ai('羞耻累积 → 公开羞辱 → 男主介入前高压'),
      relationship_change: ai('陌生 → 被迫绑定 → 欠下人情'),
      stage_release: ai('男主在关键时刻阻止女配继续羞辱女主'),
      new_hook: ai('女配发现男主在意女主，策划更大羞辱'),
      commercial_value: ai('公开羞辱 + 高价值男主护短，投流价值高'),
      evidence_support: 'module12_supported',
      interlinks: [
        {
          id: 'il1',
          position: ai('第 4 集 场 2'),
          before_cycle: ai('阶段循环 1 · 子循环 1'),
          after_cycle: ai('阶段循环 1 · 子循环 2'),
          content: ai('男主询问女主为何接受替嫁，女主解释家族压力'),
          motivation: ai('补足女主接受协议的心理动机'),
          information: ai('交代替嫁协议与姐姐逃婚背景'),
          emotion_transition: ai('从高压羞辱过渡到被迫共处'),
          evidence: ai('第 4 集场 2 对白'),
        },
      ],
      sub_cycles: [
        {
          id: 'sc1',
          coverage: ai('第 1–3 集 场 1–8'),
          sub_cycle_type: ai('被迫入局型'),
          flow: ai('女主被迫穿上婚纱，全程被操控，无处逃离'),
          twist: ai('婚礼现场发现新郎不是原定人选，协议被撕页'),
          paywall_summary: ai('第 3 集当众崩溃，秘密曝光'),
          key_frame_summary: ai('新娘茫然四顾；协议撕页特写'),
          primary_emotion: ai('羞辱感'),
          secondary_emotions: ai('压迫感、悬念感'),
          plot_function: ai('建立主角困境与被动入局'),
          commercial_value: ai('高，具备公开羞辱与强钩子'),
          evidence: ai('第 1–3 集'),
          start_episode: 1,
          end_episode: 8,
          evidence_support: 'module12_supported',
          paywalls: [
            {
              id: 'pw1',
              episode: 3,
              scene_id: 'ep3_sc04',
              paywall_type: 'hard',
              intensity: 4,
              description: ai('林曦发现自己被骗替嫁，当众崩溃'),
              trigger_emotions: ai('羞辱感、愤怒感'),
              unreleased_content: ai('男主是否会介入、真相关键信息'),
              payment_incentive: ai('观众期待女主脱离羞辱、看清真相'),
              evidence: ai('第 3 集场 4'),
              evidence_support: 'module12_supported',
            },
          ],
          key_frames: [
            {
              id: 'kf1',
              episode: 1,
              scene_id: 'ep1_sc01',
              related_ref: ai('子循环 1'),
              description: ai('新娘换装，林曦茫然站在婚礼现场'),
              expressed_emotions: ai('羞辱感、压迫感'),
              traffic_value: ai('高，一眼能看懂错位与压迫'),
              traffic_tagline: ai('替嫁新娘站在婚礼现场，她不知道新郎是谁'),
              evidence: ai('第 1 集场 1'),
              evidence_support: 'module12_supported',
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
      stage_title: ai('情感拉锯，反转升温'),
      stage_goal: ai('在身份秘密下推进情感绑定与外部危机'),
      protagonist_goal: ai('林曦渴望被平等对待并确认感情'),
      main_obstacle: ai('前任重现、身份秘密、女配反扑'),
      emotion_escalation: ai('暧昧 → 误会 → 分离危机'),
      relationship_change: ai('试探 → 靠近 → 决裂边缘'),
      stage_release: ai('第 35 集男主公开护短'),
      new_hook: ai('第 45 集前任重现打破平衡'),
      commercial_value: ai('中–高，情感峰值与反转密集'),
      evidence_support: 'unsupported',
      interlinks: [],
      sub_cycles: [],
    },
  ],
};

export const MOCK_TASKS: AnalysisTask[] = [
  { id: 1, script_id: 1, module: 'module1', status: 'success', created_at: '2024-11-15', finished_at: '2024-11-15' },
  { id: 2, script_id: 1, module: 'module2', status: 'success', created_at: '2024-11-15', finished_at: '2024-11-15' },
  { id: 3, script_id: 1, module: 'module5', status: 'awaiting_review', created_at: '2024-11-16' },
];

export function detectFileType(filename: string): FileType | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.txt')) return 'txt';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'word';
  if (lower.endsWith('.pdf')) return 'pdf';
  return null;
}

export function buildScriptTextFromTree(
  title: string,
  tree: EpisodeStructure[],
): string {
  const lines: string[] = [`《${title}》`, ''];
  for (const ep of tree) {
    lines.push(`【第${ep.episode_number}集】`);
    for (const scene of ep.scenes) {
      const loc = scene.location ? ` · ${scene.location}` : '';
      lines.push(`【场${scene.scene_number}】${loc}`);
      if (scene.characters.length) {
        lines.push(`人物：${scene.characters.join('、')}`);
      }
      lines.push(scene.text_preview);
      lines.push('');
    }
  }
  lines.push('（以下为 Mock 预览文本，实际上传后将展示完整提取内容……）');
  return lines.join('\n');
}

export function buildMockParsePreview(
  scriptId: number,
  fileName: string,
  fileType: FileType,
  title = '未命名剧本',
  totalEpisodes = 80,
): ParsePreview {
  const structure_tree: EpisodeStructure[] = [
    {
      episode_number: 1,
      scenes: [
        {
          scene_number: 1,
          location: '场景 A · 日 · 内',
          characters: ['主角', '配角'],
          text_preview: `【第1集·场1】从《${fileName}》提取：故事开端，主要冲突浮现……`,
          parse_complete: true,
        },
        {
          scene_number: 2,
          location: '场景 B · 日 · 外',
          characters: ['主角'],
          text_preview: '主角做出关键决定，为下一集埋下悬念。',
          parse_complete: true,
        },
      ],
    },
    {
      episode_number: 2,
      scenes: [
        {
          scene_number: 1,
          location: '场景 C · 夜 · 内',
          characters: ['主角', '对手'],
          text_preview: '正面对峙，信息差进一步扩大。',
          parse_complete: true,
        },
      ],
    },
  ];

  return {
    script_id: scriptId,
    file_name: fileName,
    file_type: fileType,
    total_episodes: totalEpisodes,
    total_scenes: Math.floor(totalEpisodes * 12),
    main_characters: ['主角', '对手', '配角A'],
    incomplete: false,
    episode_previews: [
      {
        episode_number: 1,
        scene_count: structure_tree[0].scenes.length,
        text_preview: structure_tree[0].scenes[0].text_preview,
      },
      {
        episode_number: 2,
        scene_count: structure_tree[1].scenes.length,
        text_preview: structure_tree[1].scenes[0].text_preview,
      },
    ],
    structure_tree,
    script_text: buildScriptTextFromTree(title, structure_tree),
  };
}
