import type { FieldRevision, FieldRevisionStatus } from '../types';

export function createAiField(value: string, editor = 'GPT-4'): FieldRevision {
  return {
    value,
    status: 'ai_generated',
    ai_original_value: value,
    editor,
    edited_at: new Date().toISOString(),
    revisions: [],
  };
}

export function createConfirmedField(value: string): FieldRevision {
  return {
    value,
    status: 'confirmed',
    ai_original_value: value,
    editor: 'GPT-4',
    edited_at: new Date().toISOString(),
    revisions: [],
  };
}

export function patchField(
  field: FieldRevision,
  value: string,
  status: FieldRevisionStatus,
  editor = '当前管理员',
): FieldRevision {
  const aiOriginal = field.ai_original_value ?? field.value;
  const changed = value.trim() !== field.value.trim();
  const revisions = [...(field.revisions ?? [])];
  if (changed) {
    revisions.unshift({
      before_value: field.value,
      after_value: value,
      editor,
      edited_at: new Date().toISOString(),
      status,
    });
  }
  return {
    ...field,
    value,
    status,
    ai_original_value: aiOriginal,
    editor,
    edited_at: new Date().toISOString(),
    revisions,
  };
}
