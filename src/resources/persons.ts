import qs from 'qs';

import { MatchDayClient } from '../client';
import { MatchDayPerson, MatchDayPersonPartial, MatchDayPersonQuery } from '../types/person';
import { ListResponse } from '../types/list-response';

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

        return this.client.makeRequest<ListResponse<MatchDayPersonPartial>>(
            this.basePath + '?' + queryString,
            {
                method: 'GET',
            },
        );
    }
}
