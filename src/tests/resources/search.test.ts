import { MatchDayClient } from '../../client';
import { SearchResource } from '../../resources/search';

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
            makeRequestSpy.mockResolvedValueOnce(mockResults);

            const result = await client.search.list({ query: 'United', itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                expect.stringContaining('/search?'),
                { method: 'GET' },
            );
            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=United');
            expect(path).toContain('itemsPerPage=10');
            expect(result).toEqual(mockResults);
        });

        it('handles empty search query', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.search.list({ itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/search?itemsPerPage=10', { method: 'GET' });
        });

        it('handles pagination parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

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
            makeRequestSpy.mockResolvedValueOnce(mockResults);

            const result = await client.search.list({ query: 'Arsenal' });

            expect(result.length).toBe(3);
            expect(result.map((r) => r.type)).toContain('team');
            expect(result.map((r) => r.type)).toContain('competition');
            expect(result.map((r) => r.type)).toContain('person');
        });

        it('returns empty array when no results found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.search.list({ query: 'nonexistent' });

            expect(result).toEqual([]);
        });
    });
});
