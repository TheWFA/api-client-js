import { MatchDayLocationRef } from './common';

export type MatchDayLocation = MatchDayLocationRef;

export type MatchDayCourtRef = {
    id: number;
    locationId: number;
    name: string;
};

export type MatchDayLocationWithCourts = MatchDayLocation & {
    courts: MatchDayCourtRef[];
};
