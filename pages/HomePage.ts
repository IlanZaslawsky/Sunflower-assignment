import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';
import { TestConfig } from '../config/testConfig';

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
    const digitalDownloadsLink = this.page.locator(this.SELECTORS.DIGITAL_DOWNLOADS_LINK).first();
    await digitalDownloadsLink.waitFor({ state: 'visible', timeout: TestConfig.timeouts.default });
    await digitalDownloadsLink.click({ timeout: TestConfig.timeouts.default });
  }

  async getHeaderEmail(): Promise<string> {
    const accountLink = this.page.locator(this.SELECTORS.ACCOUNT_EMAIL).first();
    await accountLink.waitFor({ state: 'visible', timeout: TestConfig.timeouts.default });
    
    const emailText = await accountLink.textContent();
    if (!emailText) {
      throw new Error('Account link found but no email text content');
    }

    const trimmedEmail = emailText.trim();
    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error(`Invalid email format found in header: ${trimmedEmail}`);
    }

    return trimmedEmail;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
