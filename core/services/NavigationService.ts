import { Page } from '@playwright/test';
import { INavigable } from '../interfaces/INavigable';

export class NavigationService implements INavigable {
  private readonly BASE_URL = '/';

  constructor(private page: Page) {}

  async goto(path: string = this.BASE_URL): Promise<void> {
    try {
      await this.page.goto(path, { waitUntil: 'networkidle' });
    } catch (error) {
      throw new Error(`Failed to navigate to ${path}: ${error}`);
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async goBack(): Promise<void> {
    try {
      await this.page.goBack();
    } catch (error) {
      throw new Error(`Failed to go back: ${error}`);
    }
  }
}
