import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayLocationWithCourts } from '../types';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class LocationsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/locations');
    }

    /**
     * Retrieves a paginated list of locations with their associated courts.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayLocationWithCourts} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing locations and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.locations.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayLocationWithCourts>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single location and its associated courts by ID.
     *
     * Sends a GET request to fetch detailed information about a specific
     * {@link MatchDayLocationWithCourts} object from the API.
     *
     * @async
     * @function
     * @param  id - The unique identifier of the location to retrieve.
     * @returns  A promise that resolves to the requested location with its courts.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDayLocationWithCourts>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
