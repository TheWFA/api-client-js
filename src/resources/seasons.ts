import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDaySeasonPartial } from '../types/season';

import { APIResource } from './resource';

export class SeasonsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/seasons');
    }

    /**
     * Retrieves a paginated list of seasons.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and fetches an array of {@link SeasonPartial} objects from the API.
     *
     * @async
     * @function
     * @param  query - Query parameters such as pagination, filters, or sorting.
     * @returns  A promise that resolves to an array of season summaries.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDaySeasonPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
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
