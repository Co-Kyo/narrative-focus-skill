# 叙述重心错位检测报告

**目标文章**: `/root/.openclaw/workspace/narrative-focus-test-round2/articles/03-git-objects.md`
**检测时间**: 2026-04-24
**检测模式**: Post-processing（后处理检测）

---

## Step 1: 提取文章核心概念

扫描文章，识别所有以核心概念形式呈现的技术细节：

| # | 概念 | 呈现方式 | 叙事权重 |
|---|------|---------|---------|
| 1 | blob object（数据对象） | 独立小节，含解释 | High |
| 2 | tree object（树对象） | 独立小节，含解释 | High |
| 3 | commit object（提交对象） | 独立小节，含解释 | High |
| 4 | 分支是 commit 的引用 | 提交对象小节末尾 + 独立案例小节 | High |
| 5 | tag object（标签对象） | 独立小节，含多点解释 | High |
| 6 | 压缩与增量存储 | 独立小节，简要说明 | Medium |
| 7 | 为什么彻底删除大文件要修改整个历史？ | 独立小节，含详细推演 | High |

---

## Step 2: 识别每个核心概念传达的命题

### 1. blob object
**命题**: Git 的文件存储是内容与元数据分离的——blob 只存内容，文件名由 tree 管理。这意味着 Git 的内容寻址机制基于纯内容哈希，而非文件名+内容。

### 2. tree object
**命题**: Git 的目录结构由 tree 对象表达，tree 将文件名映射到 blob（或其他 tree），形成层级结构。

### 3. commit object
**命题**: 提交是对 tree 的封装，加上元数据（时间、作者）和父提交引用，父提交引用构成了有向无环图（DAG），这是 Git 历史遍历的基础。

### 4. 分支是 commit 的引用
**命题**: 分支不是独立实体，只是某个 commit 的可移动指针。底层命令 `git update-ref` 与高层 `git reset --hard` 效果一致，印证了这一点。

### 5. tag object
**命题**: 标签是独立的 Git 对象（非引用），指向一个特定对象的固定引用，与分支（可移动引用）不同。

### 6. 压缩与增量存储
**命题**: Git 存储有两种模式——松散对象（完整存储）和 packfile（增量压缩），`git gc` 触发压缩。

### 7. 为什么彻底删除大文件要修改整个历史？
**命题**: 因为 commit 不可变，且 tree 对象包含对 blob 的引用，删除大文件后所有包含该引用的后续 commit 都需要重写（新 parent 链），这是 Git 数据模型的直接推论。

---

## Step 3: 替代测试

对每个命题应用替代测试：**如果该命题被替换为另一种实现，用户可观察行为是否改变？**

### 1. blob object
- 替代："Git 的文件存储是文件名+内容一起哈希"
- **行为改变?** 是。内容寻址去重机制完全不同，相同内容不同文件名会产生不同哈希，用户对 Git 存储模型的理解彻底改变。
- **角色**: ✅ **Architectural**

### 2. tree object
- 替代："Git 不使用层级目录结构，直接用扁平列表管理文件"
- **行为改变?** 是。目录结构的表示方式改变，用户对 .git 存储结构的理解完全不同。
- **角色**: ✅ **Architectural**

### 3. commit object
- 替代："提交只存 tree 引用，不存父提交"
- **行为改变?** 是。无法形成 DAG，历史遍历不可能，用户对 Git 历史模型的理解彻底改变。
- **角色**: ✅ **Architectural**

### 4. 分支是 commit 的引用
- 替代："分支是独立的实体，有自己的存储结构"
- **行为改变?** 是。用户对分支操作（reset、merge、rebase）的理解会根本不同，"一切皆 commit"的心智模型不成立。
- **角色**: ✅ **Architectural**

### 5. tag object
- 替代："标签只是引用（类似分支），不是独立对象"
- **行为改变?** 行为基本不变。用户给提交打标签的使用体验一致（文章自己也承认"体验一致"），只是底层存储方式不同。
- **角色**: ✅ **Transport**（存储方式的差异不影响用户可观察行为）

### 6. 压缩与增量存储
- 替代："Git 始终使用松散对象，不压缩"
- **行为改变?** 否。用户使用 Git 的方式完全不变，只是磁盘占用不同。这是存储优化，不影响任何用户可观察的行为。
- **角色**: ✅ **Transport**

### 7. 为什么彻底删除大文件要修改整个历史？
- 替代：（无直接替代——这是从 commit 不可变性推导出的必然结论）
- 该命题本身是 commit 不可变性 + tree 引用机制的**推论**，不是独立的架构机制。替代测试不直接适用。
- **角色**: 作为 commit Architectural 命题的推论，本身不是独立概念。

---

## Step 4: 叙事权重 vs 角色对比

| # | 概念 | 实际角色 | 叙事权重 | 判定 |
|---|------|---------|---------|------|
| 1 | blob object | Architectural | High（独立小节） | ✅ Correct |
| 2 | tree object | Architectural | High（独立小节） | ✅ Correct |
| 3 | commit object | Architectural | High（独立小节） | ✅ Correct |
| 4 | 分支是 commit 的引用 | Architectural | High（案例小节独立展示） | ✅ Correct |
| 5 | tag object | Transport | High（独立小节 + 多点阐述） | ❌ Over-highlighted |
| 6 | 压缩与增量存储 | Transport | Medium（独立小节，简要） | ✅ Correct |
| 7 | 彻底删除大文件修改历史 | Architectural 推论 | High（独立小节 + 详细推演） | ❌ Disproportionate |

---

## Step 5: 检测报告

```
- [✅ Correct] blob object: 独立小节呈现，实际为 Architectural — 内容与元数据分离是 Git 存储的核心机制
- [✅ Correct] tree object: 独立小节呈现，实际为 Architectural — 目录结构的层级表示是文件系统的核心
- [✅ Correct] commit object: 独立小节呈现，实际为 Architectural — 父提交引用构成 DAG 是历史遍历的基础
- [✅ Correct] 分支是 commit 的引用: 案例小节独立展示，实际为 Architectural — 分支=指针是 Git 心智模型的核心
- [❌ Over-highlighted] tag object: 独立小节 + 多点阐述，实际为 Transport — 标签是独立对象还是引用，不影响用户可观察行为（文章自己也承认"体验一致"）
- [✅ Correct] 压缩与增量存储: 独立小节但篇幅简要，实际为 Transport — 存储优化不影响用户行为
- [❌ Disproportionate] 为什么彻底删除大文件要修改整个历史？: 独立小节 + 详细推演（占全文约 20%），实际为 Architectural 推论而非独立架构机制 — 该内容本质是 commit 不可变性 + tree 引用的直接推论，应归入 commit 小节作为补充说明
```

---

## 总结

**检测结果**: 发现 **2 处** 叙述重心错位。

| 类型 | 数量 | 概念 |
|------|------|------|
| Over-highlighted | 1 | tag object |
| Disproportionate | 1 | 彻底删除大文件修改历史 |
| Correct | 5 | blob、tree、commit、分支引用、压缩存储 |

**核心问题**:
1. **tag object** 被赋予了与 blob/tree/commit 同等的独立小节地位，但文章自己指出其与分支"体验一致"，属于存储层面的差异（Transport），不应与三大核心对象并列。
2. **"彻底删除大文件"** 虽然内容有价值，但本质是 commit 不可变性的推论，以独立小节呈现使其看起来像是独立的架构概念，篇幅占比也过大（约 20%），建议归入 commit 小节作为补充说明或"常见问题"子节。

**不需要执行修正流程**（检测流程到此终止，修正需用户确认后执行）。
