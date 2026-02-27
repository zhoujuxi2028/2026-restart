# Day 1: Kubernetes 基础概念

**学习时间**：1小时
**日期**：________
**完成度**：⬜

---

## 🎯 今日学习目标

学完今天的内容后，你应该能够：
- [ ] 用 1-2 句话解释 K8s 是什么
- [ ] 说出 K8s 解决的 3 个核心问题
- [ ] 解释 Pod、Deployment、Service 的作用
- [ ] 说出 K8s 适合什么场景

---

## 1. Kubernetes 是什么？（5分钟）

### 简单定义
**Kubernetes（K8s）** 是一个开源的**容器编排平台**，用于自动化部署、扩展和管理容器化应用程序。

💡 **类比理解**：
- **Docker** = 集装箱（打包应用）
- **Kubernetes** = 港口调度系统（管理成百上千个集装箱）

### K8s 的名字
- **Kubernetes** = 希腊语"舵手"或"飞行员"
- **K8s** = K + 8个字母 + s（简写）
- **Logo** = 舵轮（象征导航和控制）

---

## 2. K8s 解决什么问题？（10分钟）

### 没有 K8s 的痛点

假设你有一个 Web 应用，使用 Docker 容器运行：

**问题 1：扩展困难**
- 流量增加，需要从 1个容器扩展到 10个容器
- 手动启动、停止、监控 10个容器？太累了！

**问题 2：容器挂了怎么办？**
- 容器崩溃了，需要手动重启
- 半夜 3点容器挂了，没人发现？用户体验糟糕！

**问题 3：负载均衡**
- 10个容器运行，用户请求该发给哪一个？
- 需要手动配置负载均衡器

**问题 4：多机器部署**
- 1台服务器不够，需要 10台服务器
- 如何决定每个容器运行在哪台服务器上？
- 某台服务器资源不足怎么办？

### K8s 的解决方案

✅ **自动扩展**：一条命令，从 1个容器扩展到 100个
✅ **自我修复**：容器挂了，K8s 自动重启
✅ **负载均衡**：自动分配流量到健康的容器
✅ **资源调度**：智能分配容器到最合适的服务器
✅ **滚动更新**：发布新版本时，无缝切换，零停机
✅ **配置管理**：统一管理应用配置和密钥

---

## 3. K8s 核心概念（30分钟）

### 3.1 集群架构

```
Kubernetes 集群
├── Master 节点（控制平面）
│   ├── API Server    ← 集群的大脑，接收所有命令
│   ├── Scheduler     ← 决定容器运行在哪个节点
│   ├── Controller    ← 监控集群状态，确保期望状态
│   └── etcd          ← 数据库，存储集群所有数据
│
└── Worker 节点（工作节点）
    ├── kubelet       ← 管理本节点上的容器
    ├── kube-proxy    ← 网络代理，处理流量
    └── Container Runtime (Docker)
```

**简单理解**：
- **Master 节点** = 指挥部（下达命令，监控状态）
- **Worker 节点** = 士兵（执行任务，运行容器）

---

### 3.2 核心对象：Pod

#### 什么是 Pod？
**Pod** 是 Kubernetes 中**最小的部署单元**，包含一个或多个容器。

💡 **类比**：
- **容器（Container）** = 一个人
- **Pod** = 一个房间（可以住 1个人或多个人）

#### 为什么需要 Pod？
在 Kubernetes 中，**你不直接管理容器，而是管理 Pod**。

**典型场景**：
```
Pod
├── 主容器：Web 应用（nginx）
└── 辅助容器：日志收集器（filebeat）
    ↑ 两个容器共享存储和网络
```

#### Pod 的特点
- ✅ **共享网络**：Pod 内的容器共享 IP 地址
- ✅ **共享存储**：Pod 内的容器可以共享数据卷
- ✅ **生命周期**：Pod 内的容器一起启动、一起停止
- ⚠️ **临时性**：Pod 可能随时被删除和重建（IP 会变）

#### YAML 示例
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
```

**解释**：
- 创建一个名为 `nginx-pod` 的 Pod
- 运行 nginx 容器，暴露 80 端口

---

### 3.3 核心对象：Deployment

#### 什么是 Deployment？
**Deployment** 是用于**管理 Pod 生命周期**的控制器。

💡 **类比**：
- **Pod** = 一个士兵
- **Deployment** = 部队司令（管理 10个士兵，有人牺牲了立即补充新兵）

#### 为什么需要 Deployment？
如果直接创建 Pod，Pod 挂了就没了。Deployment 提供：
- ✅ **副本管理**：指定运行 3个 Pod，K8s 确保始终运行 3个
- ✅ **自我修复**：Pod 挂了，自动重建
- ✅ **滚动更新**：发布新版本时，逐步替换旧 Pod
- ✅ **回滚**：新版本有问题，一键回滚到旧版本

#### 核心功能：副本管理
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3  # ← 始终运行 3个 Pod
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

**解释**：
- 创建一个 Deployment
- 管理 3个 nginx Pod
- 如果某个 Pod 挂了，自动重建

#### 核心功能：滚动更新
```bash
# 更新镜像版本
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# K8s 自动执行：
# 1. 创建 1个新版本 Pod
# 2. 等待新 Pod 就绪
# 3. 删除 1个旧版本 Pod
# 4. 重复直到所有 Pod 更新完成
```

**优点**：
- 零停机时间
- 随时可以暂停、继续、回滚

---

### 3.4 核心对象：Service

#### 什么是 Service？
**Service** 是一个**稳定的网络端点**，用于访问一组 Pod。

💡 **类比**：
- **Pod** = 士兵（随时可能换人，编号会变）
- **Service** = 部队番号（番号不变，找番号就能找到士兵）

#### 为什么需要 Service？
**问题**：Pod 的 IP 地址会变！
- Pod 重建后，IP 地址改变
- Deployment 管理多个 Pod，每个 Pod 都有不同的 IP
- 如何稳定地访问应用？

**解决方案**：Service 提供一个**固定的 IP 和 DNS 名称**，自动负载均衡到后端的 Pod。

#### Service 类型

| 类型 | 用途 | 访问方式 |
|------|------|---------|
| **ClusterIP** | 集群内部访问 | 只能在集群内部访问 |
| **NodePort** | 集群外部访问 | 通过节点 IP + 端口访问 |
| **LoadBalancer** | 云平台负载均衡器 | 云厂商提供的公网 IP |

#### YAML 示例
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: ClusterIP
  selector:
    app: nginx  # ← 选择标签为 app=nginx 的 Pod
  ports:
  - port: 80        # Service 端口
    targetPort: 80  # Pod 端口
```

**工作原理**：
```
用户请求 → nginx-service:80 → 自动负载均衡 → Pod1、Pod2、Pod3
```

---

## 4. K8s 三大核心对象总结（5分钟）

### 对比表格

| 对象 | 作用 | 类比 |
|------|------|------|
| **Pod** | 运行容器的最小单元 | 一个房间（住 1-N 个容器） |
| **Deployment** | 管理 Pod 的生命周期 | 部队司令（管理士兵） |
| **Service** | 提供稳定的网络访问 | 部队番号（稳定的访问入口） |

### 典型架构
```
用户请求
    ↓
Service（负载均衡）
    ↓
Deployment（管理 3个 Pod）
    ├── Pod 1 (nginx)
    ├── Pod 2 (nginx)
    └── Pod 3 (nginx)
```

### 实际例子
```bash
# 1. 创建 Deployment（自动创建 3个 Pod）
kubectl create deployment nginx --image=nginx --replicas=3

# 2. 创建 Service（暴露 Deployment）
kubectl expose deployment nginx --port=80 --type=NodePort

# 3. 查看结果
kubectl get pods       # 看到 3个 nginx Pod
kubectl get service    # 看到 nginx Service
```

---

## 5. K8s 适合什么场景？（5分钟）

### ✅ 适合使用 K8s

1. **大规模微服务**：几十个、上百个服务
2. **高可用要求**：需要自动故障恢复
3. **频繁发布**：每天发布多次，需要零停机
4. **弹性伸缩**：流量波动大，需要自动扩缩容
5. **多环境管理**：开发、测试、生产环境统一管理

### ❌ 不适合使用 K8s

1. **小项目**：只有 1-2个服务，用 Docker Compose 更简单
2. **团队无经验**：学习曲线陡峭，需要投入时间
3. **简单应用**：单体应用，不需要复杂编排

---

## 6. 面试重点（5分钟）

### 核心问题

**Q1: Kubernetes 是什么？**
> Kubernetes 是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用。它解决了容器在生产环境中的调度、负载均衡、自我修复等问题。

**Q2: Pod、Deployment、Service 有什么区别？**
> - **Pod** 是最小部署单元，运行容器
> - **Deployment** 管理 Pod 的生命周期，提供副本管理、滚动更新、自我修复
> - **Service** 提供稳定的网络访问入口，将流量负载均衡到 Pod

**Q3: 为什么需要 Kubernetes？**
> K8s 解决了容器化应用在生产环境的 3 大问题：
> 1. **扩展性**：自动扩缩容，应对流量波动
> 2. **高可用**：自动故障恢复，保证服务稳定
> 3. **自动化**：滚动更新、负载均衡、资源调度全自动化

---

## 7. 今日作业（选做）

- [ ] 用自己的话总结：K8s 是什么？（不超过 50字）
- [ ] 画一张图：Service → Deployment → Pod 的关系
- [ ] 思考：你的测试项目如何使用 K8s？

---

## 📝 学习笔记

**我学到的最重要的 3 点**：
1.
2.
3.

**我的疑问**：


**明天计划**：
- Day 2: Pod 与 Deployment 深入学习

---

## ✅ 自我检查

学完今天的内容，你能做到吗？

- [ ] 用 1-2 句话解释 K8s 是什么
- [ ] 说出 K8s 解决的 3 个核心问题
- [ ] 解释 Pod、Deployment、Service 的作用
- [ ] 说出 K8s 适合什么场景

**完成打卡**：Day 1 ✅

---

## 📚 参考资料

- BASF K8s 资料：`jobs/BASF/interview-prep/day-06-devops-containers/01-core-concepts.md`（第 318-451 行）
- K8s 官方文档：https://kubernetes.io/zh-cn/docs/concepts/
