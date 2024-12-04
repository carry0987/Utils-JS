/**
 * @vitest-environment node
 */
import { setupMsw } from './tool/msw.setup';
import { fetchUtils } from '@/index';
import { server } from './tool/server';
import { http } from 'msw';
import { describe, it, expect } from 'vitest';

setupMsw();

describe('fetchUtils', () => {
    const testHost = 'http://localhost';
    const testUrl = testHost + '/api/test';

    it('doFetch makes a successful GET request', async () => {
        const response = await fetchUtils.doFetch<{ message: string }>({ url: testUrl });
        const responseData = await response.json();
        expect(responseData.message).toBe('GET request successful');
    });

    it('sendData makes a successful POST request', async () => {
        const response = await fetchUtils.sendData<{ message: string }>({
            url: testUrl,
            data: { key: 'value' }
        });
        expect(response.message).toBe('POST request successful');
    });

    it('sendFormData makes a successful POST request and returns true', async () => {
        const response = await fetchUtils.sendFormData<{ message: string }>({
            url: testUrl,
            data: new FormData()
        });
        expect(response).toBe(true);
    });

    it('doFetch handles error properly', async () => {
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
