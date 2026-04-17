import { Page, expect } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {}

    /**
     * Verify that the welcome message is displayed on the home page
     */
    async verifyWelcomeMessage() {
        await expect(this.page.getByRole('heading', { name: 'Welcome to Notes App' })).toBeVisible();
    }

    /**
     * Navigate to the register/signup view
     */
    async goToRegisterView(): Promise<void> {
        await this.page.getByTestId('open-register-view').click();
    }

    /**
     * Navigate to the login view
     */
    async goToLoginView(): Promise<void> {
        await this.page.getByRole('link', { name: 'Login' }).click();
    }

    /**
     * Verify that the register button is visible
     */
    async isRegisterButtonVisible(): Promise<boolean> {
        return await this.page.getByTestId('open-register-view').isVisible();
    }

    /**
     * Verify that the login button is visible
     */
    async isLoginButtonVisible(): Promise<boolean> {
        return await this.page.getByTestId('open-login-view').isVisible();
    }
}