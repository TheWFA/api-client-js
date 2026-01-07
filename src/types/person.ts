import { MatchDayBaseListQuery } from './api';
import { MatchDayCompetitionPartial } from './competitions';
import { MatchDayPlayerPostition } from './match';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial } from './team';

export enum MatchDayPersonType {
    Player = 'player',
    Coach = 'coach',
    Staff = 'staff',
    Referee = 'referee',
    Official = 'official',
}

export enum MatchDayPersonRegistrationType {
    Player = 'player',
    HeadCoach = 'head-coach',
    AssistantCoach = 'assistant-coach',
    Assistant = 'assistant',
    Mechanic = 'mechanic',
}

export type MatchDayPersonQuery = MatchDayBaseListQuery & {
    type?: MatchDayPersonType[];
};

export type MatchDayPersonRegistrationQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    season?: string[];
    competition?: string[];
    type?: MatchDayPersonRegistrationType[];
};

export type MatchDayPersonAppearancesQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    matchGroup?: string[];
    position?: ('sub' | 'centre' | 'left' | 'right' | 'goalkeeper')[];
    season?: string[];
    competition?: string[];
    team?: string[];
};

export type MatchDayPersonStatsSummaryQuery = MatchDayBaseListQuery & {
    season?: string[];
    competition?: string[];
    team?: string[];
};

export type MatchDayPlayerStatsQuery = MatchDayBaseListQuery & {
    date?: {
        lt?: Date;
        gt?: Date;
    }[];

    season?: string[];
    team?: string[];
    competition?: string[];
};

export type MatchDayPlayerCardsQuery = MatchDayPlayerStatsQuery & {
    cardType?: ('yellow' | 'red')[];
};

export type MatchDayPerson = {
    id: string;
    firstName: string;
    lastName: string;
    knownAs: string;
};

export type MatchDayPersonRegistration = {
    type: MatchDayPersonRegistrationType;
    registeredAt: Date;
    deregisteredAt: null | Date;
    deregisteredReason: null | 'deregistration' | 'transferred' | 'other';
    number: null | number;
    team: MatchDayTeamPartial;
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
};

export type MatchDayPersonStatsSummary = {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    appearances: number;
    starts: number;
};

export type MatchDayPersonStatsGoal = {
    id: string;
    matchTime: number | null;
    matchPeriod: null | number;
    goalType: 'goal' | 'own_goal';
    isPenalty: boolean;
    createdAt: Date;
    match: {
        id: string;
        awayTeam: MatchDayTeamPartial;
        homeTeam: MatchDayTeamPartial;
        scheduledFor: Date;
    };
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    team: MatchDayTeamPartial;
    assister: MatchDayPerson;
};

export type MatchDayPersonStatsAssist = {
    id: string;
    matchTime: number | null;
    matchPeriod: null | number;
    goalType: 'goal' | 'own_goal';
    isPenalty: boolean;
    createdAt: Date;
    match: {
        id: string;
        awayTeam: MatchDayTeamPartial;
        homeTeam: MatchDayTeamPartial;
        scheduledFor: Date;
    };
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    team: MatchDayTeamPartial;
    scorer: MatchDayPerson;
};

export type MatchDayPersonStatsCard = {
    id: string;
    matchTime: number | null;
    matchPeriod: null | number;
    card: 'yellow' | 'red';
    createdAt: Date;
    offence: {
        id: string;
        code: string;
        name: string;
        description: string;
        suspensionLength: number;
    };
    match: {
        id: string;
        awayTeam: MatchDayTeamPartial;
        homeTeam: MatchDayTeamPartial;
        scheduledFor: Date;
    };
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    team: MatchDayTeamPartial;
};

export type MatchDayPersonAppearance = {
    squadPosition: MatchDayPlayerPostition;
    captain: boolean;
    match: {
        id: string;
        awayTeam: MatchDayTeamPartial;
        homeTeam: MatchDayTeamPartial;
        scheduledFor: Date;
    };
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    team: MatchDayTeamPartial;
    matchGroup: { id: string; groupName: string };
};
