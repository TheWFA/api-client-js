import { MatchDayClient } from '../../client';
import { TeamsResource } from '../../resources/teams';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

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

    describe('constructor', () => {
        it('creates resource with correct base path', () => {
            const resource = new TeamsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockTeams = [
                { id: '1', name: 'Team A' },
                { id: '2', name: 'Team B' },
            ];
            const mockResponse: ListResponse<(typeof mockTeams)[0]> = {
                items: mockTeams,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.teams.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockTeams);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 50 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.teams.list({ itemsPerPage: 50, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=50');
            expect(path).toContain('page=3');
        });

        it('returns empty items array when no teams found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.teams.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockTeam = {
                id: 'team-123',
                name: 'Test Team',
                venue: 'Test Stadium',
            };
            makeRequestSpy.mockResolvedValueOnce(mockTeam);

            const result = await client.teams.get('team-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/team-123', { method: 'GET' });
            expect(result).toEqual(mockTeam);
        });
    });

    describe('listPlayers', () => {
        it('calls makeRequest with correct path including team and season IDs', async () => {
            const mockPlayers = [
                { id: 'player-1', name: 'Player One', number: 10 },
                { id: 'player-2', name: 'Player Two', number: 7 },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockPlayers);

            const result = await client.teams.listPlayers('team-123', 'season-2024', {
                itemsPerPage: 25,
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/teams/team-123/season-2024/players?itemsPerPage=25',
                { method: 'GET' },
            );
            expect(result).toEqual(mockPlayers);
        });

        it('handles pagination for players list', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.teams.listPlayers('team-123', 'season-2024', {
                itemsPerPage: 10,
                page: 3,
            });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('team-123');
            expect(path).toContain('season-2024');
            expect(path).toContain('players');
            expect(path).toContain('itemsPerPage=10');
            expect(path).toContain('page=3');
        });
    });

    describe('listStaff', () => {
        it('calls makeRequest with correct path including team and season IDs', async () => {
            const mockStaff = [
                { id: 'staff-1', name: 'Coach One', role: 'Head Coach' },
                { id: 'staff-2', name: 'Coach Two', role: 'Assistant Coach' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockStaff);

            const result = await client.teams.listStaff('team-123', 'season-2024', {
                itemsPerPage: 10,
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/teams/team-123/season-2024/staff?itemsPerPage=10',
                { method: 'GET' },
            );
            expect(result).toEqual(mockStaff);
        });

        it('handles pagination for staff list', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.teams.listStaff('team-123', 'season-2024', {
                itemsPerPage: 5,
                page: 2,
            });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('team-123');
            expect(path).toContain('season-2024');
            expect(path).toContain('staff');
            expect(path).toContain('itemsPerPage=5');
            expect(path).toContain('page=2');
        });
    });
});
