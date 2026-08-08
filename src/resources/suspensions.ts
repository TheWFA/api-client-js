import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDaySuspension, MatchDaySuspensionListQuery } from '../types/suspensions';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class SuspensionsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/suspensions');
    }

    /**
     * Retrieves a paginated list of suspensions.
     *
     * Filtering by fixture is split in two: `servedInMatchId` returns bans sat out
     * in that fixture, `originMatchId` returns bans that arose from a card shown in it.
     *
     * @example
     * const response = await client.suspensions.list({ activeOnly: 'true' });
     * console.log(response.totalItems);
     */
    async list(query: MatchDaySuspensionListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySuspension>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single suspension by ID.
     *
     * @throws {MatchDayAPIError} If the request fails, the suspension is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDaySuspension>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}
