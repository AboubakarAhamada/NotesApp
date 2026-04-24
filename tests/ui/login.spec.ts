import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { blockAds } from '../../utils/adBlocker';

test.use({ storageState: { cookies: [], origins: [] } });
const login = process.env.APP_LOGIN;
const password = process.env.APP_PASSWORD;

if (!login || !password) {
    throw new Error('Missing APP_LOGIN or APP_PASSWORD');
}

test.describe('Testing Login Page', () => {

    test.beforeEach(async ({ page, context }) => {
        // Bloquer les publicités et overlays
        await page.route('**/*', blockAds);

        // Fermer les popups
        context.on('page', async (newPage) => {
            try {
                await newPage.close();
            } catch (e) { }
        });
    });

    test('should login with valid credentials', async ({ page }) => {

        const loginPage = new LoginPage(page);
        await page.goto('/notes/app/login');
        await loginPage.fillEmail(String(login));
        await loginPage.fillPassword(String(password));
        await loginPage.submitForm();
        await page.waitForURL('/notes/app');
        await expect(page.url()).not.toContain('/login');
        await expect(page.getByTestId('logout')).toBeVisible();
        await expect(page.getByTestId('profile')).toBeVisible();
    });
});

