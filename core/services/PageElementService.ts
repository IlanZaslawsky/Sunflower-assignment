import { Page, Locator } from '@playwright/test';
import { IPageElement } from '../interfaces/IPageElement';
import { TestConfig } from '../../config/testConfig';

export class PageElementService implements IPageElement {
  private locator: Locator;
  private readonly DEFAULT_TIMEOUT = TestConfig.timeouts.default;

  constructor(
    private page: Page,
    private selector: string
  ) {
    this.locator = page.locator(selector);
  }

  async click(): Promise<void> {
    try {
      await this.locator.click({ timeout: this.DEFAULT_TIMEOUT });
    } catch (error) {
      throw new Error(`Failed to click "${this.selector}": ${error}`);
    }
  }

  async fill(text: string): Promise<void> {
    try {
      await this.locator.fill(text, { timeout: this.DEFAULT_TIMEOUT });
    } catch (error) {
      throw new Error(`Failed to fill "${this.selector}" with "${text}": ${error}`);
    }
  }

  async getText(): Promise<string> {
    try {
      const text = await this.locator.textContent({ timeout: this.DEFAULT_TIMEOUT });
      if (!text) {
        throw new Error(`No text found in "${this.selector}"`);
      }
      return text.trim();
    } catch (error) {
      throw new Error(`Failed to get text from "${this.selector}": ${error}`);
    }
  }

  async isVisible(): Promise<boolean> {
    return await this.locator.isVisible();
  }

  async waitForVisibility(timeout: number = this.DEFAULT_TIMEOUT): Promise<void> {
    try {
      await this.locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      throw new Error(`Element "${this.selector}" not visible within ${timeout}ms: ${error}`);
    }
  }
}
