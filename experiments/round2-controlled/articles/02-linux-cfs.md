# Linux 内核中的进程调度：从 CFS 到实时调度

> 来源：CSDN https://blog.csdn.net/jiang_style/article/details/159631413
> 收集时间：2026-04-24

### 引言

作为一名深耕操作系统和嵌入式开发的工程师，我深知资源调度的重要性。在系统开发中，合理的资源调度可以提高系统的效率，确保任务的顺利进行。在 Linux 内核中，进程调度是一个核心组件，它负责分配 CPU 时间给不同的进程和线程。今天，我们就来深入探讨 Linux 内核中的进程调度，从技术原理到实战应用。

### 技术原理

#### 进程调度的核心概念

Linux 内核的进程调度主要包括：

- 调度策略：如 CFS（完全公平调度器）、实时调度（SCHED_FIFO、SCHED_RR、SCHED_DEADLINE）等。
- 优先级：进程的优先级，决定进程获得 CPU 时间的顺序。
- 调度器类：不同类型的调度器，如 fair_sched_class、rt_sched_class、dl_sched_class 等。
- 调度实体：被调度的对象，如进程、线程等。
- 负载均衡：在多 CPU 系统中，均衡各个 CPU 的负载。

#### 进程调度的实现原理

```c
// CFS 调度器的核心数据结构
struct cfs_rq {
    struct rb_root_cached tasks_timeline;
    struct rb_node *rb_leftmost;
    unsigned long min_vruntime;
};

// 调度器类结构体
struct sched_class {
    const struct sched_class *next;
    void (*enqueue_task)(struct rq *rq, struct task_struct *p, int flags);
    void (*dequeue_task)(struct rq *rq, struct task_struct *p, int flags);
    struct task_struct *(*pick_next_task)(struct rq *rq, struct task_struct *prev);
};

// 进程结构体
struct task_struct {
    pid_t pid;
    struct sched_entity se;
    struct sched_rt_entity rt;
    struct sched_dl_entity dl;
    int prio;
    int static_prio;
    int normal_prio;
    unsigned int rt_priority;
    const struct sched_class *sched_class;
};

void schedule(void)
{
    // 执行调度
}
```

### 创业视角分析

从创业者的角度来看，进程调度的设计思路与企业管理中的资源调度有着密切的联系：

- 资源分配：进程调度通过合理分配 CPU 时间，提高 CPU 的利用率，就像企业中的资源分配。
- 优先级管理：进程调度通过管理进程的优先级，确保重要的进程能够获得足够的 CPU 时间，就像企业中的任务优先级管理。
- 负载均衡：进程调度通过均衡各个 CPU 的负载，提高系统的整体性能，就像企业中的负载均衡。
- 公平性：CFS 调度器通过公平分配 CPU 时间，确保每个进程都能获得合理的 CPU 时间，就像企业中的公平性。

### 实用技巧

#### 进程调度的使用场景

- 桌面系统：需要良好的交互式响应，适合使用 CFS 调度器。
- 服务器系统：需要高吞吐量，适合使用 CFS 调度器，并优化负载均衡。
- 实时系统：需要严格的实时性，适合使用实时调度策略。

#### 进程调度的最佳实践

- 选择合适的调度策略
- 合理设置进程优先级
- 优化负载均衡
- 监控调度性能

### 代码示例

#### 设置进程调度策略

```c
#include <sched.h>
#include <stdio.h>

int main(void)
{
    struct sched_param param;
    param.sched_priority = 90;
    ret = sched_setscheduler(0, SCHED_FIFO, &param);
    printf("Scheduler set to SCHED_FIFO with priority %d\n", param.sched_priority);
    return 0;
}
```

#### 查看进程调度信息

```bash
ps -eo pid,ppid,cmd,cls,rtprio,ni,pri,psr,pcpu,pmem | head -20
uptime
top
cat /proc/schedstat
```

#### 优化 CFS 调度器参数

```bash
cat /proc/sys/kernel/sched_min_granularity_ns
cat /proc/sys/kernel/sched_wakeup_granularity_ns
cat /proc/sys/kernel/sched_latency_ns

sudo sysctl -w kernel.sched_min_granularity_ns=10000000
sudo sysctl -w kernel.sched_wakeup_granularity_ns=15000000
sudo sysctl -w kernel.sched_latency_ns=60000000
```

### 总结

Linux 内核中的进程调度是一个核心组件，它负责分配 CPU 时间给不同的进程和线程。进程调度的设计思路与企业管理中的资源调度有着密切的联系，它通过资源分配、优先级管理、负载均衡和公平性等机制，为系统的高效运行提供了保障。
