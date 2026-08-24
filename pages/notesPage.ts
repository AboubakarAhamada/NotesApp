import { type Locator, type Page, expect } from "@playwright/test";

export class NotesPage {
    readonly page: Page;
    readonly addNewNoteButton: Locator;
    readonly addNoteDialog: Locator;
    readonly noteCategorySelect: Locator;
    readonly noteCompletedCheckbox: Locator;
    readonly noteTitleInput: Locator;
    readonly noteDescriptionInput: Locator;
    readonly noteSubmitButton: Locator;
    readonly noteCancelButton: Locator;
    readonly noteCardTitle: Locator;
    readonly noteCardDescription: Locator;
    readonly deleteNoteButton: Locator;
    readonly deleteNoteDialog: Locator;
    readonly deleteNoteConfirmButton: Locator;
    readonly deleteNoteCancelButton: Locator;
    readonly listOfNotes: Locator;
    readonly noteCard: Locator;
    readonly noNotesMessage: Locator;
    readonly noNotesMessageText: string = "You don't have any notes in all categories";
    readonly titleRequiredMessage: string = "Title is required";
    readonly titleLengthMessage: string = "Title should be between 4 and 100 characters";
    readonly descriptionRequiredMessage: string = "Description is required";
    readonly descriptionLengthMessage: string = "Description should be between 4 and 1000 characters";
    readonly alertMessage : Locator; 
    readonly alertTitleMessage: string = "Title must be between 4 and 100 characters";
    readonly alertDescriptionMessage: string = "Description must be between 4 and 1000 characters";

    constructor(page: Page) {
        this.page = page;
        this.addNewNoteButton = this.page.getByTestId('add-new-note');
        this.addNoteDialog = this.page.getByRole('dialog').filter({ hasText: 'Add new note' });
        this.noteCategorySelect = this.page.getByTestId('note-category');
        this.noteCompletedCheckbox = this.page.getByTestId('note-completed');
        this.noteTitleInput = this.page.getByTestId('note-title');
        this.noteDescriptionInput = this.page.getByTestId('note-description');
        this.noteSubmitButton = this.page.getByTestId('note-submit');
        this.noteCancelButton = this.page.getByTestId('note-cancel');
        this.noteCardTitle = this.page.getByTestId('note-card-title');
        this.noteCardDescription = this.page.getByTestId('note-card-description');
        this.deleteNoteButton = this.page.getByTestId('note-delete').first();
        this.deleteNoteDialog = this.page.getByTestId('note-delete-dialog');
        this.deleteNoteConfirmButton = this.page.getByTestId('note-delete-confirm');
        this.deleteNoteCancelButton = this.page.getByTestId('note-delete-cancel-2');
        this.listOfNotes = this.page.getByTestId('notes-list');
        this.noteCard = this.page.getByTestId('note-card');
        this.noNotesMessage = this.page.getByTestId('no-notes-message');
        this.alertMessage = this.page.getByTestId('alert-message');
    }

    async openAddNoteForm() {
        await this.addNewNoteButton.click();
        await expect(this.addNoteDialog).toBeVisible();
    }

    async fullNoteForm(category: string, isCompleted: boolean, title: string, description
        : string) {
        await this.noteCategorySelect.selectOption(category);
        if (isCompleted) {
            await this.noteCompletedCheckbox.check();
        }
        await this.noteTitleInput.fill(title);
        await this.noteDescriptionInput.fill(description);
    }

    async submitNoteForm() {
        await this.noteSubmitButton.click();
    }

    getCardByTitle(title: string) {
        return this.page.getByTestId('note-card').filter({ hasText: title });
    }

    async cancelNoteForm() {
        await this.noteCancelButton.click();
    }


    async addNote(category: string, isCompleted: boolean, title: string, description: string) {
        await this.openAddNoteForm();
        await this.fullNoteForm(category, isCompleted, title, description);
        await this.submitNoteForm();
        // Wait for the created note card to appear to avoid flakiness
        const createdCard = this.getCardByTitle(title);
        await expect(createdCard).toBeVisible({ timeout: 10000 });
    }

    async openDeleteNoteDialog() {
        await this.deleteNoteButton.click();
        await expect(this.deleteNoteDialog).toBeVisible();
    }

    async closeDeleteDialog() {
        await this.deleteNoteCancelButton.click();
        await expect(this.deleteNoteDialog).not.toBeVisible();
    }

    async confirmDeleteNote() {
        await this.deleteNoteConfirmButton.click();
        await expect(this.deleteNoteDialog).not.toBeVisible();

    }

    async deleteNote() {
        await this.openDeleteNoteDialog();
        await this.confirmDeleteNote();
    }

    async deleteAllNotes() {
        // Delete notes until none remain. Using a loop that re-queries the count
        // avoids issues with dynamic lists and stale counts.
        let count = await this.noteCard.count();
        let safety = 0;
        while (count > 0 && safety < 100) {
            await this.deleteNote();
            // wait briefly for DOM update
            await this.page.waitForTimeout(200);
            const newCount = await this.noteCard.count();
            if (newCount >= count) break; // nothing changed — avoid infinite loop
            count = newCount;
            safety++;
        }
    }
}