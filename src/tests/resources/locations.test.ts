import { MatchDayClient } from '../../client';
import { LocationsResource } from '../../resources/locations';
import { ListResponse } from '../../types/list-response';

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

    it('creates resource with correct base path', () => {
        expect(new LocationsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: 'Sports Hall' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.locations.list({ itemsPerPage: 20 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/locations?itemsPerPage=20', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockLocation = { id: 1, name: 'Sports Hall', courts: [] };
            makeRequestSpy.mockResolvedValueOnce(mockLocation);

            const result = await client.locations.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/locations/1', { method: 'GET' });
            expect(result).toEqual(mockLocation);
        });
    });
});
