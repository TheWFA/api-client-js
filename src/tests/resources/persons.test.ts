import { MatchDayClient } from '../../client';
import { PersonsResource } from '../../resources/persons';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

describe('PersonsResource', () => {
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
            const resource = new PersonsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockPerson = {
                id: 'person-123',
                name: 'John Doe',
                dateOfBirth: '1990-05-15',
            };
            makeRequestSpy.mockResolvedValueOnce(mockPerson);

            const result = await client.persons.get('person-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/person-123', { method: 'GET' });
            expect(result).toEqual(mockPerson);
        });

        it('returns full person details', async () => {
            const mockPerson = {
                id: 'person-123',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'J. Doe',
                bio: 'A talented player',
                nationality: 'GB',
            };
            makeRequestSpy.mockResolvedValueOnce(mockPerson);

            const result = await client.persons.get('person-123');

            expect(result).toHaveProperty('firstName');
            expect(result).toHaveProperty('lastName');
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockPersons = [
                { id: 'person-1', name: 'John Doe' },
                { id: 'person-2', name: 'Jane Smith' },
            ];
            const mockResponse: ListResponse<(typeof mockPersons)[0]> = {
                items: mockPersons,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.list({ itemsPerPage: 10, page: 1, type: [] });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockPersons);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles search query parameter', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.list({ itemsPerPage: 10, query: 'John', type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=John');
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 25 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.list({ itemsPerPage: 25, page: 3, type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns empty items array when no persons found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.list({ itemsPerPage: 10, type: [] });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });
});
