export type MatchDayOAuth2ScopeDescription = {
    name: string;
    description: string;
    hidden: boolean;
};

export type MatchDayOAuth2Scope = keyof typeof MatchDayScopes;

export const MatchDayScopes = {
    openid: {
        name: 'OpenID',
        description: 'Verify your identity and sign you in',
        hidden: true,
    },
    profile: {
        name: 'Basic profile',
        description: 'Access to your basic profile details like your display name and avatar',
        hidden: false,
    },
    email: {
        name: 'Email address',
        description: 'Access to your email address and confirmation status',
        hidden: false,
    },
    offline_access: {
        name: 'Stay signed in',
        description: 'Allow the app to stay signed in without requiring you to log in again',
        hidden: true,
    },
    person_read: {
        name: 'Person profile',
        description:
            'Access to your person details such as your full name, associated player data and/or associated team staff.',
        hidden: false,
    },
} as const satisfies Record<string, MatchDayOAuth2ScopeDescription>;
