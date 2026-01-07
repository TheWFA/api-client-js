import { MatchDayClubPartial } from './clubs';
import { MatchDayCompetitionPartial } from './competitions';
import { MatchDayPerson } from './person';

export type MatchDayTeamPartial = {
    id: string;
    name: string;
    logo: string;
    nickname: string;
};

export type MatchDayTeamHistory = {
    name?: string;
    logo?: string;
    nickname?: string;
    abbreviation?: string;
    primary?: string;
    secondary?: string;
};

export type MatchDayTeam = MatchDayTeamPartial & {
    primary: string;
    secondary: string;
    parentClub?: MatchDayClubPartial;
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
