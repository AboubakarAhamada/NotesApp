import { test as base, Page, BrowserContext } from '@playwright/test';
import { blockAds } from '../utils/adBlocker';



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

    await page.goto(EnvData.BASE_URL +'app/login');
    await page.fill('#email', 'testoto@gmail.com');
    await page.fill('#password', 'testoto');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/notes/app', { timeout: 10000 });

    await use(page);
  },
});

export const expect = test.expect;