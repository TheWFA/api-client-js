import { MatchDayTeamPartial } from './team';

export type MatchDayClubPartial = {
    id: string;
    name: string;
    logo?: string;
};

export type MatchDayClub = {
    contact_email: string;
    teams: MatchDayTeamPartial[];
} & MatchDayClubPartial;
