import { MatchDayHistoryEntry } from './common';

export type MatchDayClub = {
    id: number;
    name: string;
    clubLogo: string | null;
    contactEmail: string | null;
    createdAt: Date;
};

export type MatchDayClubTeamRef = {
    id: number;
    name: string;
    abbreviated: string;
    nickname: string;
    badgeUrl: string;
    primary: string;
    secondary: string;
};

export type MatchDayFullClub = MatchDayClub & {
    teams: MatchDayClubTeamRef[];
    history?: MatchDayHistoryEntry[];
};
