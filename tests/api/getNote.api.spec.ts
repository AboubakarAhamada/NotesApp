import { test, expect } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { authHeaders, getAuthToken } from '../../fixtures/auth.api';

test.describe('Get Note API', () => {
    let noteId: string;
    let token: string;
    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
        console.log('Token from beforeAll:', token);
    });

    test("should get note by Id for authenticated user", async ({ request }) => {

        // Add a new note
        const newNoteResponse = await request.post(EnvData.BASE_URL + '/api/notes', {
            headers: authHeaders(token),
            form: {
                title: 'Note to retrieve by id',
                category: 'Personal',
                description: 'This note will be retrieved by id in the test'
            }
        });
        expect(newNoteResponse.status()).toBe(200);
        expect(newNoteResponse.ok()).toBeTruthy();

        const newNoteResponseBody = await newNoteResponse.json();
        noteId = newNoteResponseBody.data.id; // Assuming the response contains the new note's ID
        
        const noteResponse = await request.get(EnvData.BASE_URL + '/api/notes/' + noteId, {
            headers: {
                'X-Auth-Token': token
            }
        });
        expect(noteResponse.status()).toBe(200);

        const noteResponseBody = await noteResponse.json();
        console.log(noteResponseBody);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('data');

        expect(noteResponseBody.data.title).toBeDefined();
        expect(noteResponseBody.data.description).toBeDefined();
        expect(noteResponseBody.data.category).toBeDefined();
        expect(noteResponseBody.data.completed).toBeDefined();

        expect(noteResponseBody.data.title).toEqual(expect.any(String));
        expect(noteResponseBody.data.description).toEqual(expect.any(String));
        expect(noteResponseBody.data.category).toEqual(expect.any(String));
        expect(noteResponseBody.data.completed).toEqual(expect.any(Boolean));

        expect(noteResponseBody.data).toHaveProperty('id');
        expect(noteResponseBody.data).toHaveProperty('created_at');
        expect(noteResponseBody.data).toHaveProperty('updated_at');
        expect(noteResponseBody.data).toHaveProperty('user_id');
    });

    test("should get all notes for authenticated user", async ({ request }) => {

        const notesResponse = await request.get(EnvData.BASE_URL + '/api/notes', {
            headers: {
                'X-Auth-Token': token
            }
        });
        expect(notesResponse.status()).toBe(200);

        const noteResponseBody = await notesResponse.json();
        console.log(noteResponseBody);
        expect(noteResponseBody).toHaveProperty('success', true);
        expect(noteResponseBody).toHaveProperty('data');

        expect(Array.isArray(noteResponseBody.data)).toBe(true);

        if (noteResponseBody.data.length > 0) {
            const note = noteResponseBody.data[0];
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('description');
            expect(note).toHaveProperty('category');
            expect(note).toHaveProperty('completed');
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('created_at');
            expect(note).toHaveProperty('updated_at');
            expect(note).toHaveProperty('user_id');
        }
    });
});