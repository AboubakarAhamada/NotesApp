import { test, expect } from '@playwright/test';
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
        const newNoteResponse = await request.post('/notes/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to Delete',
                category: 'Personal',
                description: 'This note will be deleted for the test.',
            }
        });
        expect(newNoteResponse.status()).toBe(200);

        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID


        // Delete a note
        const noteResponse = await request.delete('/notes/api/notes/' + noteId, {
            headers: authHeaders(token)
        });
        expect(noteResponse.status()).toBe(200);

        const noteResponseBody = await noteResponse.json();
        console.log(noteResponseBody);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('message', 'Note successfully deleted');
    });

    test('Can\'t delete a non-existing note', async ({ request }) => {
        const nonExistingNoteId = "6a743dcfd291420298168fd2";
        const noteResponse = await request.delete('/notes/api/notes/' + nonExistingNoteId, {
            headers: authHeaders(token)
        });
        expect(noteResponse.status()).toBe(404);
        const noteResponseBody = await noteResponse.json();
        expect(noteResponseBody).toHaveProperty('success', false);
        expect(noteResponseBody).toHaveProperty('message', 'No note was found with the provided ID, Maybe it was deleted');
    });

    test('Can\'t delete a note without authentication', async ({ request }) => {
         // Add a new note
        const newNoteResponse = await request.post('/notes/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to Delete',
                category: 'Personal',
                description: 'This note will not be deleted cause user is not authenticated.',
            }
        });
        expect(newNoteResponse.status()).toBe(200);

        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID

        const response = await request.delete('/notes/api/notes/' + noteId, {
            //headers: authHeaders(token)  
        });
        expect(response.status()).toBe(401);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('success', false);
        expect(responseBody).toHaveProperty('status', 401);
        expect(responseBody).toHaveProperty('message', 'No authentication token specified in x-auth-token header');

        // We finally delete the note to clean up after the test
        const cleanupResponse = await request.delete('/notes/api/notes/' + noteId, {
            headers: authHeaders(token)
        });
        expect(cleanupResponse.status()).toBe(200);
    })
});