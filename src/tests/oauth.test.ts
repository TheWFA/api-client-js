import { MatchDayOAuth2Scope } from '../types/oauth2';

import { getTestOAuthClient } from './client';

test('creates a valid authorization url', async () => {
    const client = getTestOAuthClient();

    const state = crypto.randomUUID();
    const redirectUri = 'http://localhost:3000';
    const scopes: MatchDayOAuth2Scope[] = ['email'];

    const { url } = await client.authorize(scopes, redirectUri, state);

    expect(() => new URL(url)).not.toThrow();
    const parsed = new URL(url);

    // 2) Basic structure checks
    expect(parsed.protocol).toMatch(/^https?:$/);
    expect(parsed.hostname.length).toBeGreaterThan(0);

    // Optional but nice: common OAuth path convention
    // (keep loose to avoid coupling to exact path)
    expect(parsed.pathname).toMatch(/authorize/i);

    // 3) Required query parameters
    const qp = parsed.searchParams;

    // Typical OAuth2 params
    expect(qp.get('response_type')).toBe('code'); // Authorization Code flow
    expect(qp.get('client_id')).toBeTruthy(); // must exist
    expect(qp.get('redirect_uri')).toBe(redirectUri); // must echo input
    expect(qp.get('state')).toBe(state); // must echo input

    // Scope should include our requested scope
    const scope = qp.get('scope') ?? '';
    const scopeItems = scope.split(/[+\s]/).filter(Boolean);
    expect(scopeItems).toContain('email');

    // 4) PKCE (if your client uses it). Make these tolerant:
    const codeChallengeMethod = qp.get('code_challenge_method');
    const codeChallenge = qp.get('code_challenge');
    if (codeChallengeMethod || codeChallenge) {
        expect(codeChallengeMethod).toBe('S256');
        expect(codeChallenge).toBeTruthy();
        // a loose sanity check for base64url-ish content
        expect(codeChallenge).toMatch(/^[A-Za-z0-9\-_~.]+$/);
    }
});
