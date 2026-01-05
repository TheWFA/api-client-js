import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayClub, MatchDayClubPartial } from '../types/clubs';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class ClubsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/clubs');
    }

    /**
     * Retrieves a paginated list of clubs.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayClubPartial} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing clubs and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.clubs.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayClubPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific club.
     *
     * Makes a `GET` request to fetch the full {@link MatchDayClub} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param id - The unique identifier of the club.
     *
     * @throws {MatchDayAPIError} If the request fails, the team is not found, or the server responds with an error.
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDayClub>(this.basePath + '/' + id, { method: 'GET' });
    }
}
