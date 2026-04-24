# Before: V8 垃圾回收机制深度解析（Borderline 案例）

> 这是一个 Borderline 案例——大部分概念权重合理，只有少数问题。
> 展示 skill 在"接近正确"的文章上的检测表现。

## 文章结构

```
V8 垃圾回收机制深度解析

  一、V8 的内存堆结构（New/Old/Large Object/Code/Map Space）   ← 10%
  二、Scavenge 算法：新生代回收（Cheney 半空间复制）            ← 15%
  三、写屏障（Write Barrier）+ Card Marking                    ← 10%
  四、标记-清除与标记-压缩：三色标记法                          ← 15%
  五、增量标记与并发标记                                        ← 10%
  六、隐藏类与内联缓存（Hidden Classes / IC）                   ← 20%
  总结                                                         ← 5%
```

## Step 1→5 检测

```
- [✅ Correct] 内存堆结构：Architectural，10% 合理。区域划分是 GC 策略的基础。

- [⚠️ Borderline] Scavenge 算法（15%）：
  替换为标记-清除，用户代码不受影响（新生代回收对用户透明）→ Transport。
  但"深度解析"定位允许一定的实现细节展开。15% 偏高但可接受。

- [⚠️ Borderline] 写屏障 / Card Marking（10%）：
  替换为 remembered set，GC 细节不同但用户无感 → Transport。
  同上，"深度解析"允许。

- [✅ Correct] 三色标记法：Architectural，15% 合理。
  替换为引用计数，改变对循环引用等行为的理解。

- [✅ Correct] 增量/并发标记：Architectural，10% 合理。
  替换为全量标记，改变对 GC 暂停时间的预期。

- [✅ Correct] 隐藏类 / IC：Architectural，20% 合理。
  替换为哈希表属性访问，改变性能理解。
  注：此概念不属于 GC 领域（主题外溢），但从权重角度看 20% 给 Architectural
  概念是合理的。主题边界问题超出本 skill 范围。
```

## 本案例展示的要点

1. **Borderline 的处理**：Scavenge 和写屏障从纯替换实验看是 Transport，但在"深度解析"语境下可接受。skill 标记为 ⚠️ Borderline 而非 ❌，将判断权交给用户。

2. **skill 的边界**：隐藏类/IC 从权重角度看完全正确（Architectural 20%），但它不属于 GC 领域。这是主题外溢问题，不是权重错位问题。本 skill 只检测权重，不管主题边界。

3. **"大部分正确"的文章也有价值**：即使只有 2 个 Borderline，检测报告仍然给出了明确的判断依据（替换实验结果 + 语境说明），用户可以自行决定是否调整。
