# 实验1：部署第一个 Kubernetes 应用

## 实验目标

- 理解 Pod、Deployment、Service 的概念
- 学习使用 kubectl 命令
- 掌握 YAML 配置文件的编写

## 前置条件

- Docker Desktop Kubernetes 已启用并运行
- kubectl 命令可用

## 实验步骤

### 1. 验证集群状态

```bash
# 查看集群信息
kubectl cluster-info

# 查看节点
kubectl get nodes

# 预期输出：
# NAME             STATUS   ROLES           AGE   VERSION
# docker-desktop   Ready    control-plane   1d    v1.x.x
```

### 2. 创建简单的 Pod

```bash
# 进入 manifests 目录
cd networking/kubernetes/manifests

# 创建 Pod
kubectl apply -f 01-hello-pod.yaml

# 查看 Pod 状态
kubectl get pods

# 查看 Pod 详细信息
kubectl describe pod hello-pod

# 查看 Pod 日志
kubectl logs hello-pod
```

**思考题：**
- Pod 的状态是什么？（Pending → Running → Ready）
- 容器使用的镜像是什么？
- 分配的资源限制是多少？

### 3. 进入容器

```bash
# 进入 Pod 的容器
kubectl exec -it hello-pod -- sh

# 在容器内执行命令
/ # nginx -v
/ # ps aux
/ # exit
```

### 4. 测试 Pod 网络

```bash
# 端口转发到本地
kubectl port-forward pod/hello-pod 8080:80

# 在另一个终端测试
curl http://localhost:8080

# 或在浏览器打开 http://localhost:8080
# 应该能看到 nginx 默认页面
```

### 5. 创建 Deployment

```bash
# 删除之前的 Pod
kubectl delete -f 01-hello-pod.yaml

# 创建 Deployment
kubectl apply -f 02-hello-deployment.yaml

# 查看 Deployment
kubectl get deployment

# 查看创建的 Pods
kubectl get pods

# 观察 Pod 标签
kubectl get pods --show-labels
```

**思考题：**
- 创建了几个 Pod？为什么？
- 如果删除一个 Pod 会发生什么？

### 6. 测试自愈能力

```bash
# 查看当前 Pods
kubectl get pods

# 删除一个 Pod（替换 <pod-name> 为实际名称）
kubectl delete pod <pod-name>

# 立即查看 Pods
kubectl get pods -w

# 观察：Kubernetes 会自动创建新的 Pod 来维持期望的副本数
```

### 7. 扩缩容

```bash
# 扩展到 5 个副本
kubectl scale deployment hello-deployment --replicas=5

# 查看扩展结果
kubectl get pods

# 缩减到 2 个副本
kubectl scale deployment hello-deployment --replicas=2

# 再次查看
kubectl get pods
```

### 8. 创建 Service

```bash
# 创建 Service
kubectl apply -f 03-hello-service.yaml

# 查看 Service
kubectl get service

# 查看 Service 详细信息
kubectl describe service hello-service
```

### 9. 访问 Service

```bash
# 通过 Service 端口转发
kubectl port-forward service/hello-service 8080:80

# 测试访问（在另一个终端）
curl http://localhost:8080

# 多次访问，观察负载均衡效果
for i in {1..10}; do
  curl -s http://localhost:8080 | grep "Welcome"
done
```

### 10. 清理资源

```bash
# 删除所有资源
kubectl delete -f 03-hello-service.yaml
kubectl delete -f 02-hello-deployment.yaml

# 验证清理
kubectl get all
```

## 实验总结

完成本实验后，你应该掌握：

1. ✅ Pod 是 K8S 最小的部署单元
2. ✅ Deployment 管理 Pod 的副本和更新
3. ✅ Service 提供稳定的网络访问入口
4. ✅ K8S 具有自愈和弹性伸缩能力
5. ✅ kubectl 基本命令的使用

## 常见问题

### Q1: Pod 一直处于 Pending 状态？
```bash
# 查看原因
kubectl describe pod <pod-name>

# 可能原因：
# - 镜像拉取失败
# - 资源不足
# - 节点不可用
```

### Q2: 如何查看所有命名空间的资源？
```bash
kubectl get pods -A
kubectl get all -A
```

### Q3: 如何删除所有资源？
```bash
# 删除特定命名空间的所有资源
kubectl delete all --all

# 或使用标签选择器
kubectl delete all -l app=hello
```

## 扩展练习

1. 修改 Deployment 使用不同的镜像（如 httpd、tomcat）
2. 尝试创建不同类型的 Service（LoadBalancer）
3. 添加环境变量到容器配置
4. 配置健康检查探针（已在 02-hello-deployment.yaml 中）
5. 使用 ConfigMap 注入配置文件

## 下一步

- 实验2：ConfigMap 和 Secret 管理
- 实验3：持久化存储（PV/PVC）
- 实验4：网络策略
