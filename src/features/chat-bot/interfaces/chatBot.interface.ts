export type BotMessageKind = 'text' | 'link';

export type BotMessageRole = 'bot' | 'user';

export type BotStatus = 'idle' | 'typing' | 'loading';

/** Async use cases the engine can run after a free-text input. Add a key here to register a new one. */
export type BotActionId = 'updateUsername';

/** A message already materialised in the conversation. */
export interface BotMessage {
    id: string;
    role: BotMessageRole;
    kind: BotMessageKind;
    /** Final, ready-to-render text (already translated, or the user's echoed value). */
    text: string;
    /** kind: 'link' only */
    href?: string;
    /** External links open in a new tab; internal ones use client-side navigation. */
    external?: boolean;
    /** Visible label for the link CTA. */
    ctaText?: string;
}

/** A quick-reply chip. */
export interface BotOption {
    id: string;
    labelKey: string;
    next: string;
}

/** Request for free text from the user, bound to an async action. */
export interface BotInputRequest {
    placeholderKey: string;
    action: BotActionId;
}

/** Declarative description of a bot message inside a flow node. */
export interface BotStepMessage {
    kind?: BotMessageKind;
    textKey?: string;
    params?: Record<string, string>;
    href?: string;
    external?: boolean;
    ctaKey?: string;
}

/** A single node of the conversation graph. */
export interface BotStep {
    messages: BotStepMessage[];
    /** Quick replies shown after the messages are emitted. */
    options?: BotOption[];
    /** Ask the user for free text. */
    input?: BotInputRequest;
    /** Automatic transition to another node once the messages are emitted (no user interaction). */
    next?: string;
}

export type BotFlows = Record<string, BotStep>;
