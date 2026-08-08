import { MatchDayBaseListQuery } from './api';
import {
    MatchDayCompetitionMiniRef,
    MatchDayPersonRef,
    MatchDaySeasonMiniRef,
    MatchDayTeamMiniRef,
    OneOrMany,
} from './common';

export enum MatchDaySuspensionStatus {
    Active = 'active',
    Served = 'served',
    Appealed = 'appealed',
    Overturned = 'overturned',
}

export type MatchDayActiveOnlyStringFilter = 'true' | 'false';

export type MatchDaySuspensionOffenceRef = {
    id: number;
    name: string;
    suspensionLength: number;
};

export type MatchDaySuspensionOrigin = {
    disciplineId: number;
    card: string;
    offence: MatchDaySuspensionOffenceRef | null;
};

export type MatchDaySuspensionServedInMatch = {
    id: number;
    scheduledFor: Date | null;
    status: string;
    homeTeam: MatchDayTeamMiniRef;
    awayTeam: MatchDayTeamMiniRef;
};

export type MatchDaySuspension = {
    id: number;
    person: MatchDayPersonRef;
    competition: MatchDayCompetitionMiniRef;
    season: MatchDaySeasonMiniRef;
    origin: MatchDaySuspensionOrigin | null;
    matchesTotal: number;
    matchesServed: number;
    matchesRemaining: number;
    status: MatchDaySuspensionStatus;
    createdAt: Date;
    servedIn: MatchDaySuspensionServedInMatch[];
};

export type MatchDaySuspensionListQuery = MatchDayBaseListQuery & {
    personId?: number;
    competitionId?: number;
    seasonId?: number;
    servedInMatchId?: number;
    originMatchId?: number;
    status?: OneOrMany<MatchDaySuspensionStatus>;
    activeOnly?: MatchDayActiveOnlyStringFilter;
};

export type MatchDayPersonSuspensionsQuery = Omit<MatchDaySuspensionListQuery, 'personId'>;
