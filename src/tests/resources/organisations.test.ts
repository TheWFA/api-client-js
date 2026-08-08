import { MatchDayClient } from '../../client';
import { OrganisationsResource } from '../../resources/organisations';
import { ListResponse } from '../../types/list-response';

describe('OrganisationsResource', () => {
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
        expect(new OrganisationsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 1, name: 'WFA' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.organisations.list({ itemsPerPage: 20 });

            expect(makeRequestSpy).toHaveBeenCalledWith('/organisations?itemsPerPage=20', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockOrganisation = { id: 1, name: 'WFA', competitions: [] };
            makeRequestSpy.mockResolvedValueOnce(mockOrganisation);

            const result = await client.organisations.get(1);

            expect(makeRequestSpy).toHaveBeenCalledWith('/organisations/1', { method: 'GET' });
            expect(result).toEqual(mockOrganisation);
        });
    });
});
