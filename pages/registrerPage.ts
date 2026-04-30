import { type Page, type Locator, expect } from "@playwright/test";

export class RegisterPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;
    readonly successMessageLocator: Locator;
    readonly successMessage: string = 'User account created successfully';


    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.getByTestId('register-email');
        this.passwordInput = this.page.getByTestId('register-password');
        this.nameInput = this.page.getByTestId('register-name');
        this.confirmPasswordInput = this.page.getByTestId('register-confirm-password');
        this.submitButton = this.page.getByTestId('register-submit');
        this.successMessageLocator = this.page.getByText(this.successMessage);
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }
    async fillName(name: string) {
        await this.nameInput.fill(name);
    }
    async fillConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }
    async submitForm() {
        await this.submitButton.click();
    }
    async verifySuccessMessage() {
        await expect(this.successMessageLocator).toBeVisible();
    }
}



