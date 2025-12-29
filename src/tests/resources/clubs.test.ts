import { MatchDayClient } from '../../client';
import { ClubsResource } from '../../resources/clubs';

describe('ClubsResource', () => {
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
            const resource = new ClubsResource(client);
            expect(resource).toBeDefined();
        });
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockClubs = [
                { id: 'club-1', name: 'Club A', logo: 'https://example.com/logo1.png' },
                { id: 'club-2', name: 'Club B' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockClubs);

            const result = await client.clubs.list({ itemsPerPage: 10, page: 1 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/clubs?itemsPerPage=10&page=1', {
                method: 'GET',
            });
            expect(result).toEqual(mockClubs);
        });

        it('handles pagination parameters', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.clubs.list({ itemsPerPage: 25, page: 3 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('itemsPerPage=25');
            expect(path).toContain('page=3');
        });

        it('handles query search parameter', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            await client.clubs.list({ query: 'United', itemsPerPage: 10 });

            const path = makeRequestSpy.mock.calls[0][0] as string;
            expect(path).toContain('query=United');
        });

        it('returns empty array when no clubs found', async () => {
            makeRequestSpy.mockResolvedValueOnce([]);

            const result = await client.clubs.list({ itemsPerPage: 10 });

            expect(result).toEqual([]);
        });

        it('returns clubs with optional logo field', async () => {
            const mockClubs = [
                { id: 'club-1', name: 'Club With Logo', logo: 'https://example.com/logo.png' },
                { id: 'club-2', name: 'Club Without Logo' },
            ];
            makeRequestSpy.mockResolvedValueOnce(mockClubs);

            const result = await client.clubs.list({ itemsPerPage: 10 });

            expect(result[0]).toHaveProperty('logo');
            expect(result[1].logo).toBeUndefined();
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockClub = {
                id: 'club-123',
                name: 'Test Club',
                logo: 'https://example.com/logo.png',
                contact_email: 'contact@testclub.com',
                teams: [
                    { id: 'team-1', name: 'First Team' },
                    { id: 'team-2', name: 'Reserve Team' },
                ],
            };
            makeRequestSpy.mockResolvedValueOnce(mockClub);

            const result = await client.clubs.get('club-123');

            expect(makeRequestSpy).toHaveBeenCalledWith('/clubs/club-123', { method: 'GET' });
            expect(result).toEqual(mockClub);
        });

        it('returns club with teams array', async () => {
            const mockClub = {
                id: 'club-123',
                name: 'Test Club',
                contact_email: 'contact@testclub.com',
                teams: [
                    { id: 'team-1', name: 'Senior Team' },
                    { id: 'team-2', name: 'Junior Team' },
                    { id: 'team-3', name: 'Development Team' },
                ],
            };
            makeRequestSpy.mockResolvedValueOnce(mockClub);

            const result = await client.clubs.get('club-123');

            expect(result).toHaveProperty('teams');
            expect(result.teams).toHaveLength(3);
            expect(result.teams[0]).toHaveProperty('id');
            expect(result.teams[0]).toHaveProperty('name');
        });

        it('returns club with contact email', async () => {
            const mockClub = {
                id: 'club-123',
                name: 'Test Club',
                contact_email: 'info@club.org',
                teams: [],
            };
            makeRequestSpy.mockResolvedValueOnce(mockClub);

            const result = await client.clubs.get('club-123');

            expect(result).toHaveProperty('contact_email');
            expect(result.contact_email).toBe('info@club.org');
        });

        it('returns club with empty teams array', async () => {
            const mockClub = {
                id: 'club-456',
                name: 'New Club',
                contact_email: 'new@club.com',
                teams: [],
            };
            makeRequestSpy.mockResolvedValueOnce(mockClub);

            const result = await client.clubs.get('club-456');

            expect(result.teams).toEqual([]);
        });
    });
});
