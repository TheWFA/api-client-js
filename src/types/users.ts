import { MatchDayPerson } from './person';

export type MatchDayUserPartial = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: Date;
};

export type MatchDayUser = {
    banned: boolean;
    role: string;
    permissions: Record<string, boolean>;
    persons: MatchDayPerson[];
} & MatchDayUserPartial;
