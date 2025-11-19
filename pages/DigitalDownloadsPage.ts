import { BasePage } from '../core/BasePage';
import { Page, Locator } from '@playwright/test';

export class DigitalDownloadsPage extends BasePage {
  private readonly SELECTORS = {
    PRODUCT_ITEM: '.product-item',
    PRODUCT_TITLE: '.product-title',
    ADD_TO_CART_BTN: 'input[value="Add to cart"]',
    SHOPPING_CART_LINK: 'a[href="/cart"]',
    CART_COUNT: '.cart-qty',
  };

  constructor(page: Page) {
    super(page);
  }

  async getFirstProduct(): Promise<{ name: string; index: number }> {
    await this.createElement(this.SELECTORS.PRODUCT_ITEM).waitForVisibility();
    const products = await this.page.locator(this.SELECTORS.PRODUCT_ITEM).all();

    if (products.length === 0) {
      throw new Error('No products found');
    }

    const productName = await this.extractProductName(products[0]);
    if (!productName) {
      throw new Error('Could not extract product name');
    }

    return {
      name: productName,
      index: 0,
    };
  }

  async getRandomProduct(): Promise<{ name: string; productId: string }> {
    await this.page.waitForSelector('.product-grid', { timeout: 10000 });

    const products = await this.page.locator(this.SELECTORS.PRODUCT_ITEM).all();
    if (products.length === 0) {
      throw new Error('No products found');
    }

    const randomIndex = Math.floor(Math.random() * products.length);
    const selectedProduct = products[randomIndex];

    const productId = await selectedProduct.getAttribute('data-productid');
    if (!productId) {
      throw new Error('Could not extract product ID');
    }

    const productLink = selectedProduct.locator('.details > .product-title > a');
    await productLink.waitFor({ state: 'visible', timeout: 10000 });

    const productName = await productLink.textContent({ timeout: 5000 });
    if (!productName || !productName.trim()) {
      throw new Error('Could not extract product name');
    }

    return {
      name: productName.trim(),
      productId,
    };
  }

  private async extractProductName(productElement: Locator): Promise<string | null> {
    try {
      const titleLink = productElement.locator(`${this.SELECTORS.PRODUCT_TITLE} > a`);
      if (await titleLink.count() > 0) {
        const linkText = await titleLink.textContent({ timeout: 5000 });
        if (linkText && linkText.trim()) {
          return linkText.trim();
        }
      }

      const titleText = await productElement.locator(this.SELECTORS.PRODUCT_TITLE).textContent({ timeout: 5000 });
      if (titleText && titleText.trim()) {
        return titleText.trim();
      }

      return null;
    } catch {
      return null;
    }
  }

  async addProductToCart(productId: string): Promise<void> {
    const selectedProduct = this.page.locator(`${this.SELECTORS.PRODUCT_ITEM}[data-productid="${productId}"]`);

    if (await selectedProduct.count() === 0) {
      throw new Error(`Product ${productId} not found`);
    }

    const addToCartButton = selectedProduct.locator('input[value="Add to cart"]');
    if (await addToCartButton.count() === 0) {
      throw new Error('Add to Cart button not found');
    }

    await addToCartButton.waitFor({ state: 'visible', timeout: 10000 });

    // Listen for the POST request that confirms product was added
    const addToCartPromise = this.page.waitForResponse(
      (response) => response.url().includes('/addproducttocart') && response.status() === 200,
      { timeout: 10000 }
    );

    try {
      const cartUrl = `/addproducttocart/catalog/${productId}/1/1`;
      await this.page.evaluate((url: string) => {
        const win = window as typeof window & { AjaxCart?: { addproducttocart_catalog?: (url: string) => void } };
        if (win.AjaxCart?.addproducttocart_catalog) {
          win.AjaxCart.addproducttocart_catalog(url);
        }
      }, cartUrl);
    } catch {
      await addToCartButton.click({ timeout: 10000, force: true });
    }

    // Wait for the network request to complete
    await addToCartPromise;
  }

  async getCartCount(): Promise<number> {
    try {
      const cartElement = this.page.locator(this.SELECTORS.CART_COUNT);
      const countText = await cartElement.textContent();
      const parsed = parseInt(countText || '0', 10);
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  }

  async clickShoppingCart(): Promise<void> {
    await this.navigationService.goto('/cart');
  }
}
