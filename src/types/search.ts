import { MatchDayBaseListQuery } from './api';
import { OneOrMany } from './common';

export enum MatchDaySearchItemType {
    Person = 'person',
    Team = 'team',
    Club = 'club',
    Competition = 'competition',
    Organisation = 'organisation',
    Match = 'match',
}

export type MatchDaySearchQuery = Omit<MatchDayBaseListQuery, 'query'> & {
    query: string;
    type?: OneOrMany<MatchDaySearchItemType>;
};

export type MatchDaySearchItem = {
    type: MatchDaySearchItemType;
    id: string;
    label: string;
    description: string | null;
    imageUrl: string | null;
    score: number;
};
