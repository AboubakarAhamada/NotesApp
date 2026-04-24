import { loginData } from "./login_data";
import { APIRequestContext, expect } from "@playwright/test"; 


const login = process.env.APP_LOGIN;
const password = process.env.APP_PASSWORD;

if (!login || !password) {
  throw new Error('Missing APP_LOGIN or APP_PASSWORD');
}

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const loginResponse = await request.post('/notes/api/users/login', {
        data: loginData,
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseBody = await loginResponse.json();
    expect(loginResponseBody).toHaveProperty('data');
    expect(loginResponseBody.data).toHaveProperty('token');
    return loginResponseBody.data.token;
}

export function authHeaders(token : string) {
    return {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-auth-token': token
    };
}