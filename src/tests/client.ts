import { MatchDayClient } from '..';

// Global singleton type
declare global {
    var __matchDayClient: MatchDayClient | undefined;
}

export function getTestClient(): MatchDayClient {
    if (!globalThis.__matchDayClient) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error('Missing API_KEY in environment');
        }
        globalThis.__matchDayClient = new MatchDayClient({
            apiKey,
            baseURL: process.env.MATCHDAY_API_URL,
        });
    }
    return globalThis.__matchDayClient;
}
