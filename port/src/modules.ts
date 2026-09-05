// 步骤 3 · 实体建模 + 共享规则注册（转化自 references/ 三文件）
export const modules = {
  substitutionTest: {
    path: 'assets/common/pre-processing.md',
    description: '替代测试共享判定规则（前处理 SOP）',
    required: true,
  },
  postProcessingSop: {
    path: 'assets/common/post-processing.md',
    description: '后处理检测+修正 SOP',
    required: true,
  },
  granularityGuide: {
    path: 'assets/common/proposition-granularity-guide.md',
    description: '命题粒度指南',
    required: true,
  },
};
