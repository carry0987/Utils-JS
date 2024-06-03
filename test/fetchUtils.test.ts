/**
 * @jest-environment node
 */
import { setupMsw } from './tool/msw.setup';
import { fetchUtils } from '../src/index';
import { server } from './tool/server';
import { http } from 'msw';

setupMsw();

describe('fetchUtils', () => {
    const testHost = 'http://localhost';
    const testUrl = testHost + '/api/test';

    test('doFetch makes a successful GET request', async () => {
        const response = await fetchUtils.doFetch<{ message: string }>({ url: testUrl });
        expect(response.message).toBe('GET request successful');
    });

    test('sendData makes a successful POST request', async () => {
        const response = await fetchUtils.sendData<{ message: string }>({
            url: testUrl,
            data: { key: 'value' }
        });
        expect(response.message).toBe('POST request successful');
    });

    test('sendFormData makes a successful POST request and returns true', async () => {
        const response = await fetchUtils.sendFormData<{ message: string }>({
            url: testUrl,
            data: new FormData()
        });
        expect(response).toBe(true);
    });

    test('doFetch handles error properly', async () => {
        server.use(
            http.get(testHost + '/api/error', () => {
                return new Response('Internal Server Error', {
                    status: 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            })
        );

        try {
            await fetchUtils.doFetch<{ message: string }>({ url: testHost + '/api/error' });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
