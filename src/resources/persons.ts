import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayPerson,
    MatchDayPersonAppearance,
    MatchDayPersonAppearancesQuery,
    MatchDayPersonQuery,
    MatchDayPersonRegistration,
    MatchDayPersonRegistrationQuery,
    MatchDayPersonStatsAssist,
    MatchDayPersonStatsCard,
    MatchDayPersonStatsGoal,
    MatchDayPersonStatsSummary,
    MatchDayPersonStatsSummaryQuery,
    MatchDayPlayerCardsQuery,
    MatchDayPlayerStatsQuery,
} from '../types/person';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class PersonsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/persons');
    }

    /**
     * Retrieves a summary of a person's statistics.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPersonStatsSummaryQuery} query - Query parameters to filter the statistics summary.
     * @returns {Promise<MatchDayPersonStatsSummary>} A promise that resolves to the person's statistics summary.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async summary(id: string, query: MatchDayPersonStatsSummaryQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayPersonStatsSummary>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of goals scored by a person.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPlayerStatsQuery} query - Query parameters to filter the list of goals.
     * @returns {Promise<ListResponse<MatchDayPersonStatsGoal>>} A promise that resolves to a list of goals.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async goals(id: string, query: MatchDayPlayerStatsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonStatsGoal>>(
            this.basePath + '/' + id + '/stats/goals?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of assists made by a person.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPlayerStatsQuery} query - Query parameters to filter the list of assists.
     * @returns {Promise<ListResponse<MatchDayPersonStatsAssist>>} A promise that resolves to a list of assists.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async assists(id: string, query: MatchDayPlayerStatsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonStatsAssist>>(
            this.basePath + '/' + id + '/stats/assists?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of cards received by a person.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPlayerCardsQuery} query - Query parameters to filter the list of cards.
     * @returns {Promise<ListResponse<MatchDayPersonStatsCard>>} A promise that resolves to a list of cards.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async cards(id: string, query: MatchDayPlayerCardsQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonStatsCard>>(
            this.basePath + '/' + id + '/stats/cards?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}

export class PersonsResource extends APIResource {
    public readonly stats: PersonsStatsResource;

    constructor(client: MatchDayClient) {
        super(client, '/persons');

        this.stats = new PersonsStatsResource(client);
    }

    /**
     * Retrieves detailed information about a specific person.
     *
     * Makes a `GET` request to fetch the full {@link Person} resource
     * by its unique identifier.
     *
     * @async
     * @function
     * @param  id - The unique identifier of the person.
     * @returns A promise that resolves to the full person object.
     *
     * @throws {MatchDayAPIError} If the request fails, the person is not found, or the server responds with an error.
     *
     * @example
     * const person = await client.people.get("12345");
     * console.log(person.name);
     */
    async get(id: string) {
        return this.client.makeRequest<MatchDayPerson>(this.basePath + '/' + id, { method: 'GET' });
    }

    /**
     * Retrieves a paginated list of people.
     *
     * Makes a `GET` request to fetch a {@link ListResponse} containing {@link MatchDayPersonPartial} resources
     * based on the provided query parameters.
     *
     * @async
     * @function
     * @param {MatchDayPersonQuery} query - The filtering and pagination options for the request.
     * @returns A promise that resolves to a {@link ListResponse} containing persons and pagination metadata.
     *
     * @throws {MatchDayAPIError} If the request fails, the query is invalid, or the server responds with an error.
     *
     * @example
     * const response = await client.persons.list({ itemsPerPage: 20, type: [] });
     * console.log(response.items[0].id, response.items[0].name);
     * console.log(response.pagination.totalItems);
     */
    async list(query: MatchDayPersonQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPerson>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of registrations for a person.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPersonRegistrationQuery} query - Query parameters to filter the list of registrations.
     * @returns {Promise<ListResponse<MatchDayPersonRegistration>>} A promise that resolves to a list of registrations.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async registrations(id: string, query: MatchDayPersonRegistrationQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonRegistration>>(
            this.basePath + '/' + id + '/registrations/?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a list of appearances for a person.
     *
     * @async
     * @function
     * @param {string} id - The unique identifier of the person.
     * @param {MatchDayPersonAppearancesQuery} query - Query parameters to filter the list of appearances.
     * @returns {Promise<ListResponse<MatchDayPersonAppearance>>} A promise that resolves to a list of appearances.
     * @throws {MatchDayAPIError} If the request fails or the server responds with an error.
     */
    async appearances(id: string, query: MatchDayPersonAppearancesQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonAppearance>>(
            this.basePath + '/' + id + '/appearances/?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
