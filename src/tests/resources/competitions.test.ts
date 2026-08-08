import { MatchDayClient } from '../../client';
import { CompetitionsResource } from '../../resources/competitions';
import { ListResponse, UnpaginatedListResponse } from '../../types/list-response';

describe('CompetitionsResource', () => {
    const originalFetch = global.fetch;
    let client: MatchDayClient;
    let makeRequestSpy: jest.SpyInstance;

    beforeEach(() => {
        global.fetch = jest.fn();
        client = new MatchDayClient({ apiKey: 'test-key' });
        makeRequestSpy = jest.spyOn(client, 'makeRequest');
    });

    afterEach(() => {
        global.fetch = originalFetch;
        makeRequestSpy.mockRestore();
    });

    it('creates resource with correct base path', () => {
        expect(new CompetitionsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: 'Premier League' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.list({ itemsPerPage: 20 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions?itemsPerPage=20', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockCompetition = { id: 1, name: 'Premier League', matchGroups: [] };
            makeRequestSpy.mockResolvedValueOnce(mockCompetition);

            const result = await client.competitions.get(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/1?seasonId=2025', {
                method: 'GET',
            });
            expect(result).toEqual(mockCompetition);
        });
    });

    describe('teams', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.competitions.teams(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/1/teams?seasonId=2025', {
                method: 'GET',
            });
        });
    });

    describe('seasons', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.seasons(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/1/seasons', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('table', () => {
        it('calls makeRequest with correct path', async () => {
            const mockTable = { season: { id: 1 }, items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockTable);

            const result = await client.competitions.table(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/1/table?seasonId=2025', {
                method: 'GET',
            });
            expect(result).toEqual(mockTable);
        });
    });

    describe('matchGroupTeams', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.competitions.matchGroupTeams(1, 2);

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/1/match-groups/2/teams', {
                method: 'GET',
            });
        });
    });

    describe('stats', () => {
        it('summary calls makeRequest with correct path', async () => {
            const mockSummary = { matches: 10, teams: 4 };
            makeRequestSpy.mockResolvedValueOnce(mockSummary);

            const result = await client.competitions.stats.summary(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/1/stats/summary?seasonId=2025',
                { method: 'GET' },
            );
            expect(result).toEqual(mockSummary);
        });

        it('teams calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.competitions.stats.teams(1, { orderBy: 'points' });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/1/stats/teams?orderBy=points',
                { method: 'GET' },
            );
        });

        it('players calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.competitions.stats.players(1, { orderBy: 'goals' });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/1/stats/players?orderBy=goals',
                { method: 'GET' },
            );
        });
    });
});
