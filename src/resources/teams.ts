import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import { Team, MatchDayTeamPartial } from '../types/team';

import { APIResource } from './resource';

export class TeamsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/teams');
    }

    /**
     * Retrieves a paginated list of teams.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and fetches an array of {@link TeamPartial} objects from the API.
     *
     * @async
     * @function
     * @param {BaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayTeamPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    /**
     * Retrieves detailed information about a specific team.
     *
     * Makes a `GET` request to fetch the full {@link Team} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param id - The unique identifier of the team.
     *
     * @throws {MatchDayAPIError} If the request fails, the team is not found, or the server responds with an error.
     */
    async get(id: string) {
        return this.client.makeRequest<Team>(this.basePath + '/' + id, { method: 'GET' });
    }
}
