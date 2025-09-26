import { Person } from './person';

export type UserPartial = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: Date;
};

export type User = {
    banned: boolean;
    role: string;
    permissions: Record<string, boolean>;
    persons: Person[];
} & UserPartial;
