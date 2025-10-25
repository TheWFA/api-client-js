import { CompetitionsResource } from './resources/competitions';
import { TeamsResource } from './resources/teams';
import { PersonsResource } from './resources/persons';
import { SeasonsResource } from './resources/seasons';
import { SearchResource } from './resources/search';
import { httpResponseToAPIError } from './errors';
import { MatchResource } from './resources/matches';
import { parseDates } from './time';
import { MatchDayAPIError } from './types/errors';
import { UsersResource } from './resources/users';
import { LocationsResource } from './resources/locations';

export enum MatchDayAPIVersion {
    V1 = '/v1',
    DEFAULT = '',
}

export type APIClientConfig = {
    baseURL?: string;
    apiKey?: string;
    accessToken?: string;
    version?: MatchDayAPIVersion;
};

const defaultConfig: APIClientConfig = {
    baseURL: 'https://api.thewfa.org.uk',
    version: MatchDayAPIVersion.V1,
};

export class MatchDayClient {
    private config: APIClientConfig;

    public readonly matches = new MatchResource(this);
    public readonly competitions = new CompetitionsResource(this);
    public readonly teams = new TeamsResource(this);
    public readonly seasons = new SeasonsResource(this);
    public readonly persons = new PersonsResource(this);
    public readonly search = new SearchResource(this);
    public readonly users = new UsersResource(this);
    public readonly locations = new LocationsResource(this);

    constructor(config: APIClientConfig) {
        this.config = {
            ...defaultConfig,
            ...config,
        };
    }

    setAccessToken(token: string) {
        this.config.accessToken = token;
    }

    async makeRequest<T>(path: string, init?: RequestInit): Promise<T> {
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (!this.config.accessToken && !this.config.apiKey) {
            throw new MatchDayAPIError('No authentication method set');
        }

        if (this.config.apiKey) {
            defaultHeaders['Authorization'] = `ApiKey ${this.config.apiKey}`;
        }

        if (this.config.accessToken) {
            defaultHeaders['Authorization'] = `Bearer ${this.config.accessToken}`;
        }

        const res = await fetch(
            this.config.baseURL + (this.config.version ?? defaultConfig.version!) + path,
            {
                ...init,
                headers: {
                    ...defaultHeaders,
                    ...(init?.headers || {}),
                },
            },
        );

        if (res.status === 204) {
            return {} as T;
        }

        const error = await httpResponseToAPIError(res);

        if (error) {
            throw error;
        }

        const body = parseDates(await res.json()) as T;

        return body;
    }
}
