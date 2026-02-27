const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Base URL for the application under test
    baseUrl: 'https://jsonplaceholder.typicode.com',

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Video and screenshot settings for CI/CD
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,

    // Retry configuration for CI/CD stability
    retries: {
      runMode: 2,      // Retry twice in CI
      openMode: 0      // No retries in interactive mode
    },

    // Test isolation
    testIsolation: true,

    // Multi-reporter configuration for comprehensive test reporting
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'spec, mocha-junit-reporter, mochawesome',

      // JUnit reporter for CI integration
      mochaJunitReporterReporterOptions: {
        mochaFile: 'cypress/reports/junit/results-[hash].xml',
        toConsole: false
      },

      // Mochawesome for beautiful HTML reports
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports/mochawesome',
        overwrite: false,
        html: false,  // Will generate via marge
        json: true,   // Generate JSON for merging
        charts: true,
        reportPageTitle: 'BASF QA Automation Test Report',
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: true  // Show retry attempts
      }
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config
    },

    // Environment-specific settings
    env: {
      apiUrl: 'https://jsonplaceholder.typicode.com',
      environment: 'staging'
    },

    // Spec pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})
