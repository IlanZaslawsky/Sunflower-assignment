import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';
import { IValidatable } from '../core/interfaces/IValidatable';

export class RegisterPage extends BasePage implements IValidatable {
  private readonly SELECTORS = {
    FIRST_NAME: 'input[id="FirstName"]',
    LAST_NAME: 'input[id="LastName"]',
    EMAIL: 'input[id="Email"]',
    PASSWORD: 'input[id="Password"]',
    CONFIRM_PASSWORD: 'input[id="ConfirmPassword"]',
    REGISTER_BTN: 'input[id="register-button"]',
    RESULT_MESSAGE: '.result',
  };

  private registrationEmail: string | null = null;
  private validationError: string | null = null;

  constructor(page: Page) {
    super(page);
  }

  async fillPersonalDetails(firstName: string, lastName: string, email: string): Promise<void> {
    this.registrationEmail = email;
    await this.createElement(this.SELECTORS.FIRST_NAME).fill(firstName);
    await this.createElement(this.SELECTORS.LAST_NAME).fill(lastName);
    await this.createElement(this.SELECTORS.EMAIL).fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.createElement(this.SELECTORS.PASSWORD).fill(password);
    await this.createElement(this.SELECTORS.CONFIRM_PASSWORD).fill(password);
  }

  async clickRegisterButton(): Promise<void> {
    await this.createElement(this.SELECTORS.REGISTER_BTN).click();
  }

  async waitForConfirmation(): Promise<void> {
    await this.createElement(this.SELECTORS.RESULT_MESSAGE).waitForVisibility();
  }

  async validate(): Promise<boolean> {
    try {
      if (!this.registrationEmail) {
        this.validationError = 'No email was provided during registration';
        return false;
      }

      const resultVisible = await this.createElement(this.SELECTORS.RESULT_MESSAGE).isVisible();
      if (!resultVisible) {
        this.validationError = 'Registration result message not visible';
        return false;
      }

      return true;
    } catch (error) {
      this.validationError = `Validation failed: ${error}`;
      return false;
    }
  }

  getValidationError(): string | null {
    return this.validationError;
  }

  getRegistrationEmail(): string {
    if (!this.registrationEmail) {
      throw new Error('No registration email found');
    }
    return this.registrationEmail;
  }
}
