import { AppPage } from '../pages/appPage';
import { test} from '../fixtures/login_fixture';

test.describe('Testing Add Note Functionality', () => {

    test.beforeEach(async ({ page, context }) => {
            // Bloquer les publicités et overlays
            await page.route('**/*', (route) => {
                const url = route.request().url();
                if (
                    url.includes('google') ||
                    url.includes('ads') ||
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
                } catch (e) {}
            });
    });

    test('should add a new note', async ({ loggedPage }) => {
        const appPage = new AppPage(loggedPage);

        await loggedPage.waitForURL('**/notes/app');
        await appPage.clickAddNoteButton();
        await appPage.fullNoteForm('Work', false, 'Finish report', 'Complete the quarterly report by Friday');
        await appPage.submitNoteForm();

        // Verify the note was added
    });
}); 