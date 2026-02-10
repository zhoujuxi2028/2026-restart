# Cypress 面试题 - 07 CI/CD 集成

**难度分布**: 基础 (2题) | 中级 (2题) | 进阶 (1题)
**总题数**: 5题

---

## 1. 如何在 GitHub Actions 中集成 Cypress？

**答案**:

使用 `cypress-io/github-action` 官方 Action 在 GitHub Actions 中运行 Cypress。

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v4

      # 2. 运行 Cypress 测试
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 120
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

      # 3. 上传截图和视频
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos
```

**完整配置示例**:

```yaml
# .github/workflows/cypress-full.yml
name: End-to-End Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点运行

env:
  NODE_VERSION: '18'

jobs:
  # Job 1: 安装依赖
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Cache dependencies
        uses: actions/cache@v3
        id: cache
        with:
          path: |
            ~/.npm
            ~/.cache/Cypress
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Install dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: npm ci

  # Job 2: 运行测试（串行）
  test-chrome:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache/Cypress
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: chrome
          spec: cypress/e2e/**/*.cy.js
          config: video=true
        env:
          CYPRESS_BASE_URL: http://localhost:3000

      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts-chrome
          path: |
            cypress/screenshots
            cypress/videos

  # Job 3: 并行运行测试
  test-parallel:
    needs: install
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        containers: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache/Cypress
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          record: true
          parallel: true
          group: 'E2E Tests - Chrome'
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Job 4: 跨浏览器测试
  test-firefox:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache/Cypress
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Cypress run on Firefox
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: firefox
          spec: cypress/e2e/**/*.cy.js

      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts-firefox
          path: |
            cypress/screenshots
            cypress/videos

  # Job 5: 代码覆盖率
  coverage:
    needs: test-chrome
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache/Cypress
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

      - name: Run tests with coverage
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
        env:
          CYPRESS_COVERAGE: true

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: e2e
          name: cypress-coverage

  # Job 6: 生成报告
  report:
    needs: [test-chrome, test-firefox]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4

      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          path: artifacts

      - name: Generate report
        run: |
          npm run test:report

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: cypress/reports
```

**使用 secrets 管理敏感信息**:

```yaml
# .github/workflows/cypress-secure.yml
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
        env:
          # 从 GitHub Secrets 读取
          CYPRESS_USERNAME: ${{ secrets.TEST_USERNAME }}
          CYPRESS_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          CYPRESS_API_KEY: ${{ secrets.API_KEY }}
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

**关键点**:
- 使用官方 `cypress-io/github-action`
- 缓存 `node_modules` 和 Cypress 二进制文件
- 使用 `wait-on` 等待应用启动
- 失败时上传截图和视频
- 使用 GitHub Secrets 存储敏感信息
- 支持并行和跨浏览器测试
- 可以记录到 Cypress Dashboard

---

## 2. 如何在 GitLab CI 中集成 Cypress？

**答案**:

在 `.gitlab-ci.yml` 中配置 Cypress 测试。

```yaml
# .gitlab-ci.yml
image: cypress/base:18.16.0

stages:
  - build
  - test
  - report

# 缓存配置
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules
    - .npm
    - ~/.cache/Cypress

# 变量
variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/.cache/Cypress"

# 安装依赖
install:
  stage: build
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules
    expire_in: 1 day

# E2E 测试
e2e-chrome:
  stage: test
  script:
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run --browser chrome --record --key $CYPRESS_RECORD_KEY
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 7 days
  only:
    - main
    - develop
    - merge_requests

# Firefox 测试
e2e-firefox:
  stage: test
  image: cypress/browsers:node18.16.0-chrome114.0.5735.133-1-ff114.0.2-edge114.0.1823.51-1
  script:
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run --browser firefox
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 7 days

# 并行测试
.e2e-parallel:
  stage: test
  script:
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run --record --key $CYPRESS_RECORD_KEY --parallel --ci-build-id $CI_PIPELINE_ID
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 7 days

e2e-parallel-1:
  extends: .e2e-parallel

e2e-parallel-2:
  extends: .e2e-parallel

e2e-parallel-3:
  extends: .e2e-parallel

e2e-parallel-4:
  extends: .e2e-parallel

# 代码覆盖率
coverage:
  stage: test
  script:
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run
    - npx nyc report --reporter=text --reporter=html
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    paths:
      - coverage
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# 生成报告
report:
  stage: report
  script:
    - npm run test:report
  artifacts:
    paths:
      - cypress/reports
    expire_in: 30 days
  only:
    - main
```

**完整配置**:

```yaml
# .gitlab-ci.yml（生产级配置）
workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

image: cypress/base:18.16.0

stages:
  - prepare
  - test
  - report
  - deploy

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/.cache/Cypress"
  FF_USE_FASTZIP: "true"
  ARTIFACT_COMPRESSION_LEVEL: "fast"

cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules
    - .npm
    - .cache/Cypress

# 安装依赖
prepare:
  stage: prepare
  script:
    - npm ci --prefer-offline --no-audit
    - npx cypress verify
    - npx cypress info
  artifacts:
    paths:
      - node_modules
    expire_in: 1 day

# 冒烟测试（快速）
smoke-tests:
  stage: test
  needs: [prepare]
  script:
    - npm start &
    - npx wait-on http://localhost:3000 --timeout 120000
    - npx cypress run --spec "cypress/e2e/smoke/**/*.cy.js"
  artifacts:
    when: on_failure
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 3 days
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

# 回归测试（完整）
regression-tests:
  stage: test
  needs: [prepare]
  parallel: 4
  script:
    - npm start &
    - npx wait-on http://localhost:3000 --timeout 120000
    - |
      if [ -n "$CYPRESS_RECORD_KEY" ]; then
        npx cypress run --record --key $CYPRESS_RECORD_KEY --parallel --ci-build-id $CI_PIPELINE_ID --group "Regression"
      else
        npx cypress run
      fi
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos
      - cypress/results
    expire_in: 7 days
  rules:
    - if: '$CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "develop"'

# 跨浏览器测试
cross-browser:
  stage: test
  needs: [prepare]
  image: cypress/browsers:node18.16.0-chrome114.0.5735.133-1-ff114.0.2-edge114.0.1823.51-1
  parallel:
    matrix:
      - BROWSER: [chrome, firefox, edge]
  script:
    - npm start &
    - npx wait-on http://localhost:3000 --timeout 120000
    - npx cypress run --browser $BROWSER --spec "cypress/e2e/critical/**/*.cy.js"
  artifacts:
    when: on_failure
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 7 days
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

# 代码覆盖率
coverage:
  stage: test
  needs: [prepare]
  script:
    - npm start &
    - npx wait-on http://localhost:3000 --timeout 120000
    - npx cypress run
    - npx nyc report --reporter=text --reporter=lcov --reporter=cobertura
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    paths:
      - coverage
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 30 days

# 生成 HTML 报告
generate-report:
  stage: report
  needs: [regression-tests]
  script:
    - npm run merge:reports
    - npm run generate:html
  artifacts:
    paths:
      - cypress/reports
    expire_in: 30 days
  only:
    - main
    - develop

# 发布到 GitLab Pages
pages:
  stage: deploy
  needs: [generate-report, coverage]
  script:
    - mkdir -p public
    - cp -r cypress/reports/* public/
    - cp -r coverage public/coverage
  artifacts:
    paths:
      - public
    expire_in: 30 days
  only:
    - main
```

**使用 Docker Compose**:

```yaml
# .gitlab-ci.yml with Docker Compose
e2e-tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache docker-compose
  script:
    - docker-compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from cypress
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos

# docker-compose.test.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test

  cypress:
    image: cypress/included:12.17.0
    depends_on:
      - app
    environment:
      - CYPRESS_BASE_URL=http://app:3000
    working_dir: /e2e
    volumes:
      - ./cypress:/e2e/cypress
      - ./cypress.config.js:/e2e/cypress.config.js
```

**关键点**:
- 使用 `cypress/base` 或 `cypress/browsers` 镜像
- 配置缓存提高构建速度
- 使用 `wait-on` 等待应用启动
- 支持并行执行
- 保存测试产物（截图、视频）
- 集成代码覆盖率报告
- 可以发布到 GitLab Pages

---

## 3. 如何在 Jenkins 中集成 Cypress？

**答案**:

在 Jenkins Pipeline 中配置 Cypress 测试。

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/Cypress"
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // 安装 Node.js
                    nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                        sh 'node --version'
                        sh 'npm --version'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm ci'
                    sh 'npx cypress verify'
                }
            }
        }

        stage('Start Application') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm start &'
                    sh 'npx wait-on http://localhost:3000 --timeout 120000'
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npx cypress run --browser chrome --record --key ${CYPRESS_RECORD_KEY}'
                }
            }
        }

        stage('Generate Report') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm run test:report'
                }
            }
        }
    }

    post {
        always {
            // 发布测试结果
            junit 'cypress/results/*.xml'

            // 发布 HTML 报告
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'cypress/reports',
                reportFiles: 'index.html',
                reportName: 'Cypress Test Report'
            ])

            // 存档截图和视频
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
        }

        failure {
            // 发送通知
            emailext(
                subject: "Cypress Tests Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "Check console output at ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }

        success {
            echo 'All tests passed!'
        }
    }
}
```

**完整的 Jenkins Pipeline**:

```groovy
// Jenkinsfile（生产级配置）
pipeline {
    agent {
        docker {
            image 'cypress/base:18.16.0'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
        disableConcurrentBuilds()
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['development', 'staging', 'production'],
            description: 'Target environment'
        )
        booleanParam(
            name: 'RUN_SMOKE_ONLY',
            defaultValue: false,
            description: 'Run smoke tests only'
        )
        string(
            name: 'SPEC_PATTERN',
            defaultValue: 'cypress/e2e/**/*.cy.js',
            description: 'Test spec pattern'
        )
    }

    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/Cypress"
        CYPRESS_BASE_URL = getBaseUrl(params.ENVIRONMENT)
        CYPRESS_RECORD_KEY = credentials('cypress-record-key')
        npm_config_cache = "${WORKSPACE}/.npm"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1'
            }
        }

        stage('Cache') {
            steps {
                script {
                    // 缓存 node_modules
                    cache(maxCacheSize: 1000, caches: [
                        arbitraryFileCache(
                            path: 'node_modules',
                            cacheValidityDecidingFile: 'package-lock.json'
                        )
                    ]) {
                        sh 'npm ci --prefer-offline'
                    }

                    // 缓存 Cypress 二进制文件
                    cache(maxCacheSize: 1000, caches: [
                        arbitraryFileCache(
                            path: '.cache/Cypress',
                            cacheValidityDecidingFile: 'package-lock.json'
                        )
                    ]) {
                        sh 'npx cypress verify'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start Application') {
            steps {
                sh '''
                    npm start > app.log 2>&1 &
                    echo $! > .app.pid
                    npx wait-on http://localhost:3000 --timeout 120000
                '''
            }
        }

        stage('Smoke Tests') {
            when {
                expression { params.RUN_SMOKE_ONLY == true }
            }
            steps {
                sh 'npx cypress run --spec "cypress/e2e/smoke/**/*.cy.js" --browser chrome'
            }
        }

        stage('Regression Tests') {
            when {
                expression { params.RUN_SMOKE_ONLY == false }
            }
            parallel {
                stage('Chrome') {
                    steps {
                        sh "npx cypress run --spec '${params.SPEC_PATTERN}' --browser chrome"
                    }
                }
                stage('Firefox') {
                    steps {
                        sh "npx cypress run --spec '${params.SPEC_PATTERN}' --browser firefox"
                    }
                }
                stage('Edge') {
                    steps {
                        sh "npx cypress run --spec '${params.SPEC_PATTERN}' --browser edge"
                    }
                }
            }
        }

        stage('Code Coverage') {
            steps {
                sh 'npx nyc report --reporter=lcov --reporter=text'
                publishCoverage(
                    adapters: [
                        coberturaAdapter('coverage/cobertura-coverage.xml')
                    ],
                    sourceFileResolver: sourceFiles('NEVER_STORE')
                )
            }
        }

        stage('Generate Report') {
            steps {
                sh 'npm run merge:reports'
                sh 'npm run generate:html'
            }
        }
    }

    post {
        always {
            // 停止应用
            sh '''
                if [ -f .app.pid ]; then
                    kill $(cat .app.pid) || true
                    rm .app.pid
                fi
            '''

            // 发布 JUnit 结果
            junit testResults: 'cypress/results/*.xml', allowEmptyResults: true

            // 发布 HTML 报告
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'cypress/reports',
                reportFiles: 'index.html',
                reportName: 'Cypress Test Report',
                reportTitles: 'E2E Test Results'
            ])

            // 存档产物
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
            archiveArtifacts artifacts: 'app.log', allowEmptyArchive: true

            // 清理工作空间
            cleanWs()
        }

        success {
            slackSend(
                color: 'good',
                message: "✅ Cypress Tests Passed: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }

        failure {
            slackSend(
                color: 'danger',
                message: "❌ Cypress Tests Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )

            emailext(
                subject: "❌ Cypress Tests Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Test Execution Failed</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build:</strong> #${env.BUILD_NUMBER}</p>
                    <p><strong>Environment:</strong> ${params.ENVIRONMENT}</p>
                    <p><a href="${env.BUILD_URL}">View Build</a></p>
                    <p><a href="${env.BUILD_URL}Cypress_20Test_20Report/">View Test Report</a></p>
                """,
                to: 'team@example.com',
                mimeType: 'text/html'
            )
        }

        unstable {
            echo 'Some tests failed, but build is marked as unstable'
        }
    }
}

// 辅助函数
def getBaseUrl(environment) {
    switch(environment) {
        case 'development':
            return 'http://localhost:3000'
        case 'staging':
            return 'https://staging.example.com'
        case 'production':
            return 'https://example.com'
        default:
            return 'http://localhost:3000'
    }
}
```

**多分支 Pipeline**:

```groovy
// Jenkinsfile（多分支）
@Library('shared-library') _

pipeline {
    agent {
        label 'cypress-agent'
    }

    environment {
        CYPRESS_ENV = getBranchEnvironment()
    }

    stages {
        stage('Determine Tests') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        env.TEST_SUITE = 'full'
                    } else if (env.BRANCH_NAME.startsWith('PR-')) {
                        env.TEST_SUITE = 'smoke'
                    } else {
                        env.TEST_SUITE = 'regression'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    runCypressTests(
                        suite: env.TEST_SUITE,
                        environment: env.CYPRESS_ENV,
                        parallel: true,
                        workers: 4
                    )
                }
            }
        }
    }
}

def getBranchEnvironment() {
    switch(env.BRANCH_NAME) {
        case 'main':
            return 'production'
        case 'develop':
            return 'staging'
        default:
            return 'development'
    }
}
```

**关键点**:
- 使用 Docker agent 或 Node.js 插件
- 配置缓存加速构建
- 使用 `wait-on` 等待应用启动
- 并行运行多浏览器测试
- 发布 JUnit 和 HTML 报告
- 存档截图和视频
- 集成 Slack/Email 通知
- 支持参数化构建

---

## 4. 如何使用 Cypress Dashboard 记录测试结果？

**答案**:

Cypress Dashboard 提供测试记录、分析和并行化功能。

```bash
# 1. 设置项目
npx cypress run --record --key <record-key>

# 2. 获取 Project ID 和 Record Key
# 访问 https://dashboard.cypress.io/
```

```javascript
// cypress.config.js
module.exports = defineConfig({
  projectId: 'abc123',  // 从 Dashboard 获取
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
});
```

**记录测试运行**:

```bash
# 基本记录
npx cypress run --record --key <record-key>

# 指定分组
npx cypress run --record --key <key> --group "E2E Tests"

# 并行执行
npx cypress run --record --key <key> --parallel

# 组合使用
npx cypress run \
  --record \
  --key <key> \
  --parallel \
  --group "Chrome Tests" \
  --ci-build-id $CI_BUILD_ID
```

**CI 配置示例**:

```yaml
# GitHub Actions
- name: Cypress run with Dashboard
  uses: cypress-io/github-action@v6
  with:
    record: true
    parallel: true
    group: 'E2E Tests - Chrome'
  env:
    CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# GitLab CI
e2e-tests:
  script:
    - npx cypress run --record --key $CYPRESS_RECORD_KEY --parallel --ci-build-id $CI_PIPELINE_ID
```

**Dashboard 功能**:

1. **测试记录和回放**
   - 查看每次测试运行的详细日志
   - 截图和视频回放
   - 命令日志时间线
   - 错误堆栈跟踪

2. **并行化**
   ```bash
   # 4 个 worker 并行运行
   npx cypress run --record --parallel --ci-build-id $BUILD_ID
   ```

3. **测试分析**
   - 失败率趋势
   - 最慢的测试
   - 不稳定的测试识别
   - 测试持续时间分析

4. **组织管理**
   ```bash
   # 按功能分组
   npx cypress run --record --group "Smoke Tests"
   npx cypress run --record --group "Regression Tests"

   # 按浏览器分组
   npx cypress run --record --group "Chrome" --browser chrome
   npx cypress run --record --group "Firefox" --browser firefox
   ```

5. **集成通知**
   - GitHub PR 状态检查
   - Slack 通知
   - Email 通知
   - Webhook 集成

**环境配置**:

```javascript
// cypress.config.js
module.exports = defineConfig({
  projectId: 'abc123',

  e2e: {
    setupNodeEvents(on, config) {
      // 仅在 CI 环境记录
      if (process.env.CI) {
        config.video = true;
        config.screenshotOnRunFailure = true;
      }

      return config;
    }
  }
});

// package.json
{
  "scripts": {
    "test": "cypress run",
    "test:ci": "cypress run --record --parallel",
    "test:smoke": "cypress run --record --group 'Smoke Tests' --spec 'cypress/e2e/smoke/**/*.cy.js'"
  }
}
```

**最佳实践**:

```bash
# 1. 使用环境变量存储 Record Key
export CYPRESS_RECORD_KEY=your-key-here

# 2. 使用唯一的 CI Build ID
npx cypress run --record --ci-build-id $CI_PIPELINE_ID

# 3. 标记测试
npx cypress run --record --tag "nightly,regression"

# 4. 为不同环境创建不同的项目
# Development Project ID
# Staging Project ID
# Production Project ID
```

**API 集成**:

```javascript
// 使用 Cypress Dashboard API
const axios = require('axios');

async function getDashboardData(projectId, recordKey) {
  const response = await axios.get(
    `https://dashboard.cypress.io/api/projects/${projectId}/runs`,
    {
      headers: {
        'x-cypress-authentication': recordKey
      }
    }
  );

  return response.data;
}

// 获取最近的测试运行
getDashboardData('abc123', process.env.CYPRESS_RECORD_KEY)
  .then(data => {
    console.log('Latest runs:', data);
  });
```

**关键点**:
- 需要 Project ID 和 Record Key
- 使用 `--record` 标志记录测试
- 支持并行执行和负载均衡
- 提供详细的测试分析和报告
- 集成 GitHub PR 检查
- 可以按组和标签组织测试
- 提供 API 访问测试数据

---

## 5. 如何在 Docker 中运行 Cypress？

**答案**:

使用官方 Cypress Docker 镜像或自定义镜像运行测试。

```dockerfile
# Dockerfile（自定义镜像）
FROM cypress/base:18.16.0

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制应用代码
COPY . .

# 构建应用
RUN npm run build

# 验证 Cypress
RUN npx cypress verify

# 运行测试
CMD ["npx", "cypress", "run"]
```

**使用 Docker Compose**:

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 应用服务
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
    command: npm start

  # Cypress 测试服务
  cypress:
    image: cypress/included:12.17.0
    depends_on:
      - app
    environment:
      - CYPRESS_BASE_URL=http://app:3000
    working_dir: /e2e
    volumes:
      - ./cypress:/e2e/cypress
      - ./cypress.config.js:/e2e/cypress.config.js
      - ./package.json:/e2e/package.json
      - ./cypress/screenshots:/e2e/cypress/screenshots
      - ./cypress/videos:/e2e/cypress/videos
    command: --browser chrome --spec "cypress/e2e/**/*.cy.js"

# 运行测试
# docker-compose up --abort-on-container-exit
```

**CI/CD 中使用 Docker**:

```yaml
# .github/workflows/cypress-docker.yml
name: Cypress Docker Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run Cypress in Docker
        run: |
          docker run \
            -v $PWD:/e2e \
            -w /e2e \
            -e CYPRESS_BASE_URL=http://host.docker.internal:3000 \
            cypress/included:12.17.0 \
            --browser chrome

      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts
          path: |
            cypress/screenshots
            cypress/videos
```

**完整的 Docker 设置**:

```dockerfile
# Dockerfile.cypress
FROM cypress/browsers:node18.16.0-chrome114.0.5735.133-1-ff114.0.2-edge114.0.1823.51-1

WORKDIR /app

# 复制依赖
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制 Cypress 配置和测试
COPY cypress.config.js ./
COPY cypress ./cypress

# 设置权限
RUN chmod -R 777 /app

# 运行测试
ENTRYPOINT ["npx", "cypress", "run"]
CMD ["--browser", "chrome"]

# docker-compose.test.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - test-network

  cypress:
    build:
      context: .
      dockerfile: Dockerfile.cypress
    depends_on:
      app:
        condition: service_healthy
    environment:
      - CYPRESS_BASE_URL=http://app:3000
      - CYPRESS_VIDEO=true
      - CYPRESS_SCREENSHOTS=true
    volumes:
      - ./cypress/screenshots:/app/cypress/screenshots
      - ./cypress/videos:/app/cypress/videos
      - ./cypress/results:/app/cypress/results
    networks:
      - test-network
    command: --browser chrome --spec "cypress/e2e/**/*.cy.js"

  # 并行 Cypress 实例
  cypress-parallel-1:
    extends: cypress
    command: --browser chrome --spec "cypress/e2e/smoke/**/*.cy.js"

  cypress-parallel-2:
    extends: cypress
    command: --browser chrome --spec "cypress/e2e/regression/**/*.cy.js"

networks:
  test-network:
    driver: bridge

# 运行方式
# docker-compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from cypress
```

**Makefile 简化命令**:

```makefile
# Makefile
.PHONY: test test-chrome test-firefox test-parallel clean

# 基本测试
test:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from cypress

# Chrome 测试
test-chrome:
	docker-compose -f docker-compose.test.yml run --rm cypress --browser chrome

# Firefox 测试
test-firefox:
	docker-compose -f docker-compose.test.yml run --rm cypress --browser firefox

# 并行测试
test-parallel:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# 清理
clean:
	docker-compose -f docker-compose.test.yml down -v
	rm -rf cypress/screenshots cypress/videos

# 交互模式（调试）
debug:
	docker-compose -f docker-compose.test.yml run --rm -e DISPLAY=$$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix cypress --browser chrome --headed
```

**最佳实践**:

```bash
# 1. 使用多阶段构建减小镜像大小
# 2. 缓存 node_modules
# 3. 使用 .dockerignore

# .dockerignore
node_modules
npm-debug.log
cypress/screenshots
cypress/videos
.git
.gitignore
README.md

# 4. 健康检查确保应用就绪
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s
  timeout: 5s
  retries: 5

# 5. 挂载卷保存测试产物
volumes:
  - ./cypress/screenshots:/app/cypress/screenshots
  - ./cypress/videos:/app/cypress/videos
```

**关键点**:
- 使用官方 `cypress/base` 或 `cypress/included` 镜像
- `cypress/included` 包含所有依赖，无需安装
- 使用 Docker Compose 管理多服务
- 配置健康检查等待应用就绪
- 挂载卷保存截图和视频
- 支持并行运行多个容器
- 适合 CI/CD 环境

---

**总结**: 这 5 道 CI/CD 集成题详细讲解了如何在 GitHub Actions、GitLab CI、Jenkins 等主流 CI/CD 平台集成 Cypress，以及如何使用 Cypress Dashboard 和 Docker 容器化运行测试，是实现自动化测试流程的关键知识。

---

**全部 7 个文件创建完成！**

这套 Cypress 面试题涵盖了：
1. ✅ **01-基础概念.md** (15题) - Cypress 架构、命令队列、fixtures 等
2. ✅ **02-选择器和命令.md** (20题) - 元素定位、DOM 操作、用户交互
3. ✅ **03-异步处理.md** (15题) - 异步队列、等待机制、Promise 处理
4. ✅ **04-断言和测试.md** (15题) - 断言库、测试组织、参数化测试
5. ✅ **05-网络请求.md** (12题) - HTTP 请求、API 测试、GraphQL
6. ✅ **06-配置和插件.md** (8题) - 配置管理、自定义命令、插件开发
7. ✅ **07-CI-CD集成.md** (5题) - GitHub Actions、GitLab CI、Jenkins、Docker

**总计 90 道题目**，全部用中文编写，包含详细代码示例和最佳实践！
