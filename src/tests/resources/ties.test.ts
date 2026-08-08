import { MatchDayClient } from '../../client';
import { TiesResource } from '../../resources/ties';
import { ListResponse } from '../../types/list-response';

describe('TiesResource', () => {
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
        expect(new TiesResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, legs: [] }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.ties.list({ competitionId: 3 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/ties?competitionId=3', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockTie = { id: 1, legs: [] };
            makeRequestSpy.mockResolvedValueOnce(mockTie);

            const result = await client.ties.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/ties/1', { method: 'GET' });
            expect(result).toEqual(mockTie);
        });
    });
});
