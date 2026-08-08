import { MatchDayClient } from '../../client';
import { HistoryResource } from '../../resources/history';
import { MatchDayHistoryEntity } from '../../types/common';
import { UnpaginatedListResponse } from '../../types/list-response';

describe('HistoryResource', () => {
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
        expect(new HistoryResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: UnpaginatedListResponse<unknown> = { items: [], totalItems: 0 };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.history.list(MatchDayHistoryEntity.Team, 1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/history/team/1', { method: 'GET' });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockEntry = { id: 5, entity: 'team', entityId: 1 };
            makeRequestSpy.mockResolvedValueOnce(mockEntry);

            const result = await client.history.get(MatchDayHistoryEntity.Team, 1, 5);

            expect(makeRequestSpy).toHaveBeenCalledWith('/history/team/1/5', { method: 'GET' });
            expect(result).toEqual(mockEntry);
        });
    });
});
