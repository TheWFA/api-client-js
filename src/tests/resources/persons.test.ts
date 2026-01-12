import { MatchDayClient } from '../../client';
import { PersonsResource } from '../../resources/persons';
import { ListResponse, PaginationMeta } from '../../types/list-response';
import {
    MatchDayPersonAppearance,
    MatchDayPersonRegistration,
    MatchDayPersonRegistrationType,
    MatchDayPersonStatsAssist,
    MatchDayPersonStatsCard,
    MatchDayPersonStatsGoal,
    MatchDayPersonStatsSummary,
} from '../../types/person';
import { MatchDayPlayerPostition } from '../../types/match';
import { MatchDayCompetitionType } from '../../types/competitions';

const mockPagination: PaginationMeta = {
    totalItems: 100,
    totalPages: 10,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
};

describe('PersonsResource', () => {
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
            const resource = new PersonsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockPerson = {
                id: 'person-123',
                name: 'John Doe',
                dateOfBirth: '1990-05-15',
            };
            makeRequestSpy.mockResolvedValueOnce(mockPerson);

            const result = await client.persons.get('person-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/person-123', { method: 'GET' });
            expect(result).toEqual(mockPerson);
        });

        it('returns full person details', async () => {
            const mockPerson = {
                id: 'person-123',
                firstName: 'John',
                lastName: 'Doe',
                displayName: 'J. Doe',
                bio: 'A talented player',
                nationality: 'GB',
            };
            makeRequestSpy.mockResolvedValueOnce(mockPerson);

            const result = await client.persons.get('person-123');

            expect(result).toHaveProperty('firstName');
            expect(result).toHaveProperty('lastName');
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockPersons = [
                { id: 'person-1', name: 'John Doe' },
                { id: 'person-2', name: 'Jane Smith' },
            ];
            const mockResponse: ListResponse<(typeof mockPersons)[0]> = {
                items: mockPersons,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.list({ itemsPerPage: 10, page: 1, type: [] });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result.items).toEqual(mockPersons);
            expect(result.pagination).toEqual(mockPagination);
        });

        it('handles search query parameter', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.list({ itemsPerPage: 10, query: 'John', type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=John');
        });

        it('handles pagination parameters', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, currentPage: 3, itemsPerPage: 25 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.list({ itemsPerPage: 25, page: 3, type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns empty items array when no persons found', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                pagination: { ...mockPagination, totalItems: 0, totalPages: 0 },
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.list({ itemsPerPage: 10, type: [] });

            expect(result.items).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    describe('registrations', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockRegistrations: MatchDayPersonRegistration[] = [
                {
                    type: MatchDayPersonRegistrationType.Player,
                    registeredAt: new Date(),
                    deregisteredAt: null,
                    deregisteredReason: null,
                    number: 10,
                    team: {
                        id: 'team-1',
                        name: 'Team A',
                        logo: 'logo-url',
                        nickname: 'TA',
                        abbreviated: 'TA',
                    },
                    competition: {
                        id: 'comp-1',
                        name: 'Competition A',
                        type: MatchDayCompetitionType.League,
                        logo: 'logo-url',
                        group: { id: '1', name: 'A', shortName: 'A', logo: 'logo-url' },
                        activeSeason: {
                            id: 'season-1',
                            name: 'Season 1',
                            startDate: new Date(),
                            finishDate: new Date(),
                        },
                    },
                    season: {
                        id: 'season-1',
                        name: 'Season 1',
                        startDate: new Date(),
                        finishDate: new Date(),
                    },
                },
            ];
            const mockResponse: ListResponse<MatchDayPersonRegistration> = {
                items: mockRegistrations,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.registrations('person-123', { itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/registrations/?itemsPerPage=10',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockRegistrations);
            expect(result.pagination).toEqual(mockPagination);
        });
    });

    describe('appearances', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockAppearances: MatchDayPersonAppearance[] = [
                {
                    squadPosition: MatchDayPlayerPostition.Centre,
                    captain: false,
                    match: {
                        id: 'match-1',
                        awayTeam: {
                            id: 'team-2',
                            name: 'Team B',
                            logo: 'logo-url',
                            nickname: 'TB',
                            abbreviated: 'TB',
                        },
                        homeTeam: {
                            id: 'team-1',
                            name: 'Team A',
                            logo: 'logo-url',
                            nickname: 'TA',
                            abbreviated: 'TA',
                        },
                        scheduledFor: new Date(),
                    },
                    competition: {
                        id: 'comp-1',
                        name: 'Competition A',
                        type: MatchDayCompetitionType.League,
                        logo: 'logo-url',
                        group: { id: '1', name: 'A', shortName: 'A', logo: 'logo-url' },
                        activeSeason: {
                            id: 'season-1',
                            name: 'Season 1',
                            startDate: new Date(),
                            finishDate: new Date(),
                        },
                    },
                    season: {
                        id: 'season-1',
                        name: 'Season 1',
                        startDate: new Date(),
                        finishDate: new Date(),
                    },
                    team: {
                        id: 'team-1',
                        name: 'Team A',
                        logo: 'logo-url',
                        nickname: 'TA',
                        abbreviated: 'TA',
                    },
                    matchGroup: { id: 'group-1', groupName: 'Group A' },
                },
            ];
            const mockResponse: ListResponse<MatchDayPersonAppearance> = {
                items: mockAppearances,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.appearances('person-123', { itemsPerPage: 10 });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/appearances/?itemsPerPage=10',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockAppearances);
            expect(result.pagination).toEqual(mockPagination);
        });
    });
});

describe('PersonsStatsResource', () => {
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

    describe('summary', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockSummary: MatchDayPersonStatsSummary = {
                goals: 10,
                assists: 5,
                yellowCards: 2,
                redCards: 0,
                appearances: 20,
                starts: 15,
            };
            makeRequestSpy.mockResolvedValueOnce(mockSummary);

            const result = await client.persons.stats.summary('person-123', {
                season: ['season-1'],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/stats/summary?season%5B0%5D=season-1',
                {
                    method: 'GET',
                },
            );
            expect(result).toEqual(mockSummary);
        });
    });

    describe('goals', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockGoals: MatchDayPersonStatsGoal[] = [
                {
                    id: 'goal-1',
                    matchTime: 30,
                    matchPeriod: 1,
                    goalType: 'goal',
                    isPenalty: false,
                    createdAt: new Date(),
                    match: {
                        id: 'match-1',
                        awayTeam: {
                            id: 'team-2',
                            name: 'Team B',
                            logo: 'logo-url',
                            nickname: 'TB',
                            abbreviated: 'TB',
                        },
                        homeTeam: {
                            id: 'team-1',
                            name: 'Team A',
                            logo: 'logo-url',
                            nickname: 'TA',
                            abbreviated: 'TA',
                        },
                        scheduledFor: new Date(),
                    },
                    competition: {
                        id: 'comp-1',
                        name: 'Competition A',
                        type: MatchDayCompetitionType.League,
                        logo: 'logo-url',
                        group: { id: '1', name: 'A', shortName: 'A', logo: 'logo-url' },
                        activeSeason: {
                            id: 'season-1',
                            name: 'Season 1',
                            startDate: new Date(),
                            finishDate: new Date(),
                        },
                    },
                    season: {
                        id: 'season-1',
                        name: 'Season 1',
                        startDate: new Date(),
                        finishDate: new Date(),
                    },
                    team: {
                        id: 'team-1',
                        name: 'Team A',
                        logo: 'logo-url',
                        nickname: 'TA',
                        abbreviated: 'TA',
                    },
                    assister: {
                        id: 'person-456',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        knownAs: 'Jane',
                    },
                },
            ];
            const mockResponse: ListResponse<MatchDayPersonStatsGoal> = {
                items: mockGoals,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.stats.goals('person-123', { season: ['season-1'] });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/stats/goals?season%5B0%5D=season-1',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockGoals);
        });
    });

    describe('assists', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockAssists: MatchDayPersonStatsAssist[] = [
                {
                    id: 'assist-1',
                    matchTime: 45,
                    matchPeriod: 1,
                    goalType: 'goal',
                    isPenalty: false,
                    createdAt: new Date(),
                    match: {
                        id: 'match-1',
                        awayTeam: {
                            id: 'team-2',
                            name: 'Team B',
                            logo: 'logo-url',
                            nickname: 'TB',
                            abbreviated: 'TB',
                        },
                        homeTeam: {
                            id: 'team-1',
                            name: 'Team A',
                            logo: 'logo-url',
                            nickname: 'TA',
                            abbreviated: 'TA',
                        },
                        scheduledFor: new Date(),
                    },
                    competition: {
                        id: 'comp-1',
                        name: 'Competition A',
                        type: MatchDayCompetitionType.League,
                        logo: 'logo-url',
                        group: { id: '1', name: 'A', shortName: 'A', logo: 'logo-url' },
                        activeSeason: {
                            id: 'season-1',
                            name: 'Season 1',
                            startDate: new Date(),
                            finishDate: new Date(),
                        },
                    },
                    season: {
                        id: 'season-1',
                        name: 'Season 1',
                        startDate: new Date(),
                        finishDate: new Date(),
                    },
                    team: {
                        id: 'team-1',
                        name: 'Team A',
                        logo: 'logo-url',
                        nickname: 'TA',
                        abbreviated: 'TA',
                    },
                    scorer: {
                        id: 'person-789',
                        firstName: 'John',
                        lastName: 'Smith',
                        knownAs: 'John',
                    },
                },
            ];
            const mockResponse: ListResponse<MatchDayPersonStatsAssist> = {
                items: mockAssists,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.stats.assists('person-123', {
                season: ['season-1'],
            });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/stats/assists?season%5B0%5D=season-1',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockAssists);
        });
    });

    describe('cards', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockCards: MatchDayPersonStatsCard[] = [
                {
                    id: 'card-1',
                    matchTime: 60,
                    matchPeriod: 2,
                    card: 'yellow',
                    createdAt: new Date(),
                    offence: {
                        id: 'offence-1',
                        code: 'YC-1',
                        name: 'Unsporting behaviour',
                        description: '...',
                        suspensionLength: 0,
                    },
                    match: {
                        id: 'match-1',
                        awayTeam: {
                            id: 'team-2',
                            name: 'Team B',
                            logo: 'logo-url',
                            nickname: 'TB',
                            abbreviated: 'TB',
                        },
                        homeTeam: {
                            id: 'team-1',
                            name: 'Team A',
                            logo: 'logo-url',
                            nickname: 'TA',
                            abbreviated: 'TA',
                        },
                        scheduledFor: new Date(),
                    },
                    competition: {
                        id: 'comp-1',
                        name: 'Competition A',
                        type: MatchDayCompetitionType.League,
                        logo: 'logo-url',
                        group: { id: '1', name: 'A', shortName: 'A', logo: 'logo-url' },
                        activeSeason: {
                            id: 'season-1',
                            name: 'Season 1',
                            startDate: new Date(),
                            finishDate: new Date(),
                        },
                    },
                    season: {
                        id: 'season-1',
                        name: 'Season 1',
                        startDate: new Date(),
                        finishDate: new Date(),
                    },
                    team: {
                        id: 'team-1',
                        name: 'Team A',
                        logo: 'logo-url',
                        nickname: 'TA',
                        abbreviated: 'TA',
                    },
                },
            ];
            const mockResponse: ListResponse<MatchDayPersonStatsCard> = {
                items: mockCards,
                pagination: mockPagination,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.stats.cards('person-123', { season: ['season-1'] });

            expect(makeRequestSpy).toHaveBeenCalledWith(
                '/persons/person-123/stats/cards?season%5B0%5D=season-1',
                {
                    method: 'GET',
                },
            );
            expect(result.items).toEqual(mockCards);
        });
    });
});
