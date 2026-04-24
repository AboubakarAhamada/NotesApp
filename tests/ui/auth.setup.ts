/// <reference types="node" />
import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

const login = process.env.APP_LOGIN;
const password = process.env.APP_PASSWORD;
if (!login || !password) {
  throw new Error('Missing APP_LOGIN or APP_PASSWORD');
}

setup('authenticate user1', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
    await page.goto('/notes/app/login');
    await page.fill('#email', login);
    await page.fill('#password', password);
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/notes/app');
    await expect(page.getByTestId('add-new-note')).toBeVisible();

  // End of authentication steps.

    await page.context().storageState({ path: authFile });
});
