/**
 * Integration tests that run against the real API.
 * These tests are skipped unless both API_KEY and MATCHDAY_API_URL are set.
 *
 * To run these tests locally, ensure the API is running and .env is configured.
 * To skip these tests locally, rename or remove your .env file.
 */

import { APIClientConfig, MatchDayClient } from '../../client';
import { MatchDayHistoryEntity } from '../../types/common';
import { MatchDayForbiddenError, MatchDayNotFoundError } from '../../types/errors';

// Increase timeout for integration tests (30 seconds)
jest.setTimeout(30000);

const hasApiCredentials = !!process.env.API_KEY;

const describeWithApi = hasApiCredentials ? describe : describe.skip;

let client: MatchDayClient;

beforeAll(() => {
    if (hasApiCredentials) {
        const conf: APIClientConfig = { apiKey: process.env.API_KEY! };

        if (process.env.MATCHDAY_API_URL) {
            conf['baseURL'] = process.env.MATCHDAY_API_URL;
        }

        client = new MatchDayClient(conf);
    }
});

describeWithApi('API Integration Tests', () => {
    describe('Health', () => {
        it('fetches health status', async () => {
            const health = await client.health();
            expect(health).toHaveProperty('status');
            expect(health).toHaveProperty('scope');
        });
    });

    describe('Matches', () => {
        it('lists matches', async () => {
            const response = await client.matches.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });

        it('gets a single match when matches exist', async () => {
            const response = await client.matches.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const match = await client.matches.get(response.items[0].id);
                expect(match.id).toBe(response.items[0].id);
                expect(match).toHaveProperty('homeLineups');
                expect(match).toHaveProperty('events');
            }
        });
    });

    describe('Teams', () => {
        it('lists teams', async () => {
            const response = await client.teams.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });

        it('gets a single team when teams exist', async () => {
            const response = await client.teams.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const team = await client.teams.get(response.items[0].id);
                expect(team).toHaveProperty('id');
                expect(team.id).toBe(response.items[0].id);
            }
        });
    });

    describe('Clubs', () => {
        it('lists clubs', async () => {
            const response = await client.clubs.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
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

    describe('Competitions', () => {
        it('lists competitions', async () => {
            const response = await client.competitions.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
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

    describe('Organisations', () => {
        it('lists organisations', async () => {
            const response = await client.organisations.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });

        it('gets a single organisation when organisations exist', async () => {
            const response = await client.organisations.list({ itemsPerPage: 1 });

            if (response.items.length > 0) {
                const organisation = await client.organisations.get(response.items[0].id);
                expect(organisation).toHaveProperty('id');
                expect(organisation).toHaveProperty('competitions');
            }
        });
    });

    describe('Seasons', () => {
        it('lists seasons', async () => {
            const response = await client.seasons.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
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

    describe('Accreditations', () => {
        it('lists accreditations', async () => {
            const response = await client.accreditations.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });

        it('fetches facets', async () => {
            const facets = await client.accreditations.facets();

            expect(facets).toHaveProperty('categories');
            expect(facets).toHaveProperty('issuingBodies');
        });
    });

    describe('Persons', () => {
        let personId: number | undefined;

        beforeAll(async () => {
            const response = await client.persons.list({ query: 'Test', itemsPerPage: 1 });
            if (response.items.length > 0) {
                personId = response.items[0].id;
            }
        });

        it('lists persons', async () => {
            const response = await client.persons.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
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
                expect(registrations).toHaveProperty('totalItems');
            }
        });

        it('lists person appearances when persons exist', async () => {
            if (personId) {
                const appearances = await client.persons.appearances(personId, {
                    itemsPerPage: 5,
                });
                expect(Array.isArray(appearances.items)).toBe(true);
                expect(appearances).toHaveProperty('totalItems');
            }
        });

        it('lists person suspensions when persons exist', async () => {
            if (personId) {
                const suspensions = await client.persons.suspensions(personId, {
                    itemsPerPage: 5,
                });
                expect(Array.isArray(suspensions.items)).toBe(true);
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
                expect(goals).toHaveProperty('totalItems');
            }
        });

        it('lists person assists when persons exist', async () => {
            if (personId) {
                const assists = await client.persons.stats.assists(personId, {});
                expect(Array.isArray(assists.items)).toBe(true);
                expect(assists).toHaveProperty('totalItems');
            }
        });

        it('lists person cards when persons exist', async () => {
            if (personId) {
                const cards = await client.persons.stats.cards(personId, {});
                expect(Array.isArray(cards.items)).toBe(true);
                expect(cards).toHaveProperty('totalItems');
            }
        });
    });

    describe('Search', () => {
        it('performs a search', async () => {
            const response = await client.search.list({ query: 'test', itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });
    });

    describe('Locations', () => {
        it('lists locations', async () => {
            const response = await client.locations.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
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

    describe('Suspensions', () => {
        it('lists suspensions', async () => {
            const response = await client.suspensions.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });
    });

    describe('Ties', () => {
        it('lists ties', async () => {
            const response = await client.ties.list({ itemsPerPage: 5 });

            expect(Array.isArray(response.items)).toBe(true);
            expect(response).toHaveProperty('totalItems');
        });
    });

    describe('Kits', () => {
        it('lists kit types', async () => {
            const response = await client.kits.types();

            expect(Array.isArray(response.items)).toBe(true);
        });
    });

    describe('History', () => {
        it('lists history for a team when teams exist', async () => {
            const teams = await client.teams.list({ itemsPerPage: 1 });

            if (teams.items.length > 0) {
                const history = await client.history.list(
                    MatchDayHistoryEntity.Team,
                    teams.items[0].id,
                );
                expect(Array.isArray(history.items)).toBe(true);
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
            await expect(client.matches.get(100000000)).rejects.toThrow(MatchDayNotFoundError);
        });

        it('throws MatchDayNotFoundError with correct status code', async () => {
            try {
                await client.teams.get(100000000);
                fail('Expected MatchDayNotFoundError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MatchDayNotFoundError);
                expect((error as MatchDayNotFoundError).status).toBe(404);
            }
        });

        // Rejected by API Gateway's usage plan before the request reaches the API,
        // so this surfaces as a 403 rather than an application-level 401.
        it('throws MatchDayForbiddenError for invalid API key', async () => {
            const invalidClient = new MatchDayClient({
                apiKey: 'invalid-api-key',
                baseURL: process.env.MATCHDAY_API_URL,
            });

            await expect(invalidClient.matches.list({ itemsPerPage: 1 })).rejects.toThrow(
                MatchDayForbiddenError,
            );
        });

        it('throws MatchDayForbiddenError with correct status code', async () => {
            const invalidClient = new MatchDayClient({
                apiKey: 'invalid-api-key',
                baseURL: process.env.MATCHDAY_API_URL,
            });

            try {
                await invalidClient.matches.list({ itemsPerPage: 1 });
                fail('Expected MatchDayForbiddenError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(MatchDayForbiddenError);
                expect((error as MatchDayForbiddenError).status).toBe(403);
            }
        });
    });
});

// Log skip message if tests are skipped
if (!hasApiCredentials) {
    console.log('Skipping API integration tests: API_KEY and/or MATCHDAY_API_URL not set');
}
