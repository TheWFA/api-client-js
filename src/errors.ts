import {
    MatchDayAPIError,
    MatchDayBadRequestError,
    MatchDayNotFoundError,
    MatchDayUnauthorizedError,
    MatchDayExceededRateLimitError,
    MatchDayForbiddenError,
} from './types/errors';

const ERROR_CLASSES = {
    400: MatchDayBadRequestError,
    401: MatchDayUnauthorizedError,
    403: MatchDayForbiddenError,
    404: MatchDayNotFoundError,
    429: MatchDayExceededRateLimitError,
} as const;

const MAX_BODY_SNIPPET_LENGTH = 500;

type ExtractedError = { message: string; code?: string };

/**
 * Extracts a message/code from either the API's own `{ error: { code, message } }`
 * body, or the generic `{ message }` shape returned by API Gateway itself when a
 * request is rejected before reaching the API (e.g. a missing/invalid API key).
 */
function extractError(json: unknown): ExtractedError | undefined {
    if (!json || typeof json !== 'object') {
        return undefined;
    }

    const body = json as Record<string, unknown>;

    if (body.error && typeof body.error === 'object') {
        const error = body.error as Record<string, unknown>;

        if (typeof error.message === 'string') {
            return {
                message: error.message,
                code: typeof error.code === 'string' ? error.code : undefined,
            };
        }
    }

    if (typeof body.message === 'string') {
        return { message: body.message };
    }

    return undefined;
}

export async function httpResponseToAPIError(res: Response): Promise<MatchDayAPIError | undefined> {
    if (res.ok) {
        return;
    }

    const rawBody = await res.text().catch(() => '');
    const bodySnippet = rawBody.slice(0, MAX_BODY_SNIPPET_LENGTH);

    const ErrorClass = ERROR_CLASSES[res.status as keyof typeof ERROR_CLASSES];

    if (!ErrorClass) {
        return new MatchDayAPIError(
            `Request failed with status ${res.status}${bodySnippet ? `: ${bodySnippet}` : ''}`,
            res.status,
        );
    }

    try {
        const extracted = extractError(JSON.parse(rawBody));

        if (!extracted) {
            throw new Error('response body did not contain a recognizable error message');
        }

        return new ErrorClass(extracted.message, extracted.code);
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);

        return new MatchDayAPIError(
            `Failed to parse error response (status ${res.status}): ${detail}${bodySnippet ? `. Body: ${bodySnippet}` : ''}`,
            res.status,
        );
    }
}
