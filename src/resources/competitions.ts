import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayCompetition,
    MatchDayCompetitionGetQuery,
    MatchDayCompetitionListQuery,
    MatchDayCompetitionSeasonsQuery,
    MatchDayCompetitionStatsSummary,
    MatchDayCompetitionStatsSummaryQuery,
    MatchDayCompetitionTable,
    MatchDayCompetitionTableQuery,
    MatchDayCompetitionTeam,
    MatchDayCompetitionTeamStatsRow,
    MatchDayCompetitionTeamsStatsQuery,
    MatchDayFullCompetition,
    MatchDayMatchGroupTeam,
} from '../types/competitions';
import { MatchDayPlayerStatsQuery, MatchDayPlayerStatsRow } from '../types/stats';
import { ListResponse, UnpaginatedListResponse } from '../types/list-response';
import { MatchDaySeasonFull } from '../types/common';

import { APIResource } from './resource';

export class CompetitionsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competitions');
    }

    /**
     * Retrieves aggregate statistics for a competition.
     */
    async summary(id: number, query: MatchDayCompetitionStatsSummaryQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayCompetitionStatsSummary>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves per-team aggregate statistics for a competition.
     */
    async teams(id: number, query: MatchDayCompetitionTeamsStatsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionTeamStatsRow>>(
            this.basePath + '/' + id + '/stats/teams?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves per-player aggregate statistics for a competition.
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

export class CompetitionsResource extends APIResource {
    public readonly stats: CompetitionsStatsResource;

    constructor(client: MatchDayClient) {
        super(client, '/competitions');
        this.stats = new CompetitionsStatsResource(client);
    }

    /**
     * Retrieves a paginated list of competitions.
     *
     * @example
     * const response = await client.competitions.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayCompetitionListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetition>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific competition.
     *
     * @throws {MatchDayAPIError} If the request fails, the competition is not found, or the server responds with an error.
     */
    async get(id: number, query: MatchDayCompetitionGetQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayFullCompetition>(
            this.basePath + '/' + id + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the teams registered for a competition and season.
     */
    async teams(id: number, query: MatchDayCompetitionSeasonsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<UnpaginatedListResponse<MatchDayCompetitionTeam>>(
            this.basePath + '/' + id + '/teams?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves every season a competition has run.
     */
    async seasons(id: number) {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDaySeasonFull>>(
            this.basePath + '/' + id + '/seasons',
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the league table for a competition and season.
     *
     * Returns 400 for cup and friendly competitions, and for a competition with no registered season.
     */
    async table(id: number, query: MatchDayCompetitionTableQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayCompetitionTable>(
            this.basePath + '/' + id + '/table?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the teams in a match group stage, with their bracket seeds.
     */
    async matchGroupTeams(id: number, groupId: number) {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDayMatchGroupTeam>>(
            `${this.basePath}/${id}/match-groups/${groupId}/teams`,
            {
                method: 'GET',
            },
        );
    }
}
