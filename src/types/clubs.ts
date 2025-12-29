import { MatchDayTeamPartial } from './team';

export type MatchDayClubPartial = {
    id: string;
    name: string;
    logo?: string;
};

export type MatchDayClub = {
    contactEmail?: string;
    teams: MatchDayTeamPartial[];
} & MatchDayClubPartial;
