import {
    MatchDayAPIError,
    MatchDayBadRequestBody,
    MatchDayBadRequestError,
    MatchDayBaseErrorBody,
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
                const json: MatchDayBadRequestBody = await res.json();

                const er = new MatchDayBadRequestError(json.message);

                if (json.errors) {
                    er.validationIssues = json.errors;
                }

                return er;
            }

            case 401: {
                const json: MatchDayBaseErrorBody = await res.json();

                return new MatchDayUnauthorizedError(json.message);
            }

            case 403: {
                const json: MatchDayBaseErrorBody = await res.json();

                return new MatchDayForbiddenError(json.message);
            }

            case 404: {
                const json: MatchDayBaseErrorBody = await res.json();

                return new MatchDayNotFoundError(json.message);
            }

            case 429: {
                const json: MatchDayBaseErrorBody = await res.json();

                return new MatchDayExceededRateLimitError(json.message);
            }

            default: {
                return new MatchDayAPIError('An unknown error occurred');
            }
        }
    } catch {
        return new MatchDayAPIError('Failed to parse error');
    }
}
