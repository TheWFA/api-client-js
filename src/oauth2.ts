import { MatchDayAPIError } from './types/errors';
import { MatchDayOAuth2ScopeId } from './types/oauth2';

export type MatchDayOAuthClientConfig = {
    clientId: string;
    clientSecret?: string;
    authURL?: string;
    usePKCE?: boolean;
    pkceMethod?: 'S256' | 'plain';
};

export type MatchDayAccessTokenReturn = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
};

export type AuthorizeReturn = {
    url: string;
    pkceVerifier?: string;
};

const defaultConfig: Partial<MatchDayOAuthClientConfig> = {
    authURL: 'https://auth.thewfa.org.uk',
    pkceMethod: 'S256',
};

export class MatchDayOAuthClient {
    private config: MatchDayOAuthClientConfig;

    constructor(config: MatchDayOAuthClientConfig) {
        this.config = { ...defaultConfig, ...config };
    }

    /**
     * Builds an OAuth2 authorization URL (Authorization Code flow).
     * If this is a public client (no clientSecret) or `usePKCE` is true, PKCE params
     * (`code_challenge`, `code_challenge_method`) are included automatically.
     *
     * @param scopes - OAuth2 scopes to request (space-delimited in the URL).
     * @param redirectURL - Redirect URI registered with the provider.
     * @param state - Optional opaque string for CSRF protection and request correlation.
     * @returns Fully constructed authorization URL.
     */
    async authorize(
        scopes: MatchDayOAuth2ScopeId[],
        redirectURL: string,
        state?: string,
    ): Promise<AuthorizeReturn> {
        const base = new URL('/api/auth/oauth2/authorize', this.config.authURL!);

        base.searchParams.set('response_type', 'code');
        base.searchParams.set('client_id', this.config.clientId);
        base.searchParams.set('scope', scopes.join(' '));
        base.searchParams.set('redirect_uri', redirectURL);
        if (state) base.searchParams.set('state', state);

        const mustUsePkce = !this.config.clientSecret;
        const shouldUsePkce = mustUsePkce || !!this.config.usePKCE;

        let pkceVerifier = undefined;

        if (shouldUsePkce) {
            const method = this.config.pkceMethod ?? 'S256';
            pkceVerifier = generateCodeVerifier();
            const challenge =
                method === 'S256' ? await toCodeChallengeS256(pkceVerifier) : pkceVerifier;

            base.searchParams.set('code_challenge', challenge);
            base.searchParams.set('code_challenge_method', method);
        }

        return { url: base.toString(), pkceVerifier };
    }

    /**
     * Exchanges the authorization code for tokens at the token endpoint.
     * Sends x-www-form-urlencoded per RFC 6749. If PKCE was used, includes `code_verifier`.
     *
     * @param code - Authorization code returned to your redirect URI.
     * @param redirectURL - The same redirect URI you used in authorize().
     */
    async exchange(
        code: string,
        redirectURL: string,
        pkceVerifier?: string,
    ): Promise<MatchDayAccessTokenReturn> {
        if (!this.config.clientId) {
            throw new MatchDayAPIError('A client id is required to exchange code');
        }

        const body = new URLSearchParams();
        body.set('grant_type', 'authorization_code');
        body.set('code', code);
        body.set('redirect_uri', redirectURL);
        body.set('client_id', this.config.clientId);

        if (this.config.clientSecret) {
            body.set('client_secret', this.config.clientSecret);
        }

        if (pkceVerifier) {
            body.set('code_verifier', pkceVerifier);
        }

        const res = await fetch(`${this.config.authURL}/api/auth/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            body: body.toString(),
        });

        if (!res.ok) {
            let detail = '';
            try {
                const e = await res.json();
                detail = e.error_description || e.error || JSON.stringify(e);
            } catch {
                detail = await res.text();
            }
            throw new MatchDayAPIError(
                `Token exchange failed: ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ''}`,
            );
        }

        const json = (await res.json()) as MatchDayAccessTokenReturn;

        if (!json?.access_token) {
            throw new MatchDayAPIError('Token exchange succeeded but no access_token was returned');
        }

        return json;
    }
}

function generateCodeVerifier(length = 64): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

async function toCodeChallengeS256(verifier: string): Promise<string> {
    const enc = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary); // Browser-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
