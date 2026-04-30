import { type Locator, type Page, expect } from "@playwright/test";

export class NotesPage {
    readonly page : Page;
    readonly addNewNoteButton : Locator;
    readonly noteCategorySelect : Locator;
    readonly noteCompletedCheckbox : Locator;
    readonly noteTitleInput : Locator;
    readonly noteDescriptionInput : Locator;
    readonly noteSubmitButton : Locator;
    readonly noteCancelButton : Locator;
    readonly noteCardTitle : Locator;
    readonly noteCardDescription : Locator;   

    constructor(page: Page) {
        this.page = page;
        this.addNewNoteButton = this.page.getByTestId('add-new-note');
        this.noteCategorySelect = this.page.getByTestId('note-category');
        this.noteCompletedCheckbox = this.page.getByTestId('note-completed');
        this.noteTitleInput = this.page.getByTestId('note-title');
        this.noteDescriptionInput = this.page.getByTestId('note-description');
        this.noteSubmitButton = this.page.getByTestId('note-submit');
        this.noteCancelButton = this.page.getByTestId('note-cancel');
        this.noteCardTitle = this.page.getByTestId('note-card-title');
        this.noteCardDescription = this.page.getByTestId('note-card-description');
    } 
    
    async clickAddNoteButton(){
        await this.addNewNoteButton.click();

    } 

    async fullNoteForm(category: string, isCompleted: boolean, title: string, description
        : string){
        await this.noteCategorySelect.selectOption(category);
        if(isCompleted){
            await this.noteCompletedCheckbox.check();
        }
        await this.noteTitleInput.fill(title);
        await this.noteDescriptionInput.fill(description);
    }

    async submitNoteForm(){
        await this.noteSubmitButton.click();
    }

    async cancelNoteForm(){
        await this.noteCancelButton.click();
    }
    async verifyNoteAdded(title: string, description: string){
        const noteCardTitle = await this.noteCardTitle.textContent();
        expect(noteCardTitle).toBe(title);
        const noteCardDescription = await this.noteCardDescription.textContent();
        expect(noteCardDescription).toBe(description);
    }
}