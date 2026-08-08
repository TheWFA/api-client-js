import { MatchDayClient } from '../../client';
import { SuspensionsResource } from '../../resources/suspensions';
import { ListResponse } from '../../types/list-response';

describe('SuspensionsResource', () => {
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
        expect(new SuspensionsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, status: 'active' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.suspensions.list({ personId: 42, activeOnly: 'true' });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/suspensions?personId=42&activeOnly=true',
                { method: 'GET' },
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockSuspension = { id: 1, status: 'active' };
            makeRequestSpy.mockResolvedValueOnce(mockSuspension);

            const result = await client.suspensions.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/suspensions/1', { method: 'GET' });
            expect(result).toEqual(mockSuspension);
        });
    });
});
