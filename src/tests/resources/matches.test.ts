import { MatchDayClient } from '../../client';
import { MatchResource } from '../../resources/matches';
import { ListResponse } from '../../types/list-response';
import { MatchDayMatch, MatchDayMatchStatus } from '../../types/match';

describe('MatchResource', () => {
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

    describe('constructor', () => {
        it('creates resource with correct base path', () => {
            const resource = new MatchResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<Partial<MatchDayMatch>> = {
                items: [{ id: 1 }, { id: 2 }],
                totalItems: 2,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.matches.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockResponse.items);
            expect(result.totalItems).toBe(2);
        });

        it('handles complex query parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 2,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.matches.list({
                itemsPerPage: 20,
                page: 2,
                id: [1, 2],
                seasonId: [123],
                competitionId: [456],
                status: [MatchDayMatchStatus.Scheduled],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(expect.stringContaining('/matches?'), {
                method: 'GET',
            });
            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=20');
            expect(path).toContain('page=2');
            expect(path).toContain('id%5B0%5D=1');
            expect(path).toContain('seasonId%5B0%5D=123');
        });

        it('returns empty items array when no matches found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.matches.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.totalItems).toBe(0);
        });

        it('defaults to an empty query when none is given', async () => {
            makeRequestSpy.mockResolvedValueOnce({
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            });

            await client.matches.list();

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches?', { method: 'GET' });
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockMatch = {
                id: 123,
                homeTeam: { id: 1, name: 'Team A' },
                awayTeam: { id: 2, name: 'Team B' },
            };
            makeRequestSpy.mockResolvedValueOnce(mockMatch);

            const result = await client.matches.get(123);

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/123', { method: 'GET' });
            expect(result).toEqual(mockMatch);
        });
    });
});
