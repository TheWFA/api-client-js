import { MatchDayClient } from '../../client';
import { PersonsResource } from '../../resources/persons';

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
            makeRequestSpy.mockResolvedValueOnce(mockPersons);

            const result = await client.persons.list({ itemsPerPage: 10, page: 1, type: [] });

            expect(makeRequestSpy).toHaveBeenCalledWith('/persons?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result).toEqual(mockPersons);
        });

        it('handles search query parameter', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.persons.list({ itemsPerPage: 10, query: 'John', type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=John');
        });

        it('handles pagination parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.persons.list({ itemsPerPage: 25, page: 3, type: [] });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('returns empty array when no persons found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.persons.list({ itemsPerPage: 10, type: [] });

            expect(result).toEqual([]);
        });
    });
});
