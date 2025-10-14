import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayLocationWithCourts } from '../types';

import { APIResource } from './resource';

export class LocationsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/locations');
    }

    /**
     * Retrieves a paginated list of locations with their associated courts.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches an array of {@link MatchDayLocationWithCourts} objects from the API.
     *
     * @async
     * @function
     * @param  query - Query parameters such as pagination, filters, or sorting.
     * @returns  A promise that resolves to an array of location summaries with courts.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayLocationWithCourts[]>(
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
