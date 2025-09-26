import qs from 'qs';

import { MatchDayClient } from '../client';
import { BaseListQuery } from '../types/api';
import { SearchItem } from '../types/search';

import { APIResource } from './resource';

export class SearchResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/search');
    }

    /**
     * Performs a search query against the API.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and returns an array of {@link SearchItem} results. The results may include
     * different resource types such as matches, teams, personnel, or competitions.
     *
     * @async
     * @function
     * @param {BaseListQuery} query - Query parameters such as search text, pagination, filters, or sorting.
     * @returns {Promise<SearchItem[]>} A promise that resolves to an array of search results.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     *
     * @example
     * // Search for teams with "United" in the name
     * const results = await client.search.list({ q: "United", limit: 10 });
     * console.log(results);
     */
    async list(query: BaseListQuery): Promise<SearchItem[]> {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<SearchItem[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }
}
