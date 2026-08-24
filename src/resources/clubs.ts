import { stringifyQuery } from '../utils/query';
import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayClub, MatchDayFullClub } from '../types/clubs';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class ClubsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/clubs');
    }

    /**
     * Retrieves a paginated list of clubs.
     *
     * @example
     * const response = await client.clubs.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayBaseListQuery = {}) {
        const queryString = stringifyQuery(query);

        return this.client.makeRequest<ListResponse<MatchDayClub>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific club, including its teams.
     *
     * @throws {MatchDayAPIError} If the request fails, the club is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullClub>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
