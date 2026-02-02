const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    retries: 3,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
