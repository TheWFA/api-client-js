import { MatchDayCompetitionPartial } from './competitions';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial, MatchDayTeamStaffRole } from './team';

export type MatchDayPersonPartial = {
    id: string;
    firstName: string;
    lastName: string;
    knownAs: string;
};

export type MatchDayPlayerRegistration = {
    team: MatchDayTeamPartial;
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    registeredAt: Date;
    number: number;
};

export type MatchDayPersonStaffRegistration = {
    team: MatchDayTeamPartial;
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    role: MatchDayTeamStaffRole;
    registeredAt: Date;
};

export type MatchDayPerson = {
    playerRegistrations: MatchDayPlayerRegistration[];
    staffRegistrations: MatchDayPersonStaffRegistration[];
} & MatchDayPersonPartial;
