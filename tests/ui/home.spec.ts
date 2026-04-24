import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { blockAds } from '../../utils/adBlocker';


test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Testing Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, context }) => {
    homePage = new HomePage(page);

    // Bloquer les publicités et overlays qui causent des flaky tests
    await page.route('**/*', blockAds);

    // Fermer automatiquement les popups/publicités qui s'ouvrent
    context.on('page', async (newPage) => {
      await newPage.close();
    });

    await page.goto("/notes/app");
  });

  test('Verify welcome message', async ({ page }) => {
    await homePage.verifyWelcomeMessage();
  });

  test('Verify register button is visible', async ({ page }) => {
    await expect(page.getByTestId('open-register-view')).toBeVisible();
  });

  test('Verify login button is visible', async ({ page }) => {
    await expect(page.getByTestId('open-login-view')).toBeVisible();
  });

  test('Verify navigation to register page', async ({ page }) => {
    await homePage.goToRegisterView();
    await page.waitForURL(/\/register$/, { timeout: 10000 }); // Utiliser regex pour ignorer les hashes
    await expect(page.url()).toMatch(/\/register$/);
  });

  test('Verify navigation to login page', async ({ page }) => {
    await homePage.goToLoginView();
    await page.waitForURL(/\/login$/, { timeout: 10000 }); // Utiliser regex pour ignorer les hashes
    await expect(page.url()).toMatch(/\/login$/);
  });
});
