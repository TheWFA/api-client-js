import { MatchDayClient, MatchDayAPIVersion } from '../client';
import { MatchDayAPIError, MatchDayNotFoundError, MatchDayUnauthorizedError } from '../types/errors';

describe('MatchDayClient', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    describe('constructor', () => {
        it('uses default baseURL when not provided', () => {
            const client = new MatchDayClient({ apiKey: 'test-key' });
            expect(client).toBeDefined();
        });

        it('uses custom baseURL when provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ data: 'test' }),
            });

            const client = new MatchDayClient({
                apiKey: 'test-key',
                baseURL: 'https://custom-api.example.com',
            });

            await client.makeRequest('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://custom-api.example.com/v1/test',
                expect.any(Object),
            );
        });

        it('uses V1 API version by default', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ data: 'test' }),
            });

            const client = new MatchDayClient({ apiKey: 'test-key' });
            await client.makeRequest('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/v1/test'),
                expect.any(Object),
            );
        });

        it('uses custom API version when provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ data: 'test' }),
            });

            const client = new MatchDayClient({
                apiKey: 'test-key',
                version: MatchDayAPIVersion.DEFAULT,
            });

            await client.makeRequest('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.thewfa.org.uk/test',
                expect.any(Object),
            );
        });

        it('initializes all resource endpoints', () => {
            const client = new MatchDayClient({ apiKey: 'test-key' });

            expect(client.matches).toBeDefined();
            expect(client.competitions).toBeDefined();
            expect(client.teams).toBeDefined();
            expect(client.seasons).toBeDefined();
            expect(client.persons).toBeDefined();
            expect(client.search).toBeDefined();
            expect(client.users).toBeDefined();
            expect(client.locations).toBeDefined();
        });
    });

    describe('setAccessToken', () => {
        it('updates the access token for subsequent requests', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ data: 'test' }),
            });

            const client = new MatchDayClient({ apiKey: 'initial-key' });

            // First request with API key
            await client.makeRequest('/test');
            let call = (global.fetch as jest.Mock).mock.calls[0];
            expect(call[1].headers['Authorization']).toBe('ApiKey initial-key');

            // Update token
            client.setAccessToken('new-access-token');

            // Second request should use Bearer token
            await client.makeRequest('/test');
            call = (global.fetch as jest.Mock).mock.calls[1];
            expect(call[1].headers['Authorization']).toBe('Bearer new-access-token');
        });
    });

    describe('makeRequest', () => {
        describe('authentication', () => {
            it('throws error when no authentication method is set', async () => {
                const client = new MatchDayClient({});

                await expect(client.makeRequest('/test')).rejects.toThrow(
                    'No authentication method set',
                );
            });

            it('uses API key authentication when apiKey is set', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({ apiKey: 'my-api-key' });
                await client.makeRequest('/test');

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].headers['Authorization']).toBe('ApiKey my-api-key');
            });

            it('uses Bearer token when accessToken is set', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({ accessToken: 'my-access-token' });
                await client.makeRequest('/test');

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].headers['Authorization']).toBe('Bearer my-access-token');
            });

            it('prefers Bearer token over API key when both are set', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({
                    apiKey: 'my-api-key',
                    accessToken: 'my-access-token',
                });
                await client.makeRequest('/test');

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].headers['Authorization']).toBe('Bearer my-access-token');
            });
        });

        describe('request handling', () => {
            it('sets Content-Type header to application/json', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                await client.makeRequest('/test');

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].headers['Content-Type']).toBe('application/json');
            });

            it('passes custom init options to fetch', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                await client.makeRequest('/test', {
                    method: 'POST',
                    body: JSON.stringify({ foo: 'bar' }),
                });

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].method).toBe('POST');
                expect(call[1].body).toBe('{"foo":"bar"}');
            });

            it('allows custom headers to override defaults', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ data: 'test' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                await client.makeRequest('/test', {
                    headers: { 'X-Custom-Header': 'custom-value' },
                });

                const call = (global.fetch as jest.Mock).mock.calls[0];
                expect(call[1].headers['X-Custom-Header']).toBe('custom-value');
            });
        });

        describe('response handling', () => {
            it('returns empty object for 204 No Content response', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 204,
                    json: async () => {
                        throw new Error('No content');
                    },
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                const result = await client.makeRequest('/test');

                expect(result).toEqual({});
            });

            it('parses JSON response body', async () => {
                const responseData = { id: '123', name: 'Test' };
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => responseData,
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                const result = await client.makeRequest('/test');

                expect(result).toEqual(responseData);
            });

            it('parses dates in response body', async () => {
                const responseData = {
                    id: '123',
                    createdAt: '2024-01-15T10:30:00Z',
                };
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => responseData,
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });
                const result = await client.makeRequest<{ id: string; createdAt: Date }>('/test');

                expect(result.createdAt).toBeInstanceOf(Date);
                expect(result.createdAt.toISOString()).toBe('2024-01-15T10:30:00.000Z');
            });
        });

        describe('error handling', () => {
            it('throws MatchDayNotFoundError for 404 response', async () => {
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: async () => ({ message: 'Resource not found' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });

                await expect(client.makeRequest('/test')).rejects.toThrow(MatchDayNotFoundError);
                await expect(client.makeRequest('/test')).rejects.toThrow('Resource not found');
            });

            it('throws MatchDayUnauthorizedError for 401 response', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: false,
                    status: 401,
                    json: async () => ({ message: 'Invalid token' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });

                await expect(client.makeRequest('/test')).rejects.toThrow(MatchDayUnauthorizedError);
            });

            it('throws MatchDayAPIError for unknown error status', async () => {
                (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                    json: async () => ({ message: 'Server error' }),
                });

                const client = new MatchDayClient({ apiKey: 'test-key' });

                await expect(client.makeRequest('/test')).rejects.toThrow(MatchDayAPIError);
            });
        });
    });
});
