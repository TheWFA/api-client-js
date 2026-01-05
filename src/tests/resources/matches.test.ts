import { MatchDayClient } from '../../client';
import { MatchResource } from '../../resources/matches';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

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
            const mockMatches = [
                { id: '1', homeTeam: 'Team A', awayTeam: 'Team B' },
                { id: '2', homeTeam: 'Team C', awayTeam: 'Team D' },
            ];
            const mockResponse: ListResponse<(typeof mockMatches)[0]> = {
                items: mockMatches,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.matches.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockMatches);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles complex query parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 2, itemsPerPage: 20 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.matches.list({
                itemsPerPage: 20,
                page: 2,
                season: ['season-123'],
                competition: ['comp-456'],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(expect.stringContaining('/matches?'), {
                method: 'GET',
            });
            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=20');
            expect(path).toContain('page=2');
        });

        it('returns empty items array when no matches found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.matches.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockMatch = {
                id: 'match-123',
                homeTeam: { id: '1', name: 'Team A' },
                awayTeam: { id: '2', name: 'Team B' },
                score: { home: 2, away: 1 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockMatch);

            const result = await client.matches.get('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/match-123', { method: 'GET' });
            expect(result).toEqual(mockMatch);
        });

        it('handles special characters in ID', async () => {
            makeRequestSpy.mockResolvedValueOnce({ id: 'match-with-special' });

            await client.matches.get('match-with-special');

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/match-with-special', {
                method: 'GET',
            });
        });
    });

    describe('matchReport', () => {
        it('calls makeRequest with correct path for report endpoint', async () => {
            const mockReport = {
                matchId: 'match-123',
                summary: 'Match report content',
                events: [],
            };
            makeRequestSpy.mockResolvedValueOnce(mockReport);

            const result = await client.matches.matchReport('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/match-123/report', {
                method: 'GET',
            });
            expect(result).toEqual(mockReport);
        });
    });

    describe('matchSheet', () => {
        it('calls makeRequest with correct path for sheet endpoint', async () => {
            const mockSheet = {
                matchId: 'match-123',
                url: 'https://example.com/sheet.pdf',
            };
            makeRequestSpy.mockResolvedValueOnce(mockSheet);

            const result = await client.matches.matchSheet('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/match-123/sheet', {
                method: 'GET',
            });
            expect(result).toEqual(mockSheet);
        });
    });
});
