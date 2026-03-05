# Day 1 速成材料 - Kubernetes核心

**学习时间：4-6小时** | **今天必须完成**

---

## ⏰ 学习时间表

| 时段 | 模块 | 时长 | 重要性 |
|------|------|------|--------|
| **第1小时** | K8s基础三件套 | 60分钟 | ⭐⭐⭐⭐⭐ |
| **第2小时** | HPA自动扩缩容 | 60分钟 | ⭐⭐⭐⭐⭐ |
| **第3小时** | CA集群扩缩容 | 60分钟 | ⭐⭐⭐⭐⭐ |
| **第4小时** | K8s测试方法 | 60分钟 | ⭐⭐⭐⭐ |
| **第5-6小时** | 面试题背诵 | 90-120分钟 | ⭐⭐⭐⭐⭐ |

---

## 📖 第1小时：Kubernetes基础三件套

### 核心问答（10分钟背诵）

**Q1: 什么是Kubernetes？**
```
答：Kubernetes是开源的容器编排平台，用于自动化部署、扩展和管理容器化应用。

解决的问题：
✅ 容器太多难管理 → 自动编排调度
✅ 应用崩溃 → 自动重启
✅ 流量波动 → 自动扩缩容
✅ 如何不停机更新 → 滚动更新
```

**Q2: K8s核心三件套？**
```
1️⃣ Pod：最小部署单元
   - 包含一个或多个容器
   - 共享网络和存储
   - 临时的，会被重建

2️⃣ Deployment：Pod管理器
   - 管理Pod副本数量
   - 滚动更新和回滚
   - 自动重启故障Pod

3️⃣ Service：网络访问入口
   - 提供稳定的访问地址
   - 负载均衡到多个Pod
   - 三种类型：ClusterIP、NodePort、LoadBalancer
```

### 必会YAML（20分钟理解）

```yaml
# 1. Pod示例
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

---
# 2. Deployment示例
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3              # 3个Pod副本
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

---
# 3. Service示例
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP          # 集群内部访问
  selector:
    app: my-app           # 选择哪些Pod
  ports:
  - port: 80              # Service端口
    targetPort: 80        # Pod端口
```

### 关系图（10分钟记忆）

```
用户请求
   ↓
┌─────────────┐
│  Service    │  ← 稳定入口，负载均衡
│ (固定IP)    │
└──────┬──────┘
       │
   ┌───┴───┬───────┐
   ↓       ↓       ↓
┌──────┐ ┌──────┐ ┌──────┐
│ Pod1 │ │ Pod2 │ │ Pod3 │  ← 应用实例
└──────┘ └──────┘ └──────┘
   ↑       ↑       ↑
   └───────┴───────┘
          │
   ┌──────┴──────┐
   │ Deployment  │  ← 管理副本和更新
   └─────────────┘
```

### kubectl命令速记（10分钟）

```bash
# 查看资源
kubectl get pods                    # 所有Pod
kubectl get deployments             # 所有Deployment
kubectl get services               # 所有Service
kubectl get all                    # 所有资源

# 详细信息
kubectl describe pod <pod-name>    # Pod详情
kubectl logs <pod-name>            # Pod日志
kubectl logs -f <pod-name>         # 实时日志

# 创建和删除
kubectl apply -f app.yaml          # 创建/更新
kubectl delete -f app.yaml         # 删除

# 扩缩容
kubectl scale deployment my-app --replicas=5

# 滚动更新
kubectl set image deployment/my-app my-app=my-app:v2
kubectl rollout status deployment/my-app
kubectl rollout undo deployment/my-app  # 回滚
```

### 第1小时面试题（10分钟背诵）

1. **Q: Pod、Deployment、Service有什么区别？**
   A: Pod是最小单元；Deployment管理Pod副本和更新；Service提供网络入口

2. **Q: 为什么不直接创建Pod？**
   A: Deployment提供副本管理、自动重启、滚动更新、回滚能力

3. **Q: Service有哪些类型？**
   A: ClusterIP（集群内）、NodePort（节点端口）、LoadBalancer（云负载均衡）

4. **Q: 什么是滚动更新？**
   A: 逐步替换Pod，确保服务不中断。先启动新Pod，再删除旧Pod

5. **Q: 如何查看Pod日志？**
   A: kubectl logs <pod-name>

---

## 📖 第2小时：HPA（Horizontal Pod Autoscaler）

### 核心概念（15分钟）

```
HPA = 水平Pod自动扩缩容

作用：根据CPU/内存使用率自动调整Pod副本数

工作流程：
1. Metrics Server每15秒采集Pod指标
2. HPA Controller检查当前值 vs 目标值
3. 当前值 > 目标值 → 扩容（增加Pod）
4. 当前值 < 目标值 → 缩容（减少Pod，等待5分钟稳定期）
```

### HPA配置（20分钟理解）

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app              # 控制哪个Deployment
  minReplicas: 2              # 最少2个Pod
  maxReplicas: 10             # 最多10个Pod
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50  # CPU超过50%触发扩容
```

### HPA测试方法（15分钟）

```bash
# 1. 部署应用和HPA
kubectl apply -f deployment.yaml
kubectl apply -f hpa.yaml

# 2. 生成负载
kubectl run -it load-generator --rm --image=busybox -- /bin/sh
# 在Pod内执行
while true; do wget -q -O- http://my-app-service; done

# 3. 观察HPA（新终端）
kubectl get hpa -w
# 输出示例：
# NAME         REFERENCE       TARGETS   MINPODS   MAXPODS   REPLICAS
# my-app-hpa   Deployment/...  70%/50%   2         10        5

# 4. 查看Pod变化
kubectl get pods -w

# 5. 查看HPA详情
kubectl describe hpa my-app-hpa
```

### Python自动化测试HPA（10分钟）

```python
from kubernetes import client, config
import time

def test_hpa_scaling():
    """测试HPA扩缩容"""
    config.load_kube_config()
    autoscaling_v2 = client.AutoscalingV2Api()

    # 生成负载前
    hpa_before = autoscaling_v2.read_namespaced_horizontal_pod_autoscaler(
        "my-app-hpa", "default"
    )
    replicas_before = hpa_before.status.current_replicas
    print(f"负载前副本数: {replicas_before}")

    # 生成负载（省略，用kubectl或压测工具）

    # 等待HPA生效
    time.sleep(60)

    # 检查扩容
    hpa_after = autoscaling_v2.read_namespaced_horizontal_pod_autoscaler(
        "my-app-hpa", "default"
    )
    replicas_after = hpa_after.status.current_replicas
    print(f"负载后副本数: {replicas_after}")

    assert replicas_after > replicas_before, "HPA应该触发扩容"
    print("✅ HPA扩容测试通过")
```

### 第2小时面试题（必背）

1. **Q: HPA的工作原理？**
   A: Metrics Server采集Pod指标，HPA Controller每15秒检查，超过阈值就扩容

2. **Q: HPA如何触发扩容？**
   A: CPU/内存使用率超过目标值（如50%），自动增加Pod副本

3. **Q: HPA扩缩容的延迟？**
   A: 扩容快（秒级），缩容慢（5分钟稳定期，避免频繁抖动）

4. **Q: 如何测试HPA？**
   A: 用压测工具生成负载，观察HPA是否触发扩容，验证Pod数量变化

5. **Q: HPA的指标来源？**
   A: Metrics Server采集，也可用自定义指标（如RPS）

6. **Q: HPA最小/最大副本数的作用？**
   A: minReplicas保证高可用，maxReplicas限制资源消耗

---

## 📖 第3小时：CA（Cluster Autoscaler）

### 核心概念（15分钟）

```
CA = 集群自动扩缩容

作用：当Pod因资源不足无法调度时，自动添加节点

HPA vs CA对比：
┌──────────┬──────────────┬──────────────┐
│          │     HPA      │      CA      │
├──────────┼──────────────┼──────────────┤
│ 作用对象 │ Pod（应用层） │ Node（基础设施）│
│ 扩缩什么 │ Pod副本数    │ 集群节点数    │
│ 触发条件 │ CPU/内存高   │ Pod无法调度   │
│ 响应速度 │ 快（秒级）   │ 慢（分钟级）  │
│ 使用场景 │ 应用负载波动 │ 集群资源不足  │
└──────────┴──────────────┴──────────────┘
```

### CA工作流程（20分钟）

```
场景：所有Node资源已满，新Pod无法调度

步骤：
1. HPA触发扩容，要求创建10个新Pod
2. Scheduler尝试调度，发现所有Node资源不足
3. Pod状态变为Pending（等待调度）
4. CA检测到有Pod无法调度
5. CA向云平台（AWS/GCP/阿里云）请求新节点
6. 新Node启动并加入集群（2-5分钟）
7. Scheduler将Pending的Pod调度到新Node
8. Pod成功运行，系统恢复正常
```

### HPA + CA协同（15分钟）

```
完整流程示例：

1. 正常状态
   - 3个Node，每个Node运行5个Pod
   - 总共15个Pod

2. 流量激增
   - CPU使用率从30% → 80%

3. HPA触发
   - 检测到CPU > 50%
   - 从15个Pod扩到30个Pod

4. 资源不足
   - 3个Node只能跑15个Pod
   - 新增的15个Pod处于Pending状态

5. CA触发
   - 检测到15个Pending的Pod
   - 向云平台请求2个新Node

6. 系统恢复
   - 新Node加入（2分钟后）
   - 30个Pod全部运行
   - 流量处理正常

7. 流量下降（1小时后）
   - CPU降到20%
   - HPA缩容到10个Pod
   - CA缩容，删除1个空闲Node
```

### CA测试方法（10分钟）

```bash
# 模拟CA场景

# 1. 查看当前节点
kubectl get nodes
# 假设有3个Node

# 2. 创建大量Pod，耗尽资源
kubectl scale deployment my-app --replicas=100

# 3. 观察Pod状态
kubectl get pods -w
# 会看到部分Pod处于Pending状态

# 4. 查看Pending原因
kubectl describe pod <pending-pod-name>
# Events会显示：0/3 nodes available: insufficient cpu

# 5. 等待CA触发（2-5分钟）
kubectl get nodes -w
# 新节点会自动加入

# 6. 验证Pod调度
kubectl get pods
# Pending的Pod应该变为Running
```

### 第3小时面试题（必背）

1. **Q: HPA和CA的区别？**
   A: HPA扩Pod（应用层），CA扩Node（基础设施层）；HPA快（秒级），CA慢（分钟级）

2. **Q: CA什么时候触发？**
   A: Pod因资源不足无法调度时（Pending状态）

3. **Q: CA如何添加节点？**
   A: 向云平台（AWS/GCP/阿里云）请求新节点，节点启动后自动加入集群

4. **Q: HPA和CA如何协同工作？**
   A: HPA先扩Pod，资源不足时CA添加节点，Pod成功调度

5. **Q: CA缩容的条件？**
   A: 节点使用率低于50%持续10分钟，且Pod可以迁移到其他节点

6. **Q: 如何测试CA？**
   A: 创建大量Pod耗尽资源，观察是否自动添加节点，验证Pod能否调度

---

## 📖 第4小时：K8s测试方法

### 测试层次（15分钟）

```
1. 功能测试（What it does）
   ✅ Deployment能否正确创建Pod
   ✅ Service能否访问到Pod
   ✅ ConfigMap/Secret能否注入
   ✅ 滚动更新能否正常工作

2. 稳定性测试（How reliable）
   ✅ Pod崩溃是否自动重启
   ✅ HPA/CA是否稳定扩缩容
   ✅ 滚动更新是否零停机

3. 性能测试（How fast）
   ✅ Pod启动时间
   ✅ Service响应延迟
   ✅ HPA响应速度

4. 故障测试（How resilient）
   ✅ Pod故障注入
   ✅ 节点宕机影响
   ✅ 网络分区测试
```

### 自动化测试示例（20分钟）

```python
from kubernetes import client, config
import pytest

class TestKubernetes:
    @classmethod
    def setup_class(cls):
        """测试前置：加载K8s配置"""
        config.load_kube_config()
        cls.apps_v1 = client.AppsV1Api()
        cls.core_v1 = client.CoreV1Api()

    def test_deployment_ready(self):
        """测试Deployment是否就绪"""
        deployment = self.apps_v1.read_namespaced_deployment(
            "my-app", "default"
        )

        ready_replicas = deployment.status.ready_replicas
        desired_replicas = deployment.spec.replicas

        assert ready_replicas == desired_replicas, \
            f"期望{desired_replicas}个Pod就绪，实际{ready_replicas}个"

    def test_service_endpoints(self):
        """测试Service是否有后端Pod"""
        endpoints = self.core_v1.read_namespaced_endpoints(
            "my-app-service", "default"
        )

        assert endpoints.subsets is not None, "Service应该有Endpoints"
        assert len(endpoints.subsets[0].addresses) > 0, \
            "Service应该有后端Pod"

    def test_rolling_update_zero_downtime(self):
        """测试滚动更新零停机"""
        import requests
        import threading

        errors = []

        def continuous_request():
            """持续请求"""
            for _ in range(100):
                try:
                    response = requests.get("http://my-app-service")
                    if response.status_code != 200:
                        errors.append(response.status_code)
                except Exception as e:
                    errors.append(str(e))

        # 启动持续请求线程
        thread = threading.Thread(target=continuous_request)
        thread.start()

        # 触发滚动更新
        self.apps_v1.patch_namespaced_deployment(
            "my-app", "default",
            body={"spec": {"template": {"spec": {"containers": [{
                "name": "my-app",
                "image": "my-app:v2"
            }]}}}}
        )

        # 等待线程结束
        thread.join()

        # 验证无错误
        assert len(errors) == 0, f"滚动更新期间有{len(errors)}个请求失败"
```

### 测试工具链（15分钟）

```
1. kubectl - 命令行测试
   kubectl get pods
   kubectl describe pod <name>
   kubectl logs <name>

2. Python kubernetes库 - 自动化脚本
   pip install kubernetes
   适合：功能测试、集成测试

3. K6/Locust - 负载测试
   用于触发HPA，性能测试

4. Chaos Mesh - 故障注入
   Pod故障、网络故障、资源压力

5. Helm test - Chart测试
   helm test <release-name>
```

### 常见问题排查（10分钟）

```bash
# Pod启动失败
kubectl describe pod <pod-name>  # 查看Events
# 常见原因：镜像拉取失败、资源不足、配置错误

# Pod崩溃循环
kubectl logs <pod-name>          # 查看日志
kubectl logs <pod-name> --previous  # 查看上次日志

# HPA不工作
kubectl top pods                 # 检查Metrics Server
kubectl describe hpa <hpa-name>  # 查看HPA详情
# 常见原因：Metrics Server未安装、资源请求未设置

# Service无法访问
kubectl get endpoints <service-name>  # 检查后端Pod
kubectl describe service <service-name>
# 常见原因：Label选择器不匹配、Pod未就绪
```

---

## 📖 第5-6小时：面试题速记

### K8s基础（8题 - 20分钟）

1. **Q: 什么是Kubernetes？**
   A: 开源容器编排平台，自动化部署、扩展和管理容器应用

2. **Q: Pod、Deployment、Service的区别？**
   A: Pod是最小单元；Deployment管理Pod副本和更新；Service提供网络入口

3. **Q: 为什么Pod需要Deployment？**
   A: 提供副本管理、滚动更新、自动重启

4. **Q: Service类型？**
   A: ClusterIP（集群内）、NodePort（节点端口）、LoadBalancer（云LB）

5. **Q: K8s如何实现高可用？**
   A: 多副本、自动重启、滚动更新、HPA/CA

6. **Q: 什么是滚动更新？**
   A: 逐步替换Pod，确保服务不中断

7. **Q: ConfigMap和Secret区别？**
   A: ConfigMap存配置，Secret存敏感数据（加密）

8. **Q: Namespace作用？**
   A: 资源隔离，多环境部署

### HPA/CA（6题 - 15分钟）

9. **Q: HPA工作原理？**
   A: 根据CPU/内存自动调整Pod副本数

10. **Q: HPA如何触发扩容？**
    A: Metrics Server采集指标，超过阈值触发扩容

11. **Q: CA作用？**
    A: 集群资源不足时自动添加节点

12. **Q: HPA和CA区别？**
    A: HPA扩Pod（应用层），CA扩Node（基础设施层）

13. **Q: HPA扩缩容延迟？**
    A: 扩容快（秒级），缩容慢（5分钟稳定期）

14. **Q: 如何测试HPA？**
    A: 负载测试触发CPU升高，观察Pod数量变化

### K8s测试（6题 - 15分钟）

15. **Q: 如何测试K8s稳定性？**
    A: 故障注入、Pod重启、节点宕机测试

16. **Q: 如何验证Deployment就绪？**
    A: kubectl get deployment，检查READY列

17. **Q: 如何排查Pod启动失败？**
    A: kubectl describe pod + kubectl logs

18. **Q: 如何测试Service负载均衡？**
    A: 多次请求，检查分发到不同Pod

19. **Q: 如何自动化测试K8s？**
    A: Python kubernetes库 + pytest框架

20. **Q: 如何测试零停机部署？**
    A: 滚动更新期间持续请求，检查无失败

### 项目经验准备（STAR法则 - 40分钟）

**项目1：Cypress自动化测试框架**
```
Situation（背景）：
项目需要对IWSVA系统进行全面测试，手动测试效率低

Task（任务）：
搭建E2E自动化测试框架，覆盖9个组件的77个测试用例

Action（行动）：
1. 设计分层架构：Page Object + Workflow + Test
2. 开发ComponentRegistry作为数据中心
3. 实现多层验证：UI + Backend + Log
4. 集成CI/CD流水线

Result（结果）：
✅ 测试覆盖率达到90%
✅ 回归测试时间从2天减少到2小时
✅ 发现15个关键Bug
```

**项目2：CI/CD流水线搭建**
```
Situation：
团队没有自动化部署流程，发布慢且易出错

Task：
搭建CI/CD流水线，实现自动化测试和部署

Action：
1. 用GitHub Actions设计双层策略
   - PR快速检查（2-3分钟）
   - Main分支完整测试（5-8分钟）
2. Docker容器化测试环境
3. 并行执行Cypress + Newman测试
4. 生成多格式报告

Result：
✅ 部署时间从1小时减少到10分钟
✅ 测试通过率100%
✅ 团队效率提升50%
```

### 自我介绍（2分钟版 - 背熟）

```
"您好，我有X年测试经验，专注于自动化测试。

技术栈：
✅ 熟练掌握Python，有完整的自动化测试框架开发经验
✅ 系统学习了Kubernetes，理解Pod、Deployment、Service等核心概念
✅ 了解HPA/CA自动扩缩容机制和测试方法
✅ 有CI/CD流水线搭建经验

项目经验：
✅ 开发过Cypress E2E测试框架，77个测试用例
✅ 搭建过Docker + GitHub Actions CI/CD流水线
✅ 有API测试（Postman/Newman）和UI测试经验

优势：
✅ 学习能力强：2天系统学习了K8s和云平台测试
✅ 问题分析能力强：能定位复杂的系统问题
✅ 有测试工具开发能力：Python自动化脚本

我对云平台测试很感兴趣，希望能在这个领域深入发展。"
```

---

## ✅ Day 1 完成清单

在今天结束前，确保你能做到：

- [ ] 能用2分钟解释K8s是什么
- [ ] 能说清楚Pod、Deployment、Service的作用和关系
- [ ] 能解释HPA的工作原理和触发条件
- [ ] 能解释CA的工作原理和与HPA的区别
- [ ] 能描述HPA + CA的协同工作流程
- [ ] 能说出K8s的4种测试层次
- [ ] 能说出至少3种K8s测试工具
- [ ] 背下20道核心面试题
- [ ] 准备好2个项目案例（STAR格式）
- [ ] 背熟自我介绍

---

## 📝 今日学习笔记区

```
重点记忆：




疑问/难点：




明天需要重点复习：




```

---

**今天的目标：打好理论基础，准备好K8s核心面试问题**
**明天的任务：混沌工程 + 50道面试题速记 + 模拟面试**

加油！💪
