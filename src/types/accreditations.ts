import { MatchDayBaseListQuery } from './api';

export type MatchDayAccreditationListQuery = MatchDayBaseListQuery & {
    category?: string;
    issuingBody?: string;
};

export type MatchDayAccreditation = {
    id: string;
    name: string;
    description: string;
    category: string;
    issuingBody: string;
    validityPeriod: number | null;
    createdAt: Date;
};

export type MatchDayFullAccreditation = MatchDayAccreditation & {
    holderCount: number;
};

export type MatchDayAccreditationFacets = {
    categories: string[];
    issuingBodies: string[];
};
