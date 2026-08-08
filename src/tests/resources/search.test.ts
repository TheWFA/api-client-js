import { MatchDayClient } from '../../client';
import { SearchResource } from '../../resources/search';
import { ListResponse } from '../../types/list-response';
import { MatchDaySearchItem, MatchDaySearchItemType } from '../../types/search';

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

    it('creates resource with correct base path', () => {
        expect(new SearchResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<Partial<MatchDaySearchItem>> = {
                items: [{ type: MatchDaySearchItemType.Team, id: '1', label: 'United' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.search.list({ query: 'United', itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/search?query=United&itemsPerPage=10', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });
});
