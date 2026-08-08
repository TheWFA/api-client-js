import { MatchDayClient } from '../client';
import { MatchDayKitType, MatchDayTeamKit } from '../types/kits';
import { UnpaginatedListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class KitsResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/kit-types');
    }

    /**
     * Retrieves the available kit types (home, away, alternative).
     */
    async types() {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDayKitType>>(this.basePath, {
            method: 'GET',
        });
    }

    /**
     * Retrieves the kits for a specific team.
     */
    async forTeam(teamId: number) {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDayTeamKit>>(
            `/teams/${teamId}/kits`,
            {
                method: 'GET',
            },
        );
    }
}
