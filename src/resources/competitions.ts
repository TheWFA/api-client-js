import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types/api';
import {
    MatchDayCompetition,
    MatchDayCompetitionPartial,
    MatchDayCompetitionTableRow,
} from '../types/competitions';
import { MatchDayTeamPartial } from '../types/team';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class CompetitionsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competitions');
    }

    /**
     * Retrieves a paginated list of competitions.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayCompetitionPartial} objects from the API.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing competitions and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     *
     * @example
     * const response = await client.competitions.list({ itemsPerPage: 20 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayCompetitionPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the teams participating in a competition for a specific season.
     *
     * Builds a query string from the provided {@link MatchDayBaseListQuery} options
     * and fetches a {@link ListResponse} containing {@link MatchDayTeamPartial} objects.
     *
     * @async
     * @function
     * @param {string} competitionId - The unique identifier of the competition.
     * @param {string} seasonId - The unique identifier of the season within the competition.
     * @param {MatchDayBaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to a {@link ListResponse} containing teams and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails, the competition or season is not found, or the server responds with an error.
     *
     * @example
     * const response = await client.competitions.listTeams("comp123", "season2025", { itemsPerPage: 10 });
     * console.log(response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async listTeams(competitionId: string, seasonId: string, query: MatchDayBaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayTeamPartial>>(
            this.basePath + `/${competitionId}/${seasonId}/teams?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the competition table (standings) for a given season.
     *
     * Makes a `GET` request to fetch an array of {@link MatchDayCompetitionTableRow}
     * objects representing the current standings in the specified competition season.
     *
     * @async
     * @function
     * @param {string} competitionId - The unique identifier of the competition.
     * @param {string} seasonId - The unique identifier of the season within the competition.
     * @returns A promise that resolves to the competition table.
     *
     * @throws {MatchDayAPIError} If the request fails, the competition or season is not found, or the server responds with an error.
     *
     * @example
     * const table = await client.competitions.table("comp123", "season2025");
     * console.log(table[0].team, table[0].points);
     */
    async table(competitionId: string, seasonId: string) {
        return this.client.makeRequest<MatchDayCompetitionTableRow[]>(
            this.basePath + `/${competitionId}/${seasonId}/table`,
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
}
