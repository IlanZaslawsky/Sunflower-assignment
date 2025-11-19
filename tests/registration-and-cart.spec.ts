import { test, expect } from '../fixtures/test.fixture';
import { TestDataGenerator } from '../utils/testData';

test.describe('User Registration and Shopping Cart Flow', () => {
  test('should register user, add product to cart, verify product in cart', async ({
    homePage,
    registerPage,
    digitalDownloadsPage,
    shoppingCartPage,
  }) => {
    const testData = TestDataGenerator.generateTestData();

    // Step 1-2: Navigate and access registration
    await homePage.goto();
    await homePage.clickRegister();

    // Step 3-4: Fill registration form
    await registerPage.fillPersonalDetails(testData.firstName, testData.lastName, testData.email);
    await registerPage.fillPassword(testData.password);

    // Step 5: Submit registration
    await registerPage.clickRegisterButton();
    await registerPage.waitForConfirmation();

    const isRegistrationValid = await registerPage.validate();
    expect(isRegistrationValid).toBe(true);
    if (!isRegistrationValid) {
      throw new Error(`Registration validation failed: ${registerPage.getValidationError()}`);
    }

    // Step 6: Click Continue button
    await registerPage.clickContinue();

    // Step 7: Verify email in header
    const headerEmail = await homePage.getHeaderEmail();
    expect(headerEmail).toBe(testData.email);

    // Step 8: Navigate to Digital Downloads
    await homePage.clickDigitalDownloads();

    // Step 9: Select random product and add to cart
    const product = await digitalDownloadsPage.getRandomProduct();
    await digitalDownloadsPage.addProductToCart(product.productId);

    // Step 10: Navigate to cart
    await digitalDownloadsPage.clickShoppingCart();

    const isCartValid = await shoppingCartPage.validate();
    expect(isCartValid).toBe(true);
    if (!isCartValid) {
      throw new Error(`Cart validation failed: ${shoppingCartPage.getValidationError()}`);
    }

    // Step 11: Verify product in cart
    const itemCount = await shoppingCartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);

    const isProductInCart = await shoppingCartPage.verifyProductInCart(product.name);
    expect(isProductInCart).toBe(true);
  });
});
