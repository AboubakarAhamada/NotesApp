import {test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { loginData } from '../../fixtures/login_data';
import { EnvData } from '../../fixtures/env';
import { blockAds } from '../../utils/adBlocker';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Testing Login Page', () => {
    test.beforeEach(async ({ page, context }) => {
        // Bloquer les publicités et overlays
        await page.route('**/*', blockAds);

        // Fermer les popups
        context.on('page', async (newPage) => {
            try {
                await newPage.close();
            } catch (e) {}
        });
    });

    test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(EnvData.BASE_URL +'/app/login');
    await loginPage.fillEmail(loginData.email);
    await loginPage.fillPassword(loginData.password);
    await loginPage.submitForm();
    await page.waitForURL(EnvData.BASE_URL+'/app'); 
    await expect(page.url()).not.toContain('/login');
    await expect(page.getByTestId('logout')).toBeVisible();
    await expect(page.getByTestId('profile')).toBeVisible();
});
});

