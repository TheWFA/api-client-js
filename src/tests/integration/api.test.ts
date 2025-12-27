/**
 * Integration tests that run against the real API.
 * These tests are skipped if the required environment variables are not set.
 *
 * To run these tests locally, ensure the API is running and .env is configured.
 * To skip these tests locally, rename or remove your .env file.
 */

import { MatchDayClient } from '../../client';
import { MatchDayOAuthClient } from '../../oauth2';

// Increase timeout for integration tests (30 seconds)
jest.setTimeout(30000);

const hasApiCredentials = !!process.env.API_KEY;
const hasOAuthCredentials = !!process.env.CLIENT_ID;

const describeWithApi = hasApiCredentials ? describe : describe.skip;
const describeWithOAuth = hasOAuthCredentials ? describe : describe.skip;

let client: MatchDayClient;
let oauthClient: MatchDayOAuthClient;

beforeAll(() => {
    if (hasApiCredentials) {
        client = new MatchDayClient({
            apiKey: process.env.API_KEY,
            baseURL: process.env.MATCHDAY_API_URL,
        });
    }

    if (hasOAuthCredentials) {
        oauthClient = new MatchDayOAuthClient({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET,
            authURL: process.env.MATCHDAY_AUTH_URL,
        });
    }
});

describeWithApi('API Integration Tests', () => {
    describe('Matches', () => {
        it('lists matches', async () => {
            const matches = await client.matches.list({ itemsPerPage: 5 });

            expect(Array.isArray(matches)).toBe(true);
        });

        it('gets a single match when matches exist', async () => {
            const matches = await client.matches.list({ itemsPerPage: 1 });

            if (matches.length > 0) {
                const match = await client.matches.get(matches[0].id);
                expect(match).toHaveProperty('details');
                expect(match.details.id).toBe(matches[0].id);
            }
        });
    });

    describe('Teams', () => {
        it('lists teams', async () => {
            const teams = await client.teams.list({ itemsPerPage: 5 });

            expect(Array.isArray(teams)).toBe(true);
        });

        it('gets a single team when teams exist', async () => {
            const teams = await client.teams.list({ itemsPerPage: 1 });

            if (teams.length > 0) {
                const team = await client.teams.get(teams[0].id);
                expect(team).toHaveProperty('id');
                expect(team.id).toBe(teams[0].id);
            }
        });
    });

    describe('Competitions', () => {
        it('lists competitions', async () => {
            const competitions = await client.competitions.list({ itemsPerPage: 5 });

            expect(Array.isArray(competitions)).toBe(true);
        });

        it('gets a single competition when competitions exist', async () => {
            const competitions = await client.competitions.list({ itemsPerPage: 1 });

            if (competitions.length > 0) {
                const competition = await client.competitions.get(competitions[0].id);
                expect(competition).toHaveProperty('id');
                expect(competition.id).toBe(competitions[0].id);
            }
        });
    });

    describe('Seasons', () => {
        it('lists seasons', async () => {
            const seasons = await client.seasons.list({ itemsPerPage: 5 });

            expect(Array.isArray(seasons)).toBe(true);
        });

        it('gets a single season when seasons exist', async () => {
            const seasons = await client.seasons.list({ itemsPerPage: 1 });

            if (seasons.length > 0) {
                const season = await client.seasons.get(seasons[0].id);
                expect(season).toHaveProperty('id');
                expect(season.id).toBe(seasons[0].id);
            }
        });
    });

    describe('Persons', () => {
        it('lists persons', async () => {
            const persons = await client.persons.list({ itemsPerPage: 5, type: [] });

            expect(Array.isArray(persons)).toBe(true);
        });

        it('gets a single person when persons exist', async () => {
            const persons = await client.persons.list({ itemsPerPage: 1, type: [] });

            if (persons.length > 0) {
                const person = await client.persons.get(persons[0].id);
                expect(person).toHaveProperty('id');
                expect(person.id).toBe(persons[0].id);
            }
        });
    });

    describe('Search', () => {
        it('performs a search', async () => {
            const results = await client.search.list({ query: 'test', itemsPerPage: 5 });

            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('Locations', () => {
        it('lists locations', async () => {
            const locations = await client.locations.list({ itemsPerPage: 5 });

            expect(Array.isArray(locations)).toBe(true);
        });

        it('gets a single location when locations exist', async () => {
            const locations = await client.locations.list({ itemsPerPage: 1 });

            if (locations.length > 0) {
                const location = await client.locations.get(locations[0].id);
                expect(location).toHaveProperty('id');
                expect(location.id).toBe(locations[0].id);
            }
        });
    });

    describe('Date parsing', () => {
        it('parses dates in match responses', async () => {
            const matches = await client.matches.list({ itemsPerPage: 1 });

            if (matches.length > 0 && matches[0].scheduledFor) {
                expect(matches[0].scheduledFor).toBeInstanceOf(Date);
            }
        });
    });
});

describeWithOAuth('OAuth Integration Tests', () => {
    describe('Authorization URL', () => {
        it('generates a valid authorization URL', async () => {
            const { url, pkceVerifier } = await oauthClient.authorize(
                ['profile'],
                'http://localhost:3000/callback',
                'test-state',
            );

            expect(url).toContain('authorize');
            expect(url).toContain('client_id=' + process.env.CLIENT_ID);
            expect(url).toContain('state=test-state');

            // If no client secret, PKCE should be used
            if (!process.env.CLIENT_SECRET) {
                expect(pkceVerifier).toBeDefined();
                expect(url).toContain('code_challenge');
            }
        });
    });
});

// Log skip message if tests are skipped
if (!hasApiCredentials) {
    console.log('Skipping API integration tests: API_KEY not set');
}

if (!hasOAuthCredentials) {
    console.log('Skipping OAuth integration tests: CLIENT_ID not set');
}
