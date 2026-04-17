import { Page, expect } from "@playwright/test";

export class RegisterPage {
    constructor(private page : Page) {}

    async fillEmail(email: string) {
        await this.page.getByTestId('register-email').fill(email);
    }
    async fillPassword(password: string) {
        await this.page.getByTestId('register-password').fill(password);
    }
    async fillName(name: string) {
        await this.page.getByTestId('register-name').fill(name);
    }
    async fillConfirmPassword(confirmPassword: string) {
        await this.page.getByTestId('register-confirm-password').fill(confirmPassword);
    }
    async submitForm() {
        await this.page.getByTestId('register-submit').click();
    }   
    async verifySuccessMessage() {
        await expect(this.page.getByText('User account created successfully')).toBeVisible();
    }
}



