import { WFAAPIClient } from '../client';
import { Person } from '../types/person';

import { APIResource } from './resource';

export class PersonsResource extends APIResource {
    constructor(client: WFAAPIClient) {
        super(client, '/persons');
    }

    async get(id: string) {
        return this.client.makeRequest<Person>(this.basePath + '/' + id, { method: 'GET' });
    }
}
