import qs from 'qs';

import { WFAAPIClient } from '../client';
import { FullMatch, Match, MatchQuery } from '../types/match';

import { APIResource } from './resource';

export class MatchResource extends APIResource {
    constructor(client: WFAAPIClient) {
        super(client, '/matches');
    }

    async list(query: MatchQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<Match[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    async get(id: string) {
        return this.client.makeRequest<FullMatch>(this.basePath + '/' + id, { method: 'GET' });
    }
}
