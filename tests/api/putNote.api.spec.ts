import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';
import { authHeaders, getAuthToken } from '../../fixtures/auth.api';

test.describe('Update Note API', () => {

    let noteId: string;

    let token: string;

    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
        console.log('Token from beforeAll:', token);
    });

    test('should update existing note successfully', async ({ request }) => {
        
        // Add a new note
        const newNoteResponse = await request.post(EnvData.BASE_URL + '/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to Update',
                category: 'Personal',
                description: 'This note will be updated in the test'
            }
        });
        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID

        // Update the note
        const nodeBody = {
            title: 'Updated note',
            category: 'Personal',
            description: 'Note has been updated successfully',
            completed: true
        };
        const noteResponse = await request.put(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: authHeaders(token),
            form: nodeBody
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

        await request.delete(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: authHeaders(token)
        });
    });
});