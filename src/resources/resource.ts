import { WFAAPIClient } from '../client';

export abstract class APIResource {
    protected client: WFAAPIClient;
    protected basePath: string;

    constructor(client: WFAAPIClient, basePath: string) {
        this.basePath = basePath;
        this.client = client;
    }
}
