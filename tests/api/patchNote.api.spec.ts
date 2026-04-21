import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';

test.describe('Patch Note API', () => {
    let noteId: string;

    test('should update existing note status', async ({ request }) => {
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
        const nodeBody = {
            title: 'Note to Update',
            category: 'Personal',
            description: 'This note will be updated in the test'
        };
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

        // Patch the note
        const noteResponse = await request.patch(EnvData.BASE_URL + '/api/notes/' + noteId, {
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
        // Login to get the authentication token
        const loginResponse = await request.post(EnvData.BASE_URL + '/api/users/login',
            {
                data: loginData
            }
        );
        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.data.token;
        await request.delete(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: {
                'accept': 'application/json',
                'X-auth-token': token
            }
        });
    });

    test.afterEach(async ({ request }) => {
        // Login to get the authentication token
        const loginResponse = await request.post(EnvData.BASE_URL + '/api/users/login',
            {
                data: loginData
            }
        );
        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.data.token;
        await request.delete(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: {
                'accept': 'application/json',
                'X-auth-token': token
            }
        });
    });

});