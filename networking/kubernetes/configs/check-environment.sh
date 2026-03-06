#!/bin/bash
# K8S 环境检查脚本
# 使用方法: bash check-environment.sh

echo "================================================"
echo "Kubernetes 环境检查"
echo "================================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 已安装"
        $1 version --client 2>/dev/null | head -n 1 || $1 --version 2>/dev/null | head -n 1
        return 0
    else
        echo -e "${RED}✗${NC} $1 未安装"
        return 1
    fi
}

# 1. 检查必要工具
echo "1. 检查工具安装状态"
echo "-------------------"
check_command kubectl
check_command docker
check_command minikube
check_command kind
echo ""

# 2. 检查 Docker 状态
echo "2. 检查 Docker 状态"
echo "-------------------"
if docker ps &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon 正在运行"
    echo "   Docker 版本: $(docker --version)"
else
    echo -e "${RED}✗${NC} Docker daemon 未运行"
    echo "   请启动 Docker Desktop"
fi
echo ""

# 3. 检查 Kubernetes 集群
echo "3. 检查 Kubernetes 集群"
echo "----------------------"
if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Kubernetes 集群正在运行"
    kubectl cluster-info | head -n 2
    echo ""
    echo "   节点信息:"
    kubectl get nodes
    echo ""
    echo "   系统组件:"
    kubectl get pods -n kube-system | head -n 6
else
    echo -e "${RED}✗${NC} Kubernetes 集群未运行或未配置"
    echo ""
    echo "   建议操作:"
    echo "   1. 启用 Docker Desktop Kubernetes:"
    echo "      Docker Desktop → Settings → Kubernetes → Enable Kubernetes"
    echo "   2. 或使用 Minikube:"
    echo "      minikube start --driver=docker"
    echo "   3. 或使用 Kind:"
    echo "      kind create cluster"
fi
echo ""

# 4. 检查 kubectl 配置
echo "4. 检查 kubectl 配置"
echo "-------------------"
if kubectl config current-context &> /dev/null; then
    echo -e "${GREEN}✓${NC} kubectl 已配置"
    echo "   当前上下文: $(kubectl config current-context)"
    echo "   可用上下文:"
    kubectl config get-contexts
else
    echo -e "${RED}✗${NC} kubectl 未配置"
    echo "   请先启动 K8S 集群"
fi
echo ""

# 5. 检查网络连接
echo "5. 检查网络连接"
echo "-------------------"
if docker pull hello-world &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Hub 网络连接正常"
    docker rmi hello-world &> /dev/null
else
    echo -e "${YELLOW}⚠${NC} Docker Hub 网络连接异常"
    echo "   这不影响 Docker Desktop K8S 的使用"
    echo "   但会影响 Minikube 和 Kind 的镜像拉取"
fi
echo ""

# 6. 系统资源检查
echo "6. 系统资源"
echo "-------------------"
if [[ "$OSTYPE" == "darwin"* ]]; then
    TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024/1024)}')
    CPU_CORES=$(sysctl -n hw.ncpu)
    echo "   总内存: ${TOTAL_MEM}GB"
    echo "   CPU 核心: ${CPU_CORES}"

    if [ $TOTAL_MEM -ge 8 ]; then
        echo -e "   ${GREEN}✓${NC} 内存充足（推荐 8GB+）"
    else
        echo -e "   ${YELLOW}⚠${NC} 内存较少，建议至少 8GB"
    fi

    if [ $CPU_CORES -ge 4 ]; then
        echo -e "   ${GREEN}✓${NC} CPU 核心数充足（推荐 4+）"
    else
        echo -e "   ${YELLOW}⚠${NC} CPU 核心数较少，建议至少 4 核"
    fi
fi
echo ""

# 7. 总结
echo "================================================"
echo "环境检查完成"
echo "================================================"
echo ""

if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✓ 您的 K8S 环境已就绪！${NC}"
    echo ""
    echo "快速开始:"
    echo "  cd networking/kubernetes"
    echo "  cat 快速开始.md"
    echo "  kubectl create deployment nginx --image=nginx:alpine"
else
    echo -e "${YELLOW}⚠ 请先启动 K8S 集群${NC}"
    echo ""
    echo "推荐方案（按优先级）:"
    echo ""
    echo "  1. Docker Desktop Kubernetes (推荐)"
    echo "     • 打开 Docker Desktop"
    echo "     • Settings → Kubernetes → Enable Kubernetes"
    echo "     • 等待 2-3 分钟"
    echo ""
    echo "  2. Minikube"
    echo "     minikube start --driver=docker --cpus=4 --memory=6144"
    echo ""
    echo "  3. Kind"
    echo "     kind create cluster --name learning-k8s"
fi
echo ""
