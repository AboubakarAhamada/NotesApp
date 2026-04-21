import {test, expect, request} from '@playwright/test';
import { EnvData } from '../../fixtures/env';
import { loginData } from '../../fixtures/login_data';

test.describe('Add Note API', () => {

  test('should add a new note successfully', async ({ request }) => {
    // Login to get the authentication token
    const loginResponse = await request.post(EnvData.BASE_URL+'/api/users/login', 
        {
        data: loginData
        }
    );
    const loginResponseBody = await loginResponse.json();
    const token = loginResponseBody.data.token;
    console.log('Token:', token);

    // Add a new note
    const noteResponse = await request.post(EnvData.BASE_URL+'/api/notes', {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-auth-token': token
      },
      form: {
        title: 'Test Note 2',
        category: 'Personal',
        description: 'This is a test note again'
      }
    });
    const noteResponseBody = await noteResponse.json();
    console.log(noteResponseBody);
    expect(noteResponse.status()).toBe(200);
   
  });

});