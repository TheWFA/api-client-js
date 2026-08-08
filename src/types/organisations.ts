import { MatchDayHistoryEntry } from './common';
import { MatchDayCompetition } from './competitions';

export type MatchDayOrganisation = {
    id: number;
    name: string;
    shortName: string | null;
    badgeUrl: string | null;
    sortOrder: number;
    createdAt: Date;
};

export type MatchDayFullOrganisation = MatchDayOrganisation & {
    competitions: MatchDayCompetition[];
    history?: MatchDayHistoryEntry[];
};
