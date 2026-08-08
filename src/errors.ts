import {
    MatchDayAPIError,
    MatchDayBadRequestError,
    MatchDayErrorBody,
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
        const json: MatchDayErrorBody = JSON.parse(rawBody);

        if (!json?.error?.message) {
            throw new Error(
                'response body did not match the expected { error: { message } } shape',
            );
        }

        return new ErrorClass(json.error.message, json.error.code);
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);

        return new MatchDayAPIError(
            `Failed to parse error response (status ${res.status}): ${detail}${bodySnippet ? `. Body: ${bodySnippet}` : ''}`,
            res.status,
        );
    }
}
