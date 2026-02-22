describe('API Tests', () => {
  const baseUrl = Cypress.env('BASE_URL') || 'http://web-app:3000';

  describe('Health Check', () => {
    it('should return healthy status', () => {
      cy.request(`${baseUrl}/health`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'healthy');
        expect(response.body).to.have.property('service', 'basf-test-app');
      });
    });
  });

  describe('Users API', () => {
    it('should get all users', () => {
      cy.request(`${baseUrl}/api/users`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });

    it('should get user by ID', () => {
      cy.request(`${baseUrl}/api/users/1`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('id', 1);
        expect(response.body.data).to.have.property('name');
        expect(response.body.data).to.have.property('email');
      });
    });

    it('should return 404 for non-existent user', () => {
      cy.request({
        url: `${baseUrl}/api/users/999`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('success', false);
      });
    });

    it('should create a new user', () => {
      const newUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`
      };

      cy.request('POST', `${baseUrl}/api/users`, newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('name', newUser.name);
        expect(response.body.data).to.have.property('email', newUser.email);
      });
    });

    it('should return 400 when creating user without required fields', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/users`,
        body: { name: 'Test' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('success', false);
      });
    });
  });

  describe('Cache API', () => {
    it('should set and get cache value', () => {
      const testKey = `test-key-${Date.now()}`;
      const testValue = 'test-value';

      // Set cache
      cy.request('POST', `${baseUrl}/api/cache`, {
        key: testKey,
        value: testValue
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
      });

      // Get cache
      cy.request(`${baseUrl}/api/cache/${testKey}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('value', testValue);
      });
    });

    it('should return 404 for non-existent cache key', () => {
      cy.request({
        url: `${baseUrl}/api/cache/non-existent-key`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('success', false);
      });
    });
  });
});
