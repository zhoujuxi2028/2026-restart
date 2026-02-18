// ============================================
// Page Object Model (POM) Examples
// ============================================
// These examples demonstrate proper POM implementation in Cypress
// showing best practices for creating maintainable, scalable test automation.

// ============================================
// 1. Base Page Class (Inheritance)
// ============================================
// Common functionality shared across all pages

class BasePage {
  /**
   * Navigate to a URL
   * @param {string} url - URL path to visit
   */
  visit(url) {
    cy.visit(url);
    return this;
  }

  /**
   * Get element with improved error handling
   * @param {string} selector - CSS selector
   * @param {object} options - Cypress get options
   */
  getElement(selector, options = {}) {
    return cy.get(selector, options);
  }

  /**
   * Click an element with automatic waiting
   * @param {Cypress.Chainable} element - Cypress element
   */
  click(element) {
    element.should('be.visible').click();
    return this;
  }

  /**
   * Type text into element
   * @param {Cypress.Chainable} element - Cypress element
   * @param {string} text - Text to type
   */
  type(element, text) {
    element.should('be.visible').clear().type(text);
    return this;
  }

  /**
   * Verify element text content
   * @param {Cypress.Chainable} element - Cypress element
   * @param {string} expectedText - Expected text
   */
  verifyText(element, expectedText) {
    element.should('contain', expectedText);
    return this;
  }

  /**
   * Verify current URL contains path
   * @param {string} urlPath - Expected URL path
   */
  verifyUrlContains(urlPath) {
    cy.url().should('include', urlPath);
    return this;
  }

  /**
   * Wait for page to be fully loaded
   */
  waitForPageLoad() {
    cy.get('body').should('be.visible');
    return this;
  }

  /**
   * Verify page title
   * @param {string} expectedTitle - Expected title
   */
  verifyTitle(expectedTitle) {
    cy.title().should('equal', expectedTitle);
    return this;
  }
}

// ============================================
// 2. Login Page Object
// ============================================
// Demonstrates: Element getters, actions, assertions, method chaining

class LoginPage extends BasePage {
  constructor() {
    super();
    this.url = '/login';
  }

  // ========================================
  // Element Locators (Getters)
  // ========================================
  // Use data-cy attributes for stable selectors

  get usernameField() {
    return this.getElement('[data-cy="username"]');
  }

  get passwordField() {
    return this.getElement('[data-cy="password"]');
  }

  get submitButton() {
    return this.getElement('[data-cy="submit-button"]');
  }

  get errorMessage() {
    return this.getElement('[data-cy="error-message"]');
  }

  get welcomeMessage() {
    return this.getElement('[data-cy="welcome-message"]');
  }

  get forgotPasswordLink() {
    return this.getElement('[data-cy="forgot-password"]');
  }

  get rememberMeCheckbox() {
    return this.getElement('[data-cy="remember-me"]');
  }

  // ========================================
  // Actions (Methods)
  // ========================================

  /**
   * Navigate to login page
   */
  visit() {
    super.visit(this.url);
    this.waitForPageLoad();
    return this;
  }

  /**
   * Enter username
   * @param {string} username - Username/email
   */
  enterUsername(username) {
    this.type(this.usernameField, username);
    return this;
  }

  /**
   * Enter password
   * @param {string} password - Password
   */
  enterPassword(password) {
    this.type(this.passwordField, password);
    return this;
  }

  /**
   * Click submit button
   */
  clickSubmit() {
    this.click(this.submitButton);
    return this;
  }

  /**
   * Check "Remember Me" checkbox
   */
  checkRememberMe() {
    this.rememberMeCheckbox.check();
    return this;
  }

  /**
   * Click "Forgot Password" link
   */
  clickForgotPassword() {
    this.click(this.forgotPasswordLink);
    return new ForgotPasswordPage(); // Navigate to next page
  }

  /**
   * High-level login action (combines multiple steps)
   * @param {string} username - Username/email
   * @param {string} password - Password
   * @param {boolean} rememberMe - Check remember me checkbox
   */
  login(username, password, rememberMe = false) {
    this.enterUsername(username);
    this.enterPassword(password);
    if (rememberMe) {
      this.checkRememberMe();
    }
    this.clickSubmit();
    return new DashboardPage(); // Return next page for chaining
  }

  // ========================================
  // Assertions (Verification Methods)
  // ========================================

  /**
   * Verify login was successful
   */
  verifyLoginSuccess() {
    this.verifyUrlContains('/dashboard');
    return new DashboardPage();
  }

  /**
   * Verify error message is displayed
   * @param {string} expectedMessage - Expected error text
   */
  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('be.visible').and('contain', expectedMessage);
    return this;
  }

  /**
   * Verify submit button is disabled
   */
  verifySubmitDisabled() {
    this.submitButton.should('be.disabled');
    return this;
  }

  /**
   * Verify submit button is enabled
   */
  verifySubmitEnabled() {
    this.submitButton.should('not.be.disabled');
    return this;
  }
}

// ============================================
// 3. Dashboard Page Object
// ============================================

class DashboardPage extends BasePage {
  constructor() {
    super();
    this.url = '/dashboard';
  }

  // Element Locators
  get userGreeting() {
    return this.getElement('[data-cy="user-greeting"]');
  }

  get logoutButton() {
    return this.getElement('[data-cy="logout-button"]');
  }

  get profileLink() {
    return this.getElement('[data-cy="profile-link"]');
  }

  get notificationsBadge() {
    return this.getElement('[data-cy="notifications-badge"]');
  }

  // Actions
  visit() {
    super.visit(this.url);
    return this;
  }

  clickLogout() {
    this.click(this.logoutButton);
    return new LoginPage();
  }

  clickProfile() {
    this.click(this.profileLink);
    return new ProfilePage();
  }

  // Assertions
  verifyUserGreeting(expectedName) {
    this.userGreeting.should('contain', `Welcome, ${expectedName}!`);
    return this;
  }

  verifyNotificationCount(expectedCount) {
    this.notificationsBadge.should('have.text', String(expectedCount));
    return this;
  }
}

// ============================================
// 4. Shopping Cart Page Object
// ============================================
// Demonstrates: Dynamic elements, lists, complex interactions

class ShoppingCartPage extends BasePage {
  constructor() {
    super();
    this.url = '/cart';
  }

  // Element Locators
  get cartItems() {
    return this.getElement('[data-cy="cart-item"]');
  }

  get cartTotal() {
    return this.getElement('[data-cy="cart-total"]');
  }

  get checkoutButton() {
    return this.getElement('[data-cy="checkout-button"]');
  }

  get emptyCartMessage() {
    return this.getElement('[data-cy="empty-cart"]');
  }

  // Dynamic element locators (based on product ID)
  getCartItem(productName) {
    return this.getElement(`[data-cy="cart-item-${productName}"]`);
  }

  getRemoveButton(productName) {
    return this.getElement(`[data-cy="remove-${productName}"]`);
  }

  getQuantityInput(productName) {
    return this.getElement(`[data-cy="quantity-${productName}"]`);
  }

  // Actions
  visit() {
    super.visit(this.url);
    return this;
  }

  removeItem(productName) {
    this.click(this.getRemoveButton(productName));
    return this;
  }

  updateQuantity(productName, quantity) {
    this.getQuantityInput(productName).clear().type(String(quantity));
    return this;
  }

  clickCheckout() {
    this.click(this.checkoutButton);
    return new CheckoutPage();
  }

  // Assertions
  verifyItemInCart(productName) {
    this.getCartItem(productName).should('exist');
    return this;
  }

  verifyItemNotInCart(productName) {
    this.getCartItem(productName).should('not.exist');
    return this;
  }

  verifyCartTotal(expectedTotal) {
    this.cartTotal.should('contain', expectedTotal);
    return this;
  }

  verifyCartItemCount(expectedCount) {
    this.cartItems.should('have.length', expectedCount);
    return this;
  }

  verifyCartIsEmpty() {
    this.emptyCartMessage.should('be.visible');
    return this;
  }
}

// ============================================
// 5. Checkout Page Object (Placeholder)
// ============================================

class CheckoutPage extends BasePage {
  constructor() {
    super();
    this.url = '/checkout';
  }

  visit() {
    super.visit(this.url);
    return this;
  }
}

// ============================================
// 6. Profile Page Object (Placeholder)
// ============================================

class ProfilePage extends BasePage {
  constructor() {
    super();
    this.url = '/profile';
  }

  visit() {
    super.visit(this.url);
    return this;
  }
}

// ============================================
// 7. Forgot Password Page (Placeholder)
// ============================================

class ForgotPasswordPage extends BasePage {
  constructor() {
    super();
    this.url = '/forgot-password';
  }

  visit() {
    super.visit(this.url);
    return this;
  }
}

// ============================================
// Export Page Objects
// ============================================

module.exports = {
  BasePage,
  LoginPage,
  DashboardPage,
  ShoppingCartPage,
  CheckoutPage,
  ProfilePage,
  ForgotPasswordPage
};

// ============================================
// Usage in Tests
// ============================================

/*
// Example Test File: login.spec.js

const { LoginPage, DashboardPage } = require('../pages');

describe('Login Tests', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should login successfully with valid credentials', () => {
    // Method chaining for fluent API
    loginPage
      .login('user@example.com', 'ValidP@ss123')
      .verifyLoginSuccess();

    // Verify dashboard
    dashboardPage.verifyUserGreeting('John Doe');
  });

  it('should show error for invalid password', () => {
    loginPage
      .login('user@example.com', 'WrongPassword')
      .verifyErrorMessage('Invalid email or password');
  });

  it('should navigate to forgot password page', () => {
    const forgotPasswordPage = loginPage.clickForgotPassword();
    forgotPasswordPage.verifyUrlContains('/forgot-password');
  });

  it('should disable submit button when fields are empty', () => {
    loginPage.verifySubmitDisabled();
  });

  it('should enable submit button when fields are filled', () => {
    loginPage
      .enterUsername('user@example.com')
      .enterPassword('password')
      .verifySubmitEnabled();
  });
});

// Example Test File: shopping-cart.spec.js

const { ShoppingCartPage } = require('../pages');

describe('Shopping Cart Tests', () => {
  const cartPage = new ShoppingCartPage();

  beforeEach(() => {
    // Assuming user is logged in and has items in cart
    cy.login('user@example.com', 'password');
    cartPage.visit();
  });

  it('should display items in cart', () => {
    cartPage
      .verifyItemInCart('iPhone-14')
      .verifyItemInCart('AirPods-Pro')
      .verifyCartItemCount(2)
      .verifyCartTotal('$1,248.00');
  });

  it('should remove item from cart', () => {
    cartPage
      .removeItem('AirPods-Pro')
      .verifyItemNotInCart('AirPods-Pro')
      .verifyCartItemCount(1)
      .verifyCartTotal('$999.00');
  });

  it('should update item quantity', () => {
    cartPage
      .updateQuantity('iPhone-14', 3)
      .verifyCartTotal('$2,997.00');
  });

  it('should show empty cart message when all items removed', () => {
    cartPage
      .removeItem('iPhone-14')
      .removeItem('AirPods-Pro')
      .verifyCartIsEmpty();
  });
});
*/

// ============================================
// Best Practices Demonstrated
// ============================================
//
// 1. Inheritance (BasePage)
//    - Common functionality in base class
//    - Specific pages extend BasePage
//    - Promotes code reuse
//
// 2. Encapsulation
//    - Element locators are getters
//    - Implementation hidden from tests
//    - Tests use high-level methods
//
// 3. Method Chaining (Fluent API)
//    - Methods return `this` or next page
//    - Enables: loginPage.login().verifySuccess()
//    - More readable tests
//
// 4. Separation of Concerns
//    - Elements: What elements exist
//    - Actions: How to interact
//    - Assertions: What to verify
//    - Tests: What to test (business logic)
//
// 5. Page Navigation
//    - Methods return new page objects
//    - Example: login() returns DashboardPage
//    - Enforces correct page flow
//
// 6. Stable Selectors
//    - Use data-cy attributes
//    - More stable than IDs or classes
//    - Clear intent for testing
//
// 7. High-Level Actions
//    - login(username, password) vs individual steps
//    - Abstracts complexity
//    - Tests read like plain English
//
// 8. Reusability
//    - Page objects used across multiple tests
//    - Update locator once, affects all tests
//    - Reduces maintenance effort
//
// ============================================
// Interview Talking Points
// ============================================
//
// "I use the Page Object Model to create maintainable, scalable test automation.
// Each page is represented as a class with element locators, actions, and
// assertions. Tests use high-level methods like login() rather than raw
// Cypress commands. This separation means when a locator changes, I update
// it once in the page object, not across dozens of tests. I also use
// inheritance—BasePage contains common functionality that all page objects
// inherit. The result is test code that's easy to read, write, and maintain."
//
// ============================================
