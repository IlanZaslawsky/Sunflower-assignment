import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';
import { IValidatable } from '../core/interfaces/IValidatable';
import { Logger } from '../utils/logger';

export class ShoppingCartPage extends BasePage implements IValidatable {
  private readonly SELECTORS = {
    CART_ITEM_ROW: '.cart-item-row',
    PRODUCT_NAME: '.product-name',
    CART_EMPTY_MSG: '.no-data',
  };

  private lastValidationError: string | null = null;

  constructor(page: Page) {
    super(page);
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      return await this.page.locator(this.SELECTORS.CART_EMPTY_MSG).isVisible();
    } catch {
      return false;
    }
  }

  async getCartProductNames(): Promise<string[]> {
    await this.createElement(this.SELECTORS.CART_ITEM_ROW).waitForVisibility();

    const productNames = await this.page.locator(this.SELECTORS.PRODUCT_NAME).all();
    if (productNames.length === 0) {
      throw new Error('No products found in shopping cart');
    }

    const names: string[] = [];
    for (const product of productNames) {
      const text = await product.textContent();
      if (text) {
        names.push(text.trim());
      }
    }

    return names;
  }

  async verifyProductInCart(expectedProductName: string): Promise<boolean> {
    Logger.action(`Verifying product "${expectedProductName}" in cart`);
    const cartProductNames = await this.getCartProductNames();
    Logger.data('Cart Products', cartProductNames.join(', '));
    const trimmedExpected = expectedProductName.trim();

    // Strategy 1: Exact match
    for (const name of cartProductNames) {
      if (name === trimmedExpected) {
        Logger.success(`Exact match found: "${name}"`);
        return true;
      }
    }

    // Strategy 2: Partial match
    for (const name of cartProductNames) {
      if (name.includes(trimmedExpected)) {
        Logger.success(`Partial match found: "${name}" contains "${trimmedExpected}"`);
        return true;
      }
    }

    this.lastValidationError = `Product "${trimmedExpected}" not found in cart. Cart contains: ${cartProductNames.join(', ')}`;
    Logger.error(this.lastValidationError);
    throw new Error(this.lastValidationError);
  }

  async getCartItemCount(): Promise<number> {
    try {
      return await this.page.locator(this.SELECTORS.CART_ITEM_ROW).count();
    } catch {
      return 0;
    }
  }

  async validate(): Promise<boolean> {
    try {
      const isEmpty = await this.isCartEmpty();
      if (isEmpty) {
        this.lastValidationError = 'Shopping cart is empty';
        return false;
      }

      const itemCount = await this.getCartItemCount();
      if (itemCount === 0) {
        this.lastValidationError = 'No items in cart';
        return false;
      }

      return true;
    } catch (error) {
      this.lastValidationError = `Validation failed: ${error}`;
      return false;
    }
  }

  getValidationError(): string | null {
    return this.lastValidationError;
  }
}
