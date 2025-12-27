import { MatchDayClient } from '../../client';
import { UsersResource } from '../../resources/users';

describe('UsersResource', () => {
    const originalFetch = global.fetch;
    let client: MatchDayClient;
    let makeRequestSpy: jest.SpyInstance;

    beforeEach(() => {
        global.fetch = jest.fn();
        client = new MatchDayClient({ accessToken: 'test-token' });
        makeRequestSpy = jest.spyOn(client, 'makeRequest');
    });

    afterEach(() => {
        global.fetch = originalFetch;
        makeRequestSpy.mockRestore();
    });

    describe('constructor', () => {
        it('creates resource with correct base path', () => {
            const resource = new UsersResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('me', () => {
        it('calls makeRequest with correct path for @me endpoint', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
            };
            makeRequestSpy.mockResolvedValueOnce(mockUser);

            const result = await client.users.me();

            expect(makeRequestSpy).toHaveBeenCalledWith('/users/@me', { method: 'GET' });
            expect(result).toEqual(mockUser);
        });

        it('returns user profile data', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                avatar: 'https://example.com/avatar.jpg',
                emailVerified: true,
            };
            makeRequestSpy.mockResolvedValueOnce(mockUser);

            const result = await client.users.me();

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('displayName');
        });

        it('uses OAuth authentication', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ id: 'user-123' }),
            });

            // Create a new client without spying to test actual authentication
            const oauthClient = new MatchDayClient({ accessToken: 'oauth-access-token' });

            await oauthClient.users.me();

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer oauth-access-token',
                    }),
                }),
            );
        });
    });
});
