import { MatchDayBaseListQuery } from './api';
import { MatchDaySeasonRef } from './common';

export type MatchDaySeasonListQuery = MatchDayBaseListQuery & {
    /** ISO date string; restricts to the season active on this date. */
    activeOn?: string;
};

export type MatchDaySeason = MatchDaySeasonRef;

export type MatchDayFullSeason = MatchDaySeasonRef & {
    active: boolean;
    competitionCount: number;
    registeredTeamCount: number;
};
