export type MatchDayOAuth2Scope = {
    id: string;
    name: string;
    description: string;
};

export type MatchDayOAuth2ScopeId = keyof typeof MatchDayScopes;

export const MatchDayScopes = {
    email: {
        id: 'email',
        name: 'Read your name and email',
        description: 'Access to your name, email, and profile picture',
    },
    player: {
        id: 'player',
        name: 'Read your player associations',
        description: 'Access to who you play for and your previous teams',
    },
    staff: {
        id: 'staff',
        name: 'Read your team staff associations',
        description: 'Access to who you coach, manage or assist and any previous teams',
    },
} as const satisfies Record<string, MatchDayOAuth2Scope>;
