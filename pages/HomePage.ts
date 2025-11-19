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
    await this.createElement(this.SELECTORS.DIGITAL_DOWNLOADS_LINK).waitForVisibility();
    await this.createElement(this.SELECTORS.DIGITAL_DOWNLOADS_LINK).click();
  }

  async getHeaderEmail(): Promise<string> {
    await this.createElement(this.SELECTORS.ACCOUNT_EMAIL).waitForVisibility();
    
    const emailText = await this.createElement(this.SELECTORS.ACCOUNT_EMAIL).getText();
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
