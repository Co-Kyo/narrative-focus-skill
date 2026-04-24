# Before: Docker 容器编排入门（存在叙述重心错位）

> 一篇标题为"容器编排入门"的教程，构建细节挤占了编排内容。

## 文章结构（修正前）

```
Docker 容器编排入门：从零搭建你的第一个微服务集群

  一、理解 Docker 镜像分层机制（UnionFS/overlay2/devicemapper/btrfs）  ← 35%
  二、Docker Compose 的 YAML 语法                                     ← 25%
  三、Dockerfile 最佳实践                                              ← 15%
  四、容器网络模型（CNM: Sandbox/Endpoint/Network）                    ← 15%
  五、实际部署（docker compose up）                                     ← 5%
  总结                                                                 ← 5%
```

## Step 1→5 检测

```
- [❌ Over-highlighted] 镜像分层机制（35%）：三种存储驱动的详细对比。
  替换为单层存储，用户部署行为不变 → Transport。
  构建优化细节不应占据三分之一篇幅。

- [❌ Disproportionate] Compose YAML 语法（25%）：缩进规则、顶层键说明。
  替换为 JSON/TOML 配置，行为不变 → Configurable。
  语法细节查文档即可，不需要在教程中展开。

- [❌ Over-highlighted] CNM 网络模型（15%）：Sandbox/Endpoint/Network 三组件。
  替换为 iptables 直接管理，用户用 --network 即可 → Transport。

- [❌ Obscured] 实际部署操作（5%）：只有 docker compose up 两行命令。
  这是用户可观测行为的直接体现 → Architectural，应展开。

- [✅ Correct] Dockerfile 最佳实践：Configurable，15% 合理。
```
