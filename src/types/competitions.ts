import { MatchDaySeasonPartial } from './season';
import { MatchDayTeamPartial } from './team';

export enum MatchDayCompetitionType {
    League = 'league',
    Cup = 'cup',
    Friendly = 'friendly',
}

export type MatchDayCompetitionPartial = {
    id: string;
    name: string;
    type: MatchDayCompetitionType;
    activeSeason: MatchDaySeasonPartial;
    logo?: string;
};

export type MatchDayCompetition = {
    seasons: MatchDaySeasonPartial[];
    activeSeasonId: string;
    history: { name: string | null; logo: string | null; created_at: Date }[];
} & Omit<MatchDayCompetitionPartial, 'activeSeason'>;

export type MatchDayCompetitionTableRow = {
    team: MatchDayTeamPartial;
    position: number;
    matchesPlayed: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
};
