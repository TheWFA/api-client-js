import { MatchDayTeamPartial } from './team';

export type MatchDayClubPartial = {
    id: string;
    name: string;
    logo: string | null;
};

export type MatchDayClub = {
    contactEmail: string | null;
    teams: MatchDayTeamPartial[];
} & MatchDayClubPartial;
