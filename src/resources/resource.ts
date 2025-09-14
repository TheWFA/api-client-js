import { MatchDayClient } from '../client';

export abstract class APIResource {
    protected client: MatchDayClient;
    protected basePath: string;

    constructor(client: MatchDayClient, basePath: string) {
        this.basePath = basePath;
        this.client = client;
    }
}
