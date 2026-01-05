import { MatchDayClient } from '../../client';
import { LocationsResource } from '../../resources/locations';
import { ListResponse, PaginationMeta } from '../../types/list-response';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

describe('LocationsResource', () => {
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
            const resource = new LocationsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockLocations = [
                {
                    id: 'loc-1',
                    name: 'Sports Center A',
                    courts: [{ id: 'court-1', name: 'Court 1' }],
                },
                {
                    id: 'loc-2',
                    name: 'Sports Center B',
                    courts: [{ id: 'court-2', name: 'Court 1' }],
                },
            ];
            const mockResponse: ListResponse<(typeof mockLocations)[0]> = {
                items: mockLocations,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.locations.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/locations?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockLocations);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 25 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.locations.list({ itemsPerPage: 25, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns locations with courts', async () => {
            const mockLocations = [
                {
                    id: 'loc-1',
                    name: 'Sports Center',
                    address: '123 Main St',
                    courts: [
                        { id: 'court-1', name: 'Main Court' },
                        { id: 'court-2', name: 'Training Court' },
                    ],
                },
            ];
            const mockResponse: ListResponse<(typeof mockLocations)[0]> = {
                items: mockLocations,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.locations.list({ itemsPerPage: 10 });

            expect(result.items[0].courts).toHaveLength(2);
            expect(result.items[0].courts[0]).toHaveProperty('name');
        });

        it('returns empty items array when no locations found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.locations.list({ itemsPerPage: 10 });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockLocation = {
                id: 'loc-123',
                name: 'Sports Center',
                address: '123 Main Street',
                city: 'London',
                courts: [
                    { id: 'court-1', name: 'Court 1' },
                    { id: 'court-2', name: 'Court 2' },
                ],
            };
            makeRequestSpy.mockResolvedValueOnce(mockLocation);

            const result = await client.locations.get('loc-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/locations/loc-123', { method: 'GET' });
            expect(result).toEqual(mockLocation);
        });

        it('returns location with full details and courts', async () => {
            const mockLocation = {
                id: 'loc-123',
                name: 'Main Sports Center',
                address: '123 Main Street',
                city: 'London',
                postcode: 'SW1A 1AA',
                country: 'GB',
                coordinates: { lat: 51.5074, lng: -0.1278 },
                courts: [
                    {
                        id: 'court-1',
                        name: 'Main Court',
                        surface: 'indoor',
                        capacity: 500,
                    },
                ],
            };
            makeRequestSpy.mockResolvedValueOnce(mockLocation);

            const result = await client.locations.get('loc-123');

            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('address');
            expect(result).toHaveProperty('courts');
            expect(result.courts).toHaveLength(1);
        });
    });
});
