import { Page } from '@playwright/test';
import { NavigationService } from './services/NavigationService';
import { PageElementService } from './services/PageElementService';
import { INavigable } from './interfaces/INavigable';

export abstract class BasePage implements INavigable {
  protected navigationService: NavigationService;

  constructor(protected page: Page) {
    this.navigationService = new NavigationService(page);
  }

  protected createElement(selector: string): PageElementService {
    return new PageElementService(this.page, selector);
  }

  async goto(path: string = '/'): Promise<void> {
    await this.navigationService.goto(path);
  }

  async getCurrentUrl(): Promise<string> {
    return this.navigationService.getCurrentUrl();
  }

  protected async goBack(): Promise<void> {
    await this.navigationService.goBack();
  }
}
