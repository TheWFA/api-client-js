import { AccreditationsResource } from './resources/accreditations';
import { ClubsResource } from './resources/clubs';
import { CompetitionsResource } from './resources/competitions';
import { HistoryResource } from './resources/history';
import { KitsResource } from './resources/kits';
import { LocationsResource } from './resources/locations';
import { MatchResource } from './resources/matches';
import { OrganisationsResource } from './resources/organisations';
import { PersonsResource } from './resources/persons';
import { SearchResource } from './resources/search';
import { SeasonsResource } from './resources/seasons';
import { SuspensionsResource } from './resources/suspensions';
import { TeamsResource } from './resources/teams';
import { TiesResource } from './resources/ties';
import { httpResponseToAPIError } from './errors';
import { parseDates } from './time';
import { MatchDayAPIError } from './types/errors';
import { MatchDayHealth } from './types/health';

export enum MatchDayAPIVersion {
    V1 = '/v1',
    DEFAULT = '',
}

export type APIClientConfig = {
    baseURL?: string;
    apiKey: string;
    version?: MatchDayAPIVersion;
    headers?: Record<string, string>;
};

const defaultConfig: Partial<APIClientConfig> = {
    baseURL: 'https://api.thewfa.org.uk',
    version: MatchDayAPIVersion.V1,
};

export class MatchDayClient {
    private config: APIClientConfig;

    public readonly matches = new MatchResource(this);
    public readonly locations = new LocationsResource(this);
    public readonly teams = new TeamsResource(this);
    public readonly clubs = new ClubsResource(this);
    public readonly competitions = new CompetitionsResource(this);
    public readonly organisations = new OrganisationsResource(this);
    public readonly seasons = new SeasonsResource(this);
    public readonly accreditations = new AccreditationsResource(this);
    public readonly persons = new PersonsResource(this);
    public readonly search = new SearchResource(this);
    public readonly history = new HistoryResource(this);
    public readonly suspensions = new SuspensionsResource(this);
    public readonly ties = new TiesResource(this);
    public readonly kits = new KitsResource(this);

    constructor(config: APIClientConfig) {
        this.config = {
            ...defaultConfig,
            ...config,
        };
    }

    /**
     * Retrieves the API's health status.
     */
    async health() {
        return this.makeRequest<MatchDayHealth>('/health', { method: 'GET' });
    }

    async makeRequest<T>(path: string, init?: RequestInit): Promise<T> {
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (!this.config.apiKey) {
            throw new MatchDayAPIError('No authentication method set');
        }

        defaultHeaders['x-api-key'] = this.config.apiKey;

        const res = await fetch(
            this.config.baseURL + (this.config.version ?? defaultConfig.version!) + path,
            {
                ...init,
                headers: {
                    ...defaultHeaders,
                    ...this.config.headers,
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
