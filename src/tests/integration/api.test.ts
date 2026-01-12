/**
 * Integration tests that run against the real API.
 * These tests are skipped if the required environment variables are not set.
 *
 * To run these tests locally, ensure the API is running and .env is configured.
 * To skip these tests locally, rename or remove your .env file.
 */

import { MatchDayClient } from '../../client';
import { MatchDayOAuthClient } from '../../oauth2';
import { MatchDayNotFoundError, MatchDayUnauthorizedError } from '../../types/errors';

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
            const response = await client.matches.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single match when matches exist', async () => {
            const response = await client.matches.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const match = await client.matches.get(response.items[0].id);
                expect(match).toHaveProperty('details');
                expect(match.details.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Teams', () => {
        it('lists teams', async () => {
            const seasons = await client.seasons.list({ itemsPerPage: 1 });
            const competitions = await client.competitions.list({ itemsPerPage: 1 });
            const response = await client.teams.list({
                itemsPerPage: 5,
                season: [seasons.items[0].id],
                competition: [competitions.items[0].id],
            });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single team when teams exist', async () => {
            const seasons = await client.seasons.list({ itemsPerPage: 1 });
            const competitions = await client.competitions.list({ itemsPerPage: 1 });
            const response = await client.teams.list({
                itemsPerPage: 1,
                season: [seasons.items[0].id],
                competition: [competitions.items[0].id],
            });

            if (response.items.length > 0) {
                const team = await client.teams.get(response.items[0].id);
                expect(team).toHaveProperty('id');
                expect(team.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Competitions', () => {
        it('lists competitions', async () => {
            const response = await client.competitions.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single competition when competitions exist', async () => {
            const response = await client.competitions.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const competition = await client.competitions.get(response.items[0].id);
                expect(competition).toHaveProperty('id');
                expect(competition.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Seasons', () => {
        it('lists seasons', async () => {
            const response = await client.seasons.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single season when seasons exist', async () => {
            const response = await client.seasons.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const season = await client.seasons.get(response.items[0].id);
                expect(season).toHaveProperty('id');
                expect(season.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Persons', () => {
        let personId: string | undefined;

        beforeAll(async () => {
            const response = await client.persons.list({
                query: 'Test',
                itemsPerPage: 1,
                type: [],
            });
            if (response.items.length > 0) {
                personId = response.items[0].id;
            }
        });

        it('lists persons', async () => {
            const response = await client.persons.list({ itemsPerPage: 5, type: [] });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single person when persons exist', async () => {
            if (personId) {
                const person = await client.persons.get(personId);
                expect(person).toHaveProperty('id');
                expect(person.id).toBe(personId);
            }
        });

        it('lists person registrations when persons exist', async () => {
            if (personId) {
                const registrations = await client.persons.registrations(personId, {
                    itemsPerPage: 5,
                });
                expect(Array.isArray(registrations.items)).toBe(true);
                expect(registrations.pagination).toHaveProperty('totalItems');
            }
        });

        it('lists person appearances when persons exist', async () => {
            if (personId) {
                const appearances = await client.persons.appearances(personId, {
                    itemsPerPage: 5,
                });
                expect(Array.isArray(appearances.items)).toBe(true);
                expect(appearances.pagination).toHaveProperty('totalItems');
            }
        });

        it('gets person stats summary when persons exist', async () => {
            if (personId) {
                const stats = await client.persons.stats.summary(personId, {});
                expect(stats).toHaveProperty('goals');
                expect(stats).toHaveProperty('assists');
                expect(stats).toHaveProperty('yellowCards');
                expect(stats).toHaveProperty('redCards');
                expect(stats).toHaveProperty('appearances');
                expect(stats).toHaveProperty('starts');
            }
        });

        it('lists person goals when persons exist', async () => {
            if (personId) {
                const goals = await client.persons.stats.goals(personId, {});
                expect(Array.isArray(goals.items)).toBe(true);
                expect(goals.pagination).toHaveProperty('totalItems');
            }
        });

        it('lists person assists when persons exist', async () => {
            if (personId) {
                const assists = await client.persons.stats.assists(personId, {});
                expect(Array.isArray(assists.items)).toBe(true);
                expect(assists.pagination).toHaveProperty('totalItems');
            }
        });

        it('lists person cards when persons exist', async () => {
            if (personId) {
                const cards = await client.persons.stats.cards(personId, {});
                expect(Array.isArray(cards.items)).toBe(true);
                expect(cards.pagination).toHaveProperty('totalItems');
            }
        });
    });

    describe('Search', () => {
        it('performs a search', async () => {
            const response = await client.search.list({ query: 'test', itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });
    });

    describe('Locations', () => {
        it('lists locations', async () => {
            const response = await client.locations.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single location when locations exist', async () => {
            const response = await client.locations.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const location = await client.locations.get(response.items[0].id);
                expect(location).toHaveProperty('id');
                expect(location.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Clubs', () => {
        it('lists clubs', async () => {
            const response = await client.clubs.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response.pagination).toHaveProperty('totalItems');
        });

        it('gets a single club when clubs exist', async () => {
            const response = await client.clubs.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const club = await client.clubs.get(response.items[0].id);
                expect(club).toHaveProperty('id');
                expect(club.id).toBe(response.items[0].id);
                expect(club).toHaveProperty('teams');
                expect(club).toHaveProperty('contactEmail');
            }
        });
    });

    describe('Date parsing', () => {
        it('parses dates in match responses', async () => {
            const response = await client.matches.list({ itemsPerPage: 1 });

            if (response.items.length > 0 && response.items[0].scheduledFor) {
                expect(response.items[0].scheduledFor).toBeInstanceOf(Date);
            }
        });
    });

    describe('Error handling', () => {
        it('throws MatchDayNotFoundError for non-existent resource', async () => {
            await expect(client.matches.get('100000')).rejects.toThrow(MatchDayNotFoundError);
        });

        it('throws MatchDayNotFoundError with correct status code', async () => {
            try {
                await client.teams.get('100000');
                fail('Expected MatchDayNotFoundError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MatchDayNotFoundError);
                expect((error as MatchDayNotFoundError).status).toBe(404);
            }
        });

        it('throws MatchDayUnauthorizedError for invalid API key', async () => {
            const invalidClient = new MatchDayClient({
                apiKey: 'invalid-api-key',
                baseURL: process.env.MATCHDAY_API_URL,
            });

            await expect(invalidClient.matches.list({ itemsPerPage: 1 })).rejects.toThrow(
                MatchDayUnauthorizedError,
            );
        });

        it('throws MatchDayUnauthorizedError with correct status code', async () => {
            const invalidClient = new MatchDayClient({
                apiKey: 'invalid-api-key',
                baseURL: process.env.MATCHDAY_API_URL,
            });

            try {
                await invalidClient.matches.list({ itemsPerPage: 1 });
                fail('Expected MatchDayUnauthorizedError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MatchDayUnauthorizedError);
                expect((error as MatchDayUnauthorizedError).status).toBe(401);
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
