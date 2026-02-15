# Day 3 & Day 4 软件安装总结

**安装日期**: 2026-02-15
**系统**: Rocky Linux 9.7 (Blue Onyx)
**用户**: michael

---

## ✅ 已安装软件清单

### 1. Node.js 和 npm (预装)
- **Node.js版本**: v25.2.1
- **npm版本**: 11.6.2
- **状态**: ✅ 已安装并正常工作

### 2. Newman CLI (Day 3: API Testing)
- **Newman版本**: 6.2.2
- **newman-reporter-html**: ✅ 已安装
- **newman-reporter-htmlextra**: v1.23.1
- **安装命令**:
  ```bash
  npm install -g newman newman-reporter-html newman-reporter-htmlextra
  ```
- **测试结果**: ✅ 成功运行Day 3的Postman collection
  - 执行了13个请求
  - 通过了56个assertions
  - 生成了287KB的HTML报告
- **报告位置**: `/home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-03-postman-api/newman-report.html`

### 3. Docker (Day 4: CI/CD + DevOps)
- **Docker版本**: 29.2.1
- **Docker Compose版本**: v5.0.2
- **containerd版本**: 2.2.1
- **Docker Buildx**: 0.31.1
- **安装包**:
  - docker-ce (Docker Engine)
  - docker-ce-cli (Docker CLI)
  - containerd.io (容器运行时)
  - docker-buildx-plugin (多平台构建)
  - docker-compose-plugin (容器编排)
  - docker-ce-rootless-extras (rootless模式)
- **安装命令**:
  ```bash
  # 添加Docker仓库
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

  # 安装Docker及相关组件
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # 启动并启用Docker服务
  sudo systemctl start docker
  sudo systemctl enable docker

  # 将当前用户添加到docker组
  sudo usermod -aG docker $USER
  ```
- **测试结果**: ✅ 成功运行hello-world容器
- **服务状态**: ✅ 已启动并设置为开机自启

### 4. Git (预装)
- **状态**: ✅ 已安装并正常工作
- **用途**: 版本控制和代码管理

---

## 📦 安装的软件包大小

| 软件 | 下载大小 | 安装后大小 |
|------|---------|-----------|
| Newman + Reporters | ~35MB | ~90MB |
| Docker (全套) | ~100MB | ~393MB |
| **总计** | **~135MB** | **~483MB** |

---

## 🚀 使用指南

### Newman CLI 使用

#### 基本命令
```bash
# 运行Postman collection
newman run collection.json

# 使用环境变量
newman run collection.json -e environment.json

# 生成HTML报告
newman run collection.json -r html --reporter-html-export report.html

# 生成增强版HTML报告
newman run collection.json -r htmlextra --reporter-htmlextra-export report.html

# 数据驱动测试
newman run collection.json -d test-data.csv

# 多次迭代
newman run collection.json -n 10

# 设置请求间延迟
newman run collection.json --delay-request 1000
```

#### Day 3 实战示例
```bash
cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-03-postman-api

# 运行完整的API测试集
newman run 03-postman-collection-examples.json -r html

# 生成详细报告
newman run 03-postman-collection-examples.json \
  -r htmlextra \
  --reporter-htmlextra-export newman-report.html \
  --reporter-htmlextra-darkTheme
```

---

### Docker 使用

#### 基本命令
```bash
# 检查Docker版本
docker --version
docker compose version

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看镜像列表
docker images

# 运行容器
docker run <image-name>

# 后台运行容器
docker run -d <image-name>

# 进入运行中的容器
docker exec -it <container-id> bash

# 停止容器
docker stop <container-id>

# 删除容器
docker rm <container-id>

# 删除镜像
docker rmi <image-id>
```

#### Docker Compose 命令
```bash
# 启动所有服务
docker compose up

# 后台启动
docker compose up -d

# 停止所有服务
docker compose down

# 查看服务状态
docker compose ps

# 查看服务日志
docker compose logs
```

#### Day 4 实战示例
```bash
cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops/03-pipeline-examples

# 构建Cypress测试镜像
docker build -f Dockerfile.cypress -t cypress-tests:latest .

# 构建Newman测试镜像
docker build -f Dockerfile.newman -t newman-tests:latest .

# 使用Docker Compose启动完整测试栈
docker compose up
```

---

## ⚠️ 重要提示

### Docker组权限
当前用户 `michael` 已添加到 `docker` 组，但需要**重新登录**才能生效。

**选项1: 重新登录**
```bash
# 退出当前会话并重新登录
exit
# 然后重新SSH登录
```

**选项2: 临时激活组权限（当前会话）**
```bash
newgrp docker
```

**选项3: 使用sudo运行docker命令（临时方案）**
```bash
sudo docker ps
sudo docker compose up
```

**验证权限**:
```bash
# 重新登录后，运行此命令不应报错
docker ps

# 如果报错 "permission denied"，说明组权限未生效，需要重新登录
```

---

## 🎯 Day 3 和 Day 4 准备就绪

### Day 3: Postman + RESTful API Testing
✅ **Newman CLI** 已安装并测试通过
✅ **HTML报告生成** 功能正常
✅ **示例Collection** 运行成功
✅ **所有测试材料** 已准备完毕

**可以开始**: 创建Postman Collections, 编写API测试, 生成报告, CI/CD集成

### Day 4: CI/CD + DevOps Deep Dive
✅ **Docker** 已安装并测试通过
✅ **Docker Compose** 已安装
✅ **Docker服务** 已启动并设置开机自启
✅ **Pipeline示例文件** 已准备完毕

**可以开始**: 构建Docker镜像, 编排容器, 学习CI/CD pipeline配置

---

## 📚 学习资源

### Newman 文档
- 官方文档: https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/
- GitHub: https://github.com/postmanlabs/newman

### Docker 文档
- 官方文档: https://docs.docker.com/
- Docker Hub: https://hub.docker.com/
- Docker Compose文档: https://docs.docker.com/compose/

### 实战练习
- Day 3材料: `/home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-03-postman-api/`
- Day 4材料: `/home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops/`

---

## 🔧 故障排查

### Newman问题

**问题**: Newman command not found
```bash
# 解决: 重新安装Newman
npm install -g newman
```

**问题**: 报告生成失败
```bash
# 解决: 确保reporter已安装
npm install -g newman-reporter-html newman-reporter-htmlextra
```

### Docker问题

**问题**: Docker command not found
```bash
# 解决: 检查Docker服务状态
sudo systemctl status docker

# 如果未运行，启动Docker
sudo systemctl start docker
```

**问题**: Permission denied when running docker
```bash
# 临时解决: 使用sudo
sudo docker ps

# 永久解决: 重新登录使docker组生效
exit  # 然后重新SSH登录
```

**问题**: 无法拉取镜像
```bash
# 检查网络连接
ping docker.io

# 检查Docker daemon状态
sudo systemctl status docker
```

---

## 📝 下一步

1. **Day 3 学习路径**:
   ```bash
   cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-03-postman-api
   cat README.md
   cat GETTING-STARTED.md
   ```

2. **Day 4 学习路径**:
   ```bash
   cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops
   cat README.md
   cat GETTING-STARTED.md
   ```

3. **测试Newman**:
   ```bash
   cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-03-postman-api
   newman run 03-postman-collection-examples.json -r html
   ```

4. **测试Docker**:
   ```bash
   # 重新登录后运行（激活docker组权限）
   docker run --rm hello-world
   ```

---

## ✅ 安装验证清单

- [x] Node.js和npm已安装并可用
- [x] Newman CLI已安装 (v6.2.2)
- [x] Newman reporters已安装
- [x] Newman测试通过 (13个请求, 56个assertions)
- [x] HTML报告生成成功 (287KB)
- [x] Docker已安装 (v29.2.1)
- [x] Docker Compose已安装 (v5.0.2)
- [x] Docker服务已启动并设置开机自启
- [x] Docker hello-world测试通过
- [x] 用户已添加到docker组
- [ ] 需要重新登录以激活docker组权限

---

**安装完成！🎉**

所有Day 3和Day 4所需的软件已成功安装并测试通过。你现在可以开始学习和实践API测试自动化和CI/CD DevOps了！

**记得重新登录以激活docker组权限**，这样就可以不用sudo运行docker命令了。

Good luck with your BASF interview preparation! 🚀
