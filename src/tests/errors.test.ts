import { httpResponseToAPIError } from '../errors';
import {
    MatchDayAPIError,
    MatchDayBadRequestError,
    MatchDayUnauthorizedError,
    MatchDayForbiddenError,
    MatchDayNotFoundError,
    MatchDayExceededRateLimitError,
} from '../types/errors';

function createMockResponse(
    status: number,
    body: object,
    ok: boolean = status >= 200 && status < 300,
): Response {
    return {
        ok,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body),
    } as Response;
}

describe('httpResponseToAPIError', () => {
    describe('successful responses', () => {
        it('returns undefined for 200 OK response', async () => {
            const res = createMockResponse(200, { data: 'success' });
            const error = await httpResponseToAPIError(res);
            expect(error).toBeUndefined();
        });

        it('returns undefined for 201 Created response', async () => {
            const res = createMockResponse(201, { id: '123' });
            const error = await httpResponseToAPIError(res);
            expect(error).toBeUndefined();
        });

        it('returns undefined for 204 No Content response', async () => {
            const res = createMockResponse(204, {});
            const error = await httpResponseToAPIError(res);
            expect(error).toBeUndefined();
        });
    });

    describe('400 Bad Request', () => {
        it('returns MatchDayBadRequestError with message', async () => {
            const res = createMockResponse(400, { message: 'Invalid input' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayBadRequestError);
            expect(error?.message).toBe('Invalid input');
            expect(error?.status).toBe(400);
        });

        it('includes validation issues when present', async () => {
            const validationIssues = [
                { path: 'email', message: 'Invalid email format', code: 'invalid_format' },
                { path: 'name', message: 'Name is required', code: 'required' },
            ];
            const res = createMockResponse(
                400,
                { message: 'Validation failed', errors: validationIssues },
                false,
            );
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayBadRequestError);
            const badRequestError = error as MatchDayBadRequestError;
            expect(badRequestError.validationIssues).toEqual(validationIssues);
        });

        it('handles response without validation issues', async () => {
            const res = createMockResponse(400, { message: 'Bad request' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayBadRequestError);
            const badRequestError = error as MatchDayBadRequestError;
            expect(badRequestError.validationIssues).toBeUndefined();
        });
    });

    describe('401 Unauthorized', () => {
        it('returns MatchDayUnauthorizedError with message', async () => {
            const res = createMockResponse(401, { message: 'Invalid token' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayUnauthorizedError);
            expect(error?.message).toBe('Invalid token');
            expect(error?.status).toBe(401);
        });
    });

    describe('403 Forbidden', () => {
        it('returns MatchDayForbiddenError with message', async () => {
            const res = createMockResponse(403, { message: 'Access denied' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayForbiddenError);
            expect(error?.message).toBe('Access denied');
            expect(error?.status).toBe(403);
        });
    });

    describe('404 Not Found', () => {
        it('returns MatchDayNotFoundError with message', async () => {
            const res = createMockResponse(404, { message: 'Resource not found' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayNotFoundError);
            expect(error?.message).toBe('Resource not found');
            expect(error?.status).toBe(404);
        });
    });

    describe('429 Rate Limit Exceeded', () => {
        it('returns MatchDayExceededRateLimitError with message', async () => {
            const res = createMockResponse(429, { message: 'Too many requests' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayExceededRateLimitError);
            expect(error?.message).toBe('Too many requests');
            expect(error?.status).toBe(429);
        });
    });

    describe('unknown status codes', () => {
        it('returns generic MatchDayAPIError for 500 Internal Server Error', async () => {
            const res = createMockResponse(500, { message: 'Server error' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.message).toBe('An unknown error occurred');
        });

        it('returns generic MatchDayAPIError for 502 Bad Gateway', async () => {
            const res = createMockResponse(502, { message: 'Bad gateway' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.message).toBe('An unknown error occurred');
        });

        it('returns generic MatchDayAPIError for 503 Service Unavailable', async () => {
            const res = createMockResponse(503, { message: 'Service unavailable' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.message).toBe('An unknown error occurred');
        });
    });

    describe('JSON parse errors', () => {
        it('returns generic error when JSON parsing fails', async () => {
            const res = {
                ok: false,
                status: 400,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            } as unknown as Response;
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.message).toBe('Failed to parse error');
        });
    });
});

describe('Error classes', () => {
    describe('MatchDayAPIError', () => {
        it('creates error with default values', () => {
            const error = new MatchDayAPIError();
            expect(error.message).toBe('API Error');
            expect(error.status).toBe(500);
            expect(error.name).toBe('MatchDayAPIError');
        });

        it('creates error with custom message and status', () => {
            const error = new MatchDayAPIError('Custom error', 418);
            expect(error.message).toBe('Custom error');
            expect(error.status).toBe(418);
        });

        it('toDebugJSON returns correct structure', () => {
            const error = new MatchDayAPIError('Test error', 500);
            const debug = error.toDebugJSON();
            expect(debug).toEqual({
                status: 500,
                body: { message: 'Test error' },
            });
        });
    });

    describe('MatchDayBadRequestError', () => {
        it('creates error with default message', () => {
            const error = new MatchDayBadRequestError();
            expect(error.message).toBe('Bad Request');
            expect(error.status).toBe(400);
            expect(error.name).toBe('MatchDayBadRequestError');
        });

        it('creates error with validation issues', () => {
            const issues = [{ path: 'email', message: 'Invalid', code: 'invalid' }];
            const error = new MatchDayBadRequestError('Validation failed', issues);
            expect(error.validationIssues).toEqual(issues);
        });
    });

    describe('MatchDayUnauthorizedError', () => {
        it('creates error with default message', () => {
            const error = new MatchDayUnauthorizedError();
            expect(error.message).toBe('Unauthorized');
            expect(error.status).toBe(401);
            expect(error.name).toBe('MatchDayUnauthorizedError');
        });

        it('creates error with custom message', () => {
            const error = new MatchDayUnauthorizedError('Token expired');
            expect(error.message).toBe('Token expired');
        });
    });

    describe('MatchDayForbiddenError', () => {
        it('creates error with default message', () => {
            const error = new MatchDayForbiddenError();
            expect(error.message).toBe('Forbidden');
            expect(error.status).toBe(403);
            expect(error.name).toBe('MatchDayForbiddenError');
        });
    });

    describe('MatchDayNotFoundError', () => {
        it('creates error with default message', () => {
            const error = new MatchDayNotFoundError();
            expect(error.message).toBe('Not Found');
            expect(error.status).toBe(404);
            expect(error.name).toBe('MatchDayNotFoundError');
        });
    });

    describe('MatchDayExceededRateLimitError', () => {
        it('creates error with default message', () => {
            const error = new MatchDayExceededRateLimitError();
            expect(error.message).toBe('You have exceeded the API rate limit');
            expect(error.status).toBe(429);
            expect(error.name).toBe('MatchDayExceededRateLimitError');
        });
    });
});
