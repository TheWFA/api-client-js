import { MatchDayClient } from '../../client';
import { SearchResource } from '../../resources/search';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

describe('SearchResource', () => {
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
            const resource = new SearchResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResults = [
                { type: 'team', id: 'team-1', name: 'United FC' },
                { type: 'person', id: 'person-1', name: 'John United' },
            ];
            const mockResponse: ListResponse<(typeof mockResults)[0]> = {
                items: mockResults,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.search.list({ query: 'United', itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith(expect.stringContaining('/search?'), {
                method: 'GET',
            });
            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=United');
            expect(path).toContain('itemsPerPage=10');
            expect(result.items).toEqual(mockResults);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles empty search query', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.search.list({ itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/search?itemsPerPage=10', {
                method: 'GET',
            });
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 20 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.search.list({ query: 'test', itemsPerPage: 20, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=20');
            expect(path).toContain('page=3');
        });

        it('returns mixed resource types in results', async () => {
            const mockResults = [
                { type: 'team', id: 'team-1', name: 'Arsenal FC' },
                { type: 'competition', id: 'comp-1', name: 'Arsenal Cup' },
                { type: 'person', id: 'person-1', name: 'Arsenal Player' },
            ];
            const mockResponse: ListResponse<(typeof mockResults)[0]> = {
                items: mockResults,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.search.list({ query: 'Arsenal' });

            expect(result.items.length).toBe(3);
            expect(result.items.map((r) => r.type)).toContain('team');
            expect(result.items.map((r) => r.type)).toContain('competition');
            expect(result.items.map((r) => r.type)).toContain('person');
        });

        it('returns empty items array when no results found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.search.list({ query: 'nonexistent' });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });
});
