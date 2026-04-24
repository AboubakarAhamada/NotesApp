import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

import { blockAds } from '../utils/adBlocker';

const login = process.env.APP_LOGIN;
const password = process.env.APP_PASSWORD;

if (!login || !password) {
  throw new Error('Missing APP_LOGIN or APP_PASSWORD');
}

export const test = base.extend<{
  loggedPage: Page;
}>({
  loggedPage: async ({ page, context }: { page: Page, context: BrowserContext }, use: (value: Page) => Promise<void>) => {
    // Bloquer les publicités et overlays
    await page.route('**/*', blockAds);

    // Fermer les popups
    context.on('page', async (newPage) => {
      try {
        await newPage.close();
      } catch (e) { }
    });
    const loginPage = new LoginPage(page);
    await page.goto('/notes/app/login');
    await loginPage.fillEmail(String(login));
    await loginPage.fillPassword(String(password));
    await loginPage.submitForm();
    await page.waitForURL('**/notes/app', { timeout: 10000 });

    await use(page);
  },
});

export const expect = test.expect;