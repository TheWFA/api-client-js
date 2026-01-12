import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayCompetition,
    MatchDayCompetitionGroup,
    MatchDayCompetitionPartial,
    MatchDayCompetitionPlayersStats,
    MatchDayCompetitionPlayersStatsQuery,
    MatchDayCompetitionQuery,
    MatchDayCompetitionStatsSummary,
    MatchDayCompetitionStatsSummaryQuery,
    MatchDayCompetitionTeamsStats,
    MatchDayCompetitionTeamsStatsQuery,
} from '../types/competitions';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class CompetitionsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competitions');
    }

    async summary(id: string, query: MatchDayCompetitionStatsSummaryQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayCompetitionStatsSummary>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}

export class CompetitionsGroupsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competition-groups');
    }

    async list(query: MatchDayCompetitionQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionGroup>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    async get(id: string) {
        return this.client.makeRequest<MatchDayCompetitionGroup>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }
}

export class CompetitionsResource extends APIResource {
    public readonly stats: CompetitionsStatsResource;
    public readonly groups: CompetitionsGroupsResource;

    constructor(client: MatchDayClient) {
        super(client, '/competitions');
        this.stats = new CompetitionsStatsResource(client);
        this.groups = new CompetitionsGroupsResource(client);
    }

    /**
     * Retrieves a paginated list of competitions.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayCompetitionPartial} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayCompetitionQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing competitions and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.competitions.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayCompetitionQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific competition.
     *
     * Makes a `GET` request to fetch the full {@link MatchDayCompetition} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the competition.
     * @returns A promise that resolves to the full competition object.
     *
     * @throws {MatchDayAPIError} If the request fails, the competition is not found, or the server responds with an error.
     *
     * @example
     * const competition = await client.competitions.get("comp123");
     * console.log(competition.name);
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDayCompetition>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }

    async players(id: string, query: MatchDayCompetitionPlayersStatsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionPlayersStats>>(
            this.basePath + '/' + id + '/stats/players?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    async teams(id: string, query: MatchDayCompetitionTeamsStatsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionTeamsStats>>(
            this.basePath + '/' + id + '/stats/teams?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
