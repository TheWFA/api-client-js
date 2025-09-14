import { CompetitionPartial } from './competitions';
import { PersonPartial } from './person';

export type TeamPartial = {
    id: string;
    name: string;
    logo: string;
    nickname: string;
};

export type TeamHistory = {
    name?: string;
    logo?: string;
    nickname?: string;
    abbreviation?: string;
    primary?: string;
    secondary?: string;
};

export type Team = TeamPartial & {
    primary: string;
    secondary: string;
    parentClub?: ClubPartial;
};

export type ClubPartial = {
    id: string;
    name: string;
    logo: string;
};

export type ClubHistory = {
    name?: string;
    contactEmail?: string;
    clubLogo?: string;
    createdAt: Date;
};

export type Club = ClubPartial & {
    contactEmail: string;
    history: ClubHistory[];
};

export type TeamPlayerRegistration = {
    player: PersonPartial;
    competition: CompetitionPartial;
    registeredAt: Date;
    number: number;
};
