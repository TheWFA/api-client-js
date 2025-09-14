import { Court } from './locations';
import { MatchEvent } from './match-events';
import { PersonPartial } from './person';
import { SeasonPartial } from './season';
import { TeamPartial } from './team';

export enum MatchStatus {
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

export enum MatchType {
    League = 'league',
    Knockout = 'knockout',
}

export type MatchTimes = {
    firstHalfStartedAt: Date;
    secondHalfStartedAt: Date;
    firstHalfExtraTimeStartedAt: Date;
    secondHalfExtraTimeStartedAt: Date;
};

export type MatchOfficials = {
    referee?: PersonPartial;
    assistant1?: PersonPartial;
    assistant2?: PersonPartial;
    fourthOfficial?: PersonPartial;
};

export type MatchGroup = {
    id: string;
    competition: string;
    name: string;
};

export type Match = {
    id: string;
    homeTeam: TeamPartial;
    awayTeam: TeamPartial;
    homeScore: number;
    awayScore: number;
    homeScorePenalty: number;
    awayScorePenalty: number;
    status: MatchStatus;
    scheduledFor: Date;
    times: MatchTimes;
    competition: {
        id: string;
        name: string;
        logo?: string;
    };
    season: SeasonPartial;
    court?: Court;
    group?: MatchGroup;
    officials: MatchOfficials;
    streamLink?: string;
};

export enum PlayerPostition {
    Left = 'left',
    Right = 'right',
    Centre = 'centre',
    Goalkeeper = 'goalkeeper',
    Substitute = 'sub',
}

export type MatchPlayer = {
    person: PersonPartial;
    number: number;
    position: PlayerPostition | null;
    captain: boolean;
};

export type FullMatch = {
    details: Match;
    homeLineups: MatchPlayer[];
    awayLineups: MatchPlayer[];
    events: MatchEvent[];
};
