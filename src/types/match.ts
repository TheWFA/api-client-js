import { MatchDayCourt } from './locations';
import { MatchDayMatchEvent } from './match-events';
import { MatchDayPersonPartial } from './person';
import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial } from './team';

export enum MatchDayMatchStatus {
    Scheduled = 'scheduled',
    FirstHalf = 'first-half',
    HalfTime = 'half-time',
    SecondHalf = 'second-half',
    FullTime = 'full-time',
    Complete = 'completed',
    Postponed = 'postponed',
    Abandoned = 'abandoned',
    FirstHalfExtraTime = 'extra-time-first-half',
    HalfTimeExtraTime = 'half-time-extra-time',
    SecondHalfExtraTime = 'extra-time-second-half',
    Penalties = 'penalty-shootout',
}

export enum MatchDayMatchType {
    League = 'league',
    Knockout = 'knockout',
}

export type MatchDayMatchTimes = {
    firstHalfStartedAt: Date;
    secondHalfStartedAt: Date;
    firstHalfExtraTimeStartedAt: Date;
    secondHalfExtraTimeStartedAt: Date;
};

export type MatchDayMatchOfficials = {
    referee?: MatchDayPersonPartial;
    assistant1?: MatchDayPersonPartial;
    assistant2?: MatchDayPersonPartial;
    fourthOfficial?: MatchDayPersonPartial;
};

export type MatchDayMatchGroup = {
    id: string;
    competition: string;
    name: string;
};

export type MatchDayMatch = {
    id: string;
    homeTeam: MatchDayTeamPartial;
    awayTeam: MatchDayTeamPartial;
    homeScore: number;
    awayScore: number;
    homeScorePenalty: number;
    awayScorePenalty: number;
    status: MatchDayMatchStatus;
    scheduledFor: Date;
    times: MatchDayMatchTimes;
    competition: {
        id: string;
        name: string;
        logo?: string;
    };
    season: MatchDaySeasonPartial;
    court?: MatchDayCourt;
    group?: MatchDayMatchGroup;
    officials: MatchDayMatchOfficials;
    streamLink?: string;
};

export enum MatchDayPlayerPostition {
    Left = 'left',
    Right = 'right',
    Centre = 'centre',
    Goalkeeper = 'goalkeeper',
    Substitute = 'sub',
}

export type MatchDayMatchPlayer = {
    person: MatchDayPersonPartial;
    number: number;
    position: MatchDayPlayerPostition | null;
    captain: boolean;
};

export type MatchDayFullMatch = {
    details: MatchDayMatch;
    homeLineups: MatchDayMatchPlayer[];
    awayLineups: MatchDayMatchPlayer[];
    events: MatchDayMatchEvent[];
};
