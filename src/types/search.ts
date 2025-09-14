export enum SearchItemType {
    Team = 'team',
    Person = 'person',
    Competition = 'competition',
    Match = 'match',
}

export type SearchItem = {
    type: SearchItemType;
    id: string;
    label: string;
    description: string;
    image?: string | null;
    rank: string;
};
