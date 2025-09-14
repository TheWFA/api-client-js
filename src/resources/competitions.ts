import qs from 'qs';

import { MatchDayClient } from '../client';
import { BaseListQuery } from '../types/api';
import { Competition, CompetitionPartial, CompetitionTableRow } from '../types/competitions';
import { TeamPartial } from '../types/team';

import { APIResource } from './resource';

export class CompetitionsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/competitions');
    }

    async list(query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<CompetitionPartial[]>(this.basePath + '?' + queryString, {
            method: 'GET',
        });
    }

    async listTeams(competitionId: string, seasonId: string, query: BaseListQuery) {
        const queryString = qs.stringify(query);

        return this.client.makeRequest<TeamPartial[]>(
            this.basePath + `/${competitionId}/${seasonId}/teams?${queryString}`,
            {
                method: 'GET',
            },
        );
    }

    async table(competitionId: string, seasonId: string) {
        return this.client.makeRequest<CompetitionTableRow[]>(
            this.basePath + `/${competitionId}/${seasonId}/table`,
            {
                method: 'GET',
            },
        );
    }

    async get(id: string) {
        return this.client.makeRequest<Competition>(this.basePath + '/' + id, { method: 'GET' });
    }
}
