import { test, expect, request } from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';

test.describe('Add Note API', () => {

  test('should add a new note successfully', async ({ request }) => {
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
      title: 'New note',
      category: 'Personal',
      description: 'This is a new note for testing purpose'
    };
    const noteResponse = await request.post(EnvData.BASE_URL + '/api/notes', {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-auth-token': token
      },
      form: nodeBody
    });
    expect(noteResponse.status()).toBe(200);

    const noteResponseBody = await noteResponse.json();
    console.log(noteResponseBody);
    expect(noteResponseBody.data.title).toBe(nodeBody.title);
    expect(noteResponseBody.data.description).toBe(nodeBody.description);
    expect(noteResponseBody.data.category).toBe(nodeBody.category);
    expect(noteResponseBody.data.completed).toBe(false);
    expect(noteResponseBody.data).toHaveProperty('id');
    expect(noteResponseBody.data).toHaveProperty('created_at');
    expect(noteResponseBody.data).toHaveProperty('updated_at');
    expect(noteResponseBody.data).toHaveProperty('user_id');


  });

});