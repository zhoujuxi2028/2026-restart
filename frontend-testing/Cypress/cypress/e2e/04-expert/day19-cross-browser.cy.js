// ============================================
// Day 19: Cross-Browser and Multi-Device Testing
// ============================================
// Learning Objectives:
// - Master cross-browser testing strategies
// - Implement responsive design testing
// - Handle browser-specific behaviors and differences
// - Test on multiple devices and viewports

describe('Day 19: Cross-Browser and Multi-Device Testing', () => {

  // ============================================
  // Module 1: Cross-Browser Testing Strategies
  // ============================================
  describe('Module 1: Cross-Browser Testing Strategies', () => {
    it('1.1 Browser detection and adaptation', () => {
      cy.log('🌐 Demonstrating cross-browser testing')

      const browserInfo = {
        name: Cypress.browser.name,
        version: Cypress.browser.version,
        family: Cypress.browser.family,
        majorVersion: Cypress.browser.majorVersion,
        isHeadless: Cypress.browser.isHeadless
      }

      cy.log(`Current browser: ${browserInfo.name} ${browserInfo.version}`)
      cy.log(`Browser family: ${browserInfo.family}`)
      cy.log(`Major version: ${browserInfo.majorVersion}`)
      cy.log(`Headless mode: ${browserInfo.isHeadless}`)

      // Execute different logic based on browser
      if (browserInfo.name === 'chrome') {
        cy.log('🟢 Chrome-specific testing enabled')
        cy.log('- Advanced DevTools support')
        cy.log('- Performance monitoring capabilities')
      } else if (browserInfo.name === 'firefox') {
        cy.log('🦊 Firefox-specific testing enabled')
        cy.log('- Enhanced privacy features testing')
        cy.log('- Developer edition capabilities')
      } else if (browserInfo.name === 'edge') {
        cy.log('🔷 Edge-specific testing enabled')
        cy.log('- Microsoft ecosystem integration')
        cy.log('- Enterprise security features')
      }

      cy.visit('https://example.cypress.io')
      cy.get('h1').should('be.visible')
      cy.log('✅ Cross-browser testing completed')
    })

    it('1.2 Browser capability detection', () => {
      cy.log('🔍 Demonstrating browser capability detection')

      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // Test modern browser capabilities
        const capabilities = {
          localStorage: typeof win.localStorage !== 'undefined',
          sessionStorage: typeof win.sessionStorage !== 'undefined',
          geolocation: 'geolocation' in win.navigator,
          webWorkers: typeof win.Worker !== 'undefined',
          webGL: !!win.WebGLRenderingContext,
          canvas: !!win.HTMLCanvasElement,
          webSockets: 'WebSocket' in win,
          indexedDB: 'indexedDB' in win,
          serviceWorker: 'serviceWorker' in win.navigator
        }

        cy.log('Browser Capabilities:')
        Object.entries(capabilities).forEach(([capability, supported]) => {
          const status = supported ? '✅' : '❌'
          cy.log(`${status} ${capability}: ${supported}`)
        })

        // Conditional testing based on capabilities
        if (capabilities.localStorage) {
          cy.log('Local storage supported - enabling data persistence tests')
        }

        if (capabilities.geolocation) {
          cy.log('Geolocation supported - enabling location-based tests')
        }
      })

      cy.get('h1').should('be.visible')
      cy.log('✅ Capability detection completed')
    })

    it('1.3 Browser-specific workarounds', () => {
      cy.log('🔧 Demonstrating browser-specific workarounds')

      const browserName = Cypress.browser.name

      cy.visit('https://example.cypress.io/commands/actions')

      // Example: Handle different input behaviors across browsers
      cy.get('.action-email').then($input => {
        // Clear input with browser-specific approach
        if (browserName === 'firefox') {
          // Firefox sometimes needs different clearing approach
          cy.wrap($input).clear({ force: true }).type('firefox-test@example.com')
        } else {
          // Standard approach for Chrome, Edge
          cy.wrap($input).clear().type('standard-test@example.com')
        }

        cy.wrap($input).should('have.value', browserName === 'firefox' ? 'firefox-test@example.com' : 'standard-test@example.com')
      })

      // Handle different timing requirements
      const timeout = browserName === 'firefox' ? 8000 : 5000
      cy.get('.action-email', { timeout }).should('be.visible')

      cy.log(`Applied ${browserName}-specific optimizations`)
      cy.log('✅ Browser-specific workarounds completed')
    })
  })

  // ============================================
  // Module 2: Responsive Design Testing
  // ============================================
  describe('Module 2: Responsive Design Testing', () => {
    it('2.1 Multi-viewport testing', () => {
      cy.log('📱 Demonstrating multi-viewport testing')

      const viewports = [
        { name: 'Mobile Small', width: 320, height: 568, device: 'iPhone SE' },
        { name: 'Mobile Medium', width: 375, height: 667, device: 'iPhone 6/7/8' },
        { name: 'Mobile Large', width: 414, height: 896, device: 'iPhone XR' },
        { name: 'Tablet Portrait', width: 768, height: 1024, device: 'iPad' },
        { name: 'Tablet Landscape', width: 1024, height: 768, device: 'iPad Landscape' },
        { name: 'Desktop Small', width: 1280, height: 720, device: 'Laptop' },
        { name: 'Desktop Large', width: 1920, height: 1080, device: 'Desktop' }
      ]

      viewports.forEach((viewport, index) => {
        cy.log(`Testing viewport ${index + 1}/${viewports.length}: ${viewport.name}`)
        cy.log(`Device: ${viewport.device} (${viewport.width}x${viewport.height})`)

        cy.viewport(viewport.width, viewport.height)
        cy.visit('https://example.cypress.io')

        // Verify responsive behavior
        cy.get('h1').should('be.visible')

        // Check if navigation behaves responsively
        cy.get('body').then($body => {
          const bodyWidth = $body.width()
          cy.log(`Actual body width: ${bodyWidth}px`)

          // Verify responsive breakpoints
          if (viewport.width < 768) {
            cy.log('📱 Mobile layout active')
          } else if (viewport.width < 1024) {
            cy.log('📟 Tablet layout active')
          } else {
            cy.log('🖥️ Desktop layout active')
          }
        })

        // Small delay between viewport changes
        cy.wait(500)
      })

      cy.log('✅ Multi-viewport testing completed')
    })

    it('2.2 Layout validation across viewports', () => {
      cy.log('📐 Demonstrating layout validation')

      const testViewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Desktop', width: 1280, height: 720 }
      ]

      testViewports.forEach(viewport => {
        cy.log(`Validating layout for ${viewport.name}`)
        cy.viewport(viewport.width, viewport.height)
        cy.visit('https://example.cypress.io')

        // Validate header is visible and properly positioned
        cy.get('h1')
          .should('be.visible')
          .then($header => {
            const rect = $header[0].getBoundingClientRect()
            cy.log(`Header position: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}`)
            cy.log(`Header size: ${Math.round(rect.width)}x${Math.round(rect.height)}`)

            // Ensure header is not cut off
            expect(rect.right).to.be.lessThan(viewport.width)
            expect(rect.bottom).to.be.lessThan(viewport.height)
          })

        // Check navigation accessibility
        cy.get('nav, .navbar, [role="navigation"]').then($nav => {
          if ($nav.length > 0) {
            cy.wrap($nav).should('be.visible')
            cy.log(`Navigation found and visible on ${viewport.name}`)
          } else {
            cy.log(`No navigation element found on ${viewport.name}`)
          }
        })
      })

      cy.log('✅ Layout validation completed')
    })

    it('2.3 Touch and interaction testing', () => {
      cy.log('👆 Demonstrating touch interaction testing')

      // Test on mobile viewport
      cy.viewport('iphone-x')
      cy.visit('https://example.cypress.io/commands/actions')

      // Simulate touch interactions
      cy.get('.action-email').then($input => {
        // Test touch events
        cy.wrap($input)
          .trigger('touchstart')
          .trigger('touchend')
          .focus()

        // Verify mobile-friendly input behavior
        cy.wrap($input)
          .clear()
          .type('mobile-touch@example.com')
          .should('have.value', 'mobile-touch@example.com')

        cy.log('Touch interaction validated')
      })

      // Test swipe gestures (simulated)
      cy.get('body').then($body => {
        cy.wrap($body)
          .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }], force: true })
          .trigger('touchmove', { touches: [{ clientX: 300, clientY: 100 }], force: true })
          .trigger('touchend', { force: true })

        cy.log('Swipe gesture simulation completed')
      })

      cy.log('✅ Touch interaction testing completed')
    })
  })

  // ============================================
  // Module 3: Device-Specific Testing
  // ============================================
  describe('Module 3: Device-Specific Testing', () => {
    it('3.1 Mobile device simulation', () => {
      cy.log('📱 Demonstrating mobile device testing')

      const mobileDevices = [
        { name: 'iPhone SE', viewport: 'iphone-se2', orientation: 'portrait' },
        { name: 'iPhone 12', viewport: 'iphone-x', orientation: 'portrait' },
        { name: 'Samsung Galaxy S10', viewport: 'samsung-s10', orientation: 'portrait' },
        { name: 'iPad Mini', viewport: 'ipad-mini', orientation: 'portrait' }
      ]

      mobileDevices.forEach(device => {
        cy.log(`Testing on ${device.name}`)

        if (device.viewport.includes('iphone') || device.viewport.includes('samsung') || device.viewport.includes('ipad')) {
          cy.viewport(device.viewport, device.orientation)
        }

        cy.visit('https://example.cypress.io')

        // Mobile-specific validations
        cy.get('h1').should('be.visible')

        // Check for mobile-optimized elements
        cy.get('body').should('have.css', 'font-size').then(fontSize => {
          cy.log(`Font size on ${device.name}: ${fontSize}`)
        })

        // Verify touch targets are appropriately sized (minimum 44px)
        cy.get('a, button, input, [role="button"]').each($el => {
          const rect = $el[0].getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            // Log touch target size for important interactive elements
            if (rect.width < 44 || rect.height < 44) {
              cy.log(`⚠️ Small touch target detected: ${Math.round(rect.width)}x${Math.round(rect.height)}px`)
            }
          }
        })
      })

      cy.log('✅ Mobile device simulation completed')
    })

    it('3.2 Tablet-specific testing', () => {
      cy.log('📟 Demonstrating tablet testing')

      const tabletConfigs = [
        { name: 'iPad', width: 768, height: 1024, orientation: 'portrait' },
        { name: 'iPad Landscape', width: 1024, height: 768, orientation: 'landscape' },
        { name: 'iPad Pro', width: 1366, height: 1024, orientation: 'landscape' }
      ]

      tabletConfigs.forEach(config => {
        cy.log(`Testing tablet: ${config.name} (${config.orientation})`)
        cy.viewport(config.width, config.height)
        cy.visit('https://example.cypress.io')

        // Verify tablet-optimized layout
        cy.get('h1').should('be.visible')

        // Check for appropriate content density
        cy.get('body').then($body => {
          const bodyWidth = $body.width()
          cy.log(`Content width on ${config.name}: ${bodyWidth}px`)

          // Tablet should show more content than mobile but not be too sparse
          if (config.width > 768) {
            cy.log('Large tablet layout - expecting rich content display')
          } else {
            cy.log('Standard tablet layout - expecting balanced content')
          }
        })

        // Test tablet-specific interactions
        cy.get('.navbar, nav, [role="navigation"]').then($nav => {
          if ($nav.length > 0) {
            cy.wrap($nav).should('be.visible')
            cy.log(`Navigation appropriate for ${config.name}`)
          }
        })
      })

      cy.log('✅ Tablet testing completed')
    })

    it('3.3 High-resolution display testing', () => {
      cy.log('🖥️ Demonstrating high-resolution display testing')

      const highResConfigs = [
        { name: '4K Display', width: 3840, height: 2160, pixelRatio: 2 },
        { name: 'QHD Display', width: 2560, height: 1440, pixelRatio: 1.5 },
        { name: 'Retina MacBook', width: 2880, height: 1800, pixelRatio: 2 }
      ]

      highResConfigs.forEach(config => {
        cy.log(`Testing high-res display: ${config.name}`)
        cy.viewport(config.width, config.height)
        cy.visit('https://example.cypress.io')

        // Verify content scales appropriately
        cy.get('h1').should('be.visible')

        cy.window().then(win => {
          const actualPixelRatio = win.devicePixelRatio
          cy.log(`Device pixel ratio: ${actualPixelRatio}`)

          // Check if images and assets look crisp (if images exist)
          cy.get('body').then($body => {
            const images = $body.find('img')
            if (images.length > 0) {
              cy.wrap(images).each($img => {
                cy.wrap($img).should('be.visible').then(() => {
                  const img = $img[0]
                  if (img.complete) {
                    cy.log(`Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`)
                  }
                })
              })
            } else {
              cy.log('No images found on page - skipping image quality check')
            }
          })
        })

        // Verify text remains readable
        cy.get('body').should('have.css', 'font-size').then(fontSize => {
          cy.log(`Base font size on ${config.name}: ${fontSize}`)
        })
      })

      cy.log('✅ High-resolution display testing completed')
    })
  })

  // ============================================
  // Module 4: Browser Compatibility Testing
  // ============================================
  describe('Module 4: Browser Compatibility Testing', () => {
    it('4.1 Feature support matrix', () => {
      cy.log('🔍 Demonstrating feature support testing')

      cy.visit('https://example.cypress.io')

      cy.window().then(win => {
        // Modern web features support matrix
        const featureSupport = {
          // CSS Features
          flexbox: CSS.supports('display', 'flex'),
          grid: CSS.supports('display', 'grid'),
          customProperties: CSS.supports('--custom-property', 'value'),

          // JavaScript APIs
          fetch: typeof win.fetch !== 'undefined',
          promises: typeof win.Promise !== 'undefined',
          asyncAwait: typeof win.Symbol !== 'undefined',
          modules: 'noModule' in document.createElement('script'),

          // Storage APIs
          localStorage: typeof win.localStorage !== 'undefined',
          indexedDB: 'indexedDB' in win,

          // Media APIs
          webRTC: 'RTCPeerConnection' in win,
          getUserMedia: 'mediaDevices' in win.navigator,

          // Other modern features
          webGL: !!win.WebGLRenderingContext,
          webWorkers: typeof win.Worker !== 'undefined',
          serviceWorkers: 'serviceWorker' in win.navigator
        }

        cy.log('Browser Feature Support Matrix:')
        Object.entries(featureSupport).forEach(([feature, supported]) => {
          const status = supported ? '✅' : '❌'
          cy.log(`${status} ${feature}: ${supported ? 'Supported' : 'Not supported'}`)
        })

        // Count supported features
        const supportedCount = Object.values(featureSupport).filter(Boolean).length
        const totalFeatures = Object.keys(featureSupport).length
        const supportPercentage = Math.round((supportedCount / totalFeatures) * 100)

        cy.log(`Overall support: ${supportedCount}/${totalFeatures} (${supportPercentage}%)`)

        // Provide recommendations based on support
        if (supportPercentage >= 90) {
          cy.log('🟢 Excellent browser support - modern features available')
        } else if (supportPercentage >= 70) {
          cy.log('🟡 Good browser support - some fallbacks may be needed')
        } else {
          cy.log('🔴 Limited browser support - extensive fallbacks required')
        }
      })

      cy.get('h1').should('be.visible')
      cy.log('✅ Feature support matrix completed')
    })

    it('4.2 Performance comparison across browsers', () => {
      cy.log('⚡ Demonstrating cross-browser performance testing')

      cy.visit('https://example.cypress.io')

      cy.window().then(win => {
        if (win.performance && win.performance.timing) {
          const timing = win.performance.timing
          const browserName = Cypress.browser.name

          // Calculate performance metrics
          const metrics = {
            pageLoadTime: timing.loadEventEnd - timing.navigationStart,
            domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaintTime: timing.responseStart - timing.navigationStart,
            resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd
          }

          cy.log(`Performance metrics for ${browserName}:`)
          Object.entries(metrics).forEach(([metric, value]) => {
            cy.log(`${metric}: ${value}ms`)
          })

          // Performance expectations by browser
          const performanceBaselines = {
            chrome: { pageLoad: 3000, domReady: 2000 },
            firefox: { pageLoad: 3500, domReady: 2500 },
            edge: { pageLoad: 3200, domReady: 2200 }
          }

          const baseline = performanceBaselines[browserName] || performanceBaselines.chrome

          // Compare against baseline
          if (metrics.pageLoadTime <= baseline.pageLoad) {
            cy.log(`✅ Page load performance within expected range for ${browserName}`)
          } else {
            cy.log(`⚠️ Page load slower than expected for ${browserName}`)
          }

          if (metrics.domReadyTime <= baseline.domReady) {
            cy.log(`✅ DOM ready performance within expected range for ${browserName}`)
          } else {
            cy.log(`⚠️ DOM ready slower than expected for ${browserName}`)
          }
        }
      })

      cy.get('h1').should('be.visible')
      cy.log('✅ Performance comparison completed')
    })
  })

  // ============================================
  // Module 5: Comprehensive Cross-Browser Strategy
  // ============================================
  describe('Module 5: Comprehensive Cross-Browser Strategy', () => {
    it('5.1 Cross-browser test execution strategy', () => {
      cy.log('🎯 Demonstrating cross-browser execution strategy')

      const testStrategy = {
        primaryBrowsers: ['chrome', 'firefox', 'edge'],
        secondaryBrowsers: ['safari'],
        mobileDevices: ['iphone-x', 'samsung-s10'],
        testTypes: {
          smoke: 'All browsers',
          regression: 'Primary browsers only',
          performance: 'Chrome and Firefox',
          accessibility: 'All browsers',
          mobile: 'Mobile devices only'
        }
      }

      const currentBrowser = Cypress.browser.name
      const isPrimaryBrowser = testStrategy.primaryBrowsers.includes(currentBrowser)

      cy.log('Cross-Browser Test Strategy:')
      cy.log(`Primary browsers: ${testStrategy.primaryBrowsers.join(', ')}`)
      cy.log(`Secondary browsers: ${testStrategy.secondaryBrowsers.join(', ')}`)
      cy.log(`Current browser: ${currentBrowser} (${isPrimaryBrowser ? 'Primary' : 'Secondary'})`)

      cy.log('\nTest Type Coverage:')
      Object.entries(testStrategy.testTypes).forEach(([testType, coverage]) => {
        cy.log(`${testType}: ${coverage}`)
      })

      cy.visit('https://example.cypress.io')
      cy.get('h1').should('be.visible')

      if (isPrimaryBrowser) {
        cy.log('🟢 Running full test suite on primary browser')
      } else {
        cy.log('🟡 Running essential tests on secondary browser')
      }

      cy.log('✅ Cross-browser strategy demonstration completed')
    })

    it('5.2 Browser compatibility checklist', () => {
      cy.log('📋 Cross-browser compatibility checklist')

      const compatibilityChecklist = [
        '✅ Test core functionality across all target browsers',
        '✅ Verify responsive design on different viewport sizes',
        '✅ Validate JavaScript feature compatibility',
        '✅ Check CSS rendering consistency',
        '✅ Test form inputs and interactions',
        '✅ Verify file upload/download functionality',
        '✅ Test navigation and routing behavior',
        '✅ Validate accessibility features',
        '✅ Check performance benchmarks',
        '✅ Test error handling and recovery',
        '✅ Verify security features work consistently',
        '✅ Test offline/online state handling'
      ]

      cy.log('Cross-Browser Compatibility Checklist:')
      compatibilityChecklist.forEach(item => {
        cy.log(item)
      })

      cy.visit('https://example.cypress.io')
      cy.get('h1').should('be.visible')

      // Demonstrate some checklist validations
      cy.log('\nValidating checklist items:')

      // Core functionality
      cy.get('h1').should('contain', 'Kitchen Sink')
      cy.log('✅ Core functionality verified')

      // Navigation
      cy.get('nav, .navbar, [role="navigation"]').should('exist')
      cy.log('✅ Navigation elements present')

      // Form interactions (if available)
      cy.get('input, button, select').then($elements => {
        if ($elements.length > 0) {
          cy.log('✅ Interactive elements found and accessible')
        }
      })

      cy.log('🎉 Cross-browser and multi-device testing completed!')
    })
  })
})
