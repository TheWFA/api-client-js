import { MatchDayPersonRef } from './common';

export enum MatchDayMatchEventType {
    Goal = 'goal',
    YellowCard = 'yellow_card',
    RedCard = 'red_card',
    Substitution = 'substitution',
}

export enum MatchDayGoalType {
    Goal = 'goal',
    OwnGoal = 'own-goal',
}

export enum MatchDayMatchEventPeriod {
    FirstHalf = 'first-half',
    SecondHalf = 'second-half',
    ExtraTime = 'extra-time',
    ExtraTimeFirstHalf = 'extra-time-first-half',
    ExtraTimeSecondHalf = 'extra-time-second-half',
    Penalties = 'penalties',
}

export type MatchDayBaseMatchEvent = {
    createdAt: Date;
    time: number | null;
    matchPeriod: MatchDayMatchEventPeriod | null;
    teamId: number;
};

export type MatchDayGoalMatchEvent = MatchDayBaseMatchEvent & {
    type: MatchDayMatchEventType.Goal;
    player: MatchDayPersonRef;
    penalty: boolean;
    goalType: MatchDayGoalType;
};

export type MatchDayCardMatchEvent = MatchDayBaseMatchEvent & {
    type: MatchDayMatchEventType.YellowCard | MatchDayMatchEventType.RedCard;
    player: MatchDayPersonRef;
};

export type MatchDaySubstitutionMatchEvent = MatchDayBaseMatchEvent & {
    type: MatchDayMatchEventType.Substitution;
    playerOn: MatchDayPersonRef;
    playerOff: MatchDayPersonRef;
};

export type MatchDayMatchEvent =
    | MatchDayGoalMatchEvent
    | MatchDayCardMatchEvent
    | MatchDaySubstitutionMatchEvent;
