import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';

test.describe('Get Note API', () => {
    let noteId: string;

    test("should get note by Id for authenticated user", async ({ request }) => {
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
                title: 'Note to retrieve by id',
                category: 'Personal',
                description: 'This note will be retrieved by id in the test'
            }
        });
        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID



        const notesResponse = await request.get(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: {
                'X-Auth-Token': token
            }
        });
        const noteResponseBody = await notesResponse.json();
        console.log(noteResponseBody);
        expect(notesResponse.status()).toBe(200);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('data');
    });

    test("should get all notes for authenticated user", async ({ request }) => {
        // Login to get the authentication token
        const loginResponse = await request.post(EnvData.BASE_URL + '/api/users/login',
            {
                data: loginData
            }
        );

        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.data.token;
        console.log('Token:', token);

        const notesResponse = await request.get(EnvData.BASE_URL + '/api/notes', {
            headers: {
                'X-Auth-Token': token
            }
        });
        const noteResponseBody = await notesResponse.json();
        console.log(noteResponseBody);
        expect(notesResponse.status()).toBe(200);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('data');
    });
});