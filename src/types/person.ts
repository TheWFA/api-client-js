import { MatchDayBaseListQuery } from './api';
import { MatchDayCompetitionPartial } from './competitions';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial, MatchDayTeamStaffRole } from './team';

export enum MatchDayPersonType {
    Player = 'player',
    Coach = 'coach',
    Staff = 'staff',
    Referee = 'referee',
    Official = 'official',
}

export type MatchDayPersonQuery = MatchDayBaseListQuery & {
    type: MatchDayPersonType[];
};

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

export type MatchDayPersonRegistrations = {
    playerRegistrations: MatchDayPlayerRegistration[];
    staffRegistrations: MatchDayPersonStaffRegistration[];
};

export type MatchDayPerson = MatchDayPersonRegistrations & MatchDayPersonPartial;
