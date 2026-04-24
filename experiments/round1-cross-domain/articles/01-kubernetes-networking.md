# Kubernetes 网络模型深度解析：从零理解 Pod 通信

> 一篇面向初中级 DevOps 工程师的 Kubernetes 网络教程。标题承诺"理解 Pod 通信"，但大量篇幅给了底层网络插件细节。

## 一、CNI 插件机制与 Calico 的 BGP 路由（30%）

Kubernetes 的网络依赖 CNI（Container Network Interface）插件。Calico 是最流行的 CNI 插件之一，它使用 BGP（Border Gateway Protocol）来广播 Pod 的 IP 路由。

### Calico 的 BGP 配置

```yaml
apiVersion: projectcalico.org/v3
kind: BGPConfiguration
metadata:
  name: default
spec:
  logSeverityScreen: Info
  nodeToNodeMeshEnabled: true
  asNumber: 64512
```

Calico 通过 BIRD（B Internet Routing Daemon）守护进程与节点交换路由信息。每个节点上的 Felix 代理负责编程 iptables 规则。当 Pod 创建时，Felix 会：

1. 创建 veth pair
2. 将一端放入 Pod 的 network namespace
3. 在 host 端配置路由
4. 编程 iptables 规则

### BGP 路由表

```
10.244.0.0/24 via 192.168.1.10 dev eth0 proto bird
10.244.1.0/24 via 192.168.1.11 dev eth0 proto bird
10.244.2.0/24 via 192.168.1.12 dev eth0 proto bird
```

## 二、Flannel 的 VXLAN 封装（20%）

Flannel 是另一个流行的 CNI 插件，它使用 VXLAN 技术在节点之间建立 overlay 网络。

```bash
# 查看 flannel 的 VXLAN 设备
ip link show flannel.1

# 查看 FDB（Forwarding Database）
bridge fdb show dev flannel.1
```

VXLAN 封装将原始的 Pod 网络包封装在 UDP 数据报中，VNI（VXLAN Network Identifier）为 1。

## 三、kube-proxy 的 iptables 规则（15%）

kube-proxy 负责维护 Service 到 Pod 的映射。它通过 iptables 规则实现：

```bash
# 查看 Service 的 iptables 规则
iptables -t nat -L KUBE-SERVICES -n
```

每个 Service 对应多条 iptables 规则，使用随机或轮询算法选择后端 Pod。

## 四、DNS 解析（10%）

CoreDNS 负责集群内的 DNS 解析。Pod 的 DNS 配置指向 CoreDNS 的 ClusterIP。

## 五、Pod 之间如何通信（10%）

同一节点的 Pod 通过 veth pair 直接通信。不同节点的 Pod 通过 CNI 插件的路由机制通信。

## 六、总结（5%）

Kubernetes 网络涉及 CNI 插件、kube-proxy、DNS 等多个组件。
