import { SeasonPartial } from './season';
import { TeamPartial } from './team';

export enum CompetitionType {
    League = 'league',
    Cup = 'cup',
    Friendly = 'friendly',
}

export type CompetitionPartial = {
    id: string;
    name: string;
    type: CompetitionType;
    activeSeason: SeasonPartial;
    logo?: string;
};

export type Competition = {
    seasons: SeasonPartial[];
    activeSeasonId: string;
    previousNames: { name: string; created_at: Date };
} & Omit<CompetitionPartial, 'activeSeason'>;

export type CompetitionTableRow = {
    team: TeamPartial;
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
