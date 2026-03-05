# Day 2 速成材料 - 混沌工程 + 面试冲刺

**学习时间：4-6小时** | **明天必须完成**

---

## ⏰ 学习时间表

| 时段 | 模块 | 时长 | 重要性 |
|------|------|------|--------|
| **第1小时** | 混沌工程理论 | 60分钟 | ⭐⭐⭐⭐ |
| **第2小时** | 故障注入实践 | 60分钟 | ⭐⭐⭐⭐ |
| **第3小时** | 告警与预案 + 分布式测试 | 60分钟 | ⭐⭐⭐ |
| **第4-5小时** | 50道面试题背诵 | 120分钟 | ⭐⭐⭐⭐⭐ |
| **第6小时** | 模拟面试 | 60分钟 | ⭐⭐⭐⭐⭐ |

---

## 📖 第1小时：混沌工程理论

### 核心定义（10分钟背诵）

```
混沌工程 = 通过主动注入故障验证系统稳定性的实践

核心思想：
✅ 不等待故障发生，主动制造故障
✅ 在生产环境（或类生产）验证系统韧性
✅ 提前发现系统薄弱点
✅ 持续提升系统容错能力

为什么需要？
❌ 分布式系统复杂，故障不可避免
❌ 被动等待故障代价太高（生产事故）
✅ 需要主动验证系统能否抵御故障
```

### 混沌工程五大原则（20分钟）

```
1️⃣ 定义稳态假设
   "系统正常时应该是什么样的？"

   示例：
   ✅ API响应时间 < 200ms
   ✅ 错误率 < 0.1%
   ✅ 订单成功率 > 99%

2️⃣ 模拟真实世界事件
   真实故障类型：
   🔥 Pod崩溃（应用故障）
   🔥 网络延迟/丢包（网络故障）
   🔥 CPU/内存压力（资源不足）
   🔥 节点宕机（硬件故障）
   🔥 依赖服务超时（外部依赖）

3️⃣ 在生产环境运行实验
   阶段性推进：
   📍 阶段1：测试环境小规模试验
   📍 阶段2：生产环境单个服务
   📍 阶段3：生产环境全链路
   📍 阶段4：定期自动化运行

4️⃣ 自动化实验
   持续验证：
   ⏰ 每周自动运行混沌实验
   ⏰ 每次发布后验证稳定性
   ⏰ 大促前压力测试 + 混沌测试

5️⃣ 最小化爆炸半径
   风险控制：
   🛡️ 限制影响范围（如只影响10%流量）
   🛡️ 设置超时和回滚机制
   🛡️ 实时监控，异常立即停止
   🛡️ 从小范围开始，逐步扩大
```

### 混沌工程 vs 其他测试（10分钟）

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│             │   功能测试   │   压力测试   │  混沌工程    │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ 目的        │ 验证功能正确 │ 验证性能极限 │ 验证容错能力 │
│ 方法        │ 正常输入     │ 大量负载     │ 注入故障     │
│ 环境        │ 测试环境     │ 测试环境     │ 生产环境     │
│ 关注点      │ 业务逻辑     │ 吞吐量/延迟  │ 系统韧性     │
│ 示例        │ 下单成功     │ 1万并发下单  │ Pod崩溃仍可用│
└─────────────┴──────────────┴──────────────┴──────────────┘
```

### 混沌工程典型场景（20分钟）

```
场景1：Pod崩溃
稳态假设：服务可用性 > 99.9%
实验步骤：
  1. 随机杀死一个Pod
  2. 观察服务是否中断
  3. 验证Pod是否自动重启
  4. 验证流量是否自动切换到其他Pod
期望结果：服务无感知，自动恢复

场景2：网络延迟
稳态假设：API响应时间 < 200ms
实验步骤：
  1. 注入100ms网络延迟
  2. 观察API响应时间
  3. 观察用户体验是否受影响
  4. 验证超时和重试机制
期望结果：有降级方案，用户体验可接受

场景3：依赖服务故障
稳态假设：核心功能可用
实验步骤：
  1. 模拟数据库连接失败
  2. 观察服务是否崩溃
  3. 验证降级和熔断机制
  4. 验证错误提示是否友好
期望结果：降级到缓存，核心功能可用

场景4：资源压力
稳态假设：系统在资源压力下稳定
实验步骤：
  1. 注入CPU 80%压力
  2. 观察HPA是否触发扩容
  3. 验证扩容后系统恢复
  4. 验证OOM（内存溢出）保护
期望结果：HPA自动扩容，系统稳定
```

### 第1小时面试题（必背）

1. **Q: 什么是混沌工程？**
   A: 通过主动注入故障验证系统稳定性的实践

2. **Q: 混沌工程的核心原则？**
   A: 定义稳态、模拟真实故障、生产环境实验、自动化、最小化影响

3. **Q: 为什么需要混沌工程？**
   A: 分布式系统复杂，主动验证容错能力，提前发现薄弱点

4. **Q: 混沌工程和压力测试的区别？**
   A: 混沌工程注入故障验证韧性，压力测试增加负载验证性能

5. **Q: 什么是稳态假设？**
   A: 系统正常运行时的指标，如API响应时间 < 200ms，错误率 < 0.1%

---

## 📖 第2小时：故障注入实践

### Chaos Mesh简介（10分钟）

```
Chaos Mesh = Kubernetes原生的混沌工程平台

特点：
✅ 云原生设计，K8s资源管理
✅ 支持多种故障类型
✅ Web UI可视化操作
✅ 安全控制（Namespace隔离）

安装：
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm install chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --create-namespace

访问：kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
```

### 5种故障类型（30分钟）

#### 1️⃣ PodChaos - Pod故障

```yaml
# pod-kill: 杀死Pod
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-kill-test
spec:
  action: pod-kill
  mode: one              # 每次杀一个Pod（也可用：all、fixed、percent）
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  scheduler:
    cron: "@every 2m"    # 每2分钟执行一次

---
# pod-failure: Pod不可用
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure-test
spec:
  action: pod-failure
  mode: one
  duration: "30s"        # 持续30秒
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
```

**测试步骤**：
```bash
# 1. 应用PodChaos
kubectl apply -f podchaos.yaml

# 2. 观察Pod状态
kubectl get pods -w

# 3. 观察服务可用性
while true; do
  curl http://my-app-service
  sleep 1
done

# 4. 验证自愈能力
kubectl describe pod <new-pod-name>
# 检查是否自动重启

# 5. 删除实验
kubectl delete -f podchaos.yaml
```

#### 2️⃣ NetworkChaos - 网络故障

```yaml
# delay: 网络延迟
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay-test
spec:
  action: delay
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  delay:
    latency: "100ms"     # 增加100ms延迟
    jitter: "10ms"       # ±10ms抖动
  duration: "1m"

---
# loss: 丢包
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-loss-test
spec:
  action: loss
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  loss:
    loss: "10"           # 10%丢包率
  duration: "1m"

---
# partition: 网络分区
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-partition-test
spec:
  action: partition
  mode: all
  selector:
    namespaces:
      - default
    labelSelectors:
      app: service-a
  direction: to
  target:
    mode: all
    selector:
      namespaces:
        - default
      labelSelectors:
        app: service-b
  duration: "30s"
```

#### 3️⃣ StressChaos - 资源压力

```yaml
# CPU压力
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: stress-cpu-test
spec:
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  stressors:
    cpu:
      workers: 2         # 2个CPU压力进程
      load: 80           # 80% CPU使用率
  duration: "2m"

---
# 内存压力
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: stress-memory-test
spec:
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  stressors:
    memory:
      workers: 1
      size: "256MB"      # 占用256MB内存
  duration: "2m"
```

#### 4️⃣ IOChaos - IO故障

```yaml
# IO延迟
apiVersion: chaos-mesh.org/v1alpha1
kind: IOChaos
metadata:
  name: io-delay-test
spec:
  action: latency
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  volumePath: /data
  path: /data/*
  delay: "100ms"
  percent: 50            # 50%的IO操作延迟
  duration: "1m"
```

#### 5️⃣ TimeChaos - 时钟偏移

```yaml
# 时间跳变
apiVersion: chaos-mesh.org/v1alpha1
kind: TimeChaos
metadata:
  name: time-shift-test
spec:
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      app: my-app
  timeOffset: "-1h"      # 时钟回退1小时
  duration: "5m"
```

### 测试HPA的混沌实验（10分钟）

```yaml
# 实验：Pod崩溃 + 资源压力，验证HPA
apiVersion: chaos-mesh.org/v1alpha1
kind: Workflow
metadata:
  name: hpa-chaos-test
spec:
  entry: hpa-test
  templates:
  - name: hpa-test
    templateType: Serial
    children:
    - stress-cpu       # 1. CPU压力触发HPA扩容
    - pod-kill         # 2. 扩容期间杀死Pod
    - validate         # 3. 验证系统稳定

  - name: stress-cpu
    templateType: StressChaos
    deadline: 2m
    stressChaos:
      mode: one
      selector:
        labelSelectors:
          app: my-app
      stressors:
        cpu:
          workers: 2
          load: 80

  - name: pod-kill
    templateType: PodChaos
    podChaos:
      action: pod-kill
      mode: one
      selector:
        labelSelectors:
          app: my-app

  - name: validate
    templateType: Task
    task:
      container:
        name: validate
        image: curlimages/curl
        command: ["sh", "-c"]
        args:
        - |
          for i in {1..60}; do
            curl -f http://my-app-service || exit 1
            sleep 1
          done
```

### 第2小时面试题（必背）

6. **Q: Chaos Mesh支持哪些故障类型？**
   A: PodChaos、NetworkChaos、StressChaos、IOChaos、TimeChaos

7. **Q: PodChaos有哪些action？**
   A: pod-kill（杀死）、pod-failure（不可用）、container-kill

8. **Q: 如何注入网络延迟？**
   A: 用NetworkChaos的delay action，指定latency和jitter

9. **Q: 如何测试HPA在故障时的表现？**
   A: 注入CPU压力触发HPA，同时杀死Pod，验证自愈和扩容

10. **Q: 混沌实验失败了怎么办？**
    A: 立即停止实验，分析日志，修复问题，小范围重试

---

## 📖 第3小时：告警与预案 + 分布式测试

### 告警治理（20分钟）

```
监控栈：Prometheus + Alertmanager + Grafana

告警流程：
1. Prometheus收集指标（CPU、内存、请求量）
2. 触发告警规则（如CPU > 80%持续5分钟）
3. Alertmanager分组、去重、路由
4. 发送通知（邮件、钉钉、PagerDuty）
```

**告警规则示例**：
```yaml
groups:
- name: pod-alerts
  rules:
  - alert: PodMemoryHigh
    expr: |
      container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Pod内存使用超过90%"
      description: "{{ $labels.pod }} 内存: {{ $value | humanizePercentage }}"

  - alert: PodCrashLooping
    expr: |
      rate(kube_pod_container_status_restarts_total[15m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Pod频繁重启"
```

**告警优化**：
```
常见问题：
❌ 告警风暴：短时间大量告警
❌ 告警疲劳：太多无效告警
❌ 漏报：关键问题没告警

优化方法：
✅ 告警分级：Critical > Warning > Info
✅ 告警聚合：同一服务的告警合并
✅ 告警抑制：主服务故障时抑制下游告警
✅ 告警静默：维护期间临时静默
✅ 告警质量：减少误报，提高准确率
```

### 预案设计（20分钟）

```
预案模板：

故障类型：Pod持续重启（CrashLoopBackOff）
触发条件：Pod重启次数 > 5次/10分钟
影响范围：服务部分不可用
严重等级：Critical

应急步骤：
1. 立即检查Pod日志
   kubectl logs <pod> --previous

2. 检查资源限制
   kubectl describe pod <pod>
   # 查看Events和Resource Requests/Limits

3. 检查依赖服务
   kubectl get svc
   kubectl get endpoints

4. 临时处理
   - 如果是OOM：增加内存限制
   - 如果是配置错误：修复ConfigMap
   - 如果是镜像问题：回滚版本

5. 回滚到上一版本
   kubectl rollout undo deployment <name>

6. 验证恢复
   kubectl get pods
   curl http://service

7. 通知开发团队
   钉钉群通知 + Jira工单

恢复时间：< 15分钟
后续优化：根因分析 + 故障复盘

---

故障类型：HPA扩容失败
触发条件：CPU高但Pod数量不增加
影响范围：服务响应慢
严重等级：Warning

应急步骤：
1. 检查HPA状态
   kubectl get hpa
   kubectl describe hpa <name>

2. 检查Metrics Server
   kubectl top pods
   # 如果无输出，Metrics Server故障

3. 检查资源配额
   kubectl describe quota
   # 是否达到Namespace限制

4. 检查CA状态（如果需要）
   kubectl get nodes
   # 节点资源是否充足

5. 临时处理
   - 手动扩容：kubectl scale deployment <name> --replicas=10
   - 重启Metrics Server：kubectl rollout restart -n kube-system deployment/metrics-server

6. 验证恢复
   kubectl get hpa -w
   # 观察HPA是否正常工作

恢复时间：< 10分钟
```

### 分布式系统测试（20分钟）

```
分布式系统挑战：
1. 网络不可靠：延迟、丢包、分区
2. 部分失败：某些节点故障，系统继续运行
3. 一致性问题：数据同步延迟
4. 可观测性差：日志、指标分散

测试策略：
✅ 功能测试：跨服务调用、数据一致性
✅ 性能测试：延迟、吞吐量、跨集群通信
✅ 稳定性测试：部分节点故障、网络分区、降级
✅ 容灾测试：跨Region故障切换、数据恢复

跨集群测试方法：
1. 部署多集群环境（如主集群 + 灾备集群）
2. 模拟主集群故障
3. 验证流量自动切换
4. 验证数据同步一致性
5. 验证恢复时间（RTO/RPO）

测试工具：
- Chaos Mesh：注入网络故障
- Kubernetes多集群工具：Kubefed
- 分布式追踪：Jaeger/Zipkin
- 监控：Prometheus Federation
```

### 第3小时面试题（必背）

11. **Q: 告警分级有哪些？**
    A: Critical（立即处理）、Warning（需关注）、Info（信息）

12. **Q: 如何避免告警风暴？**
    A: 告警聚合、抑制、分组、静默

13. **Q: 预案包含哪些内容？**
    A: 故障类型、触发条件、影响范围、应急步骤、恢复时间

14. **Q: 分布式系统的主要挑战？**
    A: 网络不可靠、部分失败、一致性、可观测性

15. **Q: 如何测试跨集群故障切换？**
    A: 模拟主集群故障，验证流量是否切到备集群，验证数据一致性

---

## 📖 第4-5小时：50道面试题全背诵

### Day1回顾：K8s + HPA/CA（20题 - 30分钟）

1-20题见Day1材料，今天快速复习一遍

### Day2新增：混沌工程 + 综合（30题 - 90分钟）

**混沌工程（10题）**

21. Q: 什么是混沌工程？
    A: 通过主动注入故障验证系统稳定性的实践

22. Q: 混沌工程的核心原则？
    A: 定义稳态、模拟真实故障、生产环境实验、自动化、最小化影响

23. Q: 常见的故障注入类型？
    A: Pod故障、网络故障、资源压力、IO故障、时钟偏移

24. Q: Chaos Mesh是什么？
    A: Kubernetes原生的混沌工程平台

25. Q: 如何测试系统的自愈能力？
    A: 用PodChaos杀死Pod，观察是否自动重启和流量切换

26. Q: 如何注入网络延迟？
    A: 用NetworkChaos的delay类型，指定latency和jitter

27. Q: 混沌实验失败了怎么办？
    A: 立即停止实验，分析原因，修复问题后小范围重试

28. Q: 混沌工程和压力测试的区别？
    A: 混沌工程注入故障验证韧性，压力测试增加负载验证性能

29. Q: 如何设计混沌实验？
    A: 定义稳态 → 选择故障类型 → 小范围试验 → 扩大范围 → 自动化

30. Q: 混沌工程的价值？
    A: 提前发现系统薄弱点，提升韧性，减少生产故障

**告警与预案（5题）**

31. Q: 告警分级有哪些？
    A: Critical（需立即处理）、Warning（需关注）、Info（信息）

32. Q: 如何避免告警风暴？
    A: 告警聚合、抑制、分组、静默

33. Q: 什么是告警疲劳？
    A: 告警太多太频繁，导致忽视重要告警

34. Q: 预案包含哪些内容？
    A: 故障类型、触发条件、影响范围、应急步骤、恢复时间

35. Q: 如何设计有效的预案？
    A: 覆盖常见故障、步骤清晰、定期演练、持续更新

**分布式系统（5题）**

36. Q: 分布式系统的主要挑战？
    A: 网络不可靠、部分失败、一致性、可观测性

37. Q: 如何测试分布式系统一致性？
    A: 数据写入后，在多个节点验证数据一致

38. Q: 什么是网络分区？
    A: 部分节点网络中断，无法通信

39. Q: 如何测试跨集群故障切换？
    A: 模拟主集群故障，验证流量是否切到备集群

40. Q: 分布式链路追踪的作用？
    A: 跟踪请求在微服务间的调用路径，定位性能瓶颈

**综合测试（10题）**

41. Q: 你如何保证云平台测试质量？
    A: 自动化测试 + 混沌工程 + 监控告警 + 回归测试

42. Q: 如何设计自动化测试框架？
    A: 模块化、可复用、清晰断言、持续集成

43. Q: 测试环境如何隔离？
    A: 使用Namespace、独立集群、数据隔离

44. Q: 如何测试滚动更新？
    A: 更新过程中持续请求，验证无中断

45. Q: 如何提升测试覆盖率？
    A: 单元测试 + 集成测试 + 端到端测试 + 混沌测试

46. Q: 如何处理测试环境不稳定？
    A: 定期重建环境、资源限制、自动清理

47. Q: 你用过哪些测试工具？
    A: Python、Pytest、Kubernetes库、Chaos Mesh、K6、Cypress

48. Q: 如何定位复杂问题？
    A: 日志分析、指标监控、分布式追踪、故障复现

49. Q: CI/CD中如何集成测试？
    A: 代码提交 → 单元测试 → 构建镜像 → 集成测试 → 部署

50. Q: 你最擅长的测试领域？
    A: 自动化测试、云平台测试、稳定性测试

---

## 📖 第6小时：模拟面试

### 自我介绍（2分钟 - 背熟）

```
"您好，我有X年测试经验，专注于自动化测试和云平台测试。

技术栈：
✅ 熟练掌握Python，有完整的自动化测试框架开发经验
✅ 系统学习了Kubernetes，理解Pod、Deployment、Service等核心概念
✅ 了解HPA/CA自动扩缩容机制和测试方法
✅ 学习了混沌工程理论，了解Chaos Mesh等工具
✅ 有CI/CD流水线搭建经验

项目经验：
✅ 开发过Cypress E2E测试框架，77个测试用例，覆盖率90%
✅ 搭建过Docker + GitHub Actions CI/CD流水线
✅ 有API测试（Postman/Newman）和UI测试（Selenium）经验

优势：
✅ 学习能力强：2天系统学习了K8s、HPA/CA、混沌工程
✅ 问题分析能力强：能定位复杂的分布式系统问题
✅ 有测试工具开发能力：Python自动化脚本、测试框架

我对云平台测试很感兴趣，希望能在这个领域深入发展。"
```

### 技术问题模拟（30分钟）

**基础问题**：
1. 解释一下K8s的核心组件？
2. HPA和CA有什么区别？
3. 什么是混沌工程？

**进阶问题**：
4. 如何测试HPA在Pod崩溃时的表现？
5. 如何设计一个K8s集群的自动化测试框架？
6. 遇到过哪些复杂的测试问题？如何解决的？

**场景问题**：
7. 如果生产环境Pod频繁重启，你如何排查？
8. 如何验证滚动更新的零停机？
9. 如果HPA不工作，可能是哪些原因？

### 项目经验（STAR法则 - 20分钟）

**项目1：Cypress自动化测试框架**
```
Situation：
项目需要对IWSVA系统进行全面测试，手动测试效率低，回归测试耗时2天

Task：
搭建E2E自动化测试框架，覆盖9个组件的77个测试用例

Action：
1. 设计分层架构：Page Object + Workflow + Test Layer
2. 开发ComponentRegistry作为单一数据源
3. 实现多层验证：UI层 + Backend层 + Log层 + Business层
4. 集成CI/CD流水线，每次提交自动运行
5. 使用数据驱动测试，参数化测试用例

Result：
✅ 测试覆盖率从30%提升到90%
✅ 回归测试时间从2天减少到2小时
✅ 发现并修复15个关键Bug
✅ 团队测试效率提升70%
```

**项目2：CI/CD流水线**
```
Situation：
团队没有自动化部署流程，发布慢（1小时），容易出错

Task：
搭建CI/CD流水线，实现自动化测试和部署

Action：
1. 设计双层CI/CD策略
   - PR层：快速检查（Lint + Unit Test，2-3分钟）
   - Main层：完整测试（E2E + API + Docker，5-8分钟）
2. Docker容器化测试环境，确保一致性
3. 并行执行Cypress（16 tests）+ Newman（18 assertions）
4. 生成多格式报告（HTML + JUnit + Screenshots）
5. 智能缓存依赖，加速构建

Result：
✅ 部署时间从1小时减少到10分钟
✅ 测试通过率100%
✅ 团队效率提升50%
✅ 问题发现更早（左移测试）
```

### 问面试官的问题（准备5个 - 8分钟）

1. **团队相关**：
   "请问测试团队的规模和技术栈是怎样的？"

2. **技术栈**：
   "请问公司使用的云平台和K8s版本？有哪些测试工具？"

3. **工作内容**：
   "请问这个岗位的主要工作内容和挑战是什么？"

4. **成长机会**：
   "公司对员工的技术成长有哪些支持？比如培训、技术分享？"

5. **测试文化**：
   "公司的测试理念是怎样的？测试在研发流程中的位置？"

---

## ✅ Day 2 完成清单

- [ ] 能解释混沌工程的5大原则
- [ ] 知道Chaos Mesh的5种故障类型
- [ ] 能说出告警治理的常见问题和优化方法
- [ ] 能写一个简单的预案
- [ ] 理解分布式系统测试的挑战
- [ ] 熟记50道核心面试题（全部）
- [ ] 背熟自我介绍（2分钟）
- [ ] 准备好2个项目案例（STAR格式）
- [ ] 准备好5个问面试官的问题
- [ ] 完成至少1轮模拟面试

---

## 🎯 面试当天准备

### 面试前30分钟

**快速过一遍（10分钟）**：
- ✅ K8s三件套：Pod、Deployment、Service
- ✅ HPA扩Pod，CA扩Node
- ✅ 混沌工程：主动注入故障验证稳定性
- ✅ Chaos Mesh：5种故障类型

**背诵自我介绍（5分钟）**：
练习2遍，流畅自然

**回顾项目案例（10分钟）**：
STAR格式，突出亮点

**准备心态（5分钟）**：
- 自信但谦虚
- 承认经验不足，强调学习能力
- 展示对云平台测试的热情

### 核心话术速记卡

```
1. K8s：容器编排平台，Pod/Deployment/Service
2. HPA：应用层扩Pod，秒级，CPU/内存触发
3. CA：基础设施层扩Node，分钟级，资源不足触发
4. 混沌工程：主动注入故障，验证稳定性
5. Chaos Mesh：Pod/Network/Stress/IO/Time
6. 测试策略：功能+性能+稳定性+故障
7. 优势：学习能力强、2天速成、测试工具开发
```

### 面试注意事项

**✅ 该做的**：
- 听清问题再回答
- 先说结论，再解释原因
- 举具体例子
- 不会的坦诚说明，表达学习意愿
- 展示思维过程

**❌ 不该做的**：
- 不要瞎编答案
- 不要过度谦虚（"我不行"）
- 不要说前公司坏话
- 不要问薪资福利（HR环节问）

---

## 🚀 最后的话

**2天速成的成果**：
✅ 掌握K8s核心概念和HPA/CA原理
✅ 了解混沌工程理论和Chaos Mesh
✅ 准备好50道面试题
✅ 准备好项目经验和自我介绍

**面试心态**：
- 展示学习能力（2天学这么多！）
- 展示测试思维（即使经验不足）
- 展示潜力而非经验
- 坦诚但自信

**记住**：
你的优势不是K8s实战经验，而是：
1. 快速学习能力（2天速成）
2. 扎实的测试基础（Python + 自动化）
3. 测试工具开发能力
4. 对云平台测试的热情

**祝你面试成功！加油！** 💪🚀
