/**
 * 📊 Day 13: Data-Driven Testing
 *
 * Learning Objectives:
 * - Master Fixtures data management
 * - Learn parameterized testing
 * - Master test data generation
 * - Learn batch test execution
 * - Understand environment variable usage
 */

describe('📊 Day 13: Data-Driven Testing', () => {

  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  describe('📋 Fixtures Data Management', () => {

    it('should be able to use basic fixture data', () => {
      // 🎯 Learning Point: Basic fixture usage
      cy.fixture('users').then((users) => {
        expect(users).to.be.an('array')
        expect(users.length).to.be.greaterThan(0)

        const firstUser = users[0]
        cy.log(`Username: ${firstUser.username}`)
        cy.log(`User Email: ${firstUser.email}`)

        // Use fixture data for testing
        expect(firstUser).to.have.property('id')
        expect(firstUser).to.have.property('username')
        expect(firstUser).to.have.property('email')
      })
    })

    it('should be able to share fixture data across multiple tests', () => {
      // 🎯 Learning Point: Fixture data sharing
      cy.fixture('products').as('productsData')

      cy.get('@productsData').then((products) => {
        expect(products).to.have.length.greaterThan(0)

        products.forEach((product, index) => {
          cy.log(`Product ${index + 1}: ${product.name} - $${product.price}`)
          expect(product).to.have.property('name')
          expect(product).to.have.property('price')
          expect(product).to.have.property('category')
        })
      })
    })

    it('should be able to use nested fixture data', () => {
      // 🎯 Learning Point: Complex data structure handling
      cy.fixture('api-responses').then((apiData) => {
        // Verify API response structure
        expect(apiData).to.have.property('success')
        expect(apiData).to.have.property('error')
        expect(apiData).to.have.property('unauthorized')

        // Use nested data
        const successResponse = apiData.success
        expect(successResponse.status).to.eq(200)
        expect(successResponse.data).to.be.an('object')

        const errorResponse = apiData.error
        expect(errorResponse.status).to.eq(400)
        expect(errorResponse.message).to.include('Request')

        cy.log('✅ API response data structure validation complete')
      })
    })

    it('should be able to dynamically modify fixture data', () => {
      // 🎯 Learning Point: Dynamic data handling
      cy.fixture('users').then((users) => {
        // Add timestamp to user data
        const modifiedUsers = users.map(user => ({
          ...user,
          lastAccess: new Date().toISOString(),
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }))

        cy.log(`Modified ${modifiedUsers.length} users' data`)

        modifiedUsers.forEach((user) => {
          expect(user).to.have.property('lastAccess')
          expect(user).to.have.property('sessionId')
          cy.log(`User ${user.username} session ID: ${user.sessionId}`)
        })

        // Save modified data (in real projects might write to file)
        cy.wrap(modifiedUsers).as('modifiedUsers')
      })
    })
  })

  describe('🔄 Parameterized Testing', () => {

    it('should be able to use array parameterization for testing', () => {
      // 🎯 Learning Point: Simple parameterization
      const testCases = [
        { input: 'test@example.com', expected: true, description: 'Valid email' },
        { input: 'invalid-email', expected: false, description: 'Invalid email' },
        { input: 'user@domain.', expected: false, description: 'Incomplete domain' },
        { input: '@example.com', expected: false, description: 'Missing username' },
        { input: 'user@example.com', expected: true, description: 'Standard email format' }
      ]

      testCases.forEach((testCase, index) => {
        cy.log(`Test case ${index + 1}: ${testCase.description}`)

        // Simulate email validation function
        const isValidEmail = (email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(email)
        }

        const result = isValidEmail(testCase.input)
        expect(result).to.eq(testCase.expected)

        cy.log(`Input: ${testCase.input} -> Result: ${result} ✅`)
      })
    })

    it('should be able to use object parameterization for testing', () => {
      // 🎯 Learning Point: Complex parameterization
      const loginTestCases = {
        validAdmin: {
          username: 'admin',
          password: 'admin123',
          expectedUrl: '/admin-dashboard',
          shouldSucceed: true
        },
        validUser: {
          username: 'user',
          password: 'user123',
          expectedUrl: '/user-dashboard',
          shouldSucceed: true
        },
        invalidCredentials: {
          username: 'invalid',
          password: 'wrong',
          expectedError: 'Invalid credentials',
          shouldSucceed: false
        },
        emptyFields: {
          username: '',
          password: '',
          expectedError: 'Username and password are required',
          shouldSucceed: false
        }
      }

      Object.keys(loginTestCases).forEach((testName) => {
        const testCase = loginTestCases[testName]
        cy.log(`Executing test: ${testName}`)

        if (testCase.shouldSucceed) {
          cy.log(`Expected successful login, redirect to: ${testCase.expectedUrl}`)
        } else {
          cy.log(`Expected failure, error message: ${testCase.expectedError}`)
        }

        // This is the actual test logic, simulating the login process
        expect(testCase).to.have.property('username')
        expect(testCase).to.have.property('password')
        expect(testCase.shouldSucceed).to.be.a('boolean')

        cy.log(`✅ ${testName} test logic validation complete`)
      })
    })

  })

  describe('🎲 Test Data Generation', () => {

    it('should be able to generate random test data', () => {
      // 🎯 Learning Point: Dynamic data generation
      const generateRandomUser = () => ({
        id: Math.floor(Math.random() * 10000),
        name: `TestUser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        department: ['IT', 'HR', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
        salary: Math.floor(Math.random() * 50000) + 30000,
        isActive: Math.random() > 0.5
      })

      // Generate multiple random users
      const randomUsers = Array.from({ length: 5 }, generateRandomUser)

      randomUsers.forEach((user, index) => {
        cy.log(`Random user ${index + 1}:`)
        cy.log(`Name: ${user.name}`)
        cy.log(`Email: ${user.email}`)
        cy.log(`Age: ${user.age}`)
        cy.log(`Department: ${user.department}`)
        cy.log(`Salary: $${user.salary}`)
        cy.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`)

        // Validate generated data
        expect(user.name).to.include('TestUser')
        expect(user.email).to.include('@example.com')
        expect(user.age).to.be.at.least(18).and.at.most(68)
        expect(user.salary).to.be.at.least(30000).and.at.most(80000)
      })
    })

    it('should be able to generate specific format test data', () => {
      // 🎯 Learning Point: Formatted data generation
      const dataGenerators = {
        phone: () => {
          const area = Math.floor(Math.random() * 900) + 100
          const exchange = Math.floor(Math.random() * 900) + 100
          const number = Math.floor(Math.random() * 9000) + 1000
          return `${area}-${exchange}-${number}`
        },

        address: () => {
          const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Blvd', 'Elm Dr']
          const streetNumber = Math.floor(Math.random() * 9999) + 1
          const street = streets[Math.floor(Math.random() * streets.length)]
          return `${streetNumber} ${street}`
        },

        creditCard: () => {
          // Generate test credit card number (not real)
          const prefix = '411111111111'
          const suffix = Math.floor(Math.random() * 9000) + 1000
          return `${prefix}${suffix}`
        },

        date: (minDaysAgo = 0, maxDaysAgo = 365) => {
          const now = new Date()
          const daysAgo = Math.floor(Math.random() * (maxDaysAgo - minDaysAgo)) + minDaysAgo
          const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
          return date.toISOString().split('T')[0]
        }
      }

      // Use data generators
      const generatedData = {
        phone: dataGenerators.phone(),
        address: dataGenerators.address(),
        creditCard: dataGenerators.creditCard(),
        birthDate: dataGenerators.date(365 * 18, 365 * 65), // 18-65 years old
        registrationDate: dataGenerators.date(0, 30) // Last 30 days
      }

      cy.log('Generated test data:')
      Object.keys(generatedData).forEach(key => {
        cy.log(`${key}: ${generatedData[key]}`)
      })

      // Validate generated data format
      expect(generatedData.phone).to.match(/^\d{3}-\d{3}-\d{4}$/)
      expect(generatedData.address).to.include(' ')
      expect(generatedData.creditCard).to.have.length(16)
      expect(generatedData.birthDate).to.match(/^\d{4}-\d{2}-\d{2}$/)
      expect(generatedData.registrationDate).to.match(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should be able to generate business-related test data', () => {
      // 🎯 Learning Point: Business scenario data
      const businessDataGenerator = {
        ecommerce: {
          product: () => ({
            id: `PROD${Math.floor(Math.random() * 100000)}`,
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            description: `High-quality product with excellent features`,
            price: (Math.random() * 500 + 10).toFixed(2),
            category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
            stock: Math.floor(Math.random() * 100),
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
            reviews: Math.floor(Math.random() * 500),
            isOnSale: Math.random() > 0.7,
            tags: ['popular', 'new', 'sale', 'featured'].filter(() => Math.random() > 0.5)
          }),

          order: () => ({
            id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
            customerId: `CUST${Math.floor(Math.random() * 10000)}`,
            status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
            total: (Math.random() * 1000 + 20).toFixed(2),
            items: Math.floor(Math.random() * 5) + 1,
            paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
            shippingAddress: `${Math.floor(Math.random() * 999) + 1} Test St, Test City, TC 12345`,
            orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }

      // Generate e-commerce product data
      const products = Array.from({ length: 3 }, businessDataGenerator.ecommerce.product)
      const orders = Array.from({ length: 2 }, businessDataGenerator.ecommerce.order)

      cy.log('Generated product data:')
      products.forEach((product, index) => {
        cy.log(`Product ${index + 1}: ${product.name}`)
        cy.log(`Price: $${product.price}, Stock: ${product.stock}`)
        cy.log(`Rating: ${product.rating}, Category: ${product.category}`)
        cy.log(`Tags: ${product.tags.join(', ')}`)

        expect(product.id).to.include('PROD')
        expect(parseFloat(product.rating)).to.be.at.least(3.0).and.at.most(5.0)
      })

      cy.log('')
      cy.log('Generated order data:')
      orders.forEach((order, index) => {
        cy.log(`Order ${index + 1}: ${order.id}`)
        cy.log(`Status: ${order.status}, Total: $${order.total}`)
        cy.log(`Items: ${order.items}, Payment method: ${order.paymentMethod}`)

        expect(order.id).to.include('ORD')
        expect(order.items).to.be.at.least(1).and.at.most(6)
      })
    })
  })

  describe('📈 Batch Test Execution', () => {

    it('should be able to batch test multiple URLs', () => {
      // 🎯 Learning Point: Batch URL testing
      const urls = [
        { url: 'https://example.cypress.io', expectedTitle: 'Kitchen Sink' }
      ]

      urls.forEach((testCase, index) => {
        cy.log(`Testing URL ${index + 1}: ${testCase.url}`)

        cy.visit(testCase.url)
        cy.title().should('include', testCase.expectedTitle)

        // Verify basic page accessibility
        cy.get('body').should('be.visible')
        cy.url().should('include', testCase.url.replace(/\/$/, ''))

        cy.log(`✅ URL ${index + 1} test passed`)
      })

      // Test additional URLs separately to demonstrate the concept
      cy.log('Testing multiple URLs - demonstrated with single URL due to timing')
      cy.log('In real scenarios, use separate tests or cy.wrap() with recursion')
    })

    it('should be able to batch test form validation', () => {
      // 🎯 Learning Point: Batch form testing
      const formTestCases = [
        {
          name: 'Empty values test',
          data: { name: '', email: '', phone: '' },
          expectedErrors: ['Name cannot be empty', 'Email cannot be empty', 'Phone cannot be empty']
        },
        {
          name: 'Format error test',
          data: { name: 'John', email: 'invalid-email', phone: '123' },
          expectedErrors: ['Email format is incorrect', 'Phone format is incorrect']
        },
        {
          name: 'Valid data test',
          data: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
          expectedErrors: []
        }
      ]

      formTestCases.forEach((testCase) => {
        cy.log(`Executing form test: ${testCase.name}`)

        // Simulate form validation logic
        const validateForm = (data) => {
          const errors = []

          if (!data.name || data.name.trim() === '') {
            errors.push('Name cannot be empty')
          }

          if (!data.email || data.email.trim() === '') {
            errors.push('Email cannot be empty')
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Email format is incorrect')
          }

          if (!data.phone || data.phone.trim() === '') {
            errors.push('Phone cannot be empty')
          } else if (!/^\d{3}-\d{3}-\d{4}$/.test(data.phone)) {
            errors.push('Phone format is incorrect')
          }

          return errors
        }

        const actualErrors = validateForm(testCase.data)

        // Verify error messages
        expect(actualErrors).to.deep.equal(testCase.expectedErrors)

        cy.log(`Input data:`, testCase.data)
        cy.log(`Expected errors: ${testCase.expectedErrors.join(', ') || 'None'}`)
        cy.log(`Actual errors: ${actualErrors.join(', ') || 'None'}`)
        cy.log(`✅ ${testCase.name} validation passed`)
      })
    })

    it('should be able to batch test API endpoints', () => {
      // 🎯 Learning Point: Batch API testing
      const apiEndpoints = [
        { method: 'GET', url: '/posts/1', expectedStatus: 200 },
        { method: 'GET', url: '/posts/999999', expectedStatus: 404 },
        { method: 'GET', url: '/users', expectedStatus: 200 },
        { method: 'POST', url: '/posts', expectedStatus: 201, body: { title: 'Test', body: 'Test body' } }
      ]

      apiEndpoints.forEach((endpoint, index) => {
        cy.log(`Testing API ${index + 1}: ${endpoint.method} ${endpoint.url}`)

        const requestOptions = {
          method: endpoint.method,
          url: `https://jsonplaceholder.typicode.com${endpoint.url}`,
          failOnStatusCode: false
        }

        if (endpoint.body) {
          requestOptions.body = endpoint.body
        }

        cy.request(requestOptions).then((response) => {
          expect(response.status).to.eq(endpoint.expectedStatus)

          cy.log(`Status code: ${response.status} (expected: ${endpoint.expectedStatus}) ✅`)

          if (response.status === 200 && endpoint.method === 'GET') {
            expect(response.body).to.not.be.empty
          }
        })
      })
    })
  })

  describe('🌍 Environment Variables and Configuration', () => {

    it('should be able to use environment variables', () => {
      // 🎯 Learning Point: Environment variable usage
      const apiUrl = Cypress.env('API_URL') || 'https://api.example.com'
      const testUser = Cypress.env('TEST_USER') || 'defaultuser'
      const timeout = Cypress.env('DEFAULT_TIMEOUT') || 10000

      cy.log(`API URL: ${apiUrl}`)
      cy.log(`Test user: ${testUser}`)
      cy.log(`Timeout: ${timeout}ms`)

      // Validate environment variables
      expect(apiUrl).to.be.a('string')
      expect(testUser).to.be.a('string')
      expect(timeout).to.be.a('number')
    })

    it('should be able to use different test data based on environment', () => {
      // 🎯 Learning Point: Environment-specific data
      const environment = Cypress.env('NODE_ENV') || 'development'

      const environmentData = {
        development: {
          baseUrl: 'http://localhost:3000',
          users: [
            { username: 'dev_user', password: 'dev_pass' }
          ],
          apiTimeout: 5000
        },
        staging: {
          baseUrl: 'https://staging.example.com',
          users: [
            { username: 'stage_user', password: 'stage_pass' }
          ],
          apiTimeout: 10000
        },
        production: {
          baseUrl: 'https://example.com',
          users: [
            { username: 'prod_user', password: 'prod_pass' }
          ],
          apiTimeout: 15000
        }
      }

      const config = environmentData[environment] || environmentData.development

      cy.log(`Current environment: ${environment}`)
      cy.log(`Base URL: ${config.baseUrl}`)
      cy.log(`API timeout: ${config.apiTimeout}ms`)
      cy.log(`Number of users: ${config.users.length}`)

      // Use environment-specific data
      config.users.forEach((user, index) => {
        cy.log(`User ${index + 1}: ${user.username}`)
        expect(user).to.have.property('username')
        expect(user).to.have.property('password')
      })
    })
  })

  describe('🎯 Practical Exercises', () => {

    it('🏆 Exercise: Complete data-driven test suite', () => {
      // Create a complete data-driven test scenario
      const testSuite = {
        name: 'User Registration Flow Test',
        scenarios: [
          {
            name: 'Valid registration',
            input: {
              username: 'validuser',
              email: 'valid@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!'
            },
            expected: {
              success: true,
              redirectUrl: '/welcome',
              message: 'Registration successful'
            }
          },
          {
            name: 'Username already exists',
            input: {
              username: 'existinguser',
              email: 'new@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!'
            },
            expected: {
              success: false,
              error: 'Username already exists',
              field: 'username'
            }
          },
          {
            name: 'Password mismatch',
            input: {
              username: 'newuser',
              email: 'new@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'DifferentPass123!'
            },
            expected: {
              success: false,
              error: 'Password confirmation does not match',
              field: 'confirmPassword'
            }
          }
        ]
      }

      cy.log(`Executing test suite: ${testSuite.name}`)

      testSuite.scenarios.forEach((scenario, index) => {
        cy.log(`Scenario ${index + 1}: ${scenario.name}`)

        // Simulate registration validation logic
        const validateRegistration = (input) => {
          if (input.username === 'existinguser') {
            return { success: false, error: 'Username already exists', field: 'username' }
          }

          if (input.password !== input.confirmPassword) {
            return { success: false, error: 'Password confirmation does not match', field: 'confirmPassword' }
          }

          return { success: true, redirectUrl: '/welcome', message: 'Registration successful' }
        }

        const result = validateRegistration(scenario.input)

        // Validate results
        expect(result.success).to.eq(scenario.expected.success)

        if (scenario.expected.success) {
          expect(result.message).to.eq(scenario.expected.message)
          expect(result.redirectUrl).to.eq(scenario.expected.redirectUrl)
        } else {
          expect(result.error).to.eq(scenario.expected.error)
          if (scenario.expected.field) {
            expect(result.field).to.eq(scenario.expected.field)
          }
        }

        cy.log(`✅ ${scenario.name} test passed`)
      })

      cy.log(`🎉 ${testSuite.name} all tests completed`)
    })
  })

  describe('💡 Summary and Best Practices', () => {

    it('📚 Data-driven testing best practices summary', () => {
      cy.then(() => {
        cy.log('📊 Data-Driven Testing Core Skills ✅')
        cy.log('1. ✅ Fixtures data management and sharing')
        cy.log('2. ✅ Parameterized test implementation')
        cy.log('3. ✅ Dynamic test data generation')
        cy.log('4. ✅ Batch test execution strategies')
        cy.log('5. ✅ Environment variables and configuration management')
        cy.log('6. ✅ Business scenario data generation')
        cy.log('7. ✅ Test suite organization')
        cy.log('8. ✅ Data validation and assertions')

        cy.log('')
        cy.log('🎯 Data-Driven Best Practices:')
        cy.log('1. 📁 Organize fixtures directory structure properly')
        cy.log('2. 🔄 Use parameterization to reduce code duplication')
        cy.log('3. 🎲 Combine random and fixed data')
        cy.log('4. 🌍 Environment-specific test configurations')
        cy.log('5. 📝 Clear test data naming conventions')
        cy.log('6. 🧹 Clean up data after tests')

        cy.log('')
        cy.log('📈 Next Learning: Performance and Monitoring (Day 14)')
        cy.log('🎯 Focus: Performance metrics, monitoring, regression detection')
      })
    })

    it('📋 Data management strategy guide', () => {
      cy.then(() => {
        cy.log('📋 Data-Driven Testing Strategy Guide:')
        cy.log('')

        cy.log('📁 Fixtures Organization Structure:')
        cy.log('├── users/')
        cy.log('│   ├── admin-users.json')
        cy.log('│   ├── regular-users.json')
        cy.log('│   └── test-users.json')
        cy.log('├── products/')
        cy.log('│   ├── electronics.json')
        cy.log('│   └── books.json')
        cy.log('└── api-responses/')
        cy.log('    ├── success-responses.json')
        cy.log('    └── error-responses.json')

        cy.log('')
        cy.log('🔧 Environment Configuration Examples:')
        cy.log('development: { api: "localhost:3000", timeout: 5000 }')
        cy.log('staging: { api: "staging.com", timeout: 10000 }')
        cy.log('production: { api: "example.com", timeout: 15000 }')

        cy.log('')
        cy.log('🎯 Parameterized Testing Patterns:')
        cy.log('1. Simple array parameterization - Basic value testing')
        cy.log('2. Object parameterization - Complex scenario testing')
        cy.log('3. File parameterization - Large data testing')
        cy.log('4. Dynamic parameterization - Random data testing')
      })
    })
  })
})

/**
 * 🌟 Day 13 Learning Points Summary:
 *
 * 1. **Fixtures Data Management**
 *    - cy.fixture() basic usage
 *    - Data sharing and aliasing
 *    - Complex data structure handling
 *    - Dynamic data modification
 *
 * 2. **Parameterized Testing**
 *    - Array parameterized testing
 *    - Object parameterized testing
 *    - File-based parameterization
 *    - Test case organization
 *
 * 3. **Test Data Generation**
 *    - Random data generation
 *    - Formatted data generation
 *    - Business scenario data
 *    - Data validation strategies
 *
 * 4. **Batch Test Execution**
 *    - Batch URL testing
 *    - Batch form validation
 *    - Batch API testing
 *    - Test result aggregation
 *
 * 5. **Environment Management**
 *    - Environment variable usage
 *    - Environment-specific configuration
 *    - Dynamic configuration switching
 *    - Configuration validation
 *
 * 6. **Test Suite Design**
 *    - Scenario organization structure
 *    - Data-driven workflows
 *    - Result validation patterns
 *    - Error handling strategies
 *
 * 💡 **Design Principles**:
 * - Separation of data and logic
 * - Maintainable data structures
 * - Environment-agnostic test design
 * - Clear test scenario descriptions
 *
 * 🚀 **Next Step**: Master performance monitoring and regression detection
 */