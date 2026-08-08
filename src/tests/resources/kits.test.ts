import { MatchDayClient } from '../../client';
import { KitsResource } from '../../resources/kits';
import { UnpaginatedListResponse } from '../../types/list-response';

describe('KitsResource', () => {
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
        expect(new KitsResource(client)).toBeDefined();
    });

    describe('types', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = {
                items: [{ id: 'home', label: 'Home' }],
                totalItems: 1,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.kits.types();

            expect(makeRequestSpy).toHaveBeenCalledWith('/kit-types', { method: 'GET' });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('forTeam', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.kits.forTeam(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/teams/1/kits', { method: 'GET' });
            expect(result).toEqual(mockResponse);
        });
    });
});
