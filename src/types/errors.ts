export type MatchDayErrorDetail = {
    code: string;
    message: string;
};

export type MatchDayErrorBody = {
    error: MatchDayErrorDetail;
};

export class MatchDayAPIError extends Error {
    public status: number;
    public code?: string;
    public jsonResponse: MatchDayErrorDetail;

    constructor(message = 'API Error', status = 500, code?: string) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        this.code = code;
        this.jsonResponse = { code: code ?? 'unknown_error', message };
    }

    toDebugJSON() {
        return { status: this.status, body: this.jsonResponse };
    }
}

export class MatchDayBadRequestError extends MatchDayAPIError {
    constructor(message = 'Bad Request', code?: string) {
        super(message, 400, code);
    }
}

export class MatchDayUnauthorizedError extends MatchDayAPIError {
    constructor(message = 'Unauthorized', code?: string) {
        super(message, 401, code);
    }
}

export class MatchDayForbiddenError extends MatchDayAPIError {
    constructor(message = 'Forbidden', code?: string) {
        super(message, 403, code);
    }
}

export class MatchDayNotFoundError extends MatchDayAPIError {
    constructor(message = 'Not Found', code?: string) {
        super(message, 404, code);
    }
}

export class MatchDayExceededRateLimitError extends MatchDayAPIError {
    constructor(message = 'You have exceeded the API rate limit', code?: string) {
        super(message, 429, code);
    }
}
