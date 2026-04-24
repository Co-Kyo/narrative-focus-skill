# Before: React 事件系统文章（存在叙述重心错位）

> 修正前的原文结构，仅保留事件系统部分以展示错位问题。
> 本文属于技术教程/深潜类型，适用本 skill 的完整检测流程。

## 文章结构（修正前）

```
🔬 深入：React 事件系统三大机制

  机制一：SyntheticEvent（合成事件）的包装机制     ← 架构性，权重合理
  机制二：事件委托——React 17 前后的挂载点变化      ← 传输性/配置性，却被当作核心机制独立成章
  机制三：事件委托的运行时流程                      ← 标题写"事件委托"，但内容实际是 Fiber 遍历
```

## Step 1: 提取核心概念

| # | 概念 | 呈现方式 | 篇幅 |
|---|------|---------|------|
| 1 | SyntheticEvent 包装机制 | 独立章节，含代码示例 | ~30% |
| 2 | 事件委托（React 17 挂载点变化） | 独立章节，含迁移指南 | ~30% |
| 3 | 事件委托的运行时流程（实为 Fiber 遍历） | 独立章节，含流程步骤 | ~30% |
| 4 | stopPropagation 差异 | 对比表中一行 | ~5% |
| 5 | Fiber 树遍历 | 压缩在流程步骤中 | ~5% |

## Step 2: 命题识别

| # | 概念 | 本文传达的命题 |
|---|------|-------------|
| 1 | SyntheticEvent | "React 用合成事件包装原生事件，提供统一接口" |
| 2 | 事件委托 | "React 17 将事件监听从 document 移到 #root" |
| 3 | 运行时流程 | "用户点击后 React 从 event.target 向上遍历 DOM 树找 handler" |
| 4 | stopPropagation | "React 的 stopPropagation 只阻止内部冒泡，不影响原生监听器" |
| 5 | Fiber 遍历 | "React 遍历 Fiber 树而非 DOM 树来收集 handler" |

## Step 3: 替换实验

| # | 命题 | 替换为 | 用户行为是否变化？ | 角色 |
|---|------|--------|-----------------|------|
| 1 | "合成事件包装原生事件" | "直接透传原生事件" | onChange/onClick 等接口行为改变 | **Architectural** |
| 2 | "监听从 document 移到 #root" | "逐元素绑定 click" | onClick 行为完全不变 | **Transport** |
| 3 | "从 event.target 向上遍历 DOM 树" | "从 event.target 向上遍历 Fiber 树" | 见下方粒度分析 | 见下方 |
| 4 | "stopPropagation 只阻止内部冒泡" | "stopPropagation 同时阻止原生冒泡" | 用户代码出 bug | **Architectural** |
| 5 | "React 遍历 Fiber 树而非 DOM 树" | "React 遍历 DOM 树" | Fragment/Provider 上的 handler 丢失 | **Architectural** |

**命题粒度分析（#3 vs #5）**：

#3 和 #5 描述的是同一个机制，但粒度不同：
- #3 的运行时流程章节将 Fiber 遍历压缩为"向上遍历 DOM 树"的一步描述 → 读表面层面 → 命题是"DOM 树遍历" → 替换为"逐元素绑定"不变 → Transport
- #5 如果独立展开 Fiber 树遍历 → 读实现层面 → 命题是"Fiber 树遍历决定 handler 收集" → 替换为"DOM 树遍历"会丢失 handler → Architectural

**结论**：Fiber 遍历是 Architectural，但文章把它压缩到了 Transport 的粒度。这正是错位的核心——不是角色判断错了，而是文章的呈现深度把一个 Architectural 概念降级成了 Transport 的表象。

## Step 4: 权重 vs 角色比对

| 概念 | 角色 | 文中权重 | 判定 |
|------|------|---------|------|
| SyntheticEvent | Architectural | High (30%) | ✅ Correct |
| 事件委托 | Transport | **High (30%)** | **❌ Over-highlighted** |
| 运行时流程（标题） | Transport（标题指向委托） | High (30%) | ❌ Over-highlighted |
| Fiber 遍历（内容） | **Architectural** | **Low (~5%)** | **❌ Obscured** |
| stopPropagation | **Architectural** | **Low (~5%)** | **❌ Obscured** |
| React 17 挂载点 | Configurable | High (30%) | ❌ Disproportionate |

## Step 5: 检测报告

```
- [✅ Correct] SyntheticEvent：架构性，权重合理
- [❌ Over-highlighted] 事件委托：传输性，30% 独立成章。
  替换为逐元素绑定，onClick 行为不变 → 只是信号获取手段，不应独立成章。
- [❌ Over-highlighted] React 17 挂载点变化：配置性，占据整章。
  替换为其他挂载策略，核心事件机制不变。
- [❌ Obscured] Fiber 树遍历：架构性，压缩在流程步骤的三行里。
  替换为 DOM 树遍历，Fragment/Provider handler 丢失 → 应独立展开。
  命题粒度：文章将其压缩为"向上遍历 DOM 树"的一步，
  导致读出的命题是 Transport 级别的。若独立展开 Fiber 树结构和遍历算法，
  读出的命题才是 Architectural 级别的。
- [❌ Obscured] stopPropagation 行为差异：架构性，只在对比表一行。
  替换为"同时阻止原生冒泡"，用户代码出 bug → 应有独立代码示例。
```
