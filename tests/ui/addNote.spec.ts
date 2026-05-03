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
    test('user should add a new note', async ({ page }) => {
        test.info().annotations.push({ type: 'cleanup', description: 'Test which needs a cleanup' });

        const note = {
            category: 'Work',
            isCompleted: false,
            title: 'Finish report',
            description: 'Complete the quarterly report by Friday'
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();

        // Vérifier que la note a été ajoutée
        await notesPage.verifyNoteAdded(note.title, note.description);

    });

    test('user should cancel adding a new note', async ({ page }) => {
        const note = {
            category: 'Personal',
            isCompleted: false,
            title: 'Buy groceries',
            description: 'Get milk, bread, and eggs'
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.cancelNoteForm();
        // Vérifier que la note n'a pas été ajoutée
    });

    test('user should see validation messages when submitting empty form', async ({ page }) => {
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.submitNoteForm();
        // Vérifier les messages de validation
        const titleRequiredMessage = page.getByText(notesPage.titleRequiredMessage);
        await expect(titleRequiredMessage).toBeVisible();
        const descriptionRequiredMessage = page.getByText(notesPage.descriptionRequiredMessage);
        await expect(descriptionRequiredMessage).toBeVisible();
    });

    test('user should see validation messages when submitting form with short title and description', async ({ page }) => { 
        const note = {
            category: 'Work',
            isCompleted: false, 
            title: 'abc',
            description: 'xyz'
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();
        // Vérifier les messages de validation
        const titleLengthMessage = page.getByText(notesPage.titleLengthMessage);
        await expect(titleLengthMessage).toBeVisible();
        const descriptionLengthMessage = page.getByText(notesPage.descriptionLengthMessage);
        await expect(descriptionLengthMessage).toBeVisible();
    });

    test('user should see validation messages when submitting form with long title and description', async ({ page }) => {
        const longTitle = 'a'.repeat(101);
        const longDescription = 'b'.repeat(1001);
        const note = {
            category: 'Personal',
            isCompleted: false,
            title: longTitle,
            description: longDescription
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();
        // Vérifier les messages de validation
        const titleLengthMessage = page.getByText(notesPage.titleLengthMessage);
        await expect(titleLengthMessage).toBeVisible();
        const descriptionLengthMessage = page.getByText(notesPage.descriptionLengthMessage);
        await expect(descriptionLengthMessage).toBeVisible();
    });

    // Tests supplémentaires pour les titres et descriptions composés uniquement d'espaces
    // La gestion dees mesages d'erreur pour les champs composés uniquement d'espaces n'est pas fait comme les autres messages d'erreur,
    // il y a un message d'alerte qui s'affiche en haut du formulaire d'ajout de note, c'est pour ça que j'ai fait un test séparé pour ce cas
    test('user should see alert message when submitting form with title composed of only spaces', async ({ page }) => {
        const note = {
            category: 'Work',
            isCompleted: false,
            title: '    ',
            description: 'Normal description '
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();
        // Vérifier le message d'erreur
        const errorMessage = notesPage.alertMessage;
        await expect(errorMessage).toContainText(notesPage.alertTitleMessage);
    });

    test('user should see alert message when submitting form with description composed of spaces', async ({ page }) => {
        const note = {
            category: 'Work',
            isCompleted: true,
            title: 'Normal title',
            description: '    '
        };
        const notesPage = new NotesPage(page);
        await notesPage.openAddNoteForm();
        await notesPage.fullNoteForm(note.category, note.isCompleted, note.title, note.description);
        await notesPage.submitNoteForm();
        // Vérifier le message d'erreur
        const errorMessage = notesPage.alertMessage;
        await expect(errorMessage).toContainText(notesPage.alertDescriptionMessage);
    });

    test.afterEach(async ({ page }, testInfo) => {

        if (testInfo.annotations.some(a => a.type === 'cleanup')) {
            const notesPage = new NotesPage(page);
            await notesPage.deleteNote();
        }
    });
}); 