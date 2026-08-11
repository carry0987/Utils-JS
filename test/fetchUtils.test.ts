/**
 * @vitest-environment node
 */

import { http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { fetchUtils } from '@/index';
import { setupMsw } from './tool/msw.setup';
import { server } from './tool/server';

setupMsw();

describe('fetchUtils', () => {
    const testHost = 'http://localhost';
    const testUrl = `${testHost}/api/test`;

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

    it('doFetch does not fail on empty successful responses', async () => {
        const success = vi.fn();

        server.use(
            http.post(`${testHost}/api/no-content`, () => {
                return new Response(null, { status: 204 });
            })
        );

        const response = await fetchUtils.doFetch<null>({
            url: `${testHost}/api/no-content`,
            method: 'POST',
            success
        });

        expect(response.status).toBe(204);
        expect(success).toHaveBeenCalledWith(null);
    });

    it('sendData returns plain text for non-JSON responses', async () => {
        server.use(
            http.post(`${testHost}/api/text`, () => {
                return new Response('plain text response', {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            })
        );

        const response = await fetchUtils.sendData<string>({
            url: `${testHost}/api/text`,
            data: { key: 'value' }
        });

        expect(response).toBe('plain text response');
    });

    it('doFetch handles error properly', async () => {
        server.use(
            http.get(`${testHost}/api/error`, () => {
                return new Response('Internal Server Error', {
                    status: 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            })
        );

        try {
            await fetchUtils.doFetch<{ message: string }>({ url: `${testHost}/api/error` });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
