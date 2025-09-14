import qs from 'qs';

import { MatchDayClient } from '../client';
import { FullMatch, Match } from '../types/match';
import { MatchQuery } from '../types/match-query';

import { APIResource } from './resource';

export class MatchResource extends APIResource {
    constructor(client: MatchDayClient) {
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
