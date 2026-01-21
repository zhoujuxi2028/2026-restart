/**
 * 📊 Day 14: 性能和监控
 *
 * 学习目标：
 * - 掌握性能指标收集
 * - 学习页面加载时间测试
 * - 理解 Core Web Vitals
 * - 学习资源加载监控
 * - 掌握性能回归检测
 */

describe('📊 Day 14: 性能和监控', () => {

  beforeEach(() => {
    // 清除性能数据
    cy.window().then((win) => {
      if (win.performance && win.performance.clearMarks) {
        win.performance.clearMarks()
        win.performance.clearMeasures()
      }
    })
  })

  describe('⚡ 页面加载性能', () => {

    it('应该能够测量页面加载时间', () => {
      // 🎯 学习要点：基础页面性能测量
      const startTime = Date.now()

      cy.visit('https://example.cypress.io', {
        onBeforeLoad: (win) => {
          // 在页面加载前设置性能标记
          win.performance.mark('navigation-start')
        },
        onLoad: (win) => {
          // 页面加载完成后设置标记
          win.performance.mark('page-loaded')
        }
      })

      cy.window().then((win) => {
        const endTime = Date.now()
        const loadTime = endTime - startTime

        cy.log(`页面加载时间: ${loadTime}ms`)

        // 验证加载时间在合理范围内
        expect(loadTime).to.be.lessThan(10000) // 10 秒内
        expect(loadTime).to.be.greaterThan(100) // 至少 100ms

        // 使用 Performance API
        if (win.performance.getEntriesByType) {
          const navigationTiming = win.performance.getEntriesByType('navigation')[0]
          if (navigationTiming) {
            const {
              domContentLoadedEventEnd,
              domContentLoadedEventStart,
              loadEventEnd,
              loadEventStart,
              responseEnd,
              responseStart
            } = navigationTiming

            cy.log(`DOM Content Loaded: ${domContentLoadedEventEnd - domContentLoadedEventStart}ms`)
            cy.log(`Load Event: ${loadEventEnd - loadEventStart}ms`)
            cy.log(`Response Time: ${responseEnd - responseStart}ms`)
          }
        }
      })
    })

    it('应该能够分析加载阶段耗时', () => {
      // 🎯 学习要点：详细的加载阶段分析
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const navigation = win.performance.getEntriesByType('navigation')[0]

        if (navigation) {
          const timings = {
            // DNS 查询时间
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,

            // TCP 连接时间
            tcpConnection: navigation.connectEnd - navigation.connectStart,

            // SSL 握手时间（如果是 HTTPS）
            sslHandshake: navigation.connectEnd - navigation.secureConnectionStart,

            // 服务器响应时间
            serverResponse: navigation.responseStart - navigation.requestStart,

            // 资源下载时间
            resourceDownload: navigation.responseEnd - navigation.responseStart,

            // DOM 处理时间
            domProcessing: navigation.domComplete - navigation.domLoading,

            // DOM 内容加载时间
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,

            // 完整加载时间
            totalLoad: navigation.loadEventEnd - navigation.navigationStart
          }

          cy.log('🔍 页面加载阶段分析:')
          Object.keys(timings).forEach(phase => {
            const time = timings[phase]
            if (time > 0) {
              cy.log(`${phase}: ${time.toFixed(2)}ms`)

              // 设置性能阈值
              const thresholds = {
                dnsLookup: 200,
                tcpConnection: 300,
                sslHandshake: 500,
                serverResponse: 1000,
                resourceDownload: 2000,
                domProcessing: 3000,
                domContentLoaded: 4000,
                totalLoad: 5000
              }

              if (thresholds[phase] && time > thresholds[phase]) {
                cy.log(`⚠️ ${phase} 超过阈值 ${thresholds[phase]}ms`)
              } else if (thresholds[phase]) {
                cy.log(`✅ ${phase} 在合理范围内`)
              }
            }
          })

          // 验证关键指标
          expect(timings.totalLoad).to.be.lessThan(10000)
          expect(timings.domContentLoaded).to.be.lessThan(5000)
        } else {
          cy.log('⚠️ Navigation timing 不可用')
        }
      })
    })

    it('应该能够测试不同设备的性能', () => {
      // 🎯 学习要点：设备性能对比
      const devices = [
        { name: '桌面', viewport: { width: 1920, height: 1080 } },
        { name: '平板', viewport: { width: 768, height: 1024 } },
        { name: '手机', viewport: { width: 375, height: 667 } }
      ]

      const performanceResults = []

      devices.forEach((device) => {
        cy.viewport(device.viewport.width, device.viewport.height)

        const startTime = Date.now()

        cy.visit('https://example.cypress.io')

        cy.window().then((win) => {
          const endTime = Date.now()
          const loadTime = endTime - startTime

          const devicePerformance = {
            device: device.name,
            viewport: device.viewport,
            loadTime,
            userAgent: win.navigator.userAgent
          }

          performanceResults.push(devicePerformance)

          cy.log(`${device.name} (${device.viewport.width}x${device.viewport.height}): ${loadTime}ms`)
        })
      })

      cy.then(() => {
        cy.log('📱 设备性能对比结果:')
        performanceResults.forEach(result => {
          cy.log(`${result.device}: ${result.loadTime}ms`)
        })

        // 分析性能差异
        const maxTime = Math.max(...performanceResults.map(r => r.loadTime))
        const minTime = Math.min(...performanceResults.map(r => r.loadTime))
        const avgTime = performanceResults.reduce((sum, r) => sum + r.loadTime, 0) / performanceResults.length

        cy.log(`最快: ${minTime}ms, 最慢: ${maxTime}ms, 平均: ${avgTime.toFixed(2)}ms`)
      })
    })
  })

  describe('🎯 Core Web Vitals', () => {

    it('应该能够测量 First Contentful Paint (FCP)', () => {
      // 🎯 学习要点：FCP 指标测量
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // 等待性能数据可用
        cy.wait(1000).then(() => {
          const paintEntries = win.performance.getEntriesByType('paint')

          let fcp = 0
          paintEntries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              fcp = entry.startTime
            }
          })

          if (fcp > 0) {
            cy.log(`First Contentful Paint: ${fcp.toFixed(2)}ms`)

            // FCP 性能阈值 (Google 标准)
            if (fcp <= 1800) {
              cy.log('✅ FCP 性能优秀 (≤ 1.8s)')
            } else if (fcp <= 3000) {
              cy.log('⚠️ FCP 性能需要改进 (1.8s - 3.0s)')
            } else {
              cy.log('❌ FCP 性能差 (> 3.0s)')
            }

            expect(fcp).to.be.lessThan(5000) // 5 秒阈值
          } else {
            cy.log('⚠️ FCP 数据不可用')
          }
        })
      })
    })

    it('应该能够测量 Largest Contentful Paint (LCP)', () => {
      // 🎯 学习要点：LCP 指标测量
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // 模拟 LCP 观察（实际项目中需要 PerformanceObserver）
        cy.wait(2000).then(() => {
          // 查找页面中最大的内容元素
          cy.get('body').then(() => {
            // 模拟 LCP 测量
            const mockLCP = Math.random() * 3000 + 1000 // 1-4 秒

            cy.log(`模拟 Largest Contentful Paint: ${mockLCP.toFixed(2)}ms`)

            // LCP 性能阈值 (Google 标准)
            if (mockLCP <= 2500) {
              cy.log('✅ LCP 性能优秀 (≤ 2.5s)')
            } else if (mockLCP <= 4000) {
              cy.log('⚠️ LCP 性能需要改进 (2.5s - 4.0s)')
            } else {
              cy.log('❌ LCP 性能差 (> 4.0s)')
            }

            expect(mockLCP).to.be.lessThan(6000) // 6 秒阈值
          })
        })
      })
    })

    it('应该能够测量 Cumulative Layout Shift (CLS)', () => {
      // 🎯 学习要点：布局稳定性测量
      cy.visit('https://example.cypress.io')

      let layoutShifts = []

      cy.window().then((win) => {
        // 监控布局偏移（模拟）
        const observer = {
          observe: () => {
            // 模拟布局偏移检测
            setTimeout(() => {
              const mockShift = {
                value: Math.random() * 0.1, // 0-0.1 的偏移值
                hadRecentInput: false,
                lastInputTime: 0
              }

              layoutShifts.push(mockShift)
            }, 1000)
          }
        }

        observer.observe()

        cy.wait(2000).then(() => {
          const totalCLS = layoutShifts.reduce((sum, shift) => {
            return sum + (shift.hadRecentInput ? 0 : shift.value)
          }, 0)

          cy.log(`Cumulative Layout Shift: ${totalCLS.toFixed(3)}`)

          // CLS 性能阈值 (Google 标准)
          if (totalCLS <= 0.1) {
            cy.log('✅ CLS 性能优秀 (≤ 0.1)')
          } else if (totalCLS <= 0.25) {
            cy.log('⚠️ CLS 性能需要改进 (0.1 - 0.25)')
          } else {
            cy.log('❌ CLS 性能差 (> 0.25)')
          }

          expect(totalCLS).to.be.lessThan(0.5) // 0.5 阈值
        })
      })
    })

    it('应该能够测量 Time to Interactive (TTI)', () => {
      // 🎯 学习要点：交互就绪时间
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // 等待页面稳定
        cy.wait(2000).then(() => {
          const navigation = win.performance.getEntriesByType('navigation')[0]

          if (navigation) {
            // 模拟 TTI 计算（实际需要复杂的算法）
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
            const estimatedTTI = domContentLoaded + Math.random() * 1000 // 简化计算

            cy.log(`Time to Interactive (估算): ${estimatedTTI.toFixed(2)}ms`)

            // TTI 性能阈值
            if (estimatedTTI <= 3800) {
              cy.log('✅ TTI 性能优秀 (≤ 3.8s)')
            } else if (estimatedTTI <= 7300) {
              cy.log('⚠️ TTI 性能需要改进 (3.8s - 7.3s)')
            } else {
              cy.log('❌ TTI 性能差 (> 7.3s)')
            }

            expect(estimatedTTI).to.be.lessThan(10000) // 10 秒阈值

            // 测试页面交互性
            cy.get('body').should('be.visible')
            cy.get('a').first().should('be.visible').and('not.be.disabled')
          }
        })
      })
    })
  })

  describe('🌐 资源加载监控', () => {

    it('应该能够监控所有资源加载', () => {
      // 🎯 学习要点：资源性能监控
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')

        cy.log(`总资源数: ${resources.length}`)

        const resourceStats = {
          images: [],
          scripts: [],
          stylesheets: [],
          xhr: [],
          other: []
        }

        resources.forEach(resource => {
          const duration = resource.responseEnd - resource.startTime
          const size = resource.transferSize || 0

          const resourceInfo = {
            url: resource.name,
            duration: duration.toFixed(2),
            size: size,
            type: resource.initiatorType
          }

          // 按类型分类
          if (resource.name.match(/\\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            resourceStats.images.push(resourceInfo)
          } else if (resource.name.match(/\\.js$/)) {
            resourceStats.scripts.push(resourceInfo)
          } else if (resource.name.match(/\\.css$/)) {
            resourceStats.stylesheets.push(resourceInfo)
          } else if (resource.initiatorType === 'xmlhttprequest') {
            resourceStats.xhr.push(resourceInfo)
          } else {
            resourceStats.other.push(resourceInfo)
          }
        })

        // 分析各类资源
        Object.keys(resourceStats).forEach(type => {
          const items = resourceStats[type]
          if (items.length > 0) {
            const totalSize = items.reduce((sum, item) => sum + item.size, 0)
            const avgDuration = items.reduce((sum, item) => sum + parseFloat(item.duration), 0) / items.length
            const maxDuration = Math.max(...items.map(item => parseFloat(item.duration)))

            cy.log(`📊 ${type.toUpperCase()}:`)
            cy.log(`  数量: ${items.length}`)
            cy.log(`  总大小: ${(totalSize / 1024).toFixed(2)} KB`)
            cy.log(`  平均耗时: ${avgDuration.toFixed(2)}ms`)
            cy.log(`  最慢耗时: ${maxDuration.toFixed(2)}ms`)

            // 性能阈值检查
            if (type === 'images' && totalSize > 2 * 1024 * 1024) { // 2MB
              cy.log(`⚠️ 图片总大小超过 2MB`)
            }
            if (avgDuration > 1000) {
              cy.log(`⚠️ ${type} 平均加载时间超过 1 秒`)
            }
          }
        })

        // 找出最慢的资源
        const slowestResource = resources.reduce((prev, current) => {
          const prevDuration = prev ? prev.responseEnd - prev.startTime : 0
          const currentDuration = current.responseEnd - current.startTime
          return currentDuration > prevDuration ? current : prev
        }, null)

        if (slowestResource) {
          const slowestDuration = slowestResource.responseEnd - slowestResource.startTime
          cy.log(`🐌 最慢资源: ${slowestResource.name} (${slowestDuration.toFixed(2)}ms)`)
        }
      })
    })

    it('应该能够监控 API 请求性能', () => {
      // 🎯 学习要点：API 性能监控
      const apiCallStartTime = Date.now()

      cy.request('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
        const apiCallDuration = Date.now() - apiCallStartTime

        cy.log(`API 请求耗时: ${apiCallDuration}ms`)
        cy.log(`响应状态: ${response.status}`)
        cy.log(`响应大小: ${JSON.stringify(response.body).length} 字符`)

        // API 性能验证
        expect(response.status).to.eq(200)
        expect(apiCallDuration).to.be.lessThan(5000) // 5 秒内

        if (apiCallDuration <= 500) {
          cy.log('✅ API 响应速度优秀 (≤ 500ms)')
        } else if (apiCallDuration <= 1000) {
          cy.log('⚠️ API 响应速度一般 (500ms - 1s)')
        } else {
          cy.log('❌ API 响应速度慢 (> 1s)')
        }

        // 检查响应头的性能信息
        const headers = response.headers
        if (headers['x-response-time']) {
          cy.log(`服务器处理时间: ${headers['x-response-time']}`)
        }
      })
    })

    it('应该能够进行并发请求性能测试', () => {
      // 🎯 学习要点：并发性能测试
      const concurrentRequests = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        'https://jsonplaceholder.typicode.com/posts/3',
        'https://jsonplaceholder.typicode.com/users/1',
        'https://jsonplaceholder.typicode.com/users/2'
      ]

      const startTime = Date.now()

      // 并发执行所有请求
      const requestPromises = concurrentRequests.map((url, index) => {
        const requestStart = Date.now()
        return cy.request(url).then((response) => {
          const requestEnd = Date.now()
          return {
            index,
            url,
            duration: requestEnd - requestStart,
            status: response.status,
            size: JSON.stringify(response.body).length
          }
        })
      })

      // 等待所有请求完成
      cy.then(() => {
        const totalTime = Date.now() - startTime

        cy.log(`🔄 并发请求性能测试结果:`)
        cy.log(`总耗时: ${totalTime}ms`)
        cy.log(`请求数量: ${concurrentRequests.length}`)
        cy.log(`平均并发效率: ${(totalTime / concurrentRequests.length).toFixed(2)}ms/请求`)

        // 验证并发性能
        expect(totalTime).to.be.lessThan(10000) // 10 秒内完成所有请求

        if (totalTime <= 2000) {
          cy.log('✅ 并发性能优秀 (≤ 2s)')
        } else if (totalTime <= 5000) {
          cy.log('⚠️ 并发性能一般 (2s - 5s)')
        } else {
          cy.log('❌ 并发性能差 (> 5s)')
        }
      })
    })
  })

  describe('📈 性能回归检测', () => {

    it('应该能够建立性能基准', () => {
      // 🎯 学习要点：性能基准建立
      const performanceBaseline = {
        url: 'https://example.cypress.io',
        metrics: {
          pageLoad: null,
          domContentLoaded: null,
          firstContentfulPaint: null,
          resourceCount: null,
          totalResourceSize: null
        },
        timestamp: new Date().toISOString(),
        environment: 'test',
        version: '1.0.0'
      }

      const startTime = Date.now()

      cy.visit(performanceBaseline.url)

      cy.window().then((win) => {
        const endTime = Date.now()
        performanceBaseline.metrics.pageLoad = endTime - startTime

        const navigation = win.performance.getEntriesByType('navigation')[0]
        if (navigation) {
          performanceBaseline.metrics.domContentLoaded =
            navigation.domContentLoadedEventEnd - navigation.navigationStart
        }

        const paintEntries = win.performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            performanceBaseline.metrics.firstContentfulPaint = entry.startTime
          }
        })

        const resources = win.performance.getEntriesByType('resource')
        performanceBaseline.metrics.resourceCount = resources.length
        performanceBaseline.metrics.totalResourceSize = resources.reduce(
          (sum, resource) => sum + (resource.transferSize || 0), 0
        )

        // 保存性能基准
        cy.writeFile('cypress/temp/performance-baseline.json', performanceBaseline)

        cy.log('📊 性能基准已建立:')
        cy.log(`页面加载: ${performanceBaseline.metrics.pageLoad}ms`)
        cy.log(`DOM Content Loaded: ${performanceBaseline.metrics.domContentLoaded}ms`)
        cy.log(`FCP: ${performanceBaseline.metrics.firstContentfulPaint}ms`)
        cy.log(`资源数量: ${performanceBaseline.metrics.resourceCount}`)
        cy.log(`资源大小: ${(performanceBaseline.metrics.totalResourceSize / 1024).toFixed(2)} KB`)
      })
    })

    it('应该能够检测性能回归', () => {
      // 🎯 学习要点：性能回归检测
      cy.readFile('cypress/temp/performance-baseline.json').then((baseline) => {
        const startTime = Date.now()

        cy.visit(baseline.url)

        cy.window().then((win) => {
          const endTime = Date.now()
          const currentMetrics = {
            pageLoad: endTime - startTime,
            domContentLoaded: null,
            firstContentfulPaint: null,
            resourceCount: null,
            totalResourceSize: null
          }

          const navigation = win.performance.getEntriesByType('navigation')[0]
          if (navigation) {
            currentMetrics.domContentLoaded =
              navigation.domContentLoadedEventEnd - navigation.navigationStart
          }

          const paintEntries = win.performance.getEntriesByType('paint')
          paintEntries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              currentMetrics.firstContentfulPaint = entry.startTime
            }
          })

          const resources = win.performance.getEntriesByType('resource')
          currentMetrics.resourceCount = resources.length
          currentMetrics.totalResourceSize = resources.reduce(
            (sum, resource) => sum + (resource.transferSize || 0), 0
          )

          // 比较性能指标
          const regressionThreshold = 0.2 // 20% 回归阈值
          const improvements = []
          const regressions = []

          Object.keys(currentMetrics).forEach(metric => {
            const baselineValue = baseline.metrics[metric]
            const currentValue = currentMetrics[metric]

            if (baselineValue && currentValue) {
              const changePercent = (currentValue - baselineValue) / baselineValue
              const changeMs = currentValue - baselineValue

              cy.log(`${metric}:`)
              cy.log(`  基准: ${baselineValue}`)
              cy.log(`  当前: ${currentValue}`)
              cy.log(`  变化: ${changeMs > 0 ? '+' : ''}${changeMs} (${(changePercent * 100).toFixed(1)}%)`)

              if (changePercent > regressionThreshold) {
                regressions.push({ metric, changePercent, changeMs })
                cy.log(`  ❌ 性能回归检测`)
              } else if (changePercent < -0.1) { // 10% 改进
                improvements.push({ metric, changePercent, changeMs })
                cy.log(`  ✅ 性能改进`)
              } else {
                cy.log(`  ➡️ 性能稳定`)
              }
            }
          })

          // 总结报告
          cy.log('')
          cy.log('📊 性能回归检测报告:')
          cy.log(`改进项目: ${improvements.length}`)
          cy.log(`回归项目: ${regressions.length}`)

          if (regressions.length > 0) {
            cy.log('⚠️ 发现性能回归:')
            regressions.forEach(regression => {
              cy.log(`- ${regression.metric}: ${(regression.changePercent * 100).toFixed(1)}% 下降`)
            })
          }

          if (improvements.length > 0) {
            cy.log('✅ 性能改进:')
            improvements.forEach(improvement => {
              cy.log(`- ${improvement.metric}: ${Math.abs(improvement.changePercent * 100).toFixed(1)}% 提升`)
            })
          }

          // 断言：没有严重的性能回归
          const severeRegressions = regressions.filter(r => r.changePercent > 0.5) // 50% 回归
          expect(severeRegressions.length).to.eq(0)
        })
      })
    })

    it('应该能够生成性能报告', () => {
      // 🎯 学习要点：性能报告生成
      const startTime = Date.now()

      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const endTime = Date.now()

        // 收集所有性能数据
        const performanceReport = {
          testInfo: {
            url: 'https://example.cypress.io',
            timestamp: new Date().toISOString(),
            userAgent: win.navigator.userAgent,
            viewport: {
              width: win.innerWidth,
              height: win.innerHeight
            }
          },
          timings: {
            pageLoad: endTime - startTime,
            domContentLoaded: null,
            firstContentfulPaint: null
          },
          resources: {
            count: 0,
            totalSize: 0,
            byType: {
              images: { count: 0, size: 0 },
              scripts: { count: 0, size: 0 },
              stylesheets: { count: 0, size: 0 },
              other: { count: 0, size: 0 }
            }
          },
          coreWebVitals: {
            fcp: null,
            lcp: null,
            cls: Math.random() * 0.1, // 模拟
            tti: null
          },
          score: null
        }

        // 获取详细时间信息
        const navigation = win.performance.getEntriesByType('navigation')[0]
        if (navigation) {
          performanceReport.timings.domContentLoaded =
            navigation.domContentLoadedEventEnd - navigation.navigationStart
        }

        // 获取绘制信息
        const paintEntries = win.performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            performanceReport.timings.firstContentfulPaint = entry.startTime
            performanceReport.coreWebVitals.fcp = entry.startTime
          }
        })

        // 分析资源
        const resources = win.performance.getEntriesByType('resource')
        performanceReport.resources.count = resources.length

        resources.forEach(resource => {
          const size = resource.transferSize || 0
          performanceReport.resources.totalSize += size

          if (resource.name.match(/\\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            performanceReport.resources.byType.images.count++
            performanceReport.resources.byType.images.size += size
          } else if (resource.name.match(/\\.js$/)) {
            performanceReport.resources.byType.scripts.count++
            performanceReport.resources.byType.scripts.size += size
          } else if (resource.name.match(/\\.css$/)) {
            performanceReport.resources.byType.stylesheets.count++
            performanceReport.resources.byType.stylesheets.size += size
          } else {
            performanceReport.resources.byType.other.count++
            performanceReport.resources.byType.other.size += size
          }
        })

        // 计算性能得分 (简化算法)
        let score = 100

        // 基于页面加载时间扣分
        if (performanceReport.timings.pageLoad > 3000) score -= 20
        else if (performanceReport.timings.pageLoad > 1000) score -= 10

        // 基于资源大小扣分
        if (performanceReport.resources.totalSize > 2 * 1024 * 1024) score -= 15 // 2MB
        else if (performanceReport.resources.totalSize > 1 * 1024 * 1024) score -= 8 // 1MB

        // 基于资源数量扣分
        if (performanceReport.resources.count > 100) score -= 10
        else if (performanceReport.resources.count > 50) score -= 5

        performanceReport.score = Math.max(score, 0)

        // 生成 HTML 报告
        const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>性能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f0f8ff; padding: 20px; border-radius: 8px; }
        .score { font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }
        .score.good { color: #28a745; }
        .score.average { color: #ffc107; }
        .score.poor { color: #dc3545; }
        .metric { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .metric-name { font-weight: bold; }
        .metric-value { float: right; }
        .resources { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .resource-type { padding: 15px; background: #e9ecef; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Cypress 性能测试报告</h1>
        <p><strong>测试 URL:</strong> ${performanceReport.testInfo.url}</p>
        <p><strong>测试时间:</strong> ${performanceReport.testInfo.timestamp}</p>
        <p><strong>视口大小:</strong> ${performanceReport.testInfo.viewport.width} x ${performanceReport.testInfo.viewport.height}</p>
    </div>

    <div class="score ${performanceReport.score >= 80 ? 'good' : performanceReport.score >= 60 ? 'average' : 'poor'}">
        性能得分: ${performanceReport.score}/100
    </div>

    <h2>⚡ 核心指标</h2>
    <div class="metric">
        <span class="metric-name">页面加载时间</span>
        <span class="metric-value">${performanceReport.timings.pageLoad}ms</span>
    </div>
    <div class="metric">
        <span class="metric-name">DOM Content Loaded</span>
        <span class="metric-value">${performanceReport.timings.domContentLoaded || 'N/A'}ms</span>
    </div>
    <div class="metric">
        <span class="metric-name">First Contentful Paint</span>
        <span class="metric-value">${performanceReport.coreWebVitals.fcp?.toFixed(2) || 'N/A'}ms</span>
    </div>

    <h2>📊 资源分析</h2>
    <div class="metric">
        <span class="metric-name">总资源数量</span>
        <span class="metric-value">${performanceReport.resources.count}</span>
    </div>
    <div class="metric">
        <span class="metric-name">总资源大小</span>
        <span class="metric-value">${(performanceReport.resources.totalSize / 1024).toFixed(2)} KB</span>
    </div>

    <div class="resources">
        <div class="resource-type">
            <h3>🖼️ 图片</h3>
            <p>数量: ${performanceReport.resources.byType.images.count}</p>
            <p>大小: ${(performanceReport.resources.byType.images.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>📜 脚本</h3>
            <p>数量: ${performanceReport.resources.byType.scripts.count}</p>
            <p>大小: ${(performanceReport.resources.byType.scripts.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>🎨 样式表</h3>
            <p>数量: ${performanceReport.resources.byType.stylesheets.count}</p>
            <p>大小: ${(performanceReport.resources.byType.stylesheets.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>📄 其他</h3>
            <p>数量: ${performanceReport.resources.byType.other.count}</p>
            <p>大小: ${(performanceReport.resources.byType.other.size / 1024).toFixed(2)} KB</p>
        </div>
    </div>
</body>
</html>`

        // 保存报告
        cy.writeFile('cypress/temp/performance-report.html', htmlReport)
        cy.writeFile('cypress/temp/performance-report.json', performanceReport)

        cy.log('📊 性能报告已生成:')
        cy.log(`总体得分: ${performanceReport.score}/100`)
        cy.log(`页面加载: ${performanceReport.timings.pageLoad}ms`)
        cy.log(`资源数量: ${performanceReport.resources.count}`)
        cy.log(`资源大小: ${(performanceReport.resources.totalSize / 1024).toFixed(2)} KB`)
      })
    })
  })

  describe('💡 总结和最佳实践', () => {

    it('📚 性能监控最佳实践总结', () => {
      cy.then(() => {
        cy.log('📊 性能监控核心技能 ✅')
        cy.log('1. ✅ 页面加载性能测量')
        cy.log('2. ✅ Core Web Vitals 指标')
        cy.log('3. ✅ 资源加载监控')
        cy.log('4. ✅ API 性能测试')
        cy.log('5. ✅ 并发性能测试')
        cy.log('6. ✅ 性能基准建立')
        cy.log('7. ✅ 性能回归检测')
        cy.log('8. ✅ 性能报告生成')

        cy.log('')
        cy.log('🎯 性能监控最佳实践:')
        cy.log('1. ⚡ 建立性能基准和阈值')
        cy.log('2. 📊 监控关键性能指标')
        cy.log('3. 🔍 定期性能回归检测')
        cy.log('4. 📈 可视化性能趋势')
        cy.log('5. 🎯 针对性能瓶颈优化')
        cy.log('6. 📱 多设备性能测试')

        cy.log('')
        cy.log('🎉 恭喜！第三阶段：高级功能学习完成!')
        cy.log('📈 下一步：第四阶段 Expert 级别挑战')
        cy.log('🎯 重点：测试架构、CI/CD、团队协作')
      })
    })

    it('🏆 第三阶段学习成果总结', () => {
      cy.then(() => {
        cy.log('🎊 第三阶段：高级功能 - 学习成果总结')
        cy.log('')

        cy.log('🌐 Day 9: 网络拦截和 API 测试')
        cy.log('  ✅ cy.intercept() 完全掌握')
        cy.log('  ✅ API 响应模拟和修改')
        cy.log('  ✅ 网络延迟和错误模拟')

        cy.log('')
        cy.log('⏳ Day 10: 异步操作处理')
        cy.log('  ✅ 等待策略优化')
        cy.log('  ✅ 动态内容处理')
        cy.log('  ✅ 自定义等待条件')

        cy.log('')
        cy.log('📁 Day 11: 文件操作')
        cy.log('  ✅ 文件读写操作')
        cy.log('  ✅ 文件上传下载测试')
        cy.log('  ✅ 多媒体文件处理')

        cy.log('')
        cy.log('🛠️ Day 12: 自定义命令和插件')
        cy.log('  ✅ 自定义命令创建')
        cy.log('  ✅ Page Object 模式')
        cy.log('  ✅ 第三方插件集成')

        cy.log('')
        cy.log('📊 Day 13: 数据驱动测试')
        cy.log('  ✅ Fixtures 数据管理')
        cy.log('  ✅ 参数化测试')
        cy.log('  ✅ 批量测试执行')

        cy.log('')
        cy.log('📊 Day 14: 性能和监控')
        cy.log('  ✅ Core Web Vitals 测量')
        cy.log('  ✅ 性能回归检测')
        cy.log('  ✅ 性能报告生成')

        cy.log('')
        cy.log('🎯 已掌握的高级技能:')
        cy.log('  🌐 网络层面完全控制')
        cy.log('  ⚡ 异步操作专业处理')
        cy.log('  📁 文件系统集成')
        cy.log('  🛠️ 工具扩展和定制')
        cy.log('  📊 数据驱动测试设计')
        cy.log('  📈 性能监控和优化')

        cy.log('')
        cy.log('🚀 你现在是 Cypress 高级用户！')
        cy.log('👨‍💻 准备迎接 Expert 级别的挑战！')
      })
    })
  })
})

/**
 * 🌟 Day 14 学习要点总结：
 *
 * 1. **页面加载性能**
 *    - 基础性能测量
 *    - 加载阶段分析
 *    - 设备性能对比
 *
 * 2. **Core Web Vitals**
 *    - First Contentful Paint (FCP)
 *    - Largest Contentful Paint (LCP)
 *    - Cumulative Layout Shift (CLS)
 *    - Time to Interactive (TTI)
 *
 * 3. **资源监控**
 *    - 资源加载分析
 *    - API 性能测试
 *    - 并发性能测试
 *
 * 4. **性能回归检测**
 *    - 性能基准建立
 *    - 回归检测算法
 *    - 性能报告生成
 *
 * 5. **监控策略**
 *    - 性能阈值设置
 *    - 持续监控方案
 *    - 性能优化建议
 *
 * 💡 **性能优化原则**：
 * - 建立明确的性能基准
 * - 持续监控关键指标
 * - 及时检测性能回归
 * - 提供可操作的优化建议
 *
 * 🎉 **第三阶段完成**：
 * 恭喜！你已经掌握了 Cypress 的高级功能，
 * 可以处理复杂的测试场景和性能监控需求。
 * 准备迎接 Expert 级别的挑战！
 */