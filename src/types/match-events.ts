import { MatchDayMatchStatus } from './match';
import { MatchDayPerson } from './person';

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

export type MatchDayBaseMatchEvent = {
    type: MatchDayMatchEventType;
    createdAt: Date;
    time?: number | null;
    matchPeriod?: MatchDayMatchStatus | null;
};

export type MatchDayGoalMatchEvent = {
    player: MatchDayPerson;
    teamId: string;
    penalty: boolean;
    goaltype: MatchDayGoalType;
};

export type MatchDayCardMatchEvent = {
    player: MatchDayPerson;
    teamId: string;
};

export type MatchDaySubstitutionMatchEvent = {
    playerOn: MatchDayPerson;
    playerOff: MatchDayPerson;
    teamId: string;
};

export type MatchDayMatchEvent =
    | ({ type: MatchDayMatchEventType.Goal } & MatchDayBaseMatchEvent & MatchDayGoalMatchEvent)
    | ({ type: MatchDayMatchEventType.RedCard } & MatchDayBaseMatchEvent & MatchDayCardMatchEvent)
    | ({ type: MatchDayMatchEventType.YellowCard } & MatchDayBaseMatchEvent &
          MatchDayCardMatchEvent)
    | ({ type: MatchDayMatchEventType.Substitution } & MatchDayBaseMatchEvent &
          MatchDaySubstitutionMatchEvent);
