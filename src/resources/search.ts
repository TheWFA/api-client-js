import qs from 'qs';

import { WFAAPIClient } from '../client';
import { BaseListQuery } from '../types/api';
import { SearchItem } from '../types/search';

import { APIResource } from './resource';

export class SearchResource extends APIResource {
    constructor(client: WFAAPIClient) {
        super(client, '/search');
    }

    async list(query: BaseListQuery): Promise<SearchItem[]> {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<SearchItem[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }
}
