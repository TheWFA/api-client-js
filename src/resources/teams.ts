import qs from 'qs';

import { WFAAPIClient } from '../client';
import { BaseListQuery } from '../types/api';
import { Team, TeamPartial } from '../types/team';

import { APIResource } from './resource';

export class TeamsResource extends APIResource {
    constructor(client: WFAAPIClient) {
        super(client, '/teams');
    }

    async list(query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<TeamPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    async get(id: string) {
        return this.client.makeRequest<Team>(this.basePath + '/' + id, { method: 'GET' });
    }
}
