import { MatchDayCompetitionMiniRef, MatchDayPersonRef, MatchDayTeamRef } from './common';
import { MatchDayMatchStatus } from './match';
import { MatchDayGoalType, MatchDayMatchEventPeriod, MatchDayMatchEventType } from './match-events';

export enum MatchDayWebhookEventType {
    MatchStatusChanged = 'MatchStatusChanged',
    GoalScored = 'GoalScored',
    CardIssued = 'CardIssued',
    SubstitutionMade = 'SubstitutionMade',
    PenaltyShootoutAttempt = 'PenaltyShootoutAttempt',
    MatchScoreCorrected = 'MatchScoreCorrected',
    Ping = 'WebhookPing',
}

export type MatchDayWebhookCardType =
    MatchDayMatchEventType.YellowCard | MatchDayMatchEventType.RedCard;

/** A resolved reference that falls back to its bare id (as a string) if the lookup failed — e.g. the record was deleted, or raced the write that triggered the event. */
export type MatchDayWebhookResolved<T> = T | string;

export type MatchDayWebhookTeamRef = MatchDayWebhookResolved<MatchDayTeamRef>;

export type MatchDayWebhookPlayerRef = MatchDayWebhookResolved<MatchDayPersonRef>;

export type MatchDayWebhookMatchScore = {
    home: number;
    away: number;
    homePenalty: number;
    awayPenalty: number;
};

export type MatchDayWebhookMatch = {
    id: number;
    status: MatchDayMatchStatus;
    scheduledFor: Date | null;
    competition: MatchDayCompetitionMiniRef;
    homeTeam: MatchDayTeamRef;
    awayTeam: MatchDayTeamRef;
    /** Reflects the state after this event — e.g. a goal's payload shows the tally including that goal. */
    score: MatchDayWebhookMatchScore;
};

export type MatchDayWebhookMatchRef = MatchDayWebhookResolved<MatchDayWebhookMatch>;

export type MatchDayMatchStatusChangedWebhookEvent = {
    detailType: MatchDayWebhookEventType.MatchStatusChanged;
    match: MatchDayWebhookMatchRef;
    previousStatus: MatchDayMatchStatus;
    newStatus: MatchDayMatchStatus;
    occurredAt: Date;
};

export type MatchDayGoalScoredWebhookEvent = {
    detailType: MatchDayWebhookEventType.GoalScored;
    match: MatchDayWebhookMatchRef;
    team: MatchDayWebhookTeamRef;
    scorer: MatchDayWebhookPlayerRef | null;
    assister: MatchDayWebhookPlayerRef | null;
    goalType: MatchDayGoalType;
    isPenalty: boolean;
    matchPeriod: MatchDayMatchEventPeriod | null;
    matchTime: number | null;
    occurredAt: Date;
};

export type MatchDayCardIssuedWebhookEvent = {
    detailType: MatchDayWebhookEventType.CardIssued;
    match: MatchDayWebhookMatchRef;
    team: MatchDayWebhookTeamRef;
    player: MatchDayWebhookPlayerRef;
    cardType: MatchDayWebhookCardType;
    matchPeriod: MatchDayMatchEventPeriod | null;
    matchTime: number | null;
    occurredAt: Date;
};

export type MatchDaySubstitutionMadeWebhookEvent = {
    detailType: MatchDayWebhookEventType.SubstitutionMade;
    match: MatchDayWebhookMatchRef;
    team: MatchDayWebhookTeamRef;
    playerOn: MatchDayWebhookPlayerRef;
    playerOff: MatchDayWebhookPlayerRef;
    matchPeriod: MatchDayMatchEventPeriod | null;
    matchTime: number | null;
    occurredAt: Date;
};

export type MatchDayPenaltyShootoutAttemptWebhookEvent = {
    detailType: MatchDayWebhookEventType.PenaltyShootoutAttempt;
    match: MatchDayWebhookMatchRef;
    team: MatchDayWebhookTeamRef;
    player: MatchDayWebhookPlayerRef;
    sequence: number;
    scored: boolean | null;
    occurredAt: Date;
};

/** Fires only when editing/deleting an existing goal or shootout attempt changes the computed score — never alongside the event that produced the score in the first place. */
export type MatchDayMatchScoreCorrectedWebhookEvent = {
    detailType: MatchDayWebhookEventType.MatchScoreCorrected;
    match: MatchDayWebhookMatchRef;
    occurredAt: Date;
};

/** Synthetic verification event — never bus-published, but delivered through the same signing/HTTP path as real events. */
export type MatchDayWebhookPingEvent = {
    detailType: MatchDayWebhookEventType.Ping;
    occurredAt: Date;
};

export type MatchDayWebhookEvent =
    | MatchDayMatchStatusChangedWebhookEvent
    | MatchDayGoalScoredWebhookEvent
    | MatchDayCardIssuedWebhookEvent
    | MatchDaySubstitutionMadeWebhookEvent
    | MatchDayPenaltyShootoutAttemptWebhookEvent
    | MatchDayMatchScoreCorrectedWebhookEvent
    | MatchDayWebhookPingEvent;
