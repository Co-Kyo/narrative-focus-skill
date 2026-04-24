# PostgreSQL 查询优化实战：让你的 SQL 飞起来

> 一篇面向后端开发者的 PostgreSQL 性能优化教程。标题承诺"让 SQL 飞起来"，但大量篇幅给了索引类型细节，真正的查询执行计划分析被压缩。

## 一、B-Tree 索引的内部结构（25%）

PostgreSQL 默认使用 B-Tree 索引。B-Tree 是一种自平衡的树状数据结构，所有叶子节点在同一层。

### B-Tree 的节点分裂

当一个页面满时，B-Tree 会执行节点分裂：
1. 分配新页面
2. 将一半的 key 移到新页面
3. 在父节点中插入新的分隔 key

```sql
-- 创建 B-Tree 索引
CREATE INDEX idx_users_email ON users USING btree (email);

-- 查看索引大小
SELECT pg_size_pretty(pg_relation_size('idx_users_email'));
```

### B-Tree vs Hash 索引

| 特性 | B-Tree | Hash |
|------|--------|------|
| 范围查询 | ✅ 支持 | ❌ 不支持 |
| 等值查询 | O(log n) | O(1) |
| 排序 | ✅ 支持 | ❌ 不支持 |

## 二、GIN 索引与全文搜索（20%）

GIN（Generalized Inverted Index）用于全文搜索和 JSONB 查询。

```sql
-- 创建 GIN 索引
CREATE INDEX idx_posts_content ON posts USING gin(to_tsvector('english', content));

-- JSONB 查询
CREATE INDEX idx_data ON events USING gin(data jsonb_path_ops);
```

## 三、EXPLAIN ANALYZE 的输出解读（15%）

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;
```

输出中的关键指标：
- actual time：实际执行时间
- rows：估计 vs 实际行数
- loops：循环次数

## 四、Seq Scan vs Index Scan（10%）

当表小或选择性低时，PostgreSQL 可能选择顺序扫描而非索引扫描。

## 五、连接算法：Nested Loop vs Hash Join vs Merge Join（10%）

PostgreSQL 支持三种连接算法，优化器根据表大小和可用索引选择。

## 六、统计信息与 ANALYZE（10%）

`ANALYZE` 命令更新表的统计信息，帮助查询优化器做出更好的决策。

## 七、总结（10%）

查询优化需要理解索引、执行计划和统计信息。
