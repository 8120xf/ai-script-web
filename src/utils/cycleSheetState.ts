import type { CycleSheet, CoreCycle, SubCycle, FieldRevision, Paywall, KeyFrame, Interlink } from '../types';
import { patchField } from './fieldRevision';

function applyPatch(field: FieldRevision, value: string): FieldRevision {
  const unchanged = value.trim() === field.value.trim();
  const status = unchanged ? 'confirmed' : 'modified';
  return patchField(field, value, status);
}

export function updateOverviewField(
  sheet: CycleSheet,
  key: keyof CycleSheet['overview'],
  value: string,
): CycleSheet {
  return {
    ...sheet,
    overview: {
      ...sheet.overview,
      [key]: applyPatch(sheet.overview[key], value),
    },
    updated_at: new Date().toISOString(),
  };
}

export function updateCoreCycleField(
  sheet: CycleSheet,
  cycleId: string,
  key: keyof Omit<CoreCycle, 'id' | 'cycle_number' | 'start_episode' | 'end_episode' | 'sub_cycles' | 'interlinks' | 'evidence_support'>,
  value: string,
): CycleSheet {
  return {
    ...sheet,
    core_cycles: sheet.core_cycles.map((c) =>
      c.id === cycleId ? { ...c, [key]: applyPatch(c[key] as FieldRevision, value) } : c,
    ),
    updated_at: new Date().toISOString(),
  };
}

export function updateSubCycleField(
  sheet: CycleSheet,
  cycleId: string,
  subId: string,
  key: keyof Omit<SubCycle, 'id' | 'start_episode' | 'end_episode' | 'paywalls' | 'key_frames' | 'evidence_support'>,
  value: string,
): CycleSheet {
  return {
    ...sheet,
    core_cycles: sheet.core_cycles.map((c) =>
      c.id !== cycleId
        ? c
        : {
            ...c,
            sub_cycles: c.sub_cycles.map((s) =>
              s.id === subId ? { ...s, [key]: applyPatch(s[key] as FieldRevision, value) } : s,
            ),
          },
    ),
    updated_at: new Date().toISOString(),
  };
}

export function updatePaywallField(
  sheet: CycleSheet,
  cycleId: string,
  subId: string,
  paywallId: string,
  key: keyof Omit<Paywall, 'id' | 'episode' | 'scene_id' | 'paywall_type' | 'intensity' | 'evidence_support'>,
  value: string,
): CycleSheet {
  return {
    ...sheet,
    core_cycles: sheet.core_cycles.map((c) =>
      c.id !== cycleId
        ? c
        : {
            ...c,
            sub_cycles: c.sub_cycles.map((s) =>
              s.id !== subId
                ? s
                : {
                    ...s,
                    paywalls: s.paywalls.map((p) =>
                      p.id === paywallId ? { ...p, [key]: applyPatch(p[key] as FieldRevision, value) } : p,
                    ),
                  },
            ),
          },
    ),
    updated_at: new Date().toISOString(),
  };
}

export function updateKeyFrameField(
  sheet: CycleSheet,
  cycleId: string,
  subId: string,
  keyFrameId: string,
  key: keyof Omit<KeyFrame, 'id' | 'episode' | 'scene_id' | 'evidence_support'>,
  value: string,
): CycleSheet {
  return {
    ...sheet,
    core_cycles: sheet.core_cycles.map((c) =>
      c.id !== cycleId
        ? c
        : {
            ...c,
            sub_cycles: c.sub_cycles.map((s) =>
              s.id !== subId
                ? s
                : {
                    ...s,
                    key_frames: s.key_frames.map((kf) =>
                      kf.id === keyFrameId ? { ...kf, [key]: applyPatch(kf[key] as FieldRevision, value) } : kf,
                    ),
                  },
            ),
          },
    ),
    updated_at: new Date().toISOString(),
  };
}

export function updateInterlinkField(
  sheet: CycleSheet,
  cycleId: string,
  interlinkId: string,
  key: keyof Omit<Interlink, 'id'>,
  value: string,
): CycleSheet {
  return {
    ...sheet,
    core_cycles: sheet.core_cycles.map((c) =>
      c.id !== cycleId
        ? c
        : {
            ...c,
            interlinks: c.interlinks.map((il) =>
              il.id === interlinkId ? { ...il, [key]: applyPatch(il[key], value) } : il,
            ),
          },
    ),
    updated_at: new Date().toISOString(),
  };
}

const SHEET_STATUS_LABEL: Record<CycleSheet['sheet_status'], string> = {
  draft: '初稿',
  pending_confirm: '待确认',
  confirmed: '已确认',
  pending_review: '存疑',
};

export { SHEET_STATUS_LABEL };
