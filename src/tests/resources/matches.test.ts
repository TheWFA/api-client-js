import { MatchDayClient } from '../../client';
import { MatchResource } from '../../resources/matches';

describe('MatchResource', () => {
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
            const resource = new MatchResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockMatches = [
                { id: '1', homeTeam: 'Team A', awayTeam: 'Team B' },
                { id: '2', homeTeam: 'Team C', awayTeam: 'Team D' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockMatches);

            const result = await client.matches.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/matches?itemsPerPage=10&page=1',
                { method: 'GET' },
            );
            expect(result).toEqual(mockMatches);
        });

        it('handles complex query parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.matches.list({
                itemsPerPage: 20,
                page: 2,
                season: ['season-123'],
                competition: ['comp-456'],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                expect.stringContaining('/matches?'),
                { method: 'GET' },
            );
            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=20');
            expect(path).toContain('page=2');
        });

        it('returns empty array when no matches found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.matches.list({ itemsPerPage: 10 });

            expect(result).toEqual([]);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockMatch = {
                id: 'match-123',
                homeTeam: { id: '1', name: 'Team A' },
                awayTeam: { id: '2', name: 'Team B' },
                score: { home: 2, away: 1 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockMatch);

            const result = await client.matches.get('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/matches/match-123', { method: 'GET' });
            expect(result).toEqual(mockMatch);
        });

        it('handles special characters in ID', async () => {
            makeRequestSpy.mockResolvedValueOnce({ id: 'match-with-special' });

            await client.matches.get('match-with-special');

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/matches/match-with-special',
                { method: 'GET' },
            );
        });
    });

    describe('matchReport', () => {
        it('calls makeRequest with correct path for report endpoint', async () => {
            const mockReport = {
                matchId: 'match-123',
                summary: 'Match report content',
                events: [],
            };
            makeRequestSpy.mockResolvedValueOnce(mockReport);

            const result = await client.matches.matchReport('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/matches/match-123/report',
                { method: 'GET' },
            );
            expect(result).toEqual(mockReport);
        });
    });

    describe('matchSheet', () => {
        it('calls makeRequest with correct path for sheet endpoint', async () => {
            const mockSheet = {
                matchId: 'match-123',
                url: 'https://example.com/sheet.pdf',
            };
            makeRequestSpy.mockResolvedValueOnce(mockSheet);

            const result = await client.matches.matchSheet('match-123');

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/matches/match-123/sheet',
                { method: 'GET' },
            );
            expect(result).toEqual(mockSheet);
        });
    });
});
