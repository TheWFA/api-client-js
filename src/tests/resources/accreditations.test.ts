import { MatchDayClient } from '../../client';
import { AccreditationsResource } from '../../resources/accreditations';
import { ListResponse } from '../../types/list-response';

describe('AccreditationsResource', () => {
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
        expect(new AccreditationsResource(client)).toBeDefined();
    });

    describe('list', () => {
        it('calls makeRequest with correct path and query string', async () => {
            const mockResponse: ListResponse<unknown> = {
                items: [{ id: 'acc-1', name: 'Coaching Level 1' }],
                totalItems: 1,
                page: 1,
                itemsPerPage: 20,
            };
            makeRequestSpy.mockResolvedValueOnce(mockResponse);

            const result = await client.accreditations.list({ category: 'coaching' });

            expect(makeRequestSpy).toHaveBeenCalledWith('/accreditations?category=coaching', {
                method: 'GET',
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('facets', () => {
        it('calls makeRequest with correct path', async () => {
            const mockFacets = { categories: ['coaching'], issuingBodies: ['WFA'] };
            makeRequestSpy.mockResolvedValueOnce(mockFacets);

            const result = await client.accreditations.facets();

            expect(makeRequestSpy).toHaveBeenCalledWith('/accreditations/facets', {
                method: 'GET',
            });
            expect(result).toEqual(mockFacets);
        });
    });

    describe('get', () => {
        it('calls makeRequest with correct path', async () => {
            const mockAccreditation = { id: 'acc-1', name: 'Coaching Level 1', holderCount: 12 };
            makeRequestSpy.mockResolvedValueOnce(mockAccreditation);

            const result = await client.accreditations.get('acc-1');

            expect(makeRequestSpy).toHaveBeenCalledWith('/accreditations/acc-1', {
                method: 'GET',
            });
            expect(result).toEqual(mockAccreditation);
        });
    });
});
