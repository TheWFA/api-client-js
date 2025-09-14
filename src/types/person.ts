import { CompetitionPartial } from './competitions';
import { SeasonPartial } from './season';
import { TeamPartial } from './team';

export type PersonPartial = {
    id: string;
    firstName: string;
    lastName: string;
    knownAs: string;
};

export type PlayerRegistration = {
    team: TeamPartial;
    competition: CompetitionPartial;
    season: SeasonPartial;
    registeredAt: Date;
    number: number;
};

export type CoachRegistration = {
    team: TeamPartial;
    competition: CompetitionPartial;
    season: SeasonPartial;
    registeredAt: Date;
};

export type Person = {
    playerRegistrations: PlayerRegistration[];
    coachRegistrations: CoachRegistration[];
} & PersonPartial;
