import { MatchDayBaseListQuery } from './api';
import {
    MatchDayHistoryEntry,
    MatchDayOrganisationRef,
    MatchDaySeasonFull,
    MatchDaySeasonWithActive,
    MatchDayTeamRef,
} from './common';
import { MatchDayStatsFilterQuery } from './stats';
import { MatchDayTeam } from './team';

export enum MatchDayCompetitionType {
    League = 'league',
    Cup = 'cup',
    Friendly = 'friendly',
}

export type MatchDayCompetitionListQuery = MatchDayBaseListQuery & {
    organisationId?: number;
    type?: MatchDayCompetitionType;
};

export type MatchDayCompetition = {
    id: number;
    name: string;
    type: MatchDayCompetitionType;
    badgeUrl: string | null;
    sortOrder: number;
    hidden: boolean;
    organisation: MatchDayOrganisationRef | null;
};

export type MatchDayCompetitionGetQuery = {
    seasonId?: number;
};

export enum MatchDayCompetitionMatchGroupType {
    GameWeek = 'game-week',
    Pool = 'pool',
    Knockout = 'knockout',
    TwoLegged = 'two-legged',
}

export type MatchDayCompetitionMatchGroupProgression = {
    toGroupId: number;
    progressingTeamCount: number | null;
};

export type MatchDayCompetitionMatchGroup = {
    id: number;
    groupName: string;
    groupType: MatchDayCompetitionMatchGroupType | null;
    roundNumber: number | null;
    advancingSpots: number | null;
    seasonId: number;
    progressions: MatchDayCompetitionMatchGroupProgression[];
};

export type MatchDayFullCompetition = MatchDayCompetition & {
    season: MatchDaySeasonWithActive | null;
    matchGroups: MatchDayCompetitionMatchGroup[];
    history?: MatchDayHistoryEntry[];
};

export type MatchDayCompetitionSeasonsQuery = {
    seasonId?: number;
};

export type MatchDayMatchGroupTeam = {
    matchGroupId: number;
    team: MatchDayTeamRef;
    seedNumber: number | null;
};

export type MatchDayCompetitionStatsSummaryQuery = MatchDayStatsFilterQuery;

export type MatchDayCompetitionStatsSummary = {
    matches: number;
    teams: number;
    goals: number;
    ownGoals: number;
    goalsPerMatch: number;
    yellowCards: number;
    redCards: number;
    cleanSheets: number;
};

export type MatchDayCompetitionTeamsStatsOrderBy =
    | 'name'
    | 'played'
    | 'wins'
    | 'goalsFor'
    | 'goalsAgainst'
    | 'goalDifference'
    | 'cleanSheets'
    | 'yellowCards'
    | 'redCards'
    | 'points';

export type MatchDayCompetitionTeamsStatsQuery = MatchDayBaseListQuery &
    MatchDayStatsFilterQuery & {
        orderBy?: MatchDayCompetitionTeamsStatsOrderBy;
    };

export type MatchDayCompetitionTeamStatsRow = {
    team: MatchDayTeamRef;
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
    points: number | null;
};

export type MatchDayCompetitionTableQuery = {
    seasonId?: number;
};

export type MatchDayCompetitionTableRow = Omit<MatchDayCompetitionTeamStatsRow, 'points'> & {
    position: number;
    points: number;
};

export type MatchDayCompetitionTable = {
    season: MatchDaySeasonFull;
    items: MatchDayCompetitionTableRow[];
    totalItems: number;
};

/** Registered teams for a competition, shaped identically to {@link MatchDayTeam}. */
export type MatchDayCompetitionTeam = MatchDayTeam;
