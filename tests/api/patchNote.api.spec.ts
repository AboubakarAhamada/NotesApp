import { test, expect } from '@playwright/test';
import { authHeaders, getAuthToken } from '../../fixtures/auth.api';

test.describe('Patch Note API', () => {
    let noteId: string;
    let token: string;
    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
        console.log('Token from beforeAll:', token);
    });
    test('should update existing note status', async ({ request }) => {

        // Add a new note
        const nodeBody = {
            title: 'Note to Update',
            category: 'Personal',
            description: 'This note will be updated in the test'
        };
        const newNoteResponse = await request.post('/notes/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to Update',
                category: 'Personal',
                description: 'This note will be updated in the test'
            }
        });
        expect(newNoteResponse.status()).toBe(200);
        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID

        // Patch the note
        const noteResponse = await request.patch('/notes/api/notes/' + noteId, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-auth-token': token
            },
            form: {
                completed: true
            }
        });
        expect(noteResponse.status()).toBe(200);

        const noteResponseBody = await noteResponse.json();
        console.log(noteResponseBody);
        expect(noteResponseBody.data.title).toBe(nodeBody.title);
        expect(noteResponseBody.data.description).toBe(nodeBody.description);
        expect(noteResponseBody.data.category).toBe(nodeBody.category);
        expect(noteResponseBody.data.completed).toBe(true);
        expect(noteResponseBody.data).toHaveProperty('id');
        expect(noteResponseBody.data).toHaveProperty('created_at');
        expect(noteResponseBody.data).toHaveProperty('updated_at');
        expect(noteResponseBody.data).toHaveProperty('user_id');

    });

    test.afterEach(async ({ request }) => {
        token = await getAuthToken(request);

        await request.delete('/notes/api/notes/' + noteId, {
            headers: authHeaders(token)
        });
    });

});