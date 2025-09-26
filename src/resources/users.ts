import { MatchDayClient } from '../client';
import { User } from '../types/users';

import { APIResource } from './resource';

export class UsersResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/users');
    }

    /**
     * Fetches the currently authenticated user's information.
     *
     * Makes a `GET` request to the `@me` endpoint and returns the
     * user object associated with the provided authentication token.
     * Only works with the OAuth authentication method.
     *
     * @async
     * @function
     * @returns {Promise<User>} A promise that resolves to the authenticated {@link User} object.
     *
     * @throws {APIError} If the request fails or the server responds with an error.
     */
    async me(): Promise<User> {
        return this.client.makeRequest<User>(this.basePath + '/@me', {
            method: 'GET',
        });
    }
}
