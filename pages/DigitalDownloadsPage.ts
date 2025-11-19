import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';
import { TestConfig } from '../config/testConfig';
import { Logger } from '../utils/logger';

export class DigitalDownloadsPage extends BasePage {
  private readonly SELECTORS = {
    PRODUCT_ITEM: '.product-item',
  };

  constructor(page: Page) {
    super(page);
  }

  async getRandomProduct(): Promise<{ name: string; productId: string }> {
    Logger.action('Waiting for product grid to load');
    await this.page.waitForSelector('.product-grid', { timeout: TestConfig.timeouts.default });

    const products = await this.page.locator(this.SELECTORS.PRODUCT_ITEM).all();
    if (products.length === 0) {
      Logger.error('No products found');
      throw new Error('No products found');
    }

    Logger.info(`Found ${products.length} products, selecting random product`);
    const randomIndex = Math.floor(Math.random() * products.length);
    const selectedProduct = products[randomIndex];

    const productId = await selectedProduct.getAttribute('data-productid');
    if (!productId) {
      Logger.error('Could not extract product ID');
      throw new Error('Could not extract product ID');
    }

    const productLink = selectedProduct.locator('.details > .product-title > a');
    await productLink.waitFor({ state: 'visible', timeout: TestConfig.timeouts.default });

    const productName = await productLink.textContent({ timeout: TestConfig.timeouts.short });
    if (!productName || !productName.trim()) {
      Logger.error('Could not extract product name');
      throw new Error('Could not extract product name');
    }

    return {
      name: productName.trim(),
      productId,
    };
  }

  async addProductToCart(productId: string): Promise<void> {
    Logger.action(`Locating product with ID: ${productId}`);
    const selectedProduct = this.page.locator(`${this.SELECTORS.PRODUCT_ITEM}[data-productid="${productId}"]`);

    if (await selectedProduct.count() === 0) {
      Logger.error(`Product ${productId} not found`);
      throw new Error(`Product ${productId} not found`);
    }

    const addToCartButton = selectedProduct.locator('input[value="Add to cart"]');
    if (await addToCartButton.count() === 0) {
      Logger.error('Add to Cart button not found');
      throw new Error('Add to Cart button not found');
    }

    Logger.action('Waiting for Add to Cart button to be visible');
    await addToCartButton.waitFor({ state: 'visible', timeout: TestConfig.timeouts.default });

    // Listen for the POST request that confirms product was added
    Logger.action('Setting up network request listener for cart addition');
    const addToCartPromise = this.page.waitForResponse(
      (response) => response.url().includes('/addproducttocart') && response.status() === 200,
      { timeout: TestConfig.timeouts.default }
    );

    try {
      const cartUrl = `/addproducttocart/catalog/${productId}/1/1`;
      Logger.action('Attempting AJAX cart addition');
      await this.page.evaluate((url: string) => {
        const win = window as typeof window & { AjaxCart?: { addproducttocart_catalog?: (url: string) => void } };
        if (win.AjaxCart?.addproducttocart_catalog) {
          win.AjaxCart.addproducttocart_catalog(url);
        }
      }, cartUrl);
    } catch {
      Logger.action('AJAX method failed, falling back to button click');
      await addToCartButton.click({ timeout: TestConfig.timeouts.default, force: true });
    }

    // Wait for the network request to complete
    Logger.action('Waiting for cart addition network request to complete');
    await addToCartPromise;
    Logger.info('Product successfully added to cart (network request confirmed)');
  }

  async clickShoppingCart(): Promise<void> {
    await this.navigationService.goto('/cart');
  }
}
