import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDaySearchItem, MatchDaySearchQuery } from '../types/search';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class SearchResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/search');
    }

    /**
     * Performs a fuzzy search across persons, teams, clubs, competitions, organisations
     * and matches, ranked by trigram similarity. A blank query returns no results.
     *
     * @example
     * const response = await client.search.list({ query: 'United', itemsPerPage: 10 });
     * console.log(response.items);
     * console.log(response.totalItems);
     */
    async list(query: MatchDaySearchQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySearchItem>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
