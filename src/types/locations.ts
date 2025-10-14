export type MatchDayCourtPartial = {
    id: string;
    name: string;
};

export type MatchDayCourt = MatchDayCourtPartial & {
    location: MatchDayLocation;
};

export type MatchDayLocation = {
    id: string;
    name: string;
    addressFirstLine: string;
    addressSecondLine?: string | null;
    postcode: string;
    county: string;
    country: string;
};

export type MatchDayLocationWithCourts = MatchDayLocation & {
    courts: MatchDayCourtPartial[];
};
