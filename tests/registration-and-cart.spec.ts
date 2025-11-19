import { test, expect } from '../fixtures/test.fixture';
import { TestDataGenerator } from '../utils/testData';
import { Logger } from '../utils/logger';

test.describe('User Registration and Shopping Cart Flow', () => {
  test('should register user, add product to cart, verify product in cart', async ({
    homePage,
    registerPage,
    digitalDownloadsPage,
    shoppingCartPage,
  }) => {
    Logger.step('Starting test: User Registration and Shopping Cart Flow');
    const testData = TestDataGenerator.generateTestData();
    Logger.data('Test Email', testData.email);
    Logger.data('Test User', `${testData.firstName} ${testData.lastName}`);

    // Step 1-2: Navigate and access registration
    Logger.step('Step 1-2: Navigate to home page and access registration');
    Logger.action('Navigating to home page');
    await homePage.goto();
    Logger.action('Clicking Register link');
    await homePage.clickRegister();

    // Step 3-4: Fill registration form
    Logger.step('Step 3-4: Fill registration form with personal details');
    Logger.action('Filling personal details');
    await registerPage.fillPersonalDetails(testData.firstName, testData.lastName, testData.email);
    Logger.action('Filling password');
    await registerPage.fillPassword(testData.password);

    // Step 5: Submit registration
    Logger.step('Step 5: Submit registration');
    Logger.action('Clicking Register button');
    await registerPage.clickRegisterButton();
    Logger.action('Waiting for registration confirmation');
    await registerPage.waitForConfirmation();

    Logger.action('Validating registration');
    const isRegistrationValid = await registerPage.validate();
    expect(isRegistrationValid).toBe(true);
    if (!isRegistrationValid) {
      Logger.error(`Registration validation failed: ${registerPage.getValidationError()}`);
      throw new Error(`Registration validation failed: ${registerPage.getValidationError()}`);
    }
    Logger.success('Registration completed successfully');

    // Step 6: Click Continue button
    Logger.step('Step 6: Click Continue button');
    Logger.action('Clicking Continue button');
    await registerPage.clickContinue();

    // Step 7: Verify email in header
    Logger.step('Step 7: Verify email in header');
    Logger.action('Extracting email from header');
    const headerEmail = await homePage.getHeaderEmail();
    Logger.data('Header Email', headerEmail);
    expect(headerEmail).toBe(testData.email);
    Logger.success('Email verified in header');

    // Step 8: Navigate to Digital Downloads
    Logger.step('Step 8: Navigate to Digital Downloads');
    Logger.action('Clicking Digital Downloads link');
    await homePage.clickDigitalDownloads();

    // Step 9: Select random product and add to cart
    Logger.step('Step 9: Select random product and add to cart');
    Logger.action('Selecting random product');
    const product = await digitalDownloadsPage.getRandomProduct();
    Logger.data('Selected Product', product.name);
    Logger.data('Product ID', product.productId);
    Logger.action('Adding product to cart');
    await digitalDownloadsPage.addProductToCart(product.productId);
    Logger.success('Product added to cart');

    // Step 10: Navigate to cart
    Logger.step('Step 10: Navigate to shopping cart');
    Logger.action('Navigating to shopping cart');
    await digitalDownloadsPage.clickShoppingCart();

    Logger.action('Validating cart');
    const isCartValid = await shoppingCartPage.validate();
    expect(isCartValid).toBe(true);
    if (!isCartValid) {
      Logger.error(`Cart validation failed: ${shoppingCartPage.getValidationError()}`);
      throw new Error(`Cart validation failed: ${shoppingCartPage.getValidationError()}`);
    }
    Logger.success('Cart validation passed');

    // Step 11: Verify product in cart
    Logger.step('Step 11: Verify product in cart');
    Logger.action('Getting cart item count');
    const itemCount = await shoppingCartPage.getCartItemCount();
    Logger.data('Cart Item Count', itemCount.toString());
    expect(itemCount).toBeGreaterThan(0);

    Logger.action('Verifying product name in cart');
    const isProductInCart = await shoppingCartPage.verifyProductInCart(product.name);
    expect(isProductInCart).toBe(true);
    Logger.success(`Product "${product.name}" verified in cart`);

    Logger.step('Test completed successfully');
  });
});
