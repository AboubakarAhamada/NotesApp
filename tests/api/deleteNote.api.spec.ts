import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { authHeaders, getAuthToken } from '../../fixtures/auth.api';

test.describe('Delete Note API', () => {

    let noteId: string;
    let token: string;
    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
        console.log('Token from beforeAll:', token);
    });

    test('should delete existing note successfully', async ({ request }) => {

        // Add a new note
        const newNoteResponse = await request.post(EnvData.BASE_URL + '/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to Update',
                category: 'Personal',
                description: 'This note will be updated in the test'
            }
        });
        expect(newNoteResponse.status()).toBe(200);
        expect(newNoteResponse.ok()).toBeTruthy();

        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID


        // Delete a note
        const noteResponse = await request.delete(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: authHeaders(token)
        });
        expect(noteResponse.status()).toBe(200);

        const noteResponseBody = await noteResponse.json();
        console.log(noteResponseBody);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('message', 'Note successfully deleted');
    });
});