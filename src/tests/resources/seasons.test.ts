import { MatchDayClient } from '../../client';
import { SeasonsResource } from '../../resources/seasons';
import { ListResponse } from '../../types/list-response';

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

    it('creates resource with correct base path', () => {
        expect(new SeasonsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: '2025/26' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.seasons.list({ itemsPerPage: 20 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons?itemsPerPage=20', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockSeason = { id: 1, name: '2025/26', active: true };
            makeRequestSpy.mockResolvedValueOnce(mockSeason);

            const result = await client.seasons.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons/1', { method: 'GET' });
            expect(result).toEqual(mockSeason);
        });
    });
});
