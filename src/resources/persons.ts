import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayBaseListQuery } from '../types';
import { MatchDayPerson, MatchDayPersonPartial, MatchDayPersonQuery } from '../types/person';

import { APIResource } from './resource';

export class PersonsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/persons');
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
     * Retrieves a list of people.
     *
     * Makes a `GET` request to fetch an array of {@link MatchDayPersonPartial} resources
     * based on the provided query parameters.
     *
     * @async
     * @function
     * @param {MatchDayBaseListQuery} query - The filtering and pagination options for the request.
     * @returns  A promise that resolves to an array of partial person objects.
     *
     * @throws {MatchDayAPIError} If the request fails, the query is invalid, or the server responds with an error.
     *
     * @example
     * const people = await client.people.list({ limit: 20 });
     * console.log(people[0].id, people[0].name);
     */
    async list(query: MatchDayPersonQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<MatchDayPersonPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }
}
