import { MatchDayOAuthClient } from '../oauth2';
import { MatchDayOAuth2Scope } from '../types/oauth2';
import { MatchDayAPIError } from '../types/errors';

describe('MatchDayOAuthClient', () => {
    describe('constructor', () => {
        it('uses default authURL when not provided', async () => {
            const client = new MatchDayOAuthClient({ clientId: 'test-client' });
            const { url } = await client.authorize(['profile'], 'http://localhost:3000');
            const parsed = new URL(url);
            expect(parsed.hostname).toBe('auth.thewfa.org.uk');
        });

        it('uses custom authURL when provided', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                authURL: 'https://custom-auth.example.com',
            });
            const { url } = await client.authorize(['profile'], 'http://localhost:3000');
            const parsed = new URL(url);
            expect(parsed.hostname).toBe('custom-auth.example.com');
        });
    });

    describe('authorize', () => {
        it('creates a valid authorization URL', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client-id',
                clientSecret: 'test-secret',
            });

            const state = crypto.randomUUID();
            const redirectUri = 'http://localhost:3000/callback';
            const scopes: MatchDayOAuth2Scope[] = ['email', 'profile'];

            const { url } = await client.authorize(scopes, redirectUri, state);

            expect(() => new URL(url)).not.toThrow();
            const parsed = new URL(url);

            expect(parsed.protocol).toBe('https:');
            expect(parsed.pathname).toBe('/api/auth/oauth2/authorize');

            const qp = parsed.searchParams;
            expect(qp.get('response_type')).toBe('code');
            expect(qp.get('client_id')).toBe('test-client-id');
            expect(qp.get('redirect_uri')).toBe(redirectUri);
            expect(qp.get('state')).toBe(state);
            expect(qp.get('scope')).toBe('email profile');
        });

        it('includes PKCE parameters when usePKCE is true', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
                usePKCE: true,
            });

            const { url, pkceVerifier } = await client.authorize(
                ['profile'],
                'http://localhost:3000',
            );

            expect(pkceVerifier).toBeDefined();
            expect(pkceVerifier!.length).toBe(64);

            const parsed = new URL(url);
            const qp = parsed.searchParams;
            expect(qp.get('code_challenge_method')).toBe('S256');
            expect(qp.get('code_challenge')).toBeTruthy();
            expect(qp.get('code_challenge')).toMatch(/^[A-Za-z0-9\-_]+$/);
        });

        it('includes PKCE by default for public clients (no clientSecret)', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'public-client',
            });

            const { url, pkceVerifier } = await client.authorize(
                ['profile'],
                'http://localhost:3000',
            );

            expect(pkceVerifier).toBeDefined();

            const parsed = new URL(url);
            const qp = parsed.searchParams;
            expect(qp.get('code_challenge_method')).toBe('S256');
            expect(qp.get('code_challenge')).toBeTruthy();
        });

        it('does not include PKCE for confidential clients when usePKCE is false', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
                usePKCE: false,
            });

            const { url, pkceVerifier } = await client.authorize(
                ['profile'],
                'http://localhost:3000',
            );

            expect(pkceVerifier).toBeUndefined();

            const parsed = new URL(url);
            const qp = parsed.searchParams;
            expect(qp.get('code_challenge_method')).toBeNull();
            expect(qp.get('code_challenge')).toBeNull();
        });

        it('uses plain PKCE method when specified', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                usePKCE: true,
                pkceMethod: 'plain',
            });

            const { url, pkceVerifier } = await client.authorize(
                ['profile'],
                'http://localhost:3000',
            );

            expect(pkceVerifier).toBeDefined();

            const parsed = new URL(url);
            const qp = parsed.searchParams;
            expect(qp.get('code_challenge_method')).toBe('plain');
            expect(qp.get('code_challenge')).toBe(pkceVerifier);
        });

        it('omits state parameter when not provided', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            const { url } = await client.authorize(['profile'], 'http://localhost:3000');

            const parsed = new URL(url);
            expect(parsed.searchParams.get('state')).toBeNull();
        });

        it('handles multiple scopes', async () => {
            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            const scopes: MatchDayOAuth2Scope[] = ['openid', 'profile', 'email', 'offline_access'];
            const { url } = await client.authorize(scopes, 'http://localhost:3000');

            const parsed = new URL(url);
            const scopeParam = parsed.searchParams.get('scope');
            expect(scopeParam).toBe('openid profile email offline_access');
        });
    });

    describe('exchange', () => {
        const originalFetch = global.fetch;

        beforeEach(() => {
            global.fetch = jest.fn();
        });

        afterEach(() => {
            global.fetch = originalFetch;
        });

        it('exchanges code for tokens successfully', async () => {
            const mockTokenResponse = {
                access_token: 'test-access-token',
                refresh_token: 'test-refresh-token',
                token_type: 'Bearer',
                expires_in: 3600,
                scope: 'profile email',
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockTokenResponse,
            });

            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            const result = await client.exchange('auth-code-123', 'http://localhost:3000/callback');

            expect(result).toEqual(mockTokenResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://auth.thewfa.org.uk/api/auth/oauth2/token',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                }),
            );

            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const body = new URLSearchParams(callArgs[1].body);
            expect(body.get('grant_type')).toBe('authorization_code');
            expect(body.get('code')).toBe('auth-code-123');
            expect(body.get('redirect_uri')).toBe('http://localhost:3000/callback');
            expect(body.get('client_id')).toBe('test-client');
            expect(body.get('client_secret')).toBe('test-secret');
        });

        it('includes PKCE verifier when provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    access_token: 'test-token',
                    token_type: 'Bearer',
                    expires_in: 3600,
                    scope: 'profile',
                }),
            });

            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
            });

            await client.exchange(
                'auth-code',
                'http://localhost:3000/callback',
                'pkce-verifier-string',
            );

            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const body = new URLSearchParams(callArgs[1].body);
            expect(body.get('code_verifier')).toBe('pkce-verifier-string');
        });

        it('throws error when token exchange fails', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                json: async () => ({
                    error: 'invalid_grant',
                    error_description: 'The authorization code has expired',
                }),
            });

            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            await expect(
                client.exchange('expired-code', 'http://localhost:3000/callback'),
            ).rejects.toThrow(MatchDayAPIError);

            await expect(
                client.exchange('expired-code', 'http://localhost:3000/callback'),
            ).rejects.toThrow('Token exchange failed');
        });

        it('throws error when response has no access_token', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    token_type: 'Bearer',
                    expires_in: 3600,
                }),
            });

            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            await expect(
                client.exchange('auth-code', 'http://localhost:3000/callback'),
            ).rejects.toThrow('no access_token was returned');
        });

        it('handles non-JSON error responses', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: async () => {
                    throw new Error('Invalid JSON');
                },
                text: async () => 'Internal Server Error',
            });

            const client = new MatchDayOAuthClient({
                clientId: 'test-client',
                clientSecret: 'test-secret',
            });

            await expect(
                client.exchange('auth-code', 'http://localhost:3000/callback'),
            ).rejects.toThrow('Token exchange failed: 500 Internal Server Error');
        });

        it('does not include clientSecret for public clients', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    access_token: 'test-token',
                    token_type: 'Bearer',
                    expires_in: 3600,
                    scope: 'profile',
                }),
            });

            const client = new MatchDayOAuthClient({
                clientId: 'public-client',
            });

            await client.exchange(
                'auth-code',
                'http://localhost:3000/callback',
                'pkce-verifier',
            );

            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const body = new URLSearchParams(callArgs[1].body);
            expect(body.get('client_secret')).toBeNull();
            expect(body.get('code_verifier')).toBe('pkce-verifier');
        });
    });
});
