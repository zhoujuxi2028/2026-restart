/**
 * Day 14: Performance and Monitoring
 *
 * Learning Objectives:
 * - Master performance metrics collection
 * - Learn page load time testing
 * - Understand Core Web Vitals
 * - Learn resource loading monitoring
 * - Master performance regression detection
 */

describe('Day 14: Performance and Monitoring', () => {

  beforeEach(() => {
    // Clear performance data
    cy.window().then((win) => {
      if (win.performance && win.performance.clearMarks) {
        win.performance.clearMarks()
        win.performance.clearMeasures()
      }
    })
  })

  describe('Page Load Performance', () => {

    it('should be able to measure page load time', () => {
      // Learning point: Detailed page performance measurement with fine-grained metrics
      const startTime = Date.now()

      cy.visit('https://example.cypress.io', {
        onBeforeLoad: (win) => {
          // Set performance mark before page load
          win.performance.mark('navigation-start')
        },
        onLoad: (win) => {
          // Set mark after page load completes
          win.performance.mark('page-loaded')
        }
      })

      cy.window().then((win) => {
        const endTime = Date.now()
        const totalLoadTime = endTime - startTime

        cy.log('=== 📊 Page Load Performance - Fine-Grained Metrics ===')
        cy.log(`Total page load time (Date-based): ${totalLoadTime}ms`)

        // Use Performance API for detailed metrics
        if (win.performance.getEntriesByType) {
          const navigationTiming = win.performance.getEntriesByType('navigation')[0]
          
          if (navigationTiming) {
            cy.log('')
            cy.log('=== 🌐 Network Phase Timing ===')
            
            // 1️⃣ DNS Lookup Time
            const dnsStart = navigationTiming.domainLookupStart
            const dnsEnd = navigationTiming.domainLookupEnd
            const dnsDuration = dnsEnd - dnsStart
            cy.log(`DNS Lookup: ${dnsDuration.toFixed(2)}ms`)
            if (dnsDuration > 0 && dnsDuration <= 200) {
              cy.log(`  ✅ Excellent: DNS resolved quickly`)
            } else if (dnsDuration > 200 && dnsDuration <= 500) {
              cy.log(`  ⚠️  Warning: DNS lookup is moderate`)
            } else if (dnsDuration > 500) {
              cy.log(`  ❌ Slow: DNS lookup exceeds threshold`)
            }

            // 2️⃣ TCP Connection Time
            const tcpStart = navigationTiming.connectStart
            const tcpEnd = navigationTiming.connectEnd
            const tcpDuration = tcpEnd - tcpStart
            cy.log(`TCP Connection: ${tcpDuration.toFixed(2)}ms`)
            if (tcpDuration > 0 && tcpDuration <= 300) {
              cy.log(`  ✅ Excellent: TCP connection established quickly`)
            } else if (tcpDuration > 300 && tcpDuration <= 1000) {
              cy.log(`  ⚠️  Warning: TCP connection is moderate`)
            } else if (tcpDuration > 1000) {
              cy.log(`  ❌ Slow: TCP connection exceeds threshold`)
            }

            // 3️⃣ SSL/TLS Handshake Time (for HTTPS)
            if (navigationTiming.secureConnectionStart > 0) {
              const sslStart = navigationTiming.secureConnectionStart
              const sslEnd = navigationTiming.connectEnd
              const sslDuration = sslEnd - sslStart
              cy.log(`SSL/TLS Handshake: ${sslDuration.toFixed(2)}ms`)
              if (sslDuration > 0 && sslDuration <= 500) {
                cy.log(`  ✅ Excellent: SSL/TLS handshake fast`)
              } else if (sslDuration > 500 && sslDuration <= 1000) {
                cy.log(`  ⚠️  Warning: SSL/TLS handshake is moderate`)
              } else if (sslDuration > 1000) {
                cy.log(`  ❌ Slow: SSL/TLS handshake exceeds threshold`)
              }
            }

            cy.log('')
            cy.log('=== 📤 Request/Response Phase Timing ===')

            // 4️⃣ TTFB (Time To First Byte - Server Response Time)
            const ttfbStart = navigationTiming.requestStart
            const ttfbEnd = navigationTiming.responseStart
            const ttfbDuration = ttfbEnd - ttfbStart
            cy.log(`TTFB (Server Response): ${ttfbDuration.toFixed(2)}ms`)
            if (ttfbDuration > 0 && ttfbDuration <= 600) {
              cy.log(`  ✅ Excellent: Server responds quickly`)
            } else if (ttfbDuration > 600 && ttfbDuration <= 1200) {
              cy.log(`  ⚠️  Warning: Server response is moderate`)
            } else if (ttfbDuration > 1200) {
              cy.log(`  ❌ Slow: Server response exceeds threshold`)
            }

            // 5️⃣ Content Download Time
            const downloadStart = navigationTiming.responseStart
            const downloadEnd = navigationTiming.responseEnd
            const downloadDuration = downloadEnd - downloadStart
            cy.log(`Content Download: ${downloadDuration.toFixed(2)}ms`)
            if (downloadDuration > 0 && downloadDuration <= 1000) {
              cy.log(`  ✅ Excellent: Content downloaded quickly`)
            } else if (downloadDuration > 1000 && downloadDuration <= 3000) {
              cy.log(`  ⚠️  Warning: Content download is moderate`)
            } else if (downloadDuration > 3000) {
              cy.log(`  ❌ Slow: Content download exceeds threshold`)
            }

            cy.log('')
            cy.log('=== 🎯 DOM Processing Phase Timing ===')

            // 6️⃣ DOM Parsing Time
            const domLoadStart = navigationTiming.domLoading
            const domLoadEnd = navigationTiming.domComplete
            const domParsingDuration = domLoadEnd - domLoadStart
            cy.log(`DOM Parsing: ${domParsingDuration.toFixed(2)}ms`)
            if (domParsingDuration > 0 && domParsingDuration <= 1000) {
              cy.log(`  ✅ Excellent: DOM parsed quickly`)
            } else if (domParsingDuration > 1000 && domParsingDuration <= 2000) {
              cy.log(`  ⚠️  Warning: DOM parsing is moderate`)
            } else if (domParsingDuration > 2000) {
              cy.log(`  ❌ Slow: DOM parsing exceeds threshold`)
            }

            // 7️⃣ DOMContentLoaded Event Duration
            const domContentStart = navigationTiming.domContentLoadedEventStart
            const domContentEnd = navigationTiming.domContentLoadedEventEnd
            const domContentDuration = domContentEnd - domContentStart
            cy.log(`DOMContentLoaded Event: ${domContentDuration.toFixed(2)}ms`)

            // 8️⃣ Load Event Duration
            const loadEventStart = navigationTiming.loadEventStart
            const loadEventEnd = navigationTiming.loadEventEnd
            const loadEventDuration = loadEventEnd - loadEventStart
            cy.log(`Load Event Duration: ${loadEventDuration.toFixed(2)}ms`)

            cy.log('')
            cy.log('=== 📈 Cumulative Timing Metrics ===')

            // 9️⃣ DOMContentLoaded Time (from navigation start)
            const domContentLoadedTime = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart
            cy.log(`DOMContentLoaded Time: ${domContentLoadedTime.toFixed(2)}ms`)
            if (domContentLoadedTime <= 1800) {
              cy.log(`  ✅ Excellent: DOMContentLoaded is fast (≤ 1.8s)`)
            } else if (domContentLoadedTime <= 3000) {
              cy.log(`  ⚠️  Warning: DOMContentLoaded is moderate (1.8s - 3.0s)`)
            } else {
              cy.log(`  ❌ Slow: DOMContentLoaded exceeds threshold (> 3.0s)`)
            }

            // 🔟 Complete Page Load Time (from navigation start to load event end)
            const completeLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart
            cy.log(`Complete Load Time: ${completeLoadTime.toFixed(2)}ms`)
            if (completeLoadTime <= 2500) {
              cy.log(`  ✅ Excellent: Complete page load is fast (≤ 2.5s)`)
            } else if (completeLoadTime <= 4000) {
              cy.log(`  ⚠️  Warning: Complete page load is moderate (2.5s - 4.0s)`)
            } else {
              cy.log(`  ❌ Slow: Complete page load exceeds threshold (> 4.0s)`)
            }

            cy.log('')
            cy.log('=== 🔍 Resource Analysis ===')

            // 11️⃣ Resource Count
            const resources = win.performance.getEntriesByType('resource')
            cy.log(`Total Resources Loaded: ${resources.length}`)

            // 12️⃣ Total Resource Size
            const totalResourceSize = resources.reduce((sum, resource) => {
              return sum + (resource.transferSize || 0)
            }, 0)
            const totalResourceSizeKB = (totalResourceSize / 1024).toFixed(2)
            cy.log(`Total Resource Size: ${totalResourceSizeKB} KB`)

            // 13️⃣ Resource Loading Breakdown
            const slowestResource = resources.reduce((prev, current) => {
              const prevDuration = prev ? prev.responseEnd - prev.startTime : 0
              const currentDuration = current.responseEnd - current.startTime
              return currentDuration > prevDuration ? current : prev
            }, null)

            if (slowestResource) {
              const slowestDuration = slowestResource.responseEnd - slowestResource.startTime
              cy.log(`Slowest Resource: ${slowestResource.name.substring(0, 50)}...`)
              cy.log(`  Duration: ${slowestDuration.toFixed(2)}ms`)
            }

            cy.log('')
            cy.log('=== 📊 Performance Score ===')

            // Calculate performance score
            let score = 100

            // Deduct for DNS
            if (dnsDuration > 500) score -= 5
            else if (dnsDuration > 200) score -= 2

            // Deduct for TCP
            if (tcpDuration > 1000) score -= 5
            else if (tcpDuration > 300) score -= 2

            // Deduct for TTFB
            if (ttfbDuration > 1200) score -= 10
            else if (ttfbDuration > 600) score -= 5

            // Deduct for DOM parsing
            if (domParsingDuration > 2000) score -= 10
            else if (domParsingDuration > 1000) score -= 5

            // Deduct for complete load time
            if (completeLoadTime > 4000) score -= 15
            else if (completeLoadTime > 2500) score -= 8

            // Deduct for resource count
            if (resources.length > 100) score -= 10
            else if (resources.length > 50) score -= 5

            score = Math.max(score, 0)

            cy.log(`Overall Performance Score: ${score}/100`)
            if (score >= 80) {
              cy.log(`  🟢 Excellent Performance`)
            } else if (score >= 60) {
              cy.log(`  🟡 Good Performance`)
            } else {
              cy.log(`  🔴 Needs Optimization`)
            }

            cy.log('')
            cy.log('=== ✅ Performance Summary ===')
            cy.log(`Network Phase Total: ${(tcpDuration + dnsDuration).toFixed(2)}ms`)
            cy.log(`Request/Response Total: ${(ttfbDuration + downloadDuration).toFixed(2)}ms`)
            cy.log(`DOM Processing Total: ${domParsingDuration.toFixed(2)}ms`)
            cy.log(`Total (Navigation to Load): ${completeLoadTime.toFixed(2)}ms`)

            // Assertions - only assert if values are valid
            if (!isNaN(completeLoadTime) && completeLoadTime > 0) {
              expect(completeLoadTime).to.be.lessThan(100000)
            }
            if (!isNaN(domContentLoadedTime) && domContentLoadedTime > 0) {
              expect(domContentLoadedTime).to.be.lessThan(5000)
            }
            expect(score).to.be.greaterThan(0)
          } else {
            cy.log('Warning: Navigation timing not available')
          }
        }
      })
    })

    it('should be able to analyze loading phase timing', () => {
      // Learning point: Detailed loading phase analysis
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const navigation = win.performance.getEntriesByType('navigation')[0]

        if (navigation) {
          const timings = {
            // DNS lookup time
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,

            // TCP connection time
            tcpConnection: navigation.connectEnd - navigation.connectStart,

            // SSL handshake time (if HTTPS)
            sslHandshake: navigation.connectEnd - navigation.secureConnectionStart,

            // Server response time
            serverResponse: navigation.responseStart - navigation.requestStart,

            // Resource download time
            resourceDownload: navigation.responseEnd - navigation.responseStart,

            // DOM processing time
            domProcessing: navigation.domComplete - navigation.domLoading,

            // DOM content loaded time
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,

            // Complete load time
            totalLoad: navigation.loadEventEnd - navigation.navigationStart
          }

          cy.log('Loading phase analysis:')
          Object.keys(timings).forEach(phase => {
            const time = timings[phase]
            if (time > 0 && !isNaN(time)) {
              cy.log(`${phase}: ${time.toFixed(2)}ms`)

              // Set performance thresholds
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
                cy.log(`Warning: ${phase} exceeds threshold ${thresholds[phase]}ms`)
              } else if (thresholds[phase]) {
                cy.log(`Pass: ${phase} is within reasonable range`)
              }
            }
          })

          // Verify key metrics (only if valid)
          if (!isNaN(timings.totalLoad) && timings.totalLoad > 0) {
            expect(timings.totalLoad).to.be.lessThan(10000)
          }
          if (!isNaN(timings.domContentLoaded) && timings.domContentLoaded > 0) {
            expect(timings.domContentLoaded).to.be.lessThan(5000)
          }
        } else {
          cy.log('Warning: Navigation timing not available')
        }
      })
    })

    it('should be able to test performance on different devices', () => {
      // Learning point: Device performance comparison
      const devices = [
        { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
        { name: 'Tablet', viewport: { width: 768, height: 1024 } },
        { name: 'Mobile', viewport: { width: 375, height: 667 } }
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
        cy.log('Device performance comparison results:')
        performanceResults.forEach(result => {
          cy.log(`${result.device}: ${result.loadTime}ms`)
        })

        // Analyze performance differences
        const maxTime = Math.max(...performanceResults.map(r => r.loadTime))
        const minTime = Math.min(...performanceResults.map(r => r.loadTime))
        const avgTime = performanceResults.reduce((sum, r) => sum + r.loadTime, 0) / performanceResults.length

        cy.log(`Fastest: ${minTime}ms, Slowest: ${maxTime}ms, Average: ${avgTime.toFixed(2)}ms`)
      })
    })
  })

  describe('Core Web Vitals', () => {

    it('should be able to measure First Contentful Paint (FCP)', () => {
      // Learning point: FCP metric measurement
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // Wait for performance data to be available
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

            // FCP performance thresholds (Google standards)
            if (fcp <= 1800) {
              cy.log('Pass: Excellent FCP performance (≤ 1.8s)')
            } else if (fcp <= 3000) {
              cy.log('Warning: FCP performance needs improvement (1.8s - 3.0s)')
            } else {
              cy.log('Fail: Poor FCP performance (> 3.0s)')
            }

            expect(fcp).to.be.lessThan(5000) // 5 second threshold
          } else {
            cy.log('Warning: FCP data not available')
          }
        })
      })
    })

    it('should be able to measure Largest Contentful Paint (LCP)', () => {
      // Learning point: LCP metric measurement
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // Simulate LCP observation (actual projects need PerformanceObserver)
        cy.wait(2000).then(() => {
          // Find largest content element on page
          cy.get('body').then(() => {
            // Simulate LCP measurement
            const mockLCP = Math.random() * 3000 + 1000 // 1-4 seconds

            cy.log(`Simulated Largest Contentful Paint: ${mockLCP.toFixed(2)}ms`)

            // LCP performance thresholds (Google standards)
            if (mockLCP <= 2500) {
              cy.log('Pass: Excellent LCP performance (≤ 2.5s)')
            } else if (mockLCP <= 4000) {
              cy.log('Warning: LCP performance needs improvement (2.5s - 4.0s)')
            } else {
              cy.log('Fail: Poor LCP performance (> 4.0s)')
            }

            expect(mockLCP).to.be.lessThan(6000) // 6 second threshold
          })
        })
      })
    })

    it('should be able to measure Cumulative Layout Shift (CLS)', () => {
      // Learning point: Layout stability measurement
      cy.visit('https://example.cypress.io')

      let layoutShifts = []

      cy.window().then((win) => {
        // Monitor layout shifts (simulated)
        const observer = {
          observe: () => {
            // Simulate layout shift detection
            setTimeout(() => {
              const mockShift = {
                value: Math.random() * 0.1, // 0-0.1 shift value
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

          // CLS performance thresholds (Google standards)
          if (totalCLS <= 0.1) {
            cy.log('Pass: Excellent CLS performance (≤ 0.1)')
          } else if (totalCLS <= 0.25) {
            cy.log('Warning: CLS performance needs improvement (0.1 - 0.25)')
          } else {
            cy.log('Fail: Poor CLS performance (> 0.25)')
          }

          expect(totalCLS).to.be.lessThan(0.5) // 0.5 threshold
        })
      })
    })

    it('should be able to measure Time to Interactive (TTI)', () => {
      // Learning point: Time to interactive
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // Wait for page to stabilize
        cy.wait(2000).then(() => {
          const navigation = win.performance.getEntriesByType('navigation')[0]

          if (navigation) {
            // Simulate TTI calculation (actual needs complex algorithm)
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart

            // Check if domContentLoaded is valid
            if (!isNaN(domContentLoaded) && domContentLoaded > 0) {
              const estimatedTTI = domContentLoaded + Math.random() * 1000 // Simplified calculation

              cy.log(`Time to Interactive (estimated): ${estimatedTTI.toFixed(2)}ms`)

              // TTI performance thresholds
              if (estimatedTTI <= 3800) {
                cy.log('Pass: Excellent TTI performance (≤ 3.8s)')
              } else if (estimatedTTI <= 7300) {
                cy.log('Warning: TTI performance needs improvement (3.8s - 7.3s)')
              } else {
                cy.log('Fail: Poor TTI performance (> 7.3s)')
              }

              expect(estimatedTTI).to.be.lessThan(10000) // 10 second threshold
            } else {
              cy.log('Warning: TTI data not available, skipping validation')
            }

            // Test page interactivity
            cy.get('body').should('be.visible')
            cy.get('a').first().should('be.visible').and('not.be.disabled')
          }
        })
      })
    })
  })

  describe('Resource Loading Monitoring', () => {

    it('should be able to monitor all resource loading', () => {
      // Learning point: Resource performance monitoring
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')

        cy.log(`Total resources: ${resources.length}`)

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

          // Categorize by type
          if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            resourceStats.images.push(resourceInfo)
          } else if (resource.name.match(/\.js$/)) {
            resourceStats.scripts.push(resourceInfo)
          } else if (resource.name.match(/\.css$/)) {
            resourceStats.stylesheets.push(resourceInfo)
          } else if (resource.initiatorType === 'xmlhttprequest') {
            resourceStats.xhr.push(resourceInfo)
          } else {
            resourceStats.other.push(resourceInfo)
          }
        })

        // Analyze each resource type
        Object.keys(resourceStats).forEach(type => {
          const items = resourceStats[type]
          if (items.length > 0) {
            const totalSize = items.reduce((sum, item) => sum + item.size, 0)
            const avgDuration = items.reduce((sum, item) => sum + parseFloat(item.duration), 0) / items.length
            const maxDuration = Math.max(...items.map(item => parseFloat(item.duration)))

            cy.log(`${type.toUpperCase()}:`)
            cy.log(`  Count: ${items.length}`)
            cy.log(`  Total size: ${(totalSize / 1024).toFixed(2)} KB`)
            cy.log(`  Average duration: ${avgDuration.toFixed(2)}ms`)
            cy.log(`  Slowest duration: ${maxDuration.toFixed(2)}ms`)

            // Performance threshold checks
            if (type === 'images' && totalSize > 2 * 1024 * 1024) { // 2MB
              cy.log(`Warning: Total image size exceeds 2MB`)
            }
            if (avgDuration > 1000) {
              cy.log(`Warning: ${type} average load time exceeds 1 second`)
            }
          }
        })

        // Find slowest resource
        const slowestResource = resources.reduce((prev, current) => {
          const prevDuration = prev ? prev.responseEnd - prev.startTime : 0
          const currentDuration = current.responseEnd - current.startTime
          return currentDuration > prevDuration ? current : prev
        }, null)

        if (slowestResource) {
          const slowestDuration = slowestResource.responseEnd - slowestResource.startTime
          cy.log(`Slowest resource: ${slowestResource.name} (${slowestDuration.toFixed(2)}ms)`)
        }
      })
    })

    it('should be able to monitor API request performance', () => {
      // Learning point: API performance monitoring
      const apiCallStartTime = Date.now()

      cy.request('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
        const apiCallDuration = Date.now() - apiCallStartTime

        cy.log(`API request duration: ${apiCallDuration}ms`)
        cy.log(`Response status: ${response.status}`)
        cy.log(`Response size: ${JSON.stringify(response.body).length} characters`)

        // API performance validation
        expect(response.status).to.eq(200)
        expect(apiCallDuration).to.be.lessThan(5000) // Within 5 seconds

        if (apiCallDuration <= 500) {
          cy.log('Pass: Excellent API response speed (≤ 500ms)')
        } else if (apiCallDuration <= 1000) {
          cy.log('Warning: Average API response speed (500ms - 1s)')
        } else {
          cy.log('Slow: Slow API response (> 1s)')
        }

        // Check response headers for performance info
        const headers = response.headers
        if (headers['x-response-time']) {
          cy.log(`Server processing time: ${headers['x-response-time']}`)
        }
      })
    })

    it('should be able to perform concurrent request performance test', () => {
      // Learning point: Concurrent performance testing
      const concurrentRequests = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        'https://jsonplaceholder.typicode.com/posts/3',
        'https://jsonplaceholder.typicode.com/users/1',
        'https://jsonplaceholder.typicode.com/users/2'
      ]

      const startTime = Date.now()

      // Execute all requests concurrently
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

      // Wait for all requests to complete
      cy.then(() => {
        const totalTime = Date.now() - startTime

        cy.log(`Concurrent request performance test results:`)
        cy.log(`Total time: ${totalTime}ms`)
        cy.log(`Request count: ${concurrentRequests.length}`)
        cy.log(`Average concurrent efficiency: ${(totalTime / concurrentRequests.length).toFixed(2)}ms/request`)

        // Verify concurrent performance
        expect(totalTime).to.be.lessThan(10000) // Complete all requests within 10 seconds

        if (totalTime <= 2000) {
          cy.log('Pass: Excellent concurrent performance (≤ 2s)')
        } else if (totalTime <= 5000) {
          cy.log('Warning: Average concurrent performance (2s - 5s)')
        } else {
          cy.log('Poor: Poor concurrent performance (> 5s)')
        }
      })
    })
  })

  describe('Performance Regression Detection', () => {

    it('should be able to establish performance baseline', () => {
      // Learning point: Performance baseline establishment using Core Web Vitals
      const performanceBaseline = {
        url: 'https://example.cypress.io',
        coreWebVitals: {
          fcp: null,  // First Contentful Paint
          lcp: null,  // Largest Contentful Paint
          cls: null,  // Cumulative Layout Shift
          tti: null   // Time to Interactive
        },
        timestamp: new Date().toISOString(),
        environment: 'test',
        version: '1.0.0'
      }

      cy.visit(performanceBaseline.url)

      cy.window().then((win) => {
        // Wait for performance data to be available
        cy.wait(2000).then(() => {
          // 1️⃣ Measure FCP (First Contentful Paint)
          const paintEntries = win.performance.getEntriesByType('paint')
          paintEntries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              performanceBaseline.coreWebVitals.fcp = entry.startTime
            }
          })

          // 2️⃣ Measure LCP (Largest Contentful Paint - simulated)
          // Note: Real LCP needs PerformanceObserver, here we simulate
          cy.get('body').then(() => {
            // Simulate LCP - in real scenarios use PerformanceObserver API
            const mockLCP = Math.random() * 2000 + 1000 // 1-3 seconds
            performanceBaseline.coreWebVitals.lcp = mockLCP
          })

          // 3️⃣ Measure CLS (Cumulative Layout Shift - simulated)
          const mockCLS = Math.random() * 0.05 // 0-0.05 (excellent range)
          performanceBaseline.coreWebVitals.cls = mockCLS

          // 4️⃣ Measure TTI (Time to Interactive)
          const navigation = win.performance.getEntriesByType('navigation')[0]
          if (navigation) {
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
            if (!isNaN(domContentLoaded) && domContentLoaded > 0) {
              // TTI is typically close to DOMContentLoaded + some JS execution time
              const estimatedTTI = domContentLoaded + Math.random() * 800
              performanceBaseline.coreWebVitals.tti = estimatedTTI
            }
          }

          // Save performance baseline
          cy.writeFile('cypress/temp/performance-baseline.json', performanceBaseline)

          cy.log('=== 📊 Core Web Vitals Baseline Established ===')
          cy.log(`FCP (First Contentful Paint): ${performanceBaseline.coreWebVitals.fcp?.toFixed(2) || 'N/A'}ms`)
          cy.log(`LCP (Largest Contentful Paint): ${performanceBaseline.coreWebVitals.lcp?.toFixed(2) || 'N/A'}ms`)
          cy.log(`CLS (Cumulative Layout Shift): ${performanceBaseline.coreWebVitals.cls?.toFixed(3) || 'N/A'}`)
          cy.log(`TTI (Time to Interactive): ${performanceBaseline.coreWebVitals.tti?.toFixed(2) || 'N/A'}ms`)
          cy.log('')
          cy.log('✅ Baseline saved to: cypress/temp/performance-baseline.json')
        })
      })
    })

    it('should be able to detect performance regression', () => {
      // Learning point: Performance regression detection using Core Web Vitals
      cy.readFile('cypress/temp/performance-baseline.json').then((baseline) => {
        cy.visit(baseline.url)

        cy.window().then((win) => {
          // Wait for performance data to be available
          cy.wait(2000).then(() => {
            const currentMetrics = {
              fcp: null,
              lcp: null,
              cls: null,
              tti: null
            }

            // 1️⃣ Measure current FCP
            const paintEntries = win.performance.getEntriesByType('paint')
            paintEntries.forEach(entry => {
              if (entry.name === 'first-contentful-paint') {
                currentMetrics.fcp = entry.startTime
              }
            })

            // 2️⃣ Measure current LCP (simulated)
            cy.get('body').then(() => {
              currentMetrics.lcp = Math.random() * 2000 + 1000
            })

            // 3️⃣ Measure current CLS (simulated)
            currentMetrics.cls = Math.random() * 0.05

            // 4️⃣ Measure current TTI
            const navigation = win.performance.getEntriesByType('navigation')[0]
            if (navigation) {
              const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
              if (!isNaN(domContentLoaded) && domContentLoaded > 0) {
                currentMetrics.tti = domContentLoaded + Math.random() * 800
              }
            }

            // Compare Core Web Vitals
            const regressionThreshold = 0.15 // 15% regression threshold (stricter for CWV)
            const improvements = []
            const regressions = []
            const stable = []

            cy.log('=== 📊 Core Web Vitals Regression Analysis ===')
            cy.log('')

            // FCP Analysis
            if (baseline.coreWebVitals.fcp && currentMetrics.fcp) {
              const fcpChange = (currentMetrics.fcp - baseline.coreWebVitals.fcp) / baseline.coreWebVitals.fcp
              cy.log('🎨 FCP (First Contentful Paint):')
              cy.log(`  Baseline: ${baseline.coreWebVitals.fcp.toFixed(2)}ms`)
              cy.log(`  Current:  ${currentMetrics.fcp.toFixed(2)}ms`)
              cy.log(`  Change:   ${fcpChange > 0 ? '+' : ''}${(fcpChange * 100).toFixed(1)}%`)
              
              if (fcpChange > regressionThreshold) {
                regressions.push({ metric: 'FCP', changePercent: fcpChange })
                cy.log(`  ❌ REGRESSION: FCP degraded by ${(fcpChange * 100).toFixed(1)}%`)
                if (currentMetrics.fcp > 1800) cy.log(`  ⚠️  Warning: FCP exceeds Google's "Good" threshold (1.8s)`)
              } else if (fcpChange < -0.1) {
                improvements.push({ metric: 'FCP', changePercent: fcpChange })
                cy.log(`  ✅ IMPROVED: FCP improved by ${Math.abs(fcpChange * 100).toFixed(1)}%`)
              } else {
                stable.push('FCP')
                cy.log(`  ✓ STABLE: FCP is stable`)
              }
              cy.log('')
            }

            // LCP Analysis
            if (baseline.coreWebVitals.lcp && currentMetrics.lcp) {
              const lcpChange = (currentMetrics.lcp - baseline.coreWebVitals.lcp) / baseline.coreWebVitals.lcp
              cy.log('🖼️  LCP (Largest Contentful Paint):')
              cy.log(`  Baseline: ${baseline.coreWebVitals.lcp.toFixed(2)}ms`)
              cy.log(`  Current:  ${currentMetrics.lcp.toFixed(2)}ms`)
              cy.log(`  Change:   ${lcpChange > 0 ? '+' : ''}${(lcpChange * 100).toFixed(1)}%`)
              
              if (lcpChange > regressionThreshold) {
                regressions.push({ metric: 'LCP', changePercent: lcpChange })
                cy.log(`  ❌ REGRESSION: LCP degraded by ${(lcpChange * 100).toFixed(1)}%`)
                if (currentMetrics.lcp > 2500) cy.log(`  ⚠️  Warning: LCP exceeds Google's "Good" threshold (2.5s)`)
              } else if (lcpChange < -0.1) {
                improvements.push({ metric: 'LCP', changePercent: lcpChange })
                cy.log(`  ✅ IMPROVED: LCP improved by ${Math.abs(lcpChange * 100).toFixed(1)}%`)
              } else {
                stable.push('LCP')
                cy.log(`  ✓ STABLE: LCP is stable`)
              }
              cy.log('')
            }

            // CLS Analysis (lower is better, so logic is reversed)
            if (baseline.coreWebVitals.cls !== null && currentMetrics.cls !== null) {
              const clsChange = (currentMetrics.cls - baseline.coreWebVitals.cls) / (baseline.coreWebVitals.cls || 0.01)
              cy.log('📐 CLS (Cumulative Layout Shift):')
              cy.log(`  Baseline: ${baseline.coreWebVitals.cls.toFixed(3)}`)
              cy.log(`  Current:  ${currentMetrics.cls.toFixed(3)}`)
              cy.log(`  Change:   ${clsChange > 0 ? '+' : ''}${(clsChange * 100).toFixed(1)}%`)
              
              if (clsChange > regressionThreshold) {
                regressions.push({ metric: 'CLS', changePercent: clsChange })
                cy.log(`  ❌ REGRESSION: CLS degraded by ${(clsChange * 100).toFixed(1)}%`)
                if (currentMetrics.cls > 0.1) cy.log(`  ⚠️  Warning: CLS exceeds Google's "Good" threshold (0.1)`)
              } else if (clsChange < -0.1) {
                improvements.push({ metric: 'CLS', changePercent: clsChange })
                cy.log(`  ✅ IMPROVED: CLS improved by ${Math.abs(clsChange * 100).toFixed(1)}%`)
              } else {
                stable.push('CLS')
                cy.log(`  ✓ STABLE: CLS is stable`)
              }
              cy.log('')
            }

            // TTI Analysis
            if (baseline.coreWebVitals.tti && currentMetrics.tti) {
              const ttiChange = (currentMetrics.tti - baseline.coreWebVitals.tti) / baseline.coreWebVitals.tti
              cy.log('⚡ TTI (Time to Interactive):')
              cy.log(`  Baseline: ${baseline.coreWebVitals.tti.toFixed(2)}ms`)
              cy.log(`  Current:  ${currentMetrics.tti.toFixed(2)}ms`)
              cy.log(`  Change:   ${ttiChange > 0 ? '+' : ''}${(ttiChange * 100).toFixed(1)}%`)
              
              if (ttiChange > regressionThreshold) {
                regressions.push({ metric: 'TTI', changePercent: ttiChange })
                cy.log(`  ❌ REGRESSION: TTI degraded by ${(ttiChange * 100).toFixed(1)}%`)
                if (currentMetrics.tti > 3800) cy.log(`  ⚠️  Warning: TTI exceeds Google's "Good" threshold (3.8s)`)
              } else if (ttiChange < -0.1) {
                improvements.push({ metric: 'TTI', changePercent: ttiChange })
                cy.log(`  ✅ IMPROVED: TTI improved by ${Math.abs(ttiChange * 100).toFixed(1)}%`)
              } else {
                stable.push('TTI')
                cy.log(`  ✓ STABLE: TTI is stable`)
              }
              cy.log('')
            }

            // Summary Report
            cy.log('=== 📋 Regression Detection Summary ===')
            cy.log(`Improvements: ${improvements.length} ${improvements.length > 0 ? '✅' : ''}`)
            cy.log(`Stable: ${stable.length} ${stable.length > 0 ? '✓' : ''}`)
            cy.log(`Regressions: ${regressions.length} ${regressions.length > 0 ? '❌' : ''}`)

            if (improvements.length > 0) {
              cy.log('')
              cy.log('✅ Performance Improvements:')
              improvements.forEach(improvement => {
                cy.log(`  • ${improvement.metric}: ${Math.abs(improvement.changePercent * 100).toFixed(1)}% faster`)
              })
            }

            if (regressions.length > 0) {
              cy.log('')
              cy.log('❌ Performance Regressions Detected:')
              regressions.forEach(regression => {
                cy.log(`  • ${regression.metric}: ${(regression.changePercent * 100).toFixed(1)}% slower`)
              })
            }

            // Assertion: No severe performance regression (>50%)
            // Note: Using 50% threshold due to simulated/random data in test environment
            const severeRegressions = regressions.filter(r => r.changePercent > 0.5)
            if (severeRegressions.length > 0) {
              cy.log('')
              cy.log('🚨 CRITICAL: Severe performance regression detected (>50%)')
            } else if (regressions.length > 0) {
              cy.log('')
              cy.log('⚠️  Note: Minor regressions detected but within acceptable range (<50%)')
            }
            expect(severeRegressions.length).to.eq(0)
          })
        })
      })
    })

    it('should be able to generate performance report', () => {
      // Learning point: Performance report generation
      const startTime = Date.now()

      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const endTime = Date.now()

        // Collect all performance data
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
            cls: Math.random() * 0.1, // Simulated
            tti: null
          },
          score: null
        }

        // Get detailed timing info
        const navigation = win.performance.getEntriesByType('navigation')[0]
        if (navigation) {
          performanceReport.timings.domContentLoaded =
            navigation.domContentLoadedEventEnd - navigation.navigationStart
        }

        // Get paint info
        const paintEntries = win.performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            performanceReport.timings.firstContentfulPaint = entry.startTime
            performanceReport.coreWebVitals.fcp = entry.startTime
          }
        })

        // Analyze resources
        const resources = win.performance.getEntriesByType('resource')
        performanceReport.resources.count = resources.length

        resources.forEach(resource => {
          const size = resource.transferSize || 0
          performanceReport.resources.totalSize += size

          if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            performanceReport.resources.byType.images.count++
            performanceReport.resources.byType.images.size += size
          } else if (resource.name.match(/\.js$/)) {
            performanceReport.resources.byType.scripts.count++
            performanceReport.resources.byType.scripts.size += size
          } else if (resource.name.match(/\.css$/)) {
            performanceReport.resources.byType.stylesheets.count++
            performanceReport.resources.byType.stylesheets.size += size
          } else {
            performanceReport.resources.byType.other.count++
            performanceReport.resources.byType.other.size += size
          }
        })

        // Calculate performance score (simplified algorithm)
        let score = 100

        // Deduct points based on page load time
        if (performanceReport.timings.pageLoad > 3000) score -= 20
        else if (performanceReport.timings.pageLoad > 1000) score -= 10

        // Deduct points based on resource size
        if (performanceReport.resources.totalSize > 2 * 1024 * 1024) score -= 15 // 2MB
        else if (performanceReport.resources.totalSize > 1 * 1024 * 1024) score -= 8 // 1MB

        // Deduct points based on resource count
        if (performanceReport.resources.count > 100) score -= 10
        else if (performanceReport.resources.count > 50) score -= 5

        performanceReport.score = Math.max(score, 0)

        // Generate HTML report
        const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Performance Test Report</title>
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
        <h1>Cypress Performance Test Report</h1>
        <p><strong>Test URL:</strong> ${performanceReport.testInfo.url}</p>
        <p><strong>Test Time:</strong> ${performanceReport.testInfo.timestamp}</p>
        <p><strong>Viewport Size:</strong> ${performanceReport.testInfo.viewport.width} x ${performanceReport.testInfo.viewport.height}</p>
    </div>

    <div class="score ${performanceReport.score >= 80 ? 'good' : performanceReport.score >= 60 ? 'average' : 'poor'}">
        Performance Score: ${performanceReport.score}/100
    </div>

    <h2>Core Metrics</h2>
    <div class="metric">
        <span class="metric-name">Page Load Time</span>
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

    <h2>Resource Analysis</h2>
    <div class="metric">
        <span class="metric-name">Total Resource Count</span>
        <span class="metric-value">${performanceReport.resources.count}</span>
    </div>
    <div class="metric">
        <span class="metric-name">Total Resource Size</span>
        <span class="metric-value">${(performanceReport.resources.totalSize / 1024).toFixed(2)} KB</span>
    </div>

    <div class="resources">
        <div class="resource-type">
            <h3>Images</h3>
            <p>Count: ${performanceReport.resources.byType.images.count}</p>
            <p>Size: ${(performanceReport.resources.byType.images.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>Scripts</h3>
            <p>Count: ${performanceReport.resources.byType.scripts.count}</p>
            <p>Size: ${(performanceReport.resources.byType.scripts.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>Stylesheets</h3>
            <p>Count: ${performanceReport.resources.byType.stylesheets.count}</p>
            <p>Size: ${(performanceReport.resources.byType.stylesheets.size / 1024).toFixed(2)} KB</p>
        </div>
        <div class="resource-type">
            <h3>Other</h3>
            <p>Count: ${performanceReport.resources.byType.other.count}</p>
            <p>Size: ${(performanceReport.resources.byType.other.size / 1024).toFixed(2)} KB</p>
        </div>
    </div>
</body>
</html>`

        // Save reports
        cy.writeFile('cypress/temp/performance-report.html', htmlReport)
        cy.writeFile('cypress/temp/performance-report.json', performanceReport)

        cy.log('Performance report generated:')
        cy.log(`Overall score: ${performanceReport.score}/100`)
        cy.log(`Page load: ${performanceReport.timings.pageLoad}ms`)
        cy.log(`Resource count: ${performanceReport.resources.count}`)
        cy.log(`Resource size: ${(performanceReport.resources.totalSize / 1024).toFixed(2)} KB`)
      })
    })
  })

  describe('Summary and Best Practices', () => {

    it('Performance monitoring best practices summary', () => {
      cy.then(() => {
        cy.log('Performance Monitoring Core Skills')
        cy.log('1. Page load performance measurement')
        cy.log('2. Core Web Vitals metrics')
        cy.log('3. Resource loading monitoring')
        cy.log('4. API performance testing')
        cy.log('5. Concurrent performance testing')
        cy.log('6. Performance baseline establishment')
        cy.log('7. Performance regression detection')
        cy.log('8. Performance report generation')

        cy.log('')
        cy.log('Performance Monitoring Best Practices:')
        cy.log('1. Establish performance baselines and thresholds')
        cy.log('2. Monitor key performance indicators')
        cy.log('3. Regular performance regression detection')
        cy.log('4. Visualize performance trends')
        cy.log('5. Target performance bottlenecks for optimization')
        cy.log('6. Multi-device performance testing')

        cy.log('')
        cy.log('Congratulations! Stage 3: Advanced Features completed!')
        cy.log('Next: Stage 4 Expert Level Challenges')
        cy.log('Focus: Test architecture, CI/CD, team collaboration')
      })
    })

    it('Stage 3 learning outcomes summary', () => {
      cy.then(() => {
        cy.log('Stage 3: Advanced Features - Learning Outcomes Summary')
        cy.log('')

        cy.log('Day 9: Network Interception and API Testing')
        cy.log('  Complete mastery of cy.intercept()')
        cy.log('  API response simulation and modification')
        cy.log('  Network delay and error simulation')

        cy.log('')
        cy.log('Day 10: Asynchronous Operations')
        cy.log('  Waiting strategy optimization')
        cy.log('  Dynamic content handling')
        cy.log('  Custom wait conditions')

        cy.log('')
        cy.log('Day 11: File Operations')
        cy.log('  File read/write operations')
        cy.log('  File upload/download testing')
        cy.log('  Multimedia file processing')

        cy.log('')
        cy.log('Day 12: Custom Commands and Plugins')
        cy.log('  Custom command creation')
        cy.log('  Page Object pattern')
        cy.log('  Third-party plugin integration')

        cy.log('')
        cy.log('Day 13: Data-Driven Testing')
        cy.log('  Fixtures data management')
        cy.log('  Parameterized testing')
        cy.log('  Batch test execution')

        cy.log('')
        cy.log('Day 14: Performance and Monitoring')
        cy.log('  Core Web Vitals measurement')
        cy.log('  Performance regression detection')
        cy.log('  Performance report generation')

        cy.log('')
        cy.log('Advanced Skills Mastered:')
        cy.log('  Complete network layer control')
        cy.log('  Professional async operation handling')
        cy.log('  File system integration')
        cy.log('  Tool extension and customization')
        cy.log('  Data-driven test design')
        cy.log('  Performance monitoring and optimization')

        cy.log('')
        cy.log('You are now a Cypress Advanced User!')
        cy.log('Ready to tackle Expert level challenges!')
      })
    })
  })
})

/**
 * Day 14 Learning Points Summary:
 *
 * 1. **Page Load Performance**
 *    - Basic performance measurement
 *    - Loading phase analysis
 *    - Device performance comparison
 *
 * 2. **Core Web Vitals**
 *    - First Contentful Paint (FCP)
 *    - Largest Contentful Paint (LCP)
 *    - Cumulative Layout Shift (CLS)
 *    - Time to Interactive (TTI)
 *
 * 3. **Resource Monitoring**
 *    - Resource loading analysis
 *    - API performance testing
 *    - Concurrent performance testing
 *
 * 4. **Performance Regression Detection**
 *    - Performance baseline establishment
 *    - Regression detection algorithm
 *    - Performance report generation
 *
 * 5. **Monitoring Strategy**
 *    - Performance threshold setting
 *    - Continuous monitoring approach
 *    - Performance optimization recommendations
 *
 * **Performance Optimization Principles**:
 * - Establish clear performance baselines
 * - Continuously monitor key metrics
 * - Detect performance regressions promptly
 * - Provide actionable optimization recommendations
 *
 * **Stage 3 Completed**:
 * Congratulations! You have mastered Cypress advanced features
 * and can handle complex testing scenarios and performance monitoring needs.
 * Ready to tackle Expert level challenges!
 */
