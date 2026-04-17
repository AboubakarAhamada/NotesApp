import { Page,expect } from "@playwright/test";

export class LoginPage {

   
    constructor(private page: Page) {} 


    async fillEmail(email: string){
        await this.page.fill('#email', email);
    }  
    async fillPassword(password: string){
        await this.page.fill('#password', password);
    }
    async submitForm(){
        await this.page.getByTestId('login-submit').click();
    }
     async verifySuccessfulLogin(URL: string) {
      const currentUrl = this.page.url();
      expect(currentUrl).toBe(URL);
    }
}