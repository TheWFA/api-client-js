import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayAccreditation,
    MatchDayAccreditationFacets,
    MatchDayAccreditationListQuery,
    MatchDayFullAccreditation,
} from '../types/accreditations';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class AccreditationsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/accreditations');
    }

    /**
     * Retrieves a paginated list of accreditations.
     *
     * @example
     * const response = await client.accreditations.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayAccreditationListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayAccreditation>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the categories and issuing bodies currently in use.
     */
    async facets() {
        return this.client.makeRequest<MatchDayAccreditationFacets>(this.basePath + '/facets', {
            method: 'GET',
        });
    }

    /**
     * Retrieves detailed information about a specific accreditation.
     *
     * @throws {MatchDayAPIError} If the request fails, the accreditation is not found, or the server responds with an error.
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDayFullAccreditation>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
