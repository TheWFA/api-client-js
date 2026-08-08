import { MatchDayClient } from '../client';
import { MatchDayHistoryEntity, MatchDayHistoryEntry } from '../types/common';
import { UnpaginatedListResponse } from '../types/list-response';

import { APIResource } from './resource';

export class HistoryResource extends APIResource {
    constructor(client: MatchDayClient) {
        super(client, '/history');
    }

    /**
     * Retrieves the superseded identities of an entity, newest window first.
     *
     * Each entry is valid over `[validFrom, validTo)`; an entry with a null `validTo`
     * is the open-ended current window.
     */
    async list(entity: MatchDayHistoryEntity, entityId: number) {
        return this.client.makeRequest<UnpaginatedListResponse<MatchDayHistoryEntry>>(
            `${this.basePath}/${entity}/${entityId}`,
            {
                method: 'GET',
            },
        );
    }

    /**
     * Retrieves a single history entry by ID.
     *
     * @throws {MatchDayAPIError} If the request fails, the entry is not found, or the server responds with an error.
     */
    async get(entity: MatchDayHistoryEntity, entityId: number, historyId: number) {
        return this.client.makeRequest<MatchDayHistoryEntry>(
            `${this.basePath}/${entity}/${entityId}/${historyId}`,
            {
                method: 'GET',
            },
        );
    }
}
