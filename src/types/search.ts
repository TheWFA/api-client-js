export enum MatchDaySearchItemType {
    Team = 'team',
    Person = 'person',
    Competition = 'competition',
    Match = 'match',
}

export type MatchDaySearchItem = {
    type: MatchDaySearchItemType;
    id: string;
    label: string;
    description: string;
    image?: string | null;
    rank: string;
};
