import { MatchDayClient } from '../../client';
import { TeamsResource } from '../../resources/teams';
import { ListResponse, UnpaginatedListResponse } from '../../types/list-response';

describe('TeamsResource', () => {
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
        expect(new TeamsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: 'Team A' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.teams.list({ itemsPerPage: 20, clubId: 5 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams?itemsPerPage=20&clubId=5', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockTeam = { id: 1, name: 'Team A' };
            makeRequestSpy.mockResolvedValueOnce(mockTeam);

            const result = await client.teams.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1', { method: 'GET' });
            expect(result).toEqual(mockTeam);
        });
    });

    describe('players', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.teams.players(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/players?seasonId=2025', {
                method: 'GET',
            });
        });
    });

    describe('staff', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.teams.staff(1, {});

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/staff?', { method: 'GET' });
        });
    });

    describe('registrations', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.teams.registrations(1, { competitionId: 7 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/registrations?competitionId=7', {
                method: 'GET',
            });
        });
    });

    describe('seasons', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.teams.seasons(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/seasons', { method: 'GET' });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('stats', () => {
        it('summary calls makeRequest with correct path', async () => {
            const mockSummary = { played: 10, wins: 5 };
            makeRequestSpy.mockResolvedValueOnce(mockSummary);

            const result = await client.teams.stats.summary(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/stats/summary?seasonId=2025', {
                method: 'GET',
            });
            expect(result).toEqual(mockSummary);
        });

        it('players calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.teams.stats.players(1, { orderBy: 'goals' });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/stats/players?orderBy=goals', {
                method: 'GET',
            });
        });
    });
});
