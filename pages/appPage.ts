import { Page, expect } from "@playwright/test";

export class AppPage {
    constructor(private page: Page) {} 
    
    async clickAddNoteButton(){
        await this.page.getByTestId('add-new-note').click();
    } 

    async fullNoteForm(category: string, isCompleted: boolean, title: string, description
        : string){
        await this.page.getByTestId('note-category').selectOption(category);
        if(isCompleted){
            await this.page.getByTestId('note-completed').check();
        }
        await this.page.getByTestId('note-title').fill(title);
        await this.page.getByTestId('note-description').fill(description);
    }

    async submitNoteForm(){
        await this.page.getByTestId('note-submit').click();
    }

    async cancelNoteForm(){
        await this.page.getByTestId('note-cancel').click();
    }
}