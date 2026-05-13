import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page : Page;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly submitButton : Locator;
    readonly errorMessage : Locator;
    readonly alertMessage : string;
    readonly emptyEmailMessage : Locator;
    readonly emptyPasswordMessage : Locator;
   
    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.getByTestId('login-email');
        this.passwordInput = this.page.getByTestId('login-password');
        this.submitButton = this.page.getByTestId('login-submit');
        this.errorMessage = this.page.getByTestId('alert-message');
        this.alertMessage = 'Incorrect email address or password';
        this.emptyEmailMessage = this.page.getByText('Email address is required');
        this.emptyPasswordMessage = this.page.getByText('Password is required');
    }


    async fillEmail(email: string){
        await this.emailInput.fill(email);
    }  
    async fillPassword(password: string){
        await this.passwordInput.fill(password);
    }
    async submitForm(){
        await this.submitButton.click();
    }
     async verifySuccessfulLogin(URL: string) {
      const currentUrl = this.page.url();
      expect(currentUrl).toBe(URL);
    }
}