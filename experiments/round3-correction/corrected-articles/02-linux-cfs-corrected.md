# Linux 内核中的进程调度：从 CFS 到实时调度

> 来源：CSDN https://blog.csdn.net/jiang_style/article/details/159631413
> 收集时间：2026-04-24

### 引言

Linux 内核的进程调度器是操作系统的核心组件，负责决定哪个进程在何时获得 CPU 时间。理解调度器的工作原理，是理解系统性能特征、排查延迟问题、优化实时应用的基础。本文将深入解析 CFS（完全公平调度器）和实时调度的核心机制，以及多核环境下的负载均衡。

### 一、CFS：完全公平调度器

CFS 是 Linux 默认的普通进程调度器，其核心设计目标是**按权重公平分配 CPU 时间**。

#### 1.1 vruntime：虚拟运行时间

CFS 的核心是 **vruntime（虚拟运行时间）** 的概念。每个调度实体（进程/线程）维护一个 `vruntime` 值，记录该进程"已经消耗了多少公平份额的 CPU 时间"。

vruntime 的计算公式：

```
vruntime += 实际运行时间 × NICE_0_LOAD / 进程权重
```

- **NICE_0_LOAD** 是 nice 值为 0 的基准权重（1024）
- **进程权重** 由 nice 值决定，nice 值越低（优先级越高），权重越大

这意味着：高优先级进程的 vruntime 增长慢，低优先级进程的 vruntime 增长快。例如，nice=0 的进程权重为 1024，nice=5 的进程权重为 335。两者同时运行时，nice=0 的进程 vruntime 增长速度是 nice=5 的 335/1024 ≈ 0.33 倍——也就是说，高优先级进程每消耗 1 单位 CPU 时间，其 vruntime 只增长约 0.33，从而在后续调度中更容易被选中。

#### 1.2 红黑树与调度选择

CFS 使用**红黑树**（`struct cfs_rq` 中的 `tasks_timeline`）按 vruntime 排序所有就绪进程。调度时，CFS 选择 **vruntime 最小的进程**（即红黑树的最左节点 `rb_leftmost`）作为下一个运行的进程。

这种设计的关键优势：
- **天然公平**：运行越少的进程 vruntime 越小，越容易被选中
- **O(log n) 插入/删除**，O(1) 选择下一个进程（直接取最左节点）
- **新进程和唤醒进程**的 vruntime 被初始化为当前 `min_vruntime`，防止新进程"插队"

#### 1.3 调度延迟与最小粒度

CFS 的调度行为受两个关键参数控制：

- **sched_latency_ns**（调度延迟）：CFS 保证所有进程在此时间窗口内至少运行一次。默认值通常为 6ms（无周期模式下为 24ms）。
- **sched_min_granularity_ns**（最小粒度）：每个进程每次至少运行这么长时间，防止进程切换过于频繁。默认值通常为 0.75ms。

当就绪进程数增多时，每个进程分到的时间片 = max(sched_latency / 进程数, sched_min_granularity)。这保证了在进程数极多时，切换开销不会失控。

```c
// CFS 调度器的核心数据结构
struct cfs_rq {
    struct rb_root_cached tasks_timeline;  // 按 vruntime 排序的红黑树
    struct rb_node *rb_leftmost;           // vruntime 最小的节点（下一个运行）
    unsigned long min_vruntime;            // 当前队列的最小 vruntime 基准
};
```

### 二、实时调度：优先级抢占模型

Linux 提供三种实时调度策略，用于需要确定性保证的场景。

#### 2.1 SCHED_FIFO（先进先出）

- 进程一旦获得 CPU，会一直运行直到**主动让出**（sleep、yield、被更高优先级抢占）
- 同优先级的进程按 FIFO 顺序排队，不使用时间片
- 适合**延迟敏感但不会无限运行**的任务

#### 2.2 SCHED_RR（轮转）

- 在 SCHED_FIFO 基础上增加了**时间片**：同优先级的进程轮流运行
- 时间片用完后，进程被移到同优先级队列末尾
- 适合**需要公平分享实时优先级**的多个任务

#### 2.3 SCHED_DEADLINE

- 基于 **EDF（Earliest Deadline First）** 算法
- 每个任务声明三个参数：周期（period）、运行时间（runtime）、截止时间（deadline）
- 调度器保证在每个周期内，任务获得足够的运行时间以满足截止时间
- **优先级最高**：SCHED_DEADLINE 任务始终抢占 SCHED_RR 和 SCHED_FIFO

#### 2.4 实时调度的抢占规则

实时调度的核心规则：**高优先级实时任务始终抢占低优先级任务和所有普通（CFS）任务**。

优先级范围（数字越大优先级越高）：
- 普通进程（CFS）：nice -20 ~ +19，映射到 priority 100~139
- 实时进程：priority 0~99（对应 rt_priority 99~0）

这意味着即使 nice=-20 的普通进程，也无法与任何实时进程竞争 CPU。实时调度的本质是**牺牲公平性换取确定性**。

```c
// 实时调度实体结构
struct sched_rt_entity {
    struct list_head run_list;      // 同优先级进程链表
    unsigned long timeout;          // 超时时间
    unsigned int time_slice;        // 剩余时间片（SCHED_RR 使用）
    unsigned short on_rq;           // 是否在运行队列上
};
```

### 三、调度器类：统一的多态架构

Linux 通过**调度器类（sched_class）** 实现不同调度策略的统一管理。调度器类按优先级链式排列：

```
stop_sched_class → dl_sched_class → rt_sched_class → fair_sched_class → idle_sched_class
```

每次调度时，内核从最高优先级的调度器类开始，调用其 `pick_next_task` 回调，选择下一个运行的进程。这种设计使得不同的调度策略可以共存，每个进程通过 `sched_class` 指针关联到对应的调度器类。

```c
// 调度器类结构体
struct sched_class {
    const struct sched_class *next;
    void (*enqueue_task)(struct rq *rq, struct task_struct *p, int flags);
    void (*dequeue_task)(struct rq *rq, struct task_struct *p, int flags);
    struct task_struct *(*pick_next_task)(struct rq *rq, struct task_struct *prev);
    void (*task_tick)(struct rq *rq, struct task_struct *p, int queued);
    // ...
};
```

### 四、多核负载均衡

在多核系统中，Linux 通过**负载均衡**机制将进程合理分配到各 CPU 核心，避免某些核心过载而其他核心空闲。

#### 4.1 调度域（Scheduling Domain）

Linux 将 CPU 按拓扑结构组织为**调度域**（如共享 L1 缓存的核 → 共享 L2 的核 → 同一 NUMA 节点 → 跨 NUMA 节点）。负载均衡在每个调度域内逐层进行，优先在同一调度域内平衡，减少跨域迁移的开销。

#### 4.2 负载均衡触发条件

- **周期性均衡**：定时器触发，检查各 CPU 的负载差异
- **idle balance**：当某个 CPU 空闲时，主动从繁忙 CPU 拉取任务
- **fork/exec balance**：新进程创建时，选择负载最低的 CPU

负载均衡的粒度和频率受 `sched_migration_cost_ns` 等参数影响，核心目标是**在迁移开销和负载均衡之间取得平衡**。

### 五、调度策略选择指南

| 场景 | 推荐策略 | 原因 |
|------|---------|------|
| 桌面/交互式应用 | CFS（默认） | 公平分配，交互响应好 |
| 服务器/高吞吐 | CFS + 参数调优 | 调整 sched_latency_ns 优化吞吐 |
| 音视频/软实时 | SCHED_RR 或 SCHED_FIFO | 保证延迟上限 |
| 硬实时/工业控制 | SCHED_DEADLINE | 提供最严格的截止时间保证 |

### 六、CFS 参数调优（补充）

CFS 的行为可以通过 sysctl 参数调优，但**调整前必须理解被调参数的含义**：

```bash
# 查看当前参数值
cat /proc/sys/kernel/sched_min_granularity_ns    # 最小运行粒度（默认 0.75ms）
cat /proc/sys/kernel/sched_wakeup_granularity_ns # 唤醒抢占粒度
cat /proc/sys/kernel/sched_latency_ns            # 调度延迟周期（默认 6ms）

# 调优示例：增大最小粒度以减少切换开销（适合计算密集型服务器）
sudo sysctl -w kernel.sched_min_granularity_ns=10000000
```

> **注意**：增大 `sched_min_granularity_ns` 会减少上下文切换，提高吞吐，但会降低交互响应速度。减小则相反。没有"最优"值，只有适合特定工作负载的值。

### 七、查看调度信息

```bash
# 查看进程的调度类和优先级
ps -eo pid,ppid,cmd,cls,rtprio,ni,pri | head -20

# 实时查看调度统计
cat /proc/schedstat

# 使用 top 按优先级排序（按 'r' 调整 nice 值）
top
```

### 总结

Linux 进程调度的核心架构由三层组成：

1. **CFS 的 vruntime 机制**：通过虚拟运行时间和红黑树实现按权重公平调度，是普通进程调度的核心
2. **实时调度的优先级抢占模型**：SCHED_FIFO/SCHED_RR/SCHED_DEADLINE 提供不同层次的确定性保证，实时任务始终优先于普通任务
3. **调度器类的多态架构**：通过 sched_class 链式结构统一管理不同调度策略
4. **多核负载均衡**：通过调度域层次结构在多核间合理分配进程

理解这些机制，才能正确地选择调度策略、调优参数、排查性能问题。
