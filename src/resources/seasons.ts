import qs from 'qs';

import { MatchDayClient } from '../client';
import { BaseListQuery } from '../types/api';
import { SeasonPartial } from '../types/season';

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
    async list(query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<SeasonPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }
}
