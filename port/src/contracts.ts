// 模块注册表：共享规则资产的权威登记（构建期 validateModuleUsage 校验）
import type { SourceContract } from 'skillnomad';

export const contracts: SourceContract[] = [
  { id: 'substitution-test', kind: 'policy', path: 'assets/common/pre-processing.md', description: '替代测试共享判定规则（前处理 SOP）', scope: 'skill' },
  { id: 'post-processing-sop', kind: 'policy', path: 'assets/common/post-processing.md', description: '后处理检测+修正 SOP', scope: 'skill' },
  { id: 'granularity-guide', kind: 'policy', path: 'assets/common/proposition-granularity-guide.md', description: '命题粒度指南', scope: 'skill' },
];
