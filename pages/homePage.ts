import { type Page, type Locator, expect } from "@playwright/test";

export class HomePage {
    readonly page : Page;
    readonly registerButton : Locator;
    readonly loginButton : Locator;
    readonly welcomeMessage : Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.registerButton = this.page.getByTestId('open-register-view');
        this.loginButton = this.page.locator('a[href="/notes/app/login"]');
        this.welcomeMessage = this.page.getByRole('heading', { name: 'Welcome to Notes App' });
    }

    /**
     * Verify that the welcome message is displayed on the home page
     */
    async verifyWelcomeMessage() {
        await expect(this.welcomeMessage).toBeVisible();
    }

    /**
     * Navigate to the register/signup view
     */
    async goToRegisterView(): Promise<void> {
        await this.registerButton.click();
    }

    /**
     * Navigate to the login view
     */
    async goToLoginView(): Promise<void> {
        await this.loginButton.click();
    }

    /**
     * Verify that the register button is visible
     */
    async isRegisterButtonVisible(): Promise<boolean> {
        return await this.registerButton.isVisible();
    }

    /**
     * Verify that the login button is visible
     */
    async isLoginButtonVisible(): Promise<boolean> {
        return await this.loginButton.isVisible();
    }
}