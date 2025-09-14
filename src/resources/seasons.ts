import qs from 'qs';

import { MatchDayClient } from '../client';
import { BaseListQuery } from '../types/api';
import { SeasonPartial } from '../types/season';

import { APIResource } from './resource';

export class SeasonsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/seasons');
    }

    async list(query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<SeasonPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }
}
