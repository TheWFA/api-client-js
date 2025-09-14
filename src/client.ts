import { CompetitionsResource } from './resources/competitions';
import { TeamsResource } from './resources/teams';
import { PersonsResource } from './resources/persons';
import { SeasonsResource } from './resources/seasons';
import { SearchResource } from './resources/search';
import { httpResponseToAPIError } from './errors';
import { MatchResource } from './resources/matches';
import { parseDates } from './time';

export type APIClientConfig = {
    token: string;
    baseURL: string;
};

const defaultConfig: APIClientConfig = {
    token: '',
    baseURL: 'https://api.thewfa.org.uk',
};

export class WFAAPIClient {
    private config: APIClientConfig;

    public readonly matches = new MatchResource(this);
    public readonly competitions = new CompetitionsResource(this);
    public readonly teams = new TeamsResource(this);
    public readonly seasons = new SeasonsResource(this);
    public readonly persons = new PersonsResource(this);
    public readonly search = new SearchResource(this);

    constructor(config: Partial<APIClientConfig> & Pick<APIClientConfig, 'token'>) {
        this.config = {
            ...defaultConfig,
            ...config,
        };

        if (!config.token || config.token.length < 10) {
            throw new Error(
                'Invalid API token. Please create one at https://developer.thewfa.org.uk',
            );
        }
    }

    async makeRequest<T>(path: string, init?: RequestInit): Promise<T> {
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.config.token) {
            defaultHeaders['Authorization'] = `Token ${this.config.token}`;
        }

        const res = await fetch(this.config.baseURL + path, {
            ...init,
            headers: {
                ...defaultHeaders,
                ...(init?.headers || {}),
            },
        });

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
