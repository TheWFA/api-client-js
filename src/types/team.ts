import { MatchDayBaseListQuery } from './api';
import {
    MatchDayClubRef,
    MatchDayCompetitionRef,
    MatchDayHistoryEntry,
    MatchDayPersonRef,
    MatchDaySeasonRef,
    OneOrMany,
} from './common';
import { MatchDayStatsFilterQuery } from './stats';

export type MatchDayTeamListQuery = MatchDayBaseListQuery & {
    clubId?: number;
};

export type MatchDayTeam = {
    id: number;
    name: string;
    abbreviated: string;
    nickname: string;
    badgeUrl: string;
    gradientUrl: string | null;
    thumbnailImage: string | null;
    primary: string;
    secondary: string;
    club: MatchDayClubRef | null;
};

export type MatchDayFullTeam = MatchDayTeam & {
    history?: MatchDayHistoryEntry[];
};

export type MatchDayActiveOnlyFilter = 'true' | 'false';

export type MatchDayTeamPlayersQuery = MatchDayBaseListQuery & {
    competitionId?: number;
    seasonId?: number;
    activeOnly?: MatchDayActiveOnlyFilter;
};

export type MatchDayTeamPlayerRegistration = {
    person: MatchDayPersonRef;
    number: number | null;
    registeredAt: Date;
    deregisteredAt: Date | null;
    deregisteredReason: string | null;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
};

export enum MatchDayTeamStaffRole {
    HeadCoach = 'head-coach',
    AssistantCoach = 'assistant-coach',
    Mechanic = 'mechanic',
    Assistant = 'assistant',
}

export type MatchDayTeamStaffQuery = MatchDayBaseListQuery & {
    competitionId?: number;
    seasonId?: number;
    activeOnly?: MatchDayActiveOnlyFilter;
    role?: OneOrMany<MatchDayTeamStaffRole>;
};

export type MatchDayTeamStaffRegistration = {
    person: MatchDayPersonRef;
    role: MatchDayTeamStaffRole | null;
    registeredAt: Date;
    deregisteredAt: Date | null;
    deregisteredReason: string | null;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
};

export type MatchDayTeamRegistrationsQuery = MatchDayBaseListQuery & {
    competitionId?: number;
    seasonId?: number;
};

export type MatchDayTeamRegistration = {
    registeredAt: Date;
    competition: MatchDayCompetitionRef & { type: string };
    season: MatchDaySeasonRef;
};

export type MatchDayTeamStatsSummaryQuery = MatchDayStatsFilterQuery;

export type MatchDayTeamStatsSummary = {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    playersUsed: number;
};
