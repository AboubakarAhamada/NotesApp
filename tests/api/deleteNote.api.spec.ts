import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';

test.describe('Delete Note API', () => {

    let noteId: string;
    test('should delete existing note successfully', async ({ request }) => {
        // Login to get the authentication token
        const loginResponse = await request.post(EnvData.BASE_URL + '/api/users/login',
            {
                data: loginData
            }
        );

        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.data.token;
        console.log('Token:', token);

        // Add a new note
        const newNoteResponse = await request.post(EnvData.BASE_URL + '/api/notes', {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-auth-token': token
            },
            form: {
                title: 'Note to Update',
                category: 'Personal',
                description: 'This note will be updated in the test'
            }
        });
        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID


        // Delete a note
        const noteResponse = await request.delete(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: {
                'accept': 'application/json',
                'X-auth-token': token
            }
        });
        const noteResponseBody = await noteResponse.json();
        console.log(noteResponseBody);
        expect(noteResponse.status()).toBe(200);

    });

});