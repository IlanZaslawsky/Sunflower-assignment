# Test Standard: User Registration and Shopping Cart Flow

## Test Purpose
This test validates the complete user journey on the DemoWebShop e-commerce platform, including:
- User account registration with personal details
- Email validation in the application header post-registration
- Product discovery and selection from the Digital Downloads category
- Cart functionality and product persistence
- Verification that selected products correctly appear in the shopping cart

## Preconditions
- The target system (https://demowebshop.tricentis.com) is accessible and operational
- No pre-existing user account with the email to be registered
- Digital Downloads category contains at least one product available for purchase
- Browser supports modern web standards and JavaScript execution
- User has a valid email address for registration

## Steps to Execute

### Step 1: Navigate to Application
- **Action**: Open https://demowebshop.tricentis.com
- **Expected Result**: Home page loads successfully with all UI elements visible

### Step 2: Access Registration
- **Action**: Locate and click on the "Register" button/link in the header
- **Expected Result**: Registration form page displays with required fields (personal details section)

### Step 3: Enter Personal Details
- **Action**: Fill in all required personal details:
  - First Name
  - Last Name
  - Email address
  - Any other mandatory personal information fields
- **Expected Result**: All fields accept input without validation errors

### Step 4: Enter Password
- **Action**: Enter a valid password in the password field(s)
- **Expected Result**: Password field accepts input; validation criteria (if any) are met

### Step 5: Submit Registration
- **Action**: Click the "Register" button to submit the registration form
- **Expected Result**: Form submits without errors; confirmation message appears

### Step 6: Confirm Registration
- **Action**: Click the "Continue" button
- **Expected Result**: User is redirected to the home page

### Step 7: Validate Registration Success
- **Action**: Verify registration confirmation message is visible and examine the page header to verify email display
- **Expected Result**: Registration confirmation message appears; the registered email address is displayed in the header, confirming successful registration

### Step 8: Navigate to Digital Downloads
- **Action**: Click on the "Digital Downloads" category/section
- **Expected Result**: Digital Downloads product listing page loads with available products displayed

### Step 9: Select and Add Product to Cart
- **Action**: Select a random product from the displayed list and add it to cart
- **Expected Result**: Product is added to cart; network request confirms successful addition

### Step 10: Open Shopping Cart
- **Action**: Navigate to the Shopping Cart page
- **Expected Result**: Shopping Cart page loads displaying the items in the cart

### Step 11: Verify Product in Cart
- **Action**: Validate cart is not empty and verify the product name displayed in the shopping cart
- **Expected Result**: Cart contains items; the product name in the cart matches (exact or partial match) with the product name from the Digital Downloads listing

## Post-Conditions
- The user account created during this test remains in the system (or is deleted based on test environment policy)
- The shopping cart is cleared or the session is terminated
- Browser cache/cookies can be cleared to reset the application state for subsequent test runs
- No test data artifacts persist unless required for audit trails

## Validation Criteria
**Test passes if ALL of the following conditions are met:**
1. Registration form successfully accepts and validates all personal details
2. Password is accepted without validation errors
3. Registration submission completes without server errors
4. Registration confirmation message is visible
5. User is successfully redirected to home page after clicking "Continue"
6. Registered email address appears in the page header after registration
7. Digital Downloads category page loads with at least one product available
8. Product successfully adds to cart (confirmed by network request)
9. Shopping Cart page loads and displays cart contents
10. Cart validation confirms items are present
11. Product name in cart matches the selected product name (exact or partial match)
12. No unexpected errors or exceptions occur during any step

**Test fails if:**
- Any step produces an unexpected error or exception
- Email does not appear in the header after registration
- Cart functionality fails or product is not added
- Product name mismatch occurs in the shopping cart
- Navigation or page loading fails at any point
