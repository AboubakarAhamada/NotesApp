
import { test, expect } from '@playwright/test';

test("mocks a fruit and doesn't call api", async ({ page }) => {
    // Mock the api call before navigating
    await page.route('https://jsonplaceholder.typicode.com/comments', async route => {
        const json = [{
            postId: 1,
            id: 5,
            name: "Test mocké 1",
            email: "Hayden@althea.biz",
            body: "Body mocké"
        },
        {
            postId: 1,
            id: 5,
            name: "Test mocké 2",
            email: "Haydenezeze@althea.biz",
            body: "Body mocké2"
        }];
        await route.fulfill({ json });
    });
    // Go to the page
    await page.goto('https://qa-practice.razvanvancea.ro/fetch-api.html');

    // Assert that the mocked comment is visible
    await expect(page.getByText('Test mocké 1')).toBeVisible();
    await expect(page.getByText('Test mocké 2')).toBeVisible();
});