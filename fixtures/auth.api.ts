import { EnvData } from "./env";
import { loginData } from "./login_data";
import { APIRequestContext, expect } from "@playwright/test"; 

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const loginResponse = await request.post(EnvData.BASE_URL + '/api/users/login', {
        data: loginData
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseBody = await loginResponse.json();
    expect(loginResponseBody).toHaveProperty('token');
    return loginResponseBody.data.token;
}

export function authHeaders(token : string) {
    return {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-auth-token': token
    };
}