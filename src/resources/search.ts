import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDaySearchItem } from '../types/search';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class SearchResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/search');
    }

    /**
     * Performs a search query against the API.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and returns a {@link ListResponse} containing {@link MatchDaySearchItem} results. The results may include
     * different resource types such as matches, teams, personnel, or competitions.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as search text, pagination, filters, or sorting.
     * @returns {Promise<ListResponse<MatchDaySearchItem>>} A promise that resolves to a {@link ListResponse} containing search results and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * // Search for teams with "United" in the name
     * const response = await client.search.list({ query: "United", itemsPerPage: 10 });
     * console.log(response.items);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayBaseListQuery): Promise<ListResponse<MatchDaySearchItem>> {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySearchItem>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
