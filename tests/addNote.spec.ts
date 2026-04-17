import { test, expect } from '@playwright/test';
import { AppPage } from '../pages/appPage';
import { EnvData } from '../fixtures/env';


test.describe('Testing Add Note Functionality', () => {

    test.beforeEach(async ({ page, context }) => {
            await page.goto(EnvData.BASE_URL);
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
    test.use({ storageState: 'playwright/.auth/user1.json' });
    test('user1 should add a new note', async ({page}) => {
        const appPage = new AppPage(page);
        await appPage.clickAddNoteButton();
        // await appPage.fullNoteForm('Work', false, 'Finish report', 'Complete the quarterly report by Friday');
        // await appPage.submitNoteForm();

        // Verify the note was added
    });

    test.use({ storageState: 'playwright/.auth/user2.json' });
    test('user2 should add a new note', async ({page}) => {
        const appPage = new AppPage(page);
        await appPage.clickAddNoteButton();
        // await appPage.fullNoteForm('Work', false, 'Finish report', 'Complete the quarterly report by Friday');
        // await appPage.submitNoteForm();

        // Verify the note was added
    });
}); 