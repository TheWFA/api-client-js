export type ValidationIssue = {
    path: string;
    message: string;
    code: string;
};

export type BaseErrorBody = { message: string };
export type BadRequestBody = BaseErrorBody & { errors?: ValidationIssue[] };

export class APIError extends Error {
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

export class BadRequestError extends APIError {
    public validationIssues?: ValidationIssue[];
    public jsonResponse: BadRequestBody;

    constructor(message = 'Bad Request', validationIssues?: ValidationIssue[]) {
        super(message, 400);

        this.validationIssues = validationIssues;

        this.jsonResponse = { message };
    }
}

export class UnauthorizedError extends APIError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends APIError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends APIError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
