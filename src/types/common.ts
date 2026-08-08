/** Filters accepting either a single value or a list of values, serialized as repeated query params. */
export type OneOrMany<T> = T | T[];

export type MatchDayTeamRef = {
    id: number;
    name: string;
    nickname: string;
    badgeUrl: string;
};

/** The smaller team reference used inside suspension `servedIn` entries. */
export type MatchDayTeamMiniRef = {
    id: number;
    name: string;
};

export type MatchDayClubRef = {
    id: number;
    name: string;
    clubLogo: string | null;
};

export type MatchDayOrganisationRef = {
    id: number;
    name: string;
    shortName: string | null;
    badgeUrl: string | null;
};

export type MatchDayCompetitionRef = {
    id: number;
    name: string;
    badgeUrl: string | null;
};

export type MatchDayCompetitionRefWithOrganisation = MatchDayCompetitionRef & {
    organisation: MatchDayOrganisationRef | null;
};

/** The smaller competition reference used inside suspension and tie entries. */
export type MatchDayCompetitionMiniRef = {
    id: number;
    name: string;
};

export type MatchDaySeasonRef = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
};

/** The smaller season reference used inside suspension and tie entries. */
export type MatchDaySeasonMiniRef = {
    id: number;
    name: string;
};

export type MatchDaySeasonWithActive = MatchDaySeasonRef & {
    active: boolean;
};

export enum MatchDaySeasonZoneKind {
    Promotion = 'promotion',
    Playoff = 'playoff',
    Relegation = 'relegation',
}

export type MatchDaySeasonZone = {
    id: string;
    label: string;
    kind: MatchDaySeasonZoneKind;
    fromPosition: number;
    toPosition: number;
    color: string;
};

export type MatchDaySeasonPoints = {
    win: number;
    draw: number;
    loss: number;
};

export type MatchDaySeasonSetup = {
    classCheck: boolean;
    yellowCardLimit: number;
    points?: MatchDaySeasonPoints;
    zones?: MatchDaySeasonZone[];
};

export type MatchDaySeasonFull = MatchDaySeasonWithActive & {
    seasonSetup: MatchDaySeasonSetup;
};

export type MatchDayPersonRef = {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
};

export type MatchDayLocationRef = {
    id: number;
    name: string;
    addressFirstLine: string;
    addressSecondLine: string | null;
    postcode: string;
    county: string;
    country: string;
};

export enum MatchDayHistoryEntity {
    Team = 'team',
    Club = 'club',
    Competition = 'competition',
    Organisation = 'organisation',
}

export type MatchDayHistoryEntry = {
    id: number;
    entity: MatchDayHistoryEntity;
    entityId: number;
    values: Record<string, unknown>;
    validFrom: Date | null;
    validTo: Date | null;
    createdAt: Date;
};
