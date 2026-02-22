// Custom Cypress commands

Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  const baseUrl = Cypress.env('BASE_URL') || 'http://web-app:3000';

  return cy.request({
    method,
    url: `${baseUrl}${endpoint}`,
    body,
    failOnStatusCode: false
  });
});
