# Kubernetes 学习目录

## 环境部署

### 当前状态
- ✅ kubectl v1.34.1 已安装
- ✅ Docker Desktop v29.2.1 已安装
- ⏳ 等待启用 Docker Desktop Kubernetes

### 推荐方案：Docker Desktop 内置 Kubernetes

**启用步骤：**
1. 打开 Docker Desktop
2. Settings → Kubernetes → Enable Kubernetes
3. Apply & Restart
4. 等待 2-3 分钟启动完成

**验证命令：**
```bash
kubectl cluster-info
kubectl get nodes
kubectl get pods -A
```

## 目录结构

```
kubernetes/
├── manifests/        # K8S 配置文件（YAML）
├── labs/            # 实验练习
├── notes/           # 学习笔记
├── configs/         # 集群配置
└── README.md        # 本文件
```

## 学习路径

### 第1周：K8S 基础
- [ ] Pod、Deployment、Service 基本概念
- [ ] 使用 kubectl 管理资源
- [ ] YAML 配置文件编写
- [ ] 命名空间和标签

### 第2周：网络与存储
- [ ] Service 类型（ClusterIP、NodePort、LoadBalancer）
- [ ] Ingress 控制器
- [ ] 网络策略（NetworkPolicy）
- [ ] PV 和 PVC 存储管理

### 第3周：高级特性
- [ ] ConfigMap 和 Secret
- [ ] StatefulSet 和 DaemonSet
- [ ] HPA（水平自动扩展）
- [ ] 健康检查（Liveness、Readiness）

### 第4周：NFV-SDN 集成
- [ ] Calico/Cilium CNI 插件
- [ ] 网络策略实践
- [ ] Service Mesh 入门
- [ ] 与 NFV-SDN 学习计划结合

## 常用命令速查

### 集群信息
```bash
kubectl cluster-info                    # 集群信息
kubectl get nodes                       # 查看节点
kubectl version                         # 版本信息
```

### 资源管理
```bash
kubectl get pods                        # 查看Pod
kubectl get pods -A                     # 查看所有命名空间的Pod
kubectl describe pod <pod-name>         # Pod详细信息
kubectl logs <pod-name>                 # 查看日志
kubectl exec -it <pod-name> -- bash     # 进入容器
```

### 部署应用
```bash
kubectl apply -f <file.yaml>            # 应用配置
kubectl delete -f <file.yaml>           # 删除配置
kubectl create deployment nginx --image=nginx  # 快速创建部署
kubectl expose deployment nginx --port=80 --type=NodePort  # 暴露服务
```

### 调试
```bash
kubectl get events                      # 查看事件
kubectl describe <resource> <name>      # 详细描述
kubectl logs -f <pod-name>             # 实时日志
```

## 参考资源

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [kubectl 命令速查](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes By Example](https://kubernetesbyexample.com/)

## 与仓库其他内容的关联

- **networking/NFV-SDN/**: K8S 网络是 SDN 的实践应用
- **jobs/yunbao/**: K8S 与虚拟化技术（KVM、OpenStack）结合
- **testing/**: K8S 环境下的应用测试

## 网络问题说明

当前环境存在 Docker 网络连接问题，无法从 Docker Hub 拉取镜像：
- Minikube: 启动失败（kubeadm 初始化错误）
- Kind: 镜像拉取超时
- **解决方案**: 使用 Docker Desktop 内置 K8S（不需要拉取镜像）

如需使用 Minikube/Kind，需要先解决以下问题：
1. 配置 Docker Desktop 代理设置
2. 或配置 Docker 镜像加速器
3. 或手动导入所需镜像

## 下一步

1. ✅ 工具安装完成（kubectl, docker, minikube, kind）
2. ⏳ 启用 Docker Desktop Kubernetes
3. ⏳ 运行验证命令确认集群正常
4. ⏳ 创建第一个 Pod 部署
5. ⏳ 开始系统学习
