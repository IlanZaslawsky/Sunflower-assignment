import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  private readonly SELECTORS = {
    REGISTER_LINK: 'a[href="/register"]',
    DIGITAL_DOWNLOADS_LINK: 'a[href="/digital-downloads"]',
    ACCOUNT_EMAIL: 'a.account[href="/customer/info"]',
  };

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/');
    await this.createElement(this.SELECTORS.REGISTER_LINK).waitForVisibility();
  }

  async clickRegister(): Promise<void> {
    await this.createElement(this.SELECTORS.REGISTER_LINK).click();
  }

  async clickDigitalDownloads(): Promise<void> {
    // Handle multiple Digital Downloads links - select first
    const links = await this.page.locator(this.SELECTORS.DIGITAL_DOWNLOADS_LINK).all();
    if (links.length === 0) {
      throw new Error('No Digital Downloads link found');
    }
    await links[0].click({ timeout: 10000 });
  }

  async getHeaderEmail(): Promise<string> {
    const allAccountLinks = await this.page.locator(this.SELECTORS.ACCOUNT_EMAIL).all();
    if (allAccountLinks.length === 0) {
      throw new Error('No account email found in header');
    }

    for (const link of allAccountLinks) {
      const text = await link.textContent();
      if (text && text.includes('@')) {
        const trimmed = text.trim();
        if (this.isValidEmail(trimmed)) {
          return trimmed;
        }
      }
    }
    throw new Error('No valid email found in header account links');
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
