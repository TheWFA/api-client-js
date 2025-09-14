import { BaseListQuery } from './api';
import { MatchStatus } from './match';

export type MatchQuery = {
    /** Sort order (defaults to { date: "asc" }) */
    orderBy?: {
        date: 'asc' | 'desc';
    };

    /** Date predicates (OR across array, AND within object) */
    date?: {
        lt?: Date;
        eq?: Date;
        gt?: Date;
    }[];

    /** Matches involving any of these team IDs */
    team?: string[];

    /** Matches in any of these competition IDs */
    competition?: string[];

    /** Matches in any of these season IDs */
    season?: string[];

    /** Matches in any of these match group IDs */
    group?: string[];

    /** Matches at any of these courts/venues (given a court ID) */
    court?: string[];

    /** Matches with any of these statuses */
    status?: MatchStatus[];
} & BaseListQuery;
