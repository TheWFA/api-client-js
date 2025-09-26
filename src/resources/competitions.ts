import qs from 'qs';

import { MatchDayClient } from '../client';
import { BaseListQuery } from '../types/api';
import { Competition, CompetitionPartial, CompetitionTableRow } from '../types/competitions';
import { TeamPartial } from '../types/team';

import { APIResource } from './resource';

export class CompetitionsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competitions');
    }

    /**
     * Retrieves a list of competitions.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and fetches an array of {@link CompetitionPartial} objects from the API.
     *
     * @async
     * @function
     * @param {BaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns  A promise that resolves to an array of competitions.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     *
     * @example
     * const competitions = await client.competitions.list({ limit: 20 });
     * console.log(competitions[0].name);
     */
    async list(query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<CompetitionPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    /**
     * Retrieves the teams participating in a competition for a specific season.
     *
     * Builds a query string from the provided {@link BaseListQuery} options
     * and fetches an array of {@link TeamPartial} objects.
     *
     * @async
     * @function
     * @param {string} competitionId - The unique identifier of the competition.
     * @param {string} seasonId - The unique identifier of the season within the competition.
     * @param {BaseListQuery} query - Query parameters such as pagination, filters, or sorting.
     * @returns A promise that resolves to an array of teams.
     *
     * @throws {APIError} If the request fails, the competition or season is not found, or the server responds with an error.
     *
     * @example
     * const teams = await client.competitions.listTeams("comp123", "season2025", { limit: 10 });
     * console.log(teams[0].name);
     */
    async listTeams(competitionId: string, seasonId: string, query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<TeamPartial[]>(
            this.basePath + `/${competitionId}/${seasonId}/teams?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the competition table (standings) for a given season.
     *
     * Makes a `GET` request to fetch an array of {@link CompetitionTableRow}
     * objects representing the current standings in the specified competition season.
     *
     * @async
     * @function
     * @param {string} competitionId - The unique identifier of the competition.
     * @param {string} seasonId - The unique identifier of the season within the competition.
     * @returns A promise that resolves to the competition table.
     *
     * @throws {APIError} If the request fails, the competition or season is not found, or the server responds with an error.
     *
     * @example
     * const table = await client.competitions.table("comp123", "season2025");
     * console.log(table[0].team, table[0].points);
     */
    async table(competitionId: string, seasonId: string) {
        return this.client.makeRequest<CompetitionTableRow[]>(
            this.basePath + `/${competitionId}/${seasonId}/table`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific competition.
     *
     * Makes a `GET` request to fetch the full {@link Competition} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the competition.
     * @returns A promise that resolves to the full competition object.
     *
     * @throws {APIError} If the request fails, the competition is not found, or the server responds with an error.
     *
     * @example
     * const competition = await client.competitions.get("comp123");
     * console.log(competition.name);
     */
    async get(id: string) {
        return this.client.makeRequest<Competition>(this.basePath + '/' + id, { method: 'GET' });
    }
}
