import { MatchDayBaseListQuery } from './api';
import { MatchDayPersonRef, MatchDayTeamRef, OneOrMany } from './common';

/** Common aggregate-stats filters shared by the team, competition and person stats endpoints. */
export type MatchDayStatsFilterQuery = {
    seasonId?: OneOrMany<number>;
    competitionId?: OneOrMany<number>;
    matchGroupId?: OneOrMany<number>;
    teamId?: OneOrMany<number>;
    /** ISO date or datetime string. */
    from?: string;
    /** ISO date or datetime string. */
    to?: string;
};

export type MatchDayPlayerStatsOrderBy =
    'name' | 'appearances' | 'goals' | 'assists' | 'contributions' | 'yellowCards' | 'redCards';

export type MatchDayPlayerStatsQuery = MatchDayBaseListQuery &
    MatchDayStatsFilterQuery & {
        orderBy?: MatchDayPlayerStatsOrderBy;
    };

/** A per-player stats aggregate row, shared by the team and competition player-stats endpoints. */
export type MatchDayPlayerStatsRow = {
    player: MatchDayPersonRef;
    team: MatchDayTeamRef | null;
    number: number | null;
    appearances: number;
    goals: number;
    assists: number;
    contributions: number;
    yellowCards: number;
    redCards: number;
};
