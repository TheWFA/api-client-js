import { MatchDayBaseListQuery } from './api';
import {
    MatchDayCompetitionRef,
    MatchDayPersonRef,
    MatchDaySeasonRef,
    MatchDayTeamRef,
    OneOrMany,
} from './common';
import { MatchDayPlayerPosition } from './match';
import { MatchDayStatsFilterQuery } from './stats';

export enum MatchDayPersonType {
    Player = 'player',
    Staff = 'staff',
    Coach = 'coach',
    Official = 'official',
}

export type MatchDayPersonListQuery = MatchDayBaseListQuery & {
    type?: OneOrMany<MatchDayPersonType>;
    teamId?: number;
    competitionId?: number;
    seasonId?: number;
};

export type MatchDayPerson = MatchDayPersonRef;

export type MatchDayFullPerson = MatchDayPersonRef & {
    createdAt: Date;
    isPlayer: boolean;
    isStaff: boolean;
    isCoach: boolean;
    isOfficial: boolean;
};

export enum MatchDayPersonRegistrationType {
    Player = 'player',
    HeadCoach = 'head-coach',
    AssistantCoach = 'assistant-coach',
    Assistant = 'assistant',
    Mechanic = 'mechanic',
}

export type MatchDayPersonRegistrationsQuery = MatchDayBaseListQuery & {
    type?: OneOrMany<MatchDayPersonRegistrationType>;
    teamId?: number;
    competitionId?: number;
    seasonId?: number;
    activeOnly?: boolean | null;
};

export type MatchDayPersonRegistration = {
    type: string;
    number: number | null;
    registeredAt: Date;
    deregisteredAt: Date | null;
    deregisteredReason: string | null;
    team: MatchDayTeamRef;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
};

export type MatchDayPersonAppearancesQuery = MatchDayBaseListQuery & {
    teamId?: number;
    competitionId?: number;
    seasonId?: number;
    matchGroupId?: number;
    position?: OneOrMany<MatchDayPlayerPosition>;
    /** ISO date or datetime string. */
    scheduledFrom?: string;
    /** ISO date or datetime string. */
    scheduledTo?: string;
};

export type MatchDayPersonAppearanceMatchRef = {
    id: number;
    status: string;
    scheduledFor: Date | null;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
};

export type MatchDayPersonAppearanceMatchGroupRef = {
    id: number;
    name: string;
};

export type MatchDayPersonAppearance = {
    match: MatchDayPersonAppearanceMatchRef;
    team: MatchDayTeamRef;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
    matchGroup: MatchDayPersonAppearanceMatchGroupRef | null;
    squadPosition: string;
    captain: boolean;
    number: number | null;
};

export type MatchDayPersonStatsSummaryQuery = MatchDayStatsFilterQuery;

export type MatchDayPersonStatsSummary = {
    appearances: number;
    starts: number;
    goals: number;
    ownGoals: number;
    assists: number;
    penaltiesScored: number;
    yellowCards: number;
    redCards: number;
    contributions: number;
};

export type MatchDayPersonStatsQuery = MatchDayBaseListQuery & MatchDayStatsFilterQuery;

export type MatchDayPersonStatsMatchRef = {
    id: number;
    scheduledFor: Date | null;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
};

/** A single goal or assist contribution, returned by both the goals and assists endpoints. */
export type MatchDayPersonGoalContribution = {
    id: number;
    matchTime: number | null;
    matchPeriod: string | null;
    createdAt: Date;
    goalType: string;
    isPenalty: boolean;
    counterpart: MatchDayPersonRef | null;
    match: MatchDayPersonStatsMatchRef;
    team: MatchDayTeamRef;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
};

export type MatchDayCard = 'yellow' | 'red';

export type MatchDayPersonCardsQuery = MatchDayPersonStatsQuery & {
    card?: OneOrMany<MatchDayCard>;
};

export type MatchDayCardOffenceRef = {
    id: number;
    name: string;
    description: string | null;
    code: string | null;
    suspensionLength: number;
};

export type MatchDayPersonCard = {
    id: number;
    card: MatchDayCard;
    matchTime: number | null;
    matchPeriod: string | null;
    createdAt: Date;
    offence: MatchDayCardOffenceRef | null;
    match: MatchDayPersonStatsMatchRef;
    team: MatchDayTeamRef;
    competition: MatchDayCompetitionRef;
    season: MatchDaySeasonRef;
};
