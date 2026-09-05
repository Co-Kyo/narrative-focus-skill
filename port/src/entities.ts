// 步骤 3 · 实体建模：可命名中间产物（路径唯一事实源，步骤经 refOf 引用）
export interface Entity { concept: string; artifact: string; description: string }

export const entities: Record<string, Entity> = {
  labeledCollection: { concept: 'preprocess', artifact: '{workDir}/.meta/labeled-collection.md', description: '结构化收集+角色标注表' },
  detectionReport: { concept: 'postprocess', artifact: '{workDir}/.meta/detection-report.md', description: '叙述重心检测报告（✅/❌）' },
  correctionRecord: { concept: 'postprocess', artifact: '{workDir}/.meta/correction-record.md', description: '修正记录' },
  verifyResult: { concept: 'postprocess', artifact: '{workDir}/.meta/verify-result.md', description: '二次校验结论' },
};

export const refOf = (id: string) => ({ path: entities[id].artifact, description: entities[id].description });
