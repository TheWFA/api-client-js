import { MatchDayClient } from '../../client';
import { PersonsResource } from '../../resources/persons';
import { ListResponse } from '../../types/list-response';

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

    it('creates resource with correct base path', () => {
        expect(new PersonsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: 'Jane Doe' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.persons.list({ itemsPerPage: 20 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons?itemsPerPage=20', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockPerson = { id: 1, name: 'Jane Doe', isPlayer: true };
            makeRequestSpy.mockResolvedValueOnce(mockPerson);

            const result = await client.persons.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1', { method: 'GET' });
            expect(result).toEqual(mockPerson);
        });
    });

    describe('registrations', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.registrations(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/registrations?seasonId=2025', {
                method: 'GET',
            });
        });
    });

    describe('appearances', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.appearances(1, { competitionId: 7 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/appearances?competitionId=7', {
                method: 'GET',
            });
        });
    });

    describe('suspensions', () => {
        it('calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.suspensions(1, { activeOnly: 'true' });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/suspensions?activeOnly=true', {
                method: 'GET',
            });
        });
    });

    describe('stats', () => {
        it('summary calls makeRequest with correct path', async () => {
            const mockSummary = { goals: 5, assists: 2 };
            makeRequestSpy.mockResolvedValueOnce(mockSummary);

            const result = await client.persons.stats.summary(1, { seasonId: 2025 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/stats/summary?seasonId=2025', {
                method: 'GET',
            });
            expect(result).toEqual(mockSummary);
        });

        it('goals calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.stats.goals(1, {});

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/stats/goals?', {
                method: 'GET',
            });
        });

        it('assists calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.stats.assists(1, {});

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/stats/assists?', {
                method: 'GET',
            });
        });

        it('cards calls makeRequest with correct path', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 10,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            await client.persons.stats.cards(1, { card: 'yellow' });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons/1/stats/cards?card=yellow', {
                method: 'GET',
            });
        });
    });
});
