/// <reference types="node" />
import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { EnvData } from '../../fixtures/env';

const authFile1 = path.join(__dirname, '../../playwright/.auth/user1.json');

setup('authenticate user1', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
    await page.goto(EnvData.BASE_URL +'/app/login');
    await page.fill('#email', 'testoto@gmail.com');
    await page.fill('#password', 'testoto');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/notes/app');
    await expect(page.getByTestId('add-new-note')).toBeVisible();

  // End of authentication steps.

    await page.context().storageState({ path: authFile1 });
});

const authFile2 = path.join(__dirname, '../../playwright/.auth/user2.json');

setup('authenticate user2', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
    await page.goto(EnvData.BASE_URL +'/app/login');
    await page.fill('#email', 'testmanu@gmail.com');
    await page.fill('#password', 'testmanu');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/notes/app');
    await expect(page.getByTestId('add-new-note')).toBeVisible();

  // End of authentication steps.

    await page.context().storageState({ path: authFile2 });
});