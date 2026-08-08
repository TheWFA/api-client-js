import {
    MatchDayAPIError,
    MatchDayBadRequestError,
    MatchDayErrorBody,
    MatchDayNotFoundError,
    MatchDayUnauthorizedError,
    MatchDayExceededRateLimitError,
    MatchDayForbiddenError,
} from './types/errors';

export async function httpResponseToAPIError(res: Response): Promise<MatchDayAPIError | undefined> {
    try {
        if (res.ok) {
            return;
        }

        switch (res.status) {
            case 400: {
                const json: MatchDayErrorBody = await res.json();

                return new MatchDayBadRequestError(json.error.message, json.error.code);
            }

            case 401: {
                const json: MatchDayErrorBody = await res.json();

                return new MatchDayUnauthorizedError(json.error.message, json.error.code);
            }

            case 403: {
                const json: MatchDayErrorBody = await res.json();

                return new MatchDayForbiddenError(json.error.message, json.error.code);
            }

            case 404: {
                const json: MatchDayErrorBody = await res.json();

                return new MatchDayNotFoundError(json.error.message, json.error.code);
            }

            case 429: {
                const json: MatchDayErrorBody = await res.json();

                return new MatchDayExceededRateLimitError(json.error.message, json.error.code);
            }

            default: {
                return new MatchDayAPIError('An unknown error occurred');
            }
        }
    } catch {
        return new MatchDayAPIError('Failed to parse error');
    }
}
