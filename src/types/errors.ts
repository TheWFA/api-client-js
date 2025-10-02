export type ValidationIssue = {
    path: string;
    message: string;
    code: string;
};

export type MatchDayBaseErrorBody = { message: string };
export type MatchDayBadRequestBody = MatchDayBaseErrorBody & { errors?: ValidationIssue[] };

export class MatchDayAPIError extends Error {
    public status: number;
    public jsonResponse: { message: string };

    constructor(message = 'API Error', status = 500) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        this.jsonResponse = { message };
    }

    toDebugJSON() {
        return { status: this.status, body: this.jsonResponse };
    }
}

export class MatchDayBadRequestError extends MatchDayAPIError {
    public validationIssues?: ValidationIssue[];
    public jsonResponse: MatchDayBadRequestBody;

    constructor(message = 'Bad Request', validationIssues?: ValidationIssue[]) {
        super(message, 400);

        this.validationIssues = validationIssues;

        this.jsonResponse = { message };
    }
}

export class MatchDayUnauthorizedError extends MatchDayAPIError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class MatchDayForbiddenError extends MatchDayAPIError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

export class MatchDayNotFoundError extends MatchDayAPIError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class MatchDayExceededRateLimitError extends MatchDayAPIError {
    constructor(message = 'You have exceeded the API rate limit') {
        super(message, 429);
    }
}
