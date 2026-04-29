# 检测报告：《Linux内核三大核心模块深度解析：调度、内存与I/O》

> 来源：博客园 · 2026-03-12
> 检测模式：Post-processing (Detection)
> 错位统计：✅ 15 | ❌ Obscured 5 | ⚠️ Borderline 4

---

## Step 1: 提取核心概念

### 进程调度
- kernel_clone / COW、调度类体系（DL/RT/CFS/EXT）、运行队列、负载均衡、PREEMPT_RT、perf/trace-cmd

### 内存管理
- 硬件分页/zone/buddy、分配器系列（CMA/slab/kmalloc/vmalloc）、VMA/缺页异常、页缓存/swap、LRU/MGLRU、THP/HugeTLB、cgroup/OOM

### 文件 I/O
- I/O 模型演进（阻塞→非阻塞→多路复用→信号驱动→AIO→io_uring）、VFS、硬链接/符号链接、journaling、address_space/iomap、I/O 调度器、I/O cgroup、工具

## Step 3: 替代测试（节选）

| 概念 | 角色 | 理由 |
|------|------|------|
| 调度类体系 | **A** | 替换为单一调度策略 → 实时任务无法保证确定性响应 |
| 负载均衡 | **A** | 替换为不做均衡 → 多核利用率严重不均 |
| 硬件分页/zone/buddy | **A** | 替换为直接物理寻址 → 整个内存模型崩溃 |
| 页缓存/swap | **A** | 替换为无页缓存 → 文件 I/O 性能崩溃 |
| I/O 模型演进 | **A** | 替换为全用阻塞 I/O → 高并发无法扩展 |
| 运行队列 | **T** | 替换为全局队列 → 功能不变，仅锁竞争差异 |
| 分配器系列 | **C** | 替换为只用 buddy → 小对象效率低但功能不变 |
| THP/HugeTLB | **C** | 替换为不用大页 → 可选性能优化 |

## Step 5: 检测报告

```
- [❌ Obscured] 调度类体系（A）：4个调度类被压缩为1句话枚举，无法建立分层选择的因果模型
- [❌ Obscured] 负载均衡（A）：wake_affine/NUMA/SMT 被压缩为1段列举，均未展开
- [❌ Obscured] 硬件分页/zone/buddy（A）：三层核心机制被压缩为1句话
- [❌ Obscured] 页缓存/swap（A）：决定文件I/O性能的核心机制被压缩为1句话
- [❌ Obscured] I/O模型演进（A）：6种模型被压缩为1段枚举，未展开行为差异

- [✅ Correct] kernel_clone/COW, 运行队列, PREEMPT_RT, perf/trace-cmd, 分配器系列,
  VMA/缺页异常, LRU/MGLRU, THP/HugeTLB, cgroup/OOM, VFS, 硬链接/符号链接,
  journaling, address_space/iomap, I/O cgroup, 工具 — 权重匹配
```

## 核心诊断

**「概念枚举目录」错位模式**：三个章节都呈现为 6-8 个技术概念的均等权重列表罗列，Architectural 概念（调度类、负载均衡、页缓存、I/O 模型）与 Configurable/Transport 概念混在同一叙述层级。标题暗示"深度解析"，但内容是浅层枚举，未兑现深度承诺。
