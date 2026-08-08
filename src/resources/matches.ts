import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayFullMatch, MatchDayMatch } from '../types/match';
import { MatchDayMatchQuery } from '../types/match-query';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class MatchResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/matches');
    }

    /**
     * Retrieves a paginated list of matches matching the given query.
     *
     * @example
     * const response = await client.matches.list({ seasonId: 2025, itemsPerPage: 10 });
     * console.log(response.items[0].id);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayMatchQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayMatch>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific match, including lineups,
     * events and (if applicable) the penalty shootout.
     *
     * @example
     * const match = await client.matches.get(123);
     * console.log(match.homeTeam.name, match.awayTeam.name);
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullMatch>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
