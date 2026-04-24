# After: Docker 容器编排入门（修正后）

> 修正原则：只改权重不改事实。镜像分层、CNM 的技术内容保留，只降级叙述权重。

## 文章结构（修正后）

```
Docker 容器编排入门：从零搭建你的第一个微服务集群

  一、Docker Compose 快速上手                                        ← 15%
      ├── docker-compose.yml 核心配置
      └── 多服务定义示例

  二、从构建到部署                                                    ← 30%
      ├── Dockerfile 基础（压缩后的构建知识）
      ├── docker compose up 启动服务
      ├── 日志查看与故障排查
      └── 部署验证

  三、网络与数据持久化                                                ← 15%
      ├── --network 参数配置（CNM 压缩为一句话背景）
      └── 数据卷管理

  四、Dockerfile 进阶                                                ← 10%
      多阶段构建、.dockerignore、基础镜像选择

  五、构建原理（补充）                                               ← 10%
      镜像分层与存储驱动（降级为补充知识）

  总结                                                              ← 5%
```

## 修正操作清单

| 操作 | 依据 |
|------|------|
| 镜像分层从独立章节（35%）→ 补充（10%） | Transport：替换为单层存储不影响部署 |
| Compose YAML 语法从独立章节（25%）→ 快速上手的一部分（15%） | Configurable：语法细节查文档即可 |
| CNM 从独立章节（15%）→ 一句话背景 + --network 配置 | Transport：用户只需知道参数 |
| 实际部署从两行（5%）→ 完整的部署流程（30%） | Architectural：用户可观测行为的直接体现 |

## 二次检测

```
- [✅ Correct] 实际部署：升级为完整流程，Architectural 权重匹配
- [✅ Correct] Compose 配置：压缩为快速上手的一部分，Configurable 权重匹配
- [✅ Correct] 镜像分层：降为补充知识，Transport 权重匹配
- [✅ Correct] CNM 网络模型：压缩为一句话背景，Transport 权重匹配
- [✅ Correct] Dockerfile 进阶：保持补充，Configurable 权重匹配
```

全部 ✅，检测通过。
