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

function errorBody(code: string, message: string) {
    return { error: { code, message } };
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
        it('returns MatchDayBadRequestError with message and code', async () => {
            const res = createMockResponse(400, errorBody('invalid_input', 'Invalid input'), false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayBadRequestError);
            expect(error?.message).toBe('Invalid input');
            expect(error?.status).toBe(400);
            expect(error?.code).toBe('invalid_input');
        });
    });

    describe('401 Unauthorized', () => {
        it('returns MatchDayUnauthorizedError with message', async () => {
            const res = createMockResponse(401, errorBody('invalid_token', 'Invalid token'), false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayUnauthorizedError);
            expect(error?.message).toBe('Invalid token');
            expect(error?.status).toBe(401);
        });
    });

    describe('403 Forbidden', () => {
        it('returns MatchDayForbiddenError with message', async () => {
            const res = createMockResponse(403, errorBody('forbidden', 'Access denied'), false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayForbiddenError);
            expect(error?.message).toBe('Access denied');
            expect(error?.status).toBe(403);
        });
    });

    describe('404 Not Found', () => {
        it('returns MatchDayNotFoundError with message', async () => {
            const res = createMockResponse(
                404,
                errorBody('not_found', 'Resource not found'),
                false,
            );
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayNotFoundError);
            expect(error?.message).toBe('Resource not found');
            expect(error?.status).toBe(404);
        });
    });

    describe('429 Rate Limit Exceeded', () => {
        it('returns MatchDayExceededRateLimitError with message', async () => {
            const res = createMockResponse(
                429,
                errorBody('rate_limited', 'Too many requests'),
                false,
            );
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayExceededRateLimitError);
            expect(error?.message).toBe('Too many requests');
            expect(error?.status).toBe(429);
        });
    });

    describe('unknown status codes', () => {
        it('returns generic MatchDayAPIError for 500 Internal Server Error, with status and body', async () => {
            const res = createMockResponse(500, { message: 'Server error' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(500);
            expect(error?.message).toContain('500');
            expect(error?.message).toContain('Server error');
        });

        it('returns generic MatchDayAPIError for 502 Bad Gateway, with status and body', async () => {
            const res = createMockResponse(502, { message: 'Bad gateway' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(502);
            expect(error?.message).toContain('502');
            expect(error?.message).toContain('Bad gateway');
        });

        it('returns generic MatchDayAPIError for 503 Service Unavailable, with status and body', async () => {
            const res = createMockResponse(503, { message: 'Service unavailable' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(503);
            expect(error?.message).toContain('503');
            expect(error?.message).toContain('Service unavailable');
        });
    });

    describe('JSON parse errors', () => {
        it('returns a detailed error when the body is not JSON', async () => {
            const res = {
                ok: false,
                status: 400,
                text: async () => 'Not JSON at all',
            } as unknown as Response;
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(400);
            expect(error?.message).toContain('400');
            expect(error?.message).toContain('Not JSON at all');
        });

        it('returns a detailed error when the body is JSON but missing error.message', async () => {
            const res = createMockResponse(400, { unexpected: 'shape' }, false);
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(400);
            expect(error?.message).toContain('400');
            expect(error?.message).toContain('unexpected');
        });

        it('returns a generic error when reading the body itself fails', async () => {
            const res = {
                ok: false,
                status: 500,
                text: async () => {
                    throw new Error('stream error');
                },
            } as unknown as Response;
            const error = await httpResponseToAPIError(res);

            expect(error).toBeInstanceOf(MatchDayAPIError);
            expect(error?.status).toBe(500);
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
            const error = new MatchDayAPIError('Test error', 500, 'test_code');
            const debug = error.toDebugJSON();
            expect(debug).toEqual({
                status: 500,
                body: { code: 'test_code', message: 'Test error' },
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

        it('creates error with custom message and code', () => {
            const error = new MatchDayBadRequestError('Validation failed', 'validation_error');
            expect(error.message).toBe('Validation failed');
            expect(error.code).toBe('validation_error');
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
