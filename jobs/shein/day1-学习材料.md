# Day 1: Kubernetes 基础概念

**日期**：2026-02-27
**学习时间**：1小时
**目标**：能说清楚 K8s 的作用和核心概念

---

## 1. 什么是 Kubernetes (K8s)?

### 定义
Kubernetes 是一个开源的**容器编排平台**，用于自动化部署、扩展和管理容器化应用程序。

### 它解决什么问题？

| 问题       | K8s 如何解决           |
| -------- | ------------------ |
| 容器太多难管理  | 自动编排和调度            |
| 应用崩溃了怎么办 | 自动重启（自愈能力）         |
| 流量突然变大   | 自动扩缩容（HPA/CA）      |
| 如何更新不停机  | 滚动更新               |
| 配置和密钥管理  | ConfigMap 和 Secret |

### 核心价值
- **自动化**：减少手动运维
- **高可用**：自动恢复故障
- **可扩展**：按需扩缩容
- **声明式**：用 YAML 描述期望状态

---

## 2. K8s 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │              Control Plane (主节点)               │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │  API Server  │  │   Scheduler  │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │    etcd      │  │  Controller  │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Node 1    │  │   Node 2    │  │   Node 3    │    │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │    │
│  │ │  Pod    │ │  │ │  Pod    │ │  │ │  Pod    │ │    │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 关键组件说明

| 组件 | 作用 |
|------|------|
| **API Server** | K8s 的入口，所有操作都通过它 |
| **etcd** | 存储集群状态的数据库 |
| **Scheduler** | 决定 Pod 在哪个 Node 上运行 |
| **Controller** | 确保集群状态符合期望 |
| **Node** | 工作节点，运行 Pod |

---

## 3. 三个核心概念（面试必问）

### 3.1 Pod - 最小部署单元

**定义**：K8s 中最小的可部署单元，包含一个或多个容器。

```yaml
# 简单 Pod 示例
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  containers:
  - name: my-app
    image: nginx:latest
    ports:
    - containerPort: 80
```

**关键点**：
- Pod 里的容器共享网络和存储
- Pod 是临时的，可能被重建
- 通常不直接创建 Pod，而是用 Deployment

**面试回答**：
> "Pod 是 K8s 最小的部署单元。一个 Pod 可以包含一个或多个紧密相关的容器，它们共享网络和存储。Pod 本身是临时的，所以生产环境通常用 Deployment 来管理 Pod。"

---

### 3.2 Deployment - Pod 的管理者

**定义**：管理 Pod 的副本数量和更新策略。

```yaml
# Deployment 示例
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
spec:
  replicas: 3              # 保持 3 个 Pod 运行
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:v1
        ports:
        - containerPort: 80
```

**关键能力**：
- **副本管理**：保证指定数量的 Pod 在运行
- **滚动更新**：逐步更新 Pod，不停机
- **回滚**：更新出问题可以回退
- **自愈**：Pod 崩溃自动重建

**面试回答**：
> "Deployment 用于管理 Pod 的生命周期。它可以确保指定数量的 Pod 副本始终运行，支持滚动更新实现零停机部署，出问题还能快速回滚。"

---

### 3.3 Service - 网络访问入口

**定义**：为一组 Pod 提供稳定的网络访问入口。

```yaml
# Service 示例
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP          # 服务类型
  selector:
    app: my-app            # 选择哪些 Pod
  ports:
  - port: 80               # Service 端口
    targetPort: 80         # Pod 端口
```

**为什么需要 Service？**
- Pod 的 IP 是不固定的（Pod 重建会变）
- Service 提供稳定的访问地址
- Service 自动负载均衡到多个 Pod

**三种常用类型**：

| 类型 | 用途 | 访问范围 |
|------|------|----------|
| **ClusterIP** | 集群内部访问 | 只能集群内部访问 |
| **NodePort** | 暴露到节点端口 | 可通过节点 IP:端口 访问 |
| **LoadBalancer** | 云平台负载均衡 | 外部可访问（需要云支持） |

**面试回答**：
> "Service 为 Pod 提供稳定的网络入口。因为 Pod 的 IP 会变化，Service 用固定的 ClusterIP 或 DNS 名称来访问 Pod，并自动做负载均衡。"

---

## 4. 三者关系图

```
                     用户请求
                        │
                        ▼
                 ┌─────────────┐
                 │   Service   │  ← 稳定入口，负载均衡
                 │  (固定 IP)   │
                 └──────┬──────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │   Pod   │   │   Pod   │   │   Pod   │
    │ (副本1) │   │ (副本2) │   │ (副本3) │
    └─────────┘   └─────────┘   └─────────┘
         ▲              ▲              ▲
         └──────────────┼──────────────┘
                        │
                 ┌──────┴──────┐
                 │  Deployment │  ← 管理 Pod 数量和更新
                 └─────────────┘
```

---

## 5. 常用 kubectl 命令

```bash
# 查看资源
kubectl get pods                    # 列出所有 Pod
kubectl get deployments             # 列出所有 Deployment
kubectl get services                # 列出所有 Service
kubectl get all                     # 列出所有资源

# 详细信息
kubectl describe pod <pod-name>     # Pod 详细信息
kubectl logs <pod-name>             # 查看 Pod 日志

# 创建和删除
kubectl apply -f deployment.yaml    # 创建/更新资源
kubectl delete pod <pod-name>       # 删除 Pod

# 扩缩容
kubectl scale deployment my-app --replicas=5
```

---

## 6. Day 1 面试题练习（5题）

### Q1: 什么是 Kubernetes？它解决什么问题？
**答案要点**：
- 开源容器编排平台
- 解决容器管理、自动扩缩容、高可用、滚动更新等问题
- 让运维自动化

### Q2: Pod、Deployment、Service 分别是什么？
**答案要点**：
- Pod：最小部署单元，包含容器
- Deployment：管理 Pod 副本和更新
- Service：提供稳定网络入口

### Q3: 为什么不直接创建 Pod，而是用 Deployment？
**答案要点**：
- Deployment 提供副本管理（高可用）
- 支持滚动更新和回滚
- Pod 崩溃会自动重建

### Q4: Service 有哪几种类型？各自用途是什么？
**答案要点**：
- ClusterIP：集群内部访问
- NodePort：暴露到节点端口
- LoadBalancer：外部负载均衡

### Q5: 为什么需要 Service？
**答案要点**：
- Pod IP 不固定
- Service 提供稳定访问地址
- 自动负载均衡

---

## 7. 今日学习检查清单

- [ ] 能解释 K8s 是什么、解决什么问题
- [ ] 能说清楚 Pod、Deployment、Service 的定义和作用
- [ ] 能解释三者之间的关系
- [ ] 能回答 5 个面试题
- [ ] 理解基本的 kubectl 命令

---

## 8. 学习笔记区

（在这里记录你的学习心得和疑问）

```
笔记：




疑问：




```

---

## 明日预告

**Day 2: Pod 和 Deployment 深入**
- Pod 生命周期
- Deployment 滚动更新原理
- YAML 配置详解
