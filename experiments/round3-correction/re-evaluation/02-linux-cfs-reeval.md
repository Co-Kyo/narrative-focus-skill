# Linux CFS 文章 — 修正后重评报告

## 修正前后对比概览

原文存在 5 项叙述重心错位，修正后逐一检查：

| 原始问题 | 修正状态 | 说明 |
|---------|---------|------|
| CFS vruntime 机制完全缺失（仅未解释的代码块） | ✅ 已修正 | 1.1 节详细解释了 vruntime 公式、权重机制，并给出了 nice=0 vs nice=5 的具体数值示例 |
| 实时调度抢占模型完全缺失 | ✅ 已修正 | 2.4 节专门讲解抢占规则，明确了优先级范围映射和"实时任务始终抢占普通任务"的核心规则 |
| 负载均衡机制仅一句话 | ✅ 已修正 | 第四章独立为两小节（调度域 + 触发条件），覆盖了拓扑层次、周期均衡、idle balance、fork balance |
| SCHED_FIFO API 和 sysctl 参数被过度高亮 | ✅ 已修正 | SCHED_FIFO/RR/DEADLINE 各用简明 bullet point 说明行为特征，sysctl 参数降为"补充"章节且加了警告说明 |
| "创业视角分析"章节无技术价值 | ✅ 已修正 | 全文删除该章节，无任何非技术内容 |

**5/5 项均已修正。**

## 修正后叙述权重检测

逐概念检测叙述权重是否与实际角色匹配：

| 概念 | 实际角色 | 叙述权重 | 判定 |
|------|---------|---------|------|
| vruntime 虚拟运行时间 | Architectural（CFS 核心机制） | High（独立小节 + 公式 + 数值示例 + 代码结构体） | ✅ Correct |
| 红黑树调度选择 | Architectural（CFS 数据结构） | High（独立小节 + 复杂度分析 + 新进程初始化说明） | ✅ Correct |
| 调度延迟与最小粒度 | Architectural（CFS 时间控制） | Medium-High（独立小节 + 参数说明 + 时间片公式） | ✅ Correct |
| SCHED_FIFO 行为特征 | Configurable（实时策略之一） | Medium（bullet point 说明，无独立代码块） | ✅ Correct |
| SCHED_RR 行为特征 | Configurable（实时策略之一） | Medium（bullet point 说明） | ✅ Correct |
| SCHED_DEADLINE 行为特征 | Configurable（实时策略之一） | Medium（bullet point 说明 + EDF 算法提及） | ✅ Correct |
| 实时调度抢占规则 | Architectural（优先级模型核心） | High（独立小节 + 优先级范围映射 + 结论性说明） | ✅ Correct |
| 调度器类多态架构 | Architectural（内核设计模式） | Medium-High（独立章节 + 链式结构 + 代码结构体） | ✅ Correct |
| 调度域层次结构 | Architectural（多核调度核心） | Medium（独立小节 + 拓扑层次说明） | ✅ Correct |
| 负载均衡触发条件 | Configurable（均衡策略细节） | Medium（列举三种触发方式） | ✅ Correct |
| 调度策略选择指南 | Reference（实践参考） | Low-Medium（一张表格） | ✅ Correct |
| CFS sysctl 参数调优 | Reference（运维参考） | Low（补充章节 + 警告说明） | ✅ Correct |
| 查看调度信息命令 | Reference（运维参考） | Low（简短命令列表） | ✅ Correct |

**13/13 项全部 ✅，检测通过。**

## 结构篇幅分析

| 章节 | 标题 | 估算篇幅占比 | 叙述权重级别 |
|------|------|------------|------------|
| 一 | CFS：完全公平调度器 | ~30% | High（Architectural） |
| 二 | 实时调度：优先级抢占模型 | ~22% | High（Architectural）+ Medium（Configurable） |
| 三 | 调度器类：统一的多态架构 | ~12% | Medium-High（Architectural） |
| 四 | 多核负载均衡 | ~12% | Medium（Architectural + Configurable） |
| 五 | 调度策略选择指南 | ~6% | Low-Medium（Reference） |
| 六 | CFS 参数调优 | ~10% | Low（Reference） |
| 七 | 查看调度信息 | ~5% | Low（Reference） |
| 总结 | — | ~3% | — |

**篇幅分配合理性**：CFS（30%）和实时调度（22%）合计占 52%，作为标题承诺的两大核心主题，权重恰当。调度器类和负载均衡各约 12%，作为架构补充合理。运维参考类内容合计约 21%，处于可接受范围。

## 与原文对比：叙述重心改善评估

| 维度 | 原文 | 修正后 | 改善程度 |
|------|------|--------|---------|
| CFS vruntime 解释 | ❌ 仅有未注释的代码块 | ✅ 公式 + 权重机制 + 数值示例 | 🟢 显著改善 |
| 实时调度抢占模型 | ❌ 仅列举 API，无抢占逻辑 | ✅ 优先级映射 + 抢占规则 + 设计哲学 | 🟢 显著改善 |
| 负载均衡深度 | ❌ 一句话带过 | ✅ 调度域 + 三种触发条件 | 🟢 显著改善 |
| API/sysctl 权重 | ❌ 独立章节 + 大段代码 | ✅ 降为补充/参考，加使用警告 | 🟢 显著改善 |
| 非技术内容 | ❌ "创业视角分析"占整章 | ✅ 完全删除 | 🟢 显著改善 |
| 整体叙事连贯性 | ❌ 核心概念缺失导致叙事断裂 | ✅ CFS→实时→架构→多核，逻辑递进 | 🟢 显著改善 |

## 残留问题

修正后文章整体质量良好，仅有以下轻微问题：

1. **sched_class 代码块略显冗余**：`struct sched_class` 的代码结构体占了约 10 行，但其核心信息（链式结构 + 回调函数）已在文字中说明。可考虑精简为关键字段注释。**严重度：Low**。

2. **调度策略选择指南可进一步深化**：表格中"音视频/软实时 → SCHED_RR 或 SCHED_FIFO"的建议可以补充一个简短的选择依据（何时选 RR、何时选 FIFO），因为这是实践中常见的困惑。**严重度：Low**。

3. **缺少 CFS 的 group scheduling 说明**：CFS 支持 cgroup 级别的组调度（`CONFIG_CFS_BANDWIDTH`），这在容器化环境中是核心特性。作为一篇"深入解析"级别的文章，可以简要提及。**严重度：Medium**（可作为后续补充，不影响现有内容的正确性）。

## 权威性校验

对修正后文章中的关键技术陈述进行事实核查：

- [✅] "vruntime += 实际运行时间 × NICE_0_LOAD / 进程权重"：与内核源码 `kernel/sched/fair.c` 中 `update_curr()` 的计算逻辑一致
- [✅] "NICE_0_LOAD 是 nice 值为 0 的基准权重（1024）"：与 `sched_prio_to_weight[]` 数组定义一致
- [✅] "nice=0 权重 1024，nice=5 权重 335"：与 `sched_prio_to_weight[]` 数组一致（nice 0 → idx 120 → 1024；nice 5 → idx 125 → 335）
- [✅] "CFS 选择 vruntime 最小的进程（红黑树最左节点）"：与 `pick_next_task_fair()` 实现一致
- [✅] "sched_latency_ns 默认 6ms"：与 `sysctl_sched_latency` 默认值一致（6ms = 6000000ns）
- [✅] "sched_min_granularity_ns 默认 0.75ms"：与 `sysctl_sched_min_granularity` 默认值一致
- [✅] "实时进程 priority 0~99，普通进程 priority 100~139"：与内核 `MAX_RT_PRIO=100`、`MAX_PRIO=140` 定义一致
- [✅] "SCHED_DEADLINE 始终抢占 SCHED_FIFO 和 SCHED_RR"：与调度器类优先级链 `dl_sched_class > rt_sched_class` 一致
- [✅] "调度域按拓扑组织：L1 → L2 → NUMA → 跨 NUMA"：与内核 `sched_domain` 层次构建逻辑一致

**全部 ✅，无技术事实错误。**

## 整体评价

**评分：4.5 / 5**

修正后的文章在叙述重心上实现了根本性改善。原文最大的问题是"核心机制缺失 + 边缘内容膨胀"——vruntime 作为 CFS 的灵魂机制仅以裸代码块呈现，实时调度的抢占模型完全缺失，却给了 sysctl 参数和 SCHED_FIFO API 独立大节。修正后，文章的叙事主线清晰：**vruntime 如何实现公平 → 红黑树如何选择进程 → 实时调度如何打破公平 → 调度器类如何统一管理 → 多核如何均衡**。这条逻辑链完整、递进、自洽。

唯一扣分点是缺少 cgroup 组调度这一在现代 Linux（特别是容器化场景）中不可忽视的特性，以及调度策略选择指南可以更实用。但这些属于"锦上添花"，不影响文章作为一篇高质量技术解析的整体定位。
