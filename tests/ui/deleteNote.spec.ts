import { test, expect } from '@playwright/test';
import { NotesPage } from '../../pages/notesPage';

test.describe('Testing Deleting Note Functionality', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test.beforeEach(async ({ page, context }) => {
        await page.goto('/notes/app');
        // Bloquer les publicités et overlays
        await page.route('**/*', (route) => {
            const url = route.request().url();
            if (
                url.includes('google') ||
                url.includes('ads') ||
                url.includes("socket.io") ||
                url.includes("analytics") ||
                url.includes('doubleclick') ||
                url.includes('googlesyndication') ||
                url.includes('amazon-adsystem') ||
                url.includes('facebook.com/tr') ||
                url.includes('googletagmanager') ||
                url.includes('vignette')
            ) {
                route.abort();
            } else {
                route.continue();
            }
        });

        // Fermer les popups
        context.on('page', async (newPage) => {
            try {
                await newPage.close();
            } catch (e) { }
        });
    });

    test('user should delete a note', async ({ page }) => {
        const notesPage = new NotesPage(page);
        await notesPage.addNote('Personal', true, 'Test Note to Delete', 'This note will be deleted in the test');
        await notesPage.deleteNote();
    });

    test('user should cancel deleting a note', async ({ page }) => {
        test.info().annotations.push({ type: 'cleanup', description: 'Test which needs a cleanup' });
        const notesPage = new NotesPage(page);
        const note = {
            category: 'Work',
            isCompleted: false,
            title: 'Finish report',
            description: 'Complete the quarterly report by Friday'
        };
        // Add one note to ensure there is a note to delete
        await notesPage.addNote(note.category, note.isCompleted, note.title, note.description);

        await notesPage.openDeleteNoteDialog();
        await notesPage.closeDeleteDialog();
        // Vérifier que la note ajoutée est toujours présente (cibler la carte par titre)
        const createdCard = page.getByTestId('note-card').filter({ hasText: note.title });
        await expect(createdCard).toBeVisible();
        await expect(createdCard.getByTestId('note-card-title')).toHaveText(note.title);
        await expect(createdCard.getByTestId('note-card-description')).toHaveText(note.description);

    });

    test('user should delete all notes', async ({ page }) => {
        const notesPage = new NotesPage(page);
        // Add one note to ensure there is a note to delete
        await notesPage.addNote('Work', false, 'Note 1', 'First note to delete');
        // Delete all notes and assert that the "no notes" message is visible
        await notesPage.deleteAllNotes();
        await expect(notesPage.noNotesMessage).toBeVisible();
        const noNotesMessageText = await notesPage.noNotesMessage.textContent();
        expect(noNotesMessageText).toBe(notesPage.noNotesMessageText);
    });

    test.afterEach(async ({ page }, testInfo) => {

        if (testInfo.annotations.some(a => a.type === 'cleanup')) {
            const notesPage = new NotesPage(page);
            await notesPage.deleteNote();
        }
    });
});