import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayFullTeam,
    MatchDayTeam,
    MatchDayTeamListQuery,
    MatchDayTeamPlayerRegistration,
    MatchDayTeamPlayersQuery,
    MatchDayTeamRegistration,
    MatchDayTeamRegistrationsQuery,
    MatchDayTeamStaffQuery,
    MatchDayTeamStaffRegistration,
    MatchDayTeamStatsSummary,
    MatchDayTeamStatsSummaryQuery,
} from '../types/team';
import { MatchDayPlayerStatsQuery, MatchDayPlayerStatsRow } from '../types/stats';
import { ListResponse, UnpaginatedListResponse } from '../types/list-response';
import { MatchDaySeasonRef } from '../types/common';

import { APIResource } from './resource';

export class TeamsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/teams');
    }

    /**
     * Retrieves aggregate results and discipline stats for a team.
     *
     * @example
     * const stats = await client.teams.stats.summary(123, { seasonId: 2025 });
     */
    async summary(id: number, query: MatchDayTeamStatsSummaryQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayTeamStatsSummary>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves per-player stats aggregates for a team.
     *
     * @example
     * const players = await client.teams.stats.players(123, { orderBy: 'goals' });
     */
    async players(id: number, query: MatchDayPlayerStatsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPlayerStatsRow>>(
            this.basePath + '/' + id + '/stats/players?' + queryString,
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
     * @example
     * const response = await client.teams.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayTeamListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeam>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific team.
     *
     * @throws {MatchDayAPIError} If the request fails, the team is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullTeam>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }

    /**
     * Retrieves the playing roster for a team.
     */
    async players(id: number, query: MatchDayTeamPlayersQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeamPlayerRegistration>>(
            `${this.basePath}/${id}/players?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the staff roster for a team.
     */
    async staff(id: number, query: MatchDayTeamStaffQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeamStaffRegistration>>(
            `${this.basePath}/${id}/staff?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the competitions and seasons a team is entered into.
     */
    async registrations(id: number, query: MatchDayTeamRegistrationsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeamRegistration>>(
            `${this.basePath}/${id}/registrations?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves every season a team has ever been registered into, newest first.
     */
    async seasons(id: number) {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDaySeasonRef>>(
            `${this.basePath}/${id}/seasons`,
            {
                method: 'GET',
            },
        );
    }
}
