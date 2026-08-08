import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayFullOrganisation, MatchDayOrganisation } from '../types/organisations';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class OrganisationsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/organisations');
    }

    /**
     * Retrieves a paginated list of organisations.
     *
     * @example
     * const response = await client.organisations.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayBaseListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayOrganisation>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific organisation, including its competitions.
     *
     * @throws {MatchDayAPIError} If the request fails, the organisation is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullOrganisation>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
