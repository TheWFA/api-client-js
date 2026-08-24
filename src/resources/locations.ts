import { stringifyQuery } from '../utils/query';
import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayLocation, MatchDayLocationWithCourts } from '../types/locations';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class LocationsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/locations');
    }

    /**
     * Retrieves a paginated list of locations.
     *
     * @example
     * const response = await client.locations.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayBaseListQuery = {}) {
        const queryString = stringifyQuery(query);

        return this.client.makeRequest<ListResponse<MatchDayLocation>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single location and its associated courts by ID.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayLocationWithCourts>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
