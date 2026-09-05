// 步骤 4+5 · 单步骤 + branch 双模式 + map 并行标注（第一次 port 已验证形态）
import type { StepDefinition } from 'skillnomad';
import { task, mapNode, branch } from 'skillnomad';
import { refOf } from '../entities.js';

const labelDetail = (id: string) =>
  task({ id, label: '角色标注', type: 'agent', body: '识别命题 → 替代测试 → 打角色标签（A/T/C）' });

export const narrativeFocus: StepDefinition = {
  id: 'narrative-focus',
  title: '叙述重心规范',
  description: '检测并修正叙述权重错位；或收集阶段按角色标注防错位',
  body: '识别命题 → 替代测试 → 角色标注 → 用户检查点 → 检测/修正 → 二次校验。',
  reads: [
    { ...refOf('labeledCollection'), path: 'assets/common/pre-processing.md', description: '替代测试共享判定规则', required: true },
  ],
  writes: [
    { ...refOf('labeledCollection'), description: '结构化收集+角色标注表', required: true },
    { ...refOf('detectionReport'), description: '叙述重心检测报告', required: true },
    { ...refOf('correctionRecord'), description: '修正记录', required: true },
    { ...refOf('verifyResult'), description: '二次校验结论', required: true },
  ],
  barrier: {
    checkItems: ['标注/检测覆盖数', '用户确认'],
    clarifyPrompt: '请确认标注表/检测报告，确认后继续（Mode1 输出 / Mode2 进入修正）。',
    onConfirm: 'continue',
    onReject: 'rollback',
  },
  graph: branch(
    'mode-select',
    '模式选择：收集阶段走前处理，成品文章走后处理',
    // Mode 1 · 前处理：逐细节并行标注
    mapNode('preprocess-map', '逐细节并行标注', labelDetail('label-collect')),
    // Mode 2 · 后处理：检测 → 检查点 → 修正 → 二次校验
    task({
      id: 'detect-correct-verify',
      label: '检测-修正-二次校验',
      type: 'agent',
      body: '概念提取 → 替代测试定角色 → 输出检测报告（✅/❌）→ ⚠️用户检查点确认后修正 → 二次校验对照官方文档',
    }),
  ),
};
