import { test, expect } from '@playwright/test';
import { NotesPage } from '../../pages/notesPage';


test.describe('Testing Add Note Functionality', () => {

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
    test('user1 should add a new note', async ({ page }) => {
        const note = {
            category: 'Work',
            isCompleted: false,
            title: 'Finish report',
            description: 'Complete the quarterly report by Friday'
        };
        const notesPage = new NotesPage(page);
        await notesPage.clickAddNoteButton();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();

        // Vérifier que la note a été ajoutée
        await notesPage.verifyNoteAdded(note.title, note.description);

    });
}); 