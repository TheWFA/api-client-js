import { MatchDayBaseListQuery } from './api';
import { MatchDayCompetitionMiniRef, MatchDaySeasonMiniRef, MatchDayTeamRef } from './common';

export type MatchDayTieListQuery = MatchDayBaseListQuery & {
    competitionId?: number;
    seasonId?: number;
    teamId?: number;
};

export type MatchDayTieLeg = {
    matchId: number;
    legNumber: number | null;
    scheduledFor: Date | null;
    status: string;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
    homeScore: number;
    awayScore: number;
};

export type MatchDayTieAggregate = {
    homeScore: number;
    awayScore: number;
    complete: boolean;
};

export type MatchDayTie = {
    id: number;
    competition: MatchDayCompetitionMiniRef;
    season: MatchDaySeasonMiniRef;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
    createdAt: Date;
    legs: MatchDayTieLeg[];
    aggregate: MatchDayTieAggregate;
};
