export type MatchDayKitType = {
    id: string;
    label: string;
};

export type MatchDayTeamKit = {
    id: number;
    teamId: number;
    kitType: MatchDayKitType | null;
    isGoalkeeper: boolean;
    imageUrl: string;
    textColour: string | null;
};
