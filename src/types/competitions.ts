import { MatchDayBaseListQuery } from './api';
import { MatchDayPerson } from './person';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial } from './team';

export enum MatchDayCompetitionType {
    League = 'league',
    Cup = 'cup',
    Friendly = 'friendly',
}

export type MatchDayCompetitionQuery = MatchDayBaseListQuery & {
    group?: string[];
};

export type MatchDayCompetitionPartial = {
    id: string;
    name: string;
    type: MatchDayCompetitionType;
    activeSeason: MatchDaySeasonPartial;
    group: MatchDayCompetitionGroupPartial | null;
    logo: null | string;
};

export type MatchDayCompetitionGroupPartial = {
    id: string;
    name: string;
    shortName: string;
    logo: null | string;
};

export type MatchDayCompetitionHistory = {
    id: string;
    name: string | null;
    logo: string | null;
    created_at: Date;
};

export type MatchDayCompetition = {
    seasons: (MatchDaySeasonPartial & { isActiveSeason: boolean })[];
    history: MatchDayCompetitionHistory[];
    group: MatchDayCompetitionGroupPartial | null;
} & Omit<MatchDayCompetitionPartial, 'activeSeason'>;

export type MatchDayCompetitionTableRow = {
    team: MatchDayTeamPartial;
    position: number;
    matchesPlayed: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
};

export type MatchDayCompetitionStatsSummaryQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    season?: string[];
    matchGroup?: string[];
};

export type MatchDayCompetitionStatsSummary = {
    matches: number;
    goals: number;
    ownGoals: number;
    goalsPerMatch: number;
    yellowCards: number;
    redCards: number;
    cleanSheets: number;
    teams: number;
};

export type MatchDayCompetitionPlayersStatsQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    season?: string[];
    matchGroup?: string[];
    team?: string[];
    orderBy?:
        | 'name'
        | 'goals'
        | 'assists'
        | 'contributions'
        | 'yellowCards'
        | 'redCards'
        | 'appearances';
};

export type MatchDayCompetitionPlayersStats = {
    player: MatchDayPerson;
    team: MatchDayTeamPartial;
    goals: number;
    assists: number;
    contributions: number;
    yellowCards: number;
    redCards: number;
    appearances: number;
};

export type MatchDayCompetitionTeamsStatsQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    season?: string[];
    matchGroup?: string[];
    orderBy?:
        | 'name'
        | 'goalsFor'
        | 'goalsAgainst'
        | 'goalDifference'
        | 'cleanSheets'
        | 'yellowCards'
        | 'redCards'
        | 'played'
        | 'wins'
        | 'points';
};

export type MatchDayCompetitionTeamsStats = {
    team: MatchDayTeamPartial;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    goalsPerMatch: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    points: number;
};

export type MatchDayCompetitionGroup = {
    id: string;
    name: string;
    shortName: string;
    logo: null | string;
    competitions: MatchDayCompetitionPartial[];
};
