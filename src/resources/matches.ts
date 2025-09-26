import qs from 'qs';

import { MatchDayClient } from '../client';
import { FullMatch, Match } from '../types/match';
import { MatchQuery } from '../types/match-query';

import { APIResource } from './resource';

export class MatchResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/matches');
    }

    /**
     * Retrieves a list of matches matching the given query.
     *
     * Builds a query string from the provided {@link MatchQuery} options
     * and fetches an array of {@link Match} objects from the API.
     *
     * @async
     * @function
     * @param {MatchQuery} query - Query parameters such as filters, search options, or pagination.
     * @returns  A promise that resolves to an array of matches.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     *
     * @example
     * const matches = await client.matches.list({ season: "2025", limit: 10 });
     * console.log(matches[0].id);
     */
    async list(query: MatchQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<Match[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    /**
     * Retrieves detailed information about a specific match.
     *
     * Makes a `GET` request to fetch the full {@link FullMatch} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the match.
     * @returns  A promise that resolves to the full match object.
     *
     * @throws {APIError} If the request fails, the match is not found, or the server responds with an error.
     *
     * @example
     * const match = await client.matches.get("abc123");
     * console.log(match.homeTeam.name, match.awayTeam.name);
     */
    async get(id: string) {
        return this.client.makeRequest<FullMatch>(this.basePath + '/' + id, { method: 'GET' });
    }
}
