import qs from 'qs';

import { MatchDayClient } from '../client';
import {
    MatchDayFullPerson,
    MatchDayPerson,
    MatchDayPersonAppearance,
    MatchDayPersonAppearancesQuery,
    MatchDayPersonCard,
    MatchDayPersonCardsQuery,
    MatchDayPersonGoalContribution,
    MatchDayPersonListQuery,
    MatchDayPersonRegistration,
    MatchDayPersonRegistrationsQuery,
    MatchDayPersonStatsQuery,
    MatchDayPersonStatsSummary,
    MatchDayPersonStatsSummaryQuery,
} from '../types/person';
import { MatchDayPersonSuspensionsQuery, MatchDaySuspension } from '../types/suspensions';
import { ListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class PersonsStatsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/persons');
    }

    /**
     * Retrieves a summary of a person's career statistics.
     */
    async summary(id: number, query: MatchDayPersonStatsSummaryQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayPersonStatsSummary>(
            this.basePath + '/' + id + '/stats/summary?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the goals scored by a person.
     */
    async goals(id: number, query: MatchDayPersonStatsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonGoalContribution>>(
            this.basePath + '/' + id + '/stats/goals?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the assists made by a person.
     */
    async assists(id: number, query: MatchDayPersonStatsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonGoalContribution>>(
            this.basePath + '/' + id + '/stats/assists?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves the cards received by a person.
     */
    async cards(id: number, query: MatchDayPersonCardsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonCard>>(
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
     * Retrieves a paginated list of people with display names only.
     *
     * @example
     * const response = await client.persons.list({ itemsPerPage: 20 });
     * console.log(response.items[0].id, response.items[0].name);
     * console.log(response.totalItems);
     */
    async list(query: MatchDayPersonListQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPerson>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves detailed information about a specific person.
     *
     * @throws {MatchDayAPIError} If the request fails, the person is not found, or the server responds with an error.
     */
    async get(id: number) {
        return this.client.makeRequest<MatchDayFullPerson>(this.basePath + '/' + id, {
            method: 'GET',
        });
    }

    /**
     * Retrieves a person's playing and staff registrations, newest first.
     */
    async registrations(id: number, query: MatchDayPersonRegistrationsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonRegistration>>(
            this.basePath + '/' + id + '/registrations?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a person's match appearances.
     */
    async appearances(id: number, query: MatchDayPersonAppearancesQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDayPersonAppearance>>(
            this.basePath + '/' + id + '/appearances?' + queryString,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a person's suspensions.
     */
    async suspensions(id: number, query: MatchDayPersonSuspensionsQuery = {}) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<ListResponse<MatchDaySuspension>>(
            this.basePath + '/' + id + '/suspensions?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
