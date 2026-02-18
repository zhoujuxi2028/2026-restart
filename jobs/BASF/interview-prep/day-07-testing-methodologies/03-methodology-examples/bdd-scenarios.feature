# BDD Scenarios - Gherkin Examples

# These are example BDD scenarios demonstrating proper Gherkin syntax
# and best practices for writing behavior-driven test cases.

# ============================================
# Feature 1: User Authentication
# ============================================
Feature: User Authentication
  As a registered user
  I want to log in to my account
  So that I can access my personalized dashboard

  Background:
    Given the application is running
    And the database contains user "john@example.com" with password "ValidP@ss123"

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters email "john@example.com"
    And the user enters password "ValidP@ss123"
    And the user clicks the "Login" button
    Then the user should be redirected to "/dashboard"
    And the user should see welcome message "Welcome back, John!"
    And a session cookie should be created

  Scenario: Login fails with incorrect password
    Given the user is on the login page
    When the user enters email "john@example.com"
    And the user enters password "WrongPassword123"
    And the user clicks the "Login" button
    Then the user should remain on the login page
    And the user should see error message "Invalid email or password"
    And no session cookie should be created

  Scenario: Login fails with non-existent email
    Given the user is on the login page
    When the user enters email "nonexistent@example.com"
    And the user enters password "SomePassword123"
    And the user clicks the "Login" button
    Then the user should see error message "Invalid email or password"

  Scenario: Login button is disabled when fields are empty
    Given the user is on the login page
    When the user has not entered any credentials
    Then the "Login" button should be disabled

  Scenario Outline: Login validation with various invalid inputs
    Given the user is on the login page
    When the user enters email "<email>"
    And the user enters password "<password>"
    And the user clicks the "Login" button
    Then the user should see error message "<error_message>"

    Examples:
      | email                | password       | error_message               |
      |                      | ValidP@ss123   | Email is required           |
      | john@example.com     |                | Password is required        |
      | invalid-email        | ValidP@ss123   | Please enter a valid email  |
      | john@example.com     | short          | Password too short          |

# ============================================
# Feature 2: Shopping Cart
# ============================================
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase the products I want

  Background:
    Given the user is logged in as "john@example.com"
    And the following products exist:
      | id  | name          | price | stock |
      | 101 | iPhone 14     | 999   | 50    |
      | 102 | AirPods Pro   | 249   | 100   |
      | 103 | MacBook Pro   | 2499  | 20    |

  Scenario: Add single item to empty cart
    Given the user's cart is empty
    When the user adds product "iPhone 14" to the cart
    Then the cart should contain 1 item
    And the cart total should be $999.00
    And the cart icon should show badge "1"

  Scenario: Add multiple quantities of same item
    Given the user's cart is empty
    When the user adds 3 units of product "AirPods Pro" to the cart
    Then the cart should contain 1 line item
    And the line item quantity should be 3
    And the cart total should be $747.00

  Scenario: Add multiple different items
    Given the user's cart is empty
    When the user adds product "iPhone 14" to the cart
    And the user adds product "AirPods Pro" to the cart
    Then the cart should contain 2 items
    And the cart total should be $1,248.00

  Scenario: Remove item from cart
    Given the user has "iPhone 14" in the cart
    And the user has "AirPods Pro" in the cart
    When the user removes "AirPods Pro" from the cart
    Then the cart should contain 1 item
    And the cart total should be $999.00

  Scenario: Update item quantity
    Given the user has 2 units of "iPhone 14" in the cart
    When the user updates the quantity to 5
    Then the cart should show quantity 5 for "iPhone 14"
    And the cart total should be $4,995.00

  Scenario: Cannot add more items than available stock
    Given the user's cart is empty
    And product "MacBook Pro" has 20 units in stock
    When the user attempts to add 25 units of "MacBook Pro"
    Then the user should see error "Only 20 units available"
    And the cart should remain empty

  Scenario: Cart persists across sessions
    Given the user has "iPhone 14" in the cart
    When the user logs out
    And the user logs back in
    Then the cart should still contain "iPhone 14"
    And the cart total should be $999.00

# ============================================
# Feature 3: Checkout Process
# ============================================
Feature: Checkout Process
  As a customer
  I want to complete my purchase
  So that I can receive my ordered products

  Background:
    Given the user is logged in as "john@example.com"
    And the user has items worth $150.00 in the cart
    And the user has saved shipping address:
      | field       | value              |
      | name        | John Doe           |
      | address     | 123 Main Street    |
      | city        | San Francisco      |
      | state       | CA                 |
      | zip         | 94102              |
      | country     | USA                |

  Scenario: Successful checkout with saved address and valid payment
    Given the user is on the checkout page
    When the user selects saved shipping address
    And the user enters valid credit card details:
      | field       | value            |
      | number      | 4111111111111111 |
      | name        | John Doe         |
      | expiry      | 12/25            |
      | cvv         | 123              |
    And the user clicks "Place Order"
    Then the order should be confirmed
    And the user should see order number
    And the user should receive confirmation email
    And the cart should be empty
    And the inventory should be updated

  Scenario: Checkout with new shipping address
    Given the user is on the checkout page
    When the user clicks "Use new address"
    And the user enters shipping address:
      | field       | value              |
      | name        | John Doe           |
      | address     | 456 Oak Avenue     |
      | city        | Los Angeles        |
      | state       | CA                 |
      | zip         | 90001              |
      | country     | USA                |
    And the user enters valid credit card details
    And the user clicks "Place Order"
    Then the order should be confirmed
    And the new address should be saved to user's account

  Scenario: Checkout fails with invalid credit card
    Given the user is on the checkout page
    When the user enters invalid credit card "4111111111111112"
    And the user clicks "Place Order"
    Then the user should see error "Payment declined"
    And the order should not be created
    And the items should remain in the cart

  Scenario: Checkout fails with expired card
    Given the user is on the checkout page
    When the user enters credit card with expiry "01/20"
    And the user clicks "Place Order"
    Then the user should see error "Card has expired"
    And the order should not be created

  Scenario: Apply promo code at checkout
    Given the user is on the checkout page
    And a promo code "SAVE20" exists for 20% off
    When the user enters promo code "SAVE20"
    And the user clicks "Apply"
    Then the discount should be $30.00
    And the cart total should be $120.00
    And the promo code field should show "SAVE20 applied"

  Scenario: Invalid promo code shows error
    Given the user is on the checkout page
    When the user enters promo code "INVALID123"
    And the user clicks "Apply"
    Then the user should see error "Invalid promo code"
    And no discount should be applied
    And the cart total should remain $150.00

  Scenario Outline: Shipping cost calculation
    Given the user has items worth <order_total> in the cart
    And the user is a <membership> member
    When the user selects <shipping_method> shipping
    Then the shipping cost should be <shipping_cost>
    And the final total should be <final_total>

    Examples:
      | order_total | membership | shipping_method | shipping_cost | final_total |
      | $150.00     | premium    | standard        | $0.00         | $150.00     |
      | $150.00     | premium    | express         | $0.00         | $150.00     |
      | $150.00     | regular    | standard        | $0.00         | $150.00     |
      | $150.00     | regular    | express         | $15.00        | $165.00     |
      | $30.00      | premium    | standard        | $0.00         | $30.00      |
      | $30.00      | regular    | standard        | $5.00         | $35.00      |
      | $30.00      | regular    | express         | $20.00        | $50.00      |

# ============================================
# Feature 4: Order Management
# ============================================
Feature: Order Management
  As a customer
  I want to view and manage my orders
  So that I can track my purchases

  Background:
    Given the user is logged in as "john@example.com"
    And the user has the following orders:
      | order_id | date       | status    | total   |
      | ORD-001  | 2026-02-01 | Delivered | $999.00 |
      | ORD-002  | 2026-02-10 | Shipped   | $249.00 |
      | ORD-003  | 2026-02-15 | Paid      | $150.00 |

  Scenario: View order history
    When the user navigates to "My Orders"
    Then the user should see 3 orders
    And orders should be sorted by date (newest first)
    And each order should display order number, date, status, and total

  Scenario: View order details
    When the user navigates to "My Orders"
    And the user clicks on order "ORD-002"
    Then the user should see order details:
      | field          | value             |
      | Order Number   | ORD-002           |
      | Status         | Shipped           |
      | Total          | $249.00           |
      | Shipping       | Standard          |
      | Tracking       | TRACK123456       |
    And the user should see list of items in the order

  Scenario: Cancel order before shipping
    Given order "ORD-003" has status "Paid"
    When the user cancels order "ORD-003"
    And the user confirms cancellation
    Then the order status should change to "Cancelled"
    And the user should receive refund confirmation
    And the inventory should be restored

  Scenario: Cannot cancel order after shipping
    Given order "ORD-002" has status "Shipped"
    When the user attempts to cancel order "ORD-002"
    Then the user should see message "Cannot cancel shipped orders"
    And the order status should remain "Shipped"

  Scenario: Filter orders by status
    When the user navigates to "My Orders"
    And the user filters by status "Shipped"
    Then only orders with status "Shipped" should be displayed
    And the user should see 1 order

  Scenario: Search orders by order number
    When the user navigates to "My Orders"
    And the user searches for "ORD-002"
    Then the user should see order "ORD-002"
    And only 1 order should be displayed

# ============================================
# BDD Best Practices Demonstrated
# ============================================
#
# 1. Clear Feature Descriptions
#    - User story format: As a... I want... So that...
#
# 2. Background for Common Setup
#    - Reduces duplication across scenarios
#    - Sets up common preconditions
#
# 3. Declarative Steps (What, not How)
#    - Good: "When the user adds product to cart"
#    - Avoid: "When the user clicks button with ID cart-button-123"
#
# 4. Business Language (Not Technical)
#    - Good: "Then the order should be confirmed"
#    - Avoid: "Then the API should return status 201"
#
# 5. Scenario Outlines for Data-Driven Tests
#    - Test same behavior with multiple data sets
#    - Use Examples tables
#
# 6. Independent Scenarios
#    - Each scenario can run in isolation
#    - No dependencies between scenarios
#
# 7. Clear Expected Results
#    - Specific assertions
#    - Quantifiable outcomes
#
# 8. Edge Cases and Error Scenarios
#    - Not just happy paths
#    - Invalid inputs, error handling
#
# ============================================
# Interview Talking Points
# ============================================
#
# "I write BDD scenarios in Gherkin format to ensure shared understanding
# between developers, QA, and business stakeholders. The scenarios serve
# as executable documentation—they're always up-to-date because if behavior
# changes, tests fail. I use Background for common setup, Scenario Outlines
# for data-driven tests, and focus on business language rather than technical
# implementation details."
#
# ============================================
