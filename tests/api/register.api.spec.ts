import {test, expect} from '@playwright/test';
import { registerData } from '../../fixtures/register_data';
import { EnvData } from '../../fixtures/env';

test.describe('Testing Register API', () => {
    test('should register a new user with valid email, name, and password', async ({request}) => {
        const response = await request.post(EnvData.BASE_URL + '/api/users/register', {
            data: registerData
        });
        console.log(await response.json());
        const body = await response.json();
        expect(response.status()).toBe(201);
        expect(body).toHaveProperty('message', 'User account created successfully');
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('name', registerData.name);   
    });

    test('should not register a new user with invalid data', async ({request}) => {
        const response = await request.post(EnvData.BASE_URL + '/api/users/register', {
            data: {
                email: 'invalid-email',
                password: 'short',
                name: 'Tester'
            }
        });
        console.log(await response.json());
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body).toHaveProperty('success', false);
    });
});