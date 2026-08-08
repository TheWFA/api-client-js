import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayFullSeason, MatchDaySeason, MatchDaySeasonListQuery } from '../types/season';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class SeasonsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/seasons');
    }

    /**
     * Retrieves a paginated list of seasons, newest first.
     *
     * @example
     * const response = await client.seasons.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDaySeasonListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySeason>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single season by its unique identifier.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullSeason>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
