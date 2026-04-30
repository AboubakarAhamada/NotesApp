import {test} from '@playwright/test';
import { RegisterPage } from '../../pages/registrerPage';
import { registerData } from '../../fixtures/register_data';
import { blockAds } from '../../utils/adBlocker';


test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Testing Registration Page', () => {

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page, context }) => {
    // Bloquer les publicités et overlays
    await page.route('**/*', blockAds);

    // Fermer les popups
    context.on('page', async (newPage) => {
      try {
        await newPage.close();
      } catch (e) {}
    });

    registerPage = new RegisterPage(page);
    await page.goto('/notes/app/register');
  });

  test('should register a new user', async ({ page }) => {

    await registerPage.fillEmail(registerData.email);
    await registerPage.fillPassword(registerData.password);
    await registerPage.fillName(registerData.name);
    await registerPage.fillConfirmPassword(registerData.confirmPassword);
    await registerPage.submitForm();
    await registerPage.verifySuccessMessage();
  });
});