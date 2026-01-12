import { MatchDayClient } from '../../client';
import { CompetitionsResource } from '../../resources/competitions';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

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

    describe('constructor', () => {
        it('creates resource with correct base path', () => {
            const resource = new CompetitionsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockCompetitions = [
                { id: '1', name: 'Premier League' },
                { id: '2', name: 'Championship' },
            ];
            const mockResponse: ListResponse<(typeof mockCompetitions)[0]> = {
                items: mockCompetitions,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockCompetitions);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 25 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.competitions.list({ itemsPerPage: 25, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns empty items array when no competitions found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockCompetition = {
                id: 'comp-123',
                name: 'WFA Championship',
                description: 'Top tier competition',
            };
            makeRequestSpy.mockResolvedValueOnce(mockCompetition);

            const result = await client.competitions.get('comp-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/comp-123', {
                method: 'GET',
            });
            expect(result).toEqual(mockCompetition);
        });
    });

    describe('players', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockPlayers = [
                { id: 'player-1', name: 'Player A' },
                { id: 'player-2', name: 'Player B' },
            ];
            const mockResponse: ListResponse<(typeof mockPlayers)[0]> = {
                items: mockPlayers,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.players('comp-123', {
                season: ['2025'],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/comp-123/stats/players?season%5B0%5D=2025',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockPlayers);
            expect(result.pagination).toEqual(mockPagination);
        });
    });

    describe('teams', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockTeams = [
                { id: 'team-1', name: 'Team A' },
                { id: 'team-2', name: 'Team B' },
            ];
            const mockResponse: ListResponse<(typeof mockTeams)[0]> = {
                items: mockTeams,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.competitions.teams('comp-123', { season: ['2025'] });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/comp-123/stats/teams?season%5B0%5D=2025',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockTeams);
            expect(result.pagination).toEqual(mockPagination);
        });
    });
});
