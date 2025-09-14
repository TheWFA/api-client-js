import { MatchStatus } from './match';
import { PersonPartial } from './person';

export enum MatchEventType {
    Goal = 'goal',
    YellowCard = 'yellow_card',
    RedCard = 'red_card',
    Substitution = 'substitution',
}

export enum GoalType {
    Goal = 'goal',
    OwnGoal = 'own-goal',
}

export type BaseMatchEvent = {
    type: MatchEventType;
    createdAt: Date;
    time?: number | null;
    matchPeriod?: MatchStatus | null;
};

export type GoalMatchEvent = {
    player: PersonPartial;
    teamId: string;
    penalty: boolean;
    goaltype: GoalType;
};

export type CardMatchEvent = {
    player: PersonPartial;
    teamId: string;
};

export type SubstitutionMatchEvent = {
    playerOn: PersonPartial;
    playerOff: PersonPartial;
    teamId: string;
};

export type MatchEvent =
    | ({ type: MatchEventType.Goal } & BaseMatchEvent & GoalMatchEvent)
    | ({ type: MatchEventType.RedCard } & BaseMatchEvent & CardMatchEvent)
    | ({ type: MatchEventType.YellowCard } & BaseMatchEvent & CardMatchEvent)
    | ({ type: MatchEventType.Substitution } & BaseMatchEvent & SubstitutionMatchEvent);
