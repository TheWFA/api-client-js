import { MatchDayClient } from '../../client';
import { SeasonsResource } from '../../resources/seasons';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

describe('SeasonsResource', () => {
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
            const resource = new SeasonsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockSeasons = [
                { id: 'season-2024', name: '2024/25 Season' },
                { id: 'season-2023', name: '2023/24 Season' },
            ];
            const mockResponse: ListResponse<(typeof mockSeasons)[0]> = {
                items: mockSeasons,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.seasons.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockSeasons);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 5 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.seasons.list({ itemsPerPage: 5, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=5');
            expect(path).toContain('page=3');
        });

        it('returns empty items array when no seasons found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.seasons.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockSeason = {
                id: 'season-2024',
                name: '2024/25 Season',
                startDate: '2024-08-01',
                endDate: '2025-05-31',
            };
            makeRequestSpy.mockResolvedValueOnce(mockSeason);

            const result = await client.seasons.get('season-2024');

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons/season-2024', { method: 'GET' });
            expect(result).toEqual(mockSeason);
        });

        it('returns season details with dates', async () => {
            const mockSeason = {
                id: 'season-2024',
                name: '2024/25 Season',
                startDate: '2024-08-01',
                endDate: '2025-05-31',
                isActive: true,
            };
            makeRequestSpy.mockResolvedValueOnce(mockSeason);

            const result = await client.seasons.get('season-2024');

            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('startDate');
        });
    });
});
