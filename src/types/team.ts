import { MatchDayCompetitionPartial } from './competitions';
import { MatchDayPersonPartial } from './person';

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

export type Team = MatchDayTeamPartial & {
    primary: string;
    secondary: string;
    parentClub?: MatchDayClubPartial;
};

export type MatchDayClubPartial = {
    id: string;
    name: string;
    logo: string;
};

export type MatchDayClubHistory = {
    name?: string;
    contactEmail?: string;
    clubLogo?: string;
    createdAt: Date;
};

export type Club = MatchDayClubPartial & {
    contactEmail: string;
    history: MatchDayClubHistory[];
};

export type TeamPlayerRegistration = {
    player: MatchDayPersonPartial;
    competition: MatchDayCompetitionPartial;
    registeredAt: Date;
    number: number;
};
