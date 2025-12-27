import { MatchDayClient } from '../../client';
import { CompetitionsResource } from '../../resources/competitions';

describe('CompetitionsResource', () => {
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
            const resource = new CompetitionsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockCompetitions = [
                { id: '1', name: 'Premier League' },
                { id: '2', name: 'Championship' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockCompetitions);

            const result = await client.competitions.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result).toEqual(mockCompetitions);
        });

        it('handles pagination parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.competitions.list({ itemsPerPage: 25, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns empty array when no competitions found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.competitions.list({ itemsPerPage: 10 });

            expect(result).toEqual([]);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockCompetition = {
                id: 'comp-123',
                name: 'WFA Championship',
                description: 'Top tier competition',
            };
            makeRequestSpy.mockResolvedValueOnce(mockCompetition);

            const result = await client.competitions.get('comp-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/competitions/comp-123', {
                method: 'GET',
            });
            expect(result).toEqual(mockCompetition);
        });
    });

    describe('listTeams', () => {
        it('calls makeRequest with correct path including competition and season IDs', async () => {
            const mockTeams = [
                { id: 'team-1', name: 'Team A' },
                { id: 'team-2', name: 'Team B' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockTeams);

            const result = await client.competitions.listTeams('comp-123', 'season-2024', {
                itemsPerPage: 20,
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/comp-123/season-2024/teams?itemsPerPage=20',
                { method: 'GET' },
            );
            expect(result).toEqual(mockTeams);
        });

        it('handles pagination for teams list', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.competitions.listTeams('comp-123', 'season-2024', {
                itemsPerPage: 10,
                page: 4,
            });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('comp-123');
            expect(path).toContain('season-2024');
            expect(path).toContain('teams');
            expect(path).toContain('itemsPerPage=10');
            expect(path).toContain('page=4');
        });
    });

    describe('table', () => {
        it('calls makeRequest with correct path for table endpoint', async () => {
            const mockTable = [
                { position: 1, team: 'Team A', points: 30, played: 10 },
                { position: 2, team: 'Team B', points: 27, played: 10 },
                { position: 3, team: 'Team C', points: 24, played: 10 },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockTable);

            const result = await client.competitions.table('comp-123', 'season-2024');

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/competitions/comp-123/season-2024/table',
                { method: 'GET' },
            );
            expect(result).toEqual(mockTable);
        });

        it('returns correct standings data structure', async () => {
            const mockTable = [
                {
                    position: 1,
                    team: { id: 'team-1', name: 'Team A' },
                    played: 10,
                    won: 8,
                    drawn: 1,
                    lost: 1,
                    goalsFor: 25,
                    goalsAgainst: 8,
                    goalDifference: 17,
                    points: 25,
                },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockTable);

            const result = await client.competitions.table('comp-123', 'season-2024');

            expect(result[0]).toHaveProperty('position');
            expect(result[0]).toHaveProperty('team');
            expect(result[0]).toHaveProperty('points');
        });
    });
});
