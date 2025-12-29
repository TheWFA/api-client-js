import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { MatchDayClub, MatchDayClubPartial } from '../types/clubs';

import { APIResource } from './resource';

export class ClubsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/clubs');
    }

    /**
     * Retrieves a paginated list of clubs.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and fetches an array of {@link MatchDayClubPartial} objects from the API.
     *
     * @async
     * @function
     * @param {BaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayClubPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
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
