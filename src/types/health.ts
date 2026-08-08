export enum MatchDayHealthStatus {
    Healthy = 'healthy',
    Unhealthy = 'unhealthy',
}

export enum MatchDayHealthScope {
    Public = 'public',
    Internal = 'internal',
}

export type MatchDayHealth = {
    status: MatchDayHealthStatus;
    latencyMs?: number;
    error?: string;
    scope: MatchDayHealthScope;
};
