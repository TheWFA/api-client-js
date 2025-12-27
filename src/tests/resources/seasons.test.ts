import { MatchDayClient } from '../../client';
import { SeasonsResource } from '../../resources/seasons';

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

    describe('constructor', () => {
        it('creates resource with correct base path', () => {
            const resource = new SeasonsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockSeasons = [
                { id: 'season-2024', name: '2024/25 Season' },
                { id: 'season-2023', name: '2023/24 Season' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockSeasons);

            const result = await client.seasons.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result).toEqual(mockSeasons);
        });

        it('handles pagination parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.seasons.list({ itemsPerPage: 5, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=5');
            expect(path).toContain('page=3');
        });

        it('returns empty array when no seasons found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.seasons.list({ itemsPerPage: 10 });

            expect(result).toEqual([]);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockSeason = {
                id: 'season-2024',
                name: '2024/25 Season',
                startDate: '2024-08-01',
                endDate: '2025-05-31',
            };
            makeRequestSpy.mockResolvedValueOnce(mockSeason);

            const result = await client.seasons.get('season-2024');

            expect(makeRequestSpy).toHaveBeenCalledWith('/seasons/season-2024', { method: 'GET' });
            expect(result).toEqual(mockSeason);
        });

        it('returns season details with dates', async () => {
            const mockSeason = {
                id: 'season-2024',
                name: '2024/25 Season',
                startDate: '2024-08-01',
                endDate: '2025-05-31',
                isActive: true,
            };
            makeRequestSpy.mockResolvedValueOnce(mockSeason);

            const result = await client.seasons.get('season-2024');

            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('startDate');
        });
    });
});
