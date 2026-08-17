export type DiscordEmbed = {
    title: string;
    description?: string;
    color?: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    timestamp?: string;
};

export type DiscordWebhookPayload = {
    content?: string;
    embeds?: DiscordEmbed[];
};

export async function postToDiscord(
    webhookUrl: string,
    payload: DiscordWebhookPayload,
): Promise<void> {
    const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(
            `Discord webhook request failed with status ${res.status}${detail ? `: ${detail}` : ''}`,
        );
    }
}
