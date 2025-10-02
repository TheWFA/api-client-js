import { MatchDayCompetitionPartial } from './competitions';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial } from './team';

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

export type MatchDayCoachRegistration = {
    team: MatchDayTeamPartial;
    competition: MatchDayCompetitionPartial;
    season: MatchDaySeasonPartial;
    registeredAt: Date;
};

export type MatchDayPerson = {
    playerRegistrations: MatchDayPlayerRegistration[];
    coachRegistrations: MatchDayCoachRegistration[];
} & MatchDayPersonPartial;
