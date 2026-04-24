# Transformer 架构完全指南：从 Attention 到 GPT

> 一篇面向 ML 入门者的 Transformer 教程。标题承诺"从 Attention 到 GPT"，但大量篇幅给了位置编码的数学公式，真正的 Self-Attention 机制和信息流动被压缩。

## 一、位置编码的数学原理（30%）

Transformer 没有循环结构，需要位置编码来注入序列信息。

### 正弦/余弦位置编码

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$$

```python
import torch
import math

def positional_encoding(max_len, d_model):
    pe = torch.zeros(max_len, d_model)
    position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe
```

### 为什么选择正弦函数？

正弦函数的特性：$PE_{pos+k}$ 可以表示为 $PE_{pos}$ 的线性函数，这意味着模型可以通过线性变换学到相对位置关系。

### RoPE（旋转位置编码）

现代 LLM 使用 RoPE 替代原始位置编码：

```python
def rope(q, k, pos_ids):
    # 旋转矩阵应用
    cos = torch.cos(pos_ids * theta)
    sin = torch.sin(pos_ids * theta)
    q_rotated = q * cos + rotate_half(q) * sin
    k_rotated = k * cos + rotate_half(k) * sin
    return q_rotated, k_rotated
```

## 二、Self-Attention 机制（15%）

Attention 计算：$Attention(Q, K, V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$

Q、K、V 分别是查询、键、值矩阵。

## 三、Multi-Head Attention（10%）

多个注意力头并行计算，捕捉不同维度的关系。

## 四、Feed-Forward Network（10%）

两层全连接网络，提供非线性变换能力。

## 五、Layer Normalization（10%）

稳定训练过程。

## 六、Encoder-Decoder 结构（10%）

编码器处理输入，解码器生成输出。

## 七、总结（15%）

Transformer 通过 Attention 机制实现了并行化的序列处理。
