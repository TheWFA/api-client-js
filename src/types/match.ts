import {
    MatchDayCompetitionRefWithOrganisation,
    MatchDayLocationRef,
    MatchDayPersonRef,
    MatchDaySeasonRef,
    MatchDayTeamRef,
} from './common';
import { MatchDayMatchEvent } from './match-events';

export enum MatchDayMatchStatus {
    Scheduled = 'scheduled',
    FirstHalf = 'first-half',
    HalfTime = 'half-time',
    SecondHalf = 'second-half',
    FirstHalfExtraTime = 'extra-time-first-half',
    HalfTimeExtraTime = 'half-time-extra-time',
    SecondHalfExtraTime = 'extra-time-second-half',
    Penalties = 'penalties',
    FullTime = 'full-time',
    Postponed = 'postponed',
    Abandoned = 'abandoned',
    Cancelled = 'cancelled',
    Forfeit = 'forfeit',
    Awarded = 'awarded',
}

export enum MatchDayPlayerPosition {
    Left = 'left',
    Right = 'right',
    Centre = 'centre',
    Goalkeeper = 'goalkeeper',
    Substitute = 'sub',
}

export type MatchDayMatchTimes = {
    firstHalfStartedAt: Date | null;
    secondHalfStartedAt: Date | null;
    firstHalfExtraTimeStartedAt: Date | null;
    secondHalfExtraTimeStartedAt: Date | null;
};

export type MatchDayMatchOfficials = {
    referee?: MatchDayPersonRef;
    assistant1?: MatchDayPersonRef;
    assistant2?: MatchDayPersonRef;
    fourthOfficial?: MatchDayPersonRef;
};

export type MatchDayMatchGroupRef = {
    id: number;
    competitionId: number;
    name: string;
};

export type MatchDayMatchCourt = {
    id: number;
    name: string;
    location: MatchDayLocationRef;
};

export type MatchDayMatchStream = {
    id: number;
    streamUrl: string | null;
    commentators: string | null;
};

export type MatchDayMatch = {
    id: number;
    status: MatchDayMatchStatus;
    scheduledFor: Date | null;
    times: MatchDayMatchTimes;
    hidden: boolean;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
    homeScore: number;
    awayScore: number;
    homeScorePenalty: number;
    awayScorePenalty: number;
    competition: MatchDayCompetitionRefWithOrganisation;
    season: MatchDaySeasonRef;
    court: MatchDayMatchCourt | null;
    matchGroup: MatchDayMatchGroupRef | null;
    officials: MatchDayMatchOfficials;
    streams: MatchDayMatchStream[];
};

export type MatchDayMatchPlayer = {
    person: MatchDayPersonRef;
    number: number | null;
    position: MatchDayPlayerPosition;
    captain: boolean;
};

export type MatchDayMatchPenalty = {
    sequence: number;
    teamId: number;
    scored: boolean | null;
    player: MatchDayPersonRef;
};

export type MatchDayFullMatch = MatchDayMatch & {
    homeLineups: MatchDayMatchPlayer[];
    awayLineups: MatchDayMatchPlayer[];
    events: MatchDayMatchEvent[];
    penalties: MatchDayMatchPenalty[];
};
