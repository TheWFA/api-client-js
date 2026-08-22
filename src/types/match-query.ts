import { MatchDayBaseListQuery } from './api';
import { OneOrMany } from './common';
import { MatchDayMatchStatus } from './match';

export type MatchDayMatchQuery = MatchDayBaseListQuery & {
    id?: OneOrMany<number>;
    teamId?: OneOrMany<number>;
    competitionId?: OneOrMany<number>;
    organisationId?: OneOrMany<number>;
    seasonId?: OneOrMany<number>;
    matchGroupId?: OneOrMany<number>;
    courtId?: OneOrMany<number>;
    status?: MatchDayMatchStatus[];
    /** ISO date or datetime string. */
    scheduledFrom?: string;
    /** ISO date or datetime string. */
    scheduledTo?: string;
    orderByDateDesc?: boolean;
};
