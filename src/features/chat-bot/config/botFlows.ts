import { paths } from "@/shared/constants";
import { BotFlows } from "../interfaces/chatBot.interface";

export const DISCORD_INVITE_URL = "https://discord.com/invite/navyy";

export const ROOT_STEP = 'root';

/**
 * Declarative conversation graph. To add a new integration, add a node here
 * (and, if it needs a free-text step, register its async handler in useChatBot.controller).
 */
export const BOT_FLOWS: BotFlows = {
    [ROOT_STEP]: {
        messages: [
            { textKey: 'chatBot.greeting1' },
            { textKey: 'chatBot.greeting2' },
        ],
        options: [
            { id: 'updateUsername', labelKey: 'chatBot.options.updateUsername', next: 'updateUsername.askPremium' },
            { id: 'discord', labelKey: 'chatBot.options.discord', next: 'discord.show' },
            { id: 'applyStaff', labelKey: 'chatBot.options.applyStaff', next: 'applyStaff.show' },
        ],
    },

    // --- Discord ---
    'discord.show': {
        messages: [
            { textKey: 'chatBot.flow.discordIntro' },
            { kind: 'link', href: DISCORD_INVITE_URL, external: true, ctaKey: 'chatBot.flow.discordCta' },
        ],
        next: 'anythingElse',
    },

    // --- Apply as staff ---
    'applyStaff.show': {
        messages: [
            { textKey: 'chatBot.flow.applyIntro' },
            { kind: 'link', href: paths.applications, external: false, ctaKey: 'chatBot.flow.applyCta' },
        ],
        next: 'anythingElse',
    },

    // --- Update username ---
    'updateUsername.askPremium': {
        messages: [
            { textKey: 'chatBot.flow.updateIntro1' },
            { textKey: 'chatBot.flow.updateIntro2' },
        ],
        options: [
            { id: 'premium', labelKey: 'chatBot.options.premium', next: 'updateUsername.askUuid' },
            { id: 'notPremium', labelKey: 'chatBot.options.notPremium', next: 'updateUsername.notPremium' },
        ],
    },
    'updateUsername.notPremium': {
        messages: [
            { textKey: 'chatBot.flow.notPremium1' },
            { textKey: 'chatBot.flow.notPremium2' },
        ],
        next: 'anythingElse',
    },
    'updateUsername.askUuid': {
        messages: [
            { textKey: 'chatBot.flow.askUuid' },
        ],
        input: { placeholderKey: 'chatBot.flow.uuidPlaceholder', action: 'updateUsername' },
    },

    // --- Shared closing flow ---
    anythingElse: {
        messages: [
            { textKey: 'chatBot.flow.anythingElse' },
        ],
        options: [
            { id: 'yes', labelKey: 'chatBot.options.yes', next: ROOT_STEP },
            { id: 'no', labelKey: 'chatBot.options.no', next: 'goodbye' },
        ],
    },
    goodbye: {
        messages: [
            { textKey: 'chatBot.flow.goodbye1' },
            { textKey: 'chatBot.flow.goodbye2' },
        ],
    },
};
