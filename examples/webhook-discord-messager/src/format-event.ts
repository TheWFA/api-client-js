import {
    MatchDayWebhookEvent,
    MatchDayWebhookEventType,
    MatchDayWebhookMatchRef,
    MatchDayWebhookPlayerRef,
    MatchDayWebhookTeamRef,
} from '@thewfa/api-client';

import { DiscordEmbed, DiscordWebhookPayload } from './discord';

const WFA_GREEN = 0x2ecc71;

// `match`/`team`/`player` fall back to a bare id string when the platform couldn't
// resolve the underlying record (e.g. it was deleted) — render either shape.
function describeTeam(team: MatchDayWebhookTeamRef): string {
    return typeof team === 'string' ? `Team #${team}` : team.name;
}

function describePlayer(player: MatchDayWebhookPlayerRef | null): string {
    if (player === null) return 'Unknown';
    return typeof player === 'string' ? `Player #${player}` : player.name;
}

function describeMatch(match: MatchDayWebhookMatchRef): string {
    if (typeof match === 'string') return `Match #${match}`;
    return `${match.homeTeam.name} ${match.score.home}-${match.score.away} ${match.awayTeam.name}`;
}

function matchField(match: MatchDayWebhookMatchRef): DiscordEmbed['fields'] {
    return [{ name: 'Match', value: describeMatch(match) }];
}

function buildEmbed(event: MatchDayWebhookEvent): DiscordEmbed {
    const timestamp = event.occurredAt.toISOString();

    switch (event.detailType) {
        case MatchDayWebhookEventType.GoalScored:
            return {
                title: '⚽ Goal!',
                description: `${describePlayer(event.scorer)} scores for ${describeTeam(event.team)}${
                    event.assister ? ` (assist: ${describePlayer(event.assister)})` : ''
                }`,
                color: WFA_GREEN,
                fields: matchField(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.CardIssued:
            return {
                title: event.cardType === 'red_card' ? '🟥 Red Card' : '🟨 Yellow Card',
                description: `${describePlayer(event.player)} (${describeTeam(event.team)})`,
                fields: matchField(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.SubstitutionMade:
            return {
                title: '🔄 Substitution',
                description: `${describeTeam(event.team)}: ${describePlayer(event.playerOn)} on, ${describePlayer(event.playerOff)} off`,
                fields: matchField(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.PenaltyShootoutAttempt:
            return {
                title: event.scored ? '✅ Penalty Scored' : '❌ Penalty Missed',
                description: `${describePlayer(event.player)} (${describeTeam(event.team)}) — attempt #${event.sequence}`,
                fields: matchField(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.MatchStatusChanged:
            return {
                title: 'ℹ️ Match Status Changed',
                description: `${event.previousStatus} → ${event.newStatus}`,
                fields: matchField(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.MatchScoreCorrected:
            return {
                title: '✏️ Score Corrected',
                description: describeMatch(event.match),
                timestamp,
            };

        case MatchDayWebhookEventType.Ping:
            return {
                title: '🏓 Ping',
                description: 'Verification ping received.',
                timestamp,
            };
    }
}

export function buildDiscordPayload(event: MatchDayWebhookEvent): DiscordWebhookPayload {
    return { embeds: [buildEmbed(event)] };
}
