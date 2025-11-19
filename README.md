# Sunflower QA Test - Registration & Shopping Cart

Automation test for user registration flow and shopping cart functionality on DemoWebShop.

## Setup

```bash
npm install
```

## Run Tests

```bash
npm test                    # Run in headless mode
npm run test:headed         # Run with UI visible
```

## Project Structure

```
pages/              # Page Object Model classes
  - BasePage.ts     # Base class for all pages
  - HomePage.ts
  - RegisterPage.ts
  - DigitalDownloadsPage.ts
  - ShoppingCartPage.ts
fixtures/           # Playwright test fixtures
  - test.fixture.ts # Page fixture setup
tests/              # Test specs
  - registration-and-cart.spec.ts
```
