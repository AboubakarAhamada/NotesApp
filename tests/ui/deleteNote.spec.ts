import { test, expect } from '@playwright/test';
import { NotesPage } from '../../pages/notesPage';

test.describe('Testing Deleting Note Functionality', () => {

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

    test.use({ storageState: 'playwright/.auth/user.json' });

    test('user should delete a note', async ({ page }) => {
        const notesPage = new NotesPage(page);
        await notesPage.addNote('Personal', true, 'Test Note to Delete', 'This note will be deleted in the test');
        await notesPage.deleteNote();
    });

    test('user should cancel deleting a note', async ({ page }) => {
        test.info().annotations.push({ type: 'cleanup', description: 'Test which needs a cleanup' });
        const notesPage = new NotesPage(page);
        // Add one note to ensure there is a note to delete
        await notesPage.addNote('Work', false, 'Note 1', 'First note to delete');
        await notesPage.cancelDeleteNote();
        await notesPage.verifyNoteExists('Note 1', 'First note to delete');
    });

    test('user should delete all notes', async ({ page }) => {
        const notesPage = new NotesPage(page);
        // Add one note to ensure there is a note to delete
        await notesPage.addNote('Work', false, 'Note 1', 'First note to delete');

        await notesPage.deleteAllNotes();
    });

    test.afterEach(async ({ page }, testInfo) => {

        if (testInfo.annotations.some(a => a.type === 'cleanup')) {
            const notesPage = new NotesPage(page);
            await notesPage.deleteNote();
        }
    });
});