import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayTie, MatchDayTieListQuery } from '../types/ties';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class TiesResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/ties');
    }

    /**
     * Retrieves a paginated list of two-legged ties, with their legs and aggregate score.
     *
     * A match's `matchGroup`/`tieId` points here.
     *
     * @example
     * const response = await client.ties.list({ competitionId: 1 });
     * console.log(response.totalItems);
     */
    async list(query: MatchDayTieListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTie>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single tie by ID.
     *
     * @throws {MatchDayAPIError} If the request fails, the tie is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayTie>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
