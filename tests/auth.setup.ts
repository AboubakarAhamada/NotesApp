/// <reference types="node" />
import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { EnvData } from '../fixtures/env';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
    await page.goto(EnvData.BASE_URL +'/login');
    await page.fill('#email', 'testoto@gmail.com');
    await page.fill('#password', 'testoto');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/notes/app');
    await expect(page.getByTestId('add-new-note')).toBeVisible();

  // End of authentication steps.

    await page.context().storageState({ path: authFile });
});