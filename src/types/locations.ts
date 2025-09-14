export type Court = {
    id: string;
    name: string;
    location: Location;
};

export type Location = {
    addressFirstLine: string;
    addressSecondLine?: string | null;
    postcode: string;
    county: string;
    country: string;
};
