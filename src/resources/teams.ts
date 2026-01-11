import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayTeam,
    MatchDayTeamPartial,
    MatchDayTeamStaffRegistration,
    MatchDayTeamPlayerRegistration,
    TeamPlayersStatsQuery,
    TeamStaffQuery,
    MatchDayTeamListQuery,
    TeamStatsSummaryQuery,
} from '../types/team';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class TeamsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/teams');
    }

    async summary(id: string, query: TeamStatsSummaryQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<TeamStatsSummaryQuery>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}

export class TeamsResource extends APIResource {
    public readonly stats: TeamsStatsResource;

    constructor(client: MatchDayClient) {
        super(client, '/teams');
        this.stats = new TeamsStatsResource(client);
    }

    /**
     * Retrieves a paginated list of teams.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayTeamPartial} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing teams and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.teams.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayTeamListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeamPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
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
        return this.client.makeRequest<MatchDayTeam>(this.basePath + '/' + id, { method: 'GET' });
    }

    /**
     * Retrieves a list of player registrations for a given team and season.
     *
     * Makes a `GET` request to fetch an array of {@link MatchDayTeamPlayerRegistration} resources
     * filtered by the provided team ID, season ID, and query parameters.
     *
     * @async
     * @function
     * @param  teamId - The unique identifier of the team.
     * @param  query - The filtering and pagination options for the request.
     * @returns  A promise that resolves to an array of player registrations.
     *
     * @throws {MatchDayAPIError} If the request fails, the query is invalid, or the server responds with an error.
     *
     * @example
     * const players = await client.teams.listPlayers("team123", "season2025", { limit: 10 });
     * console.log(players[0].playerId, players[0].status);
     */
    async players(teamId: string, query: TeamPlayersStatsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayTeamPlayerRegistration[]>(
            `${this.basePath}/${teamId}/stats/players?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of staff registrations for a given team and season.
     *
     * Makes a `GET` request to fetch an array of {@link MatchDayTeamStaffRegistration} resources
     * filtered by the provided team ID, season ID, and query parameters.
     *
     * @async
     * @function
     * @param {string} teamId - The unique identifier of the team.
     * @param {MatchDayBaseListQuery} query - The filtering and pagination options for the request.
     * @returns A promise that resolves to an array of staff registrations.
     *
     * @throws {MatchDayAPIError} If the request fails, the query is invalid, or the server responds with an error.
     *
     * @example
     * const staff = await client.teams.listStaff("team123", "season2025", { offset: 0, limit: 5 });
     * console.log(staff[0].staffId, staff[0].role);
     */
    async staff(teamId: string, query: TeamStaffQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayTeamStaffRegistration[]>(
            `${this.basePath}/${teamId}/staff?${queryString}`,
            {
                method: 'GET',
            },
        );
    }
}
