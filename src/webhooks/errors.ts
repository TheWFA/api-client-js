export class MatchDayWebhookError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class MatchDayWebhookSignatureError extends MatchDayWebhookError {}

export class MatchDayWebhookPayloadError extends MatchDayWebhookError {}
