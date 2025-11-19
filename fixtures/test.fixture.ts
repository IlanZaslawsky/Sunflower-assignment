import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { DigitalDownloadsPage } from '../pages/DigitalDownloadsPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

type PageFixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  digitalDownloadsPage: DigitalDownloadsPage;
  shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  digitalDownloadsPage: async ({ page }, use) => {
    const digitalDownloadsPage = new DigitalDownloadsPage(page);
    await use(digitalDownloadsPage);
  },

  shoppingCartPage: async ({ page }, use) => {
    const shoppingCartPage = new ShoppingCartPage(page);
    await use(shoppingCartPage);
  },
});

export { expect } from '@playwright/test';
