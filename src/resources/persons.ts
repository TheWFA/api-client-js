import { MatchDayClient } from '../client';
import { Person } from '../types/person';

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
     * @throws {APIError} If the request fails, the person is not found, or the server responds with an error.
     *
     * @example
     * const person = await client.people.get("12345");
     * console.log(person.name);
     */
    async get(id: string) {
        return this.client.makeRequest<Person>(this.basePath + '/' + id, { method: 'GET' });
    }
}
