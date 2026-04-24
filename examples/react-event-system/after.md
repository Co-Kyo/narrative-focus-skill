# After: React 事件系统文章（修正后）

> 修正后的文章结构。仅展示结构变化和关键内容差异。
> 修正遵循"只改权重不改事实"原则——所有技术细节保留，只调整篇幅和位置。

## 文章结构（修正后）

```
🔬 深入：React 事件系统的核心机制

  核心机制一：Fiber 层事件模拟——React 事件的真正运行方式    ← 架构性，升级为核心
    ├── 第一步：获取信号（原生 DOM 层）                        ← 事件委托降为一句话
    ├── 第二步：Fiber 层分发（React 的核心）                   ← Fiber 遍历独立展开
    ├── 为什么必须在 Fiber 树上遍历？                          ← 新增：解释架构性核心
    ├── stopPropagation() 的真实行为                          ← 新增：独立代码示例
    └── capture vs bubble 顺序                                ← 保留

  核心机制二：SyntheticEvent——React 的事件包装层             ← 架构性，权重合理

  补充：信号获取方式——事件委托与挂载点                        ← 传输性/配置性，降级为补充
```

## 修正操作清单

| 操作 | 具体变更 | 依据 |
|------|---------|------|
| 降级事件委托 | "三大机制之一" → "补充"小节，篇幅压缩为一段话 + 挂载点图 | 替换实验：逐元素绑定不影响 onClick → Transport |
| 降级挂载点变化 | 独立章节 → 补充小节内的一个条目 | 替换为其他挂载策略不影响核心机制 → Configurable |
| 升级 Fiber 遍历 | 流程步骤的三行 → 独立的核心机制一，展开完整分发流程 | 替换为 DOM 树遍历丢失 Fragment handler → Architectural |
| 升级 stopPropagation | 对比表一行 → 独立代码示例 + 坑 + 解决方案 | 替换为"同时阻止原生冒泡"用户代码出 bug → Architectural |
| 对齐面试话术 | "三大机制：SyntheticEvent、事件委托、运行时分发" → "核心是 Fiber 层模拟，SyntheticEvent 是包装层，事件委托只是信号获取手段" | 面试话术应锚定 Architectural 概念 |
| 对齐翻车点 | stopPropagation 条目补充完整行为差异 + 代码示例 | Architectural 概念需要独立展开 |

## 修正原则（未被修改的部分）

- 受控/非受控组件的内容 → 无错位，保留不动
- React 19 表单新特性 → 无错位，保留不动
- 所有正确的代码示例和对比表 → 保留不动，只改叙述重心
- 事件委托的**事实**保留（document → #root 的变化确实发生了）→ 只是降级了叙述权重

## 二次检测

修正后重新执行 Step 1→5：

```
- [✅ Correct] Fiber 遍历：升级为核心机制，Architectural 权重匹配
- [✅ Correct] stopPropagation：独立代码示例，Architectural 权重匹配
- [✅ Correct] SyntheticEvent：保持核心机制，Architectural 权重匹配
- [✅ Correct] 事件委托：降为补充，Transport 权重匹配
- [✅ Correct] 挂载点变化：降为补充内的条目，Configurable 权重匹配
```

全部 ✅，检测通过。
