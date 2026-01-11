import { MatchDayBaseListQuery } from './api';
import { MatchDayClubPartial } from './clubs';
import { MatchDayCompetitionPartial } from './competitions';
import { MatchDayPerson } from './person';

export type MatchDayTeamListQuery = MatchDayBaseListQuery & {
    season: string[];
    competition: string[];
};

export type MatchDayTeamPartial = {
    id: string;
    name: string;
    logo: string;
    abbreviated: string;
    nickname: string;
};

export type MatchDayTeamHistory = {
    id: string;
    name?: string;
    logo?: string;
    nickname?: string;
    abbreviated?: string;
    primary?: string;
    secondary?: string;
};

export type MatchDayTeam = MatchDayTeamPartial & {
    primary: string;
    secondary: string;
    parentClub?: MatchDayClubPartial;
    history: MatchDayTeam[];
};

export type MatchDayClubHistory = {
    name?: string;
    contactEmail?: string;
    clubLogo?: string;
    createdAt: Date;
};

export type MatchDayTeamPlayerRegistration = {
    player: MatchDayPerson;
    competition: MatchDayCompetitionPartial;
    registeredAt: Date;
    number: number;
};

export enum MatchDayTeamStaffRole {
    HeadCoach = 'head-coach',
    AssistantCoach = 'assistant-coach',
    Mechanic = 'mechanic',
    Assistant = 'assistant',
}

export type MatchDayTeamStaffRegistration = {
    person: MatchDayPerson;
    competition: MatchDayCompetitionPartial;
    registeredAt: Date;
    role: MatchDayTeamStaffRole | null;
};

export type TeamPlayersStatsQuery = MatchDayBaseListQuery & {
    from?: Date;
    to?: Date;
    season?: string[];
    competition?: string[];
    matchGroup?: string[];
    orderBy?:
        | 'name'
        | 'goals'
        | 'assists'
        | 'contributions'
        | 'yellowCards'
        | 'redCards'
        | 'appearances';
};

export type TeamStaffQuery = MatchDayBaseListQuery & {
    season?: string[];
    competition?: string[];
    role?: ('head-coach' | 'assistant-coach' | 'assistant' | 'mechanic')[];
};
