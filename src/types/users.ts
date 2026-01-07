import { MatchDayPerson } from './person';

export type MatchDayUserProfile = {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
};

export type MatchDayUser = {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
    email?: string;
    persons?: MatchDayPerson[];
};
