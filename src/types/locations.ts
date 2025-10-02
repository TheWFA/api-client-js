export type MatchDayCourt = {
    id: string;
    name: string;
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
