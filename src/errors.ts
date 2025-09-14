import {
    APIError,
    BadRequestBody,
    BadRequestError,
    BaseErrorBody,
    NotFoundError,
    UnauthorizedError,
} from './types/errors';

export async function httpResponseToAPIError(res: Response): Promise<APIError | undefined> {
    try {
        if (res.ok) {
            return;
        }

        switch (res.status) {
            case 400: {
                const json: BadRequestBody = await res.json();

                const er = new BadRequestError(json.message);

                if (json.errors) {
                    er.validationIssues = json.errors;
                }

                return er;
            }

            case 401: {
                const json: BaseErrorBody = await res.json();

                return new UnauthorizedError(json.message);
            }

            case 403: {
                const json: BaseErrorBody = await res.json();

                return new UnauthorizedError(json.message);
            }

            case 404: {
                const json: BaseErrorBody = await res.json();

                return new NotFoundError(json.message);
            }

            default: {
                return new APIError('An unknown error occurred');
            }
        }
    } catch {
        return new APIError('Failed to parse error');
    }
}
