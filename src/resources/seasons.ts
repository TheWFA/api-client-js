import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDaySeasonPartial } from '../types/season';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class SeasonsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/seasons');
    }

    /**
     * Retrieves a paginated list of seasons.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDaySeasonPartial} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing seasons and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.seasons.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySeasonPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single season by its unique identifier.
     *
     * Sends a GET request to fetch detailed information about a specific
     * {@link MatchDaySeasonPartial} object from the API.
     *
     * @async
     * @function
     * @param  id - The unique identifier of the season to retrieve.
     * @returns  A promise that resolves to the requested season summary.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDaySeasonPartial>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
