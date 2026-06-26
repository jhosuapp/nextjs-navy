import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useMenuStore } from "@/shared/stores/menu.store";
import { useChatBotStore } from "../stores/chatBot.store";
import { BOT_FLOWS, ROOT_STEP } from "../config/botFlows";
import { getUserNameAction } from "../actions/get-username.action";
import { postUpdateUsernameAction } from "../actions/post-updateUsername.action";
import { BotActionId, BotMessage, BotOption, BotStep, BotStepMessage } from "../interfaces/chatBot.interface";

/** Delay between sequential bot messages while the typing indicator is shown. */
const TYPING_MS = 650;

const makeId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const useChatBot = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const hamburger = useMenuStore(s => s.hamburger);

    const messages = useChatBotStore(s => s.messages);
    const status = useChatBotStore(s => s.status);
    const options = useChatBotStore(s => s.options);
    const input = useChatBotStore(s => s.input);
    const addMessage = useChatBotStore(s => s.addMessage);
    const setStatus = useChatBotStore(s => s.setStatus);
    const setOptions = useChatBotStore(s => s.setOptions);
    const setInput = useChatBotStore(s => s.setInput);
    const reset = useChatBotStore(s => s.reset);

    // Epoch token: bumping it supersedes any in-flight message sequence.
    const runIdRef = useRef(0);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const pendingResolversRef = useRef<Array<(v: boolean) => void>>([]);

    const clearTimers = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        // Unblock any awaited wait() so suspended sequences exit cleanly
        pendingResolversRef.current.forEach(resolve => resolve(false));
        pendingResolversRef.current = [];
    }, []);

    // Resolves true after `ms`, or false if the run was superseded / cleared.
    const wait = useCallback((ms: number, runId: number) => new Promise<boolean>((resolve) => {
        pendingResolversRef.current.push(resolve);
        const id = setTimeout(() => {
            pendingResolversRef.current = pendingResolversRef.current.filter(r => r !== resolve);
            resolve(runId === runIdRef.current);
        }, ms);
        timeoutsRef.current.push(id);
    }), []);

    const botText = useCallback((text: string): BotMessage => ({
        id: makeId(), role: 'bot', kind: 'text', text,
    }), []);

    const emitStepMessage = useCallback((msg: BotStepMessage) => {
        addMessage({
            id: makeId(),
            role: 'bot',
            kind: msg.kind ?? 'text',
            text: msg.textKey ? t(msg.textKey, msg.params) : '',
            href: msg.href,
            external: msg.external,
            ctaText: msg.ctaKey ? t(msg.ctaKey) : undefined,
        });
    }, [addMessage, t]);

    const runAction = useCallback(async (action: BotActionId, value: string, runId: number) => {
        if (action === 'updateUsername') {
            setStatus('loading');
            try {
                const data = await getUserNameAction(value);
                if (runId !== runIdRef.current) return;
                if (!data?.username || !data?.uuid) {
                    addMessage(botText(t('chatBot.flow.invalidUuid')));
                } else {
                    addMessage(botText(t('chatBot.flow.updating', { username: data.username })));
                    try {
                        await postUpdateUsernameAction({ nick: data.username, uuid: data.uuid });
                        if (runId !== runIdRef.current) return;
                        addMessage(botText(t('chatBot.flow.updateSuccess')));
                    } catch {
                        if (runId !== runIdRef.current) return;
                        addMessage(botText(t('chatBot.flow.updateNotFound')));
                    }
                }
            } catch {
                if (runId !== runIdRef.current) return;
                addMessage(botText(t('chatBot.flow.invalidUuid')));
            }
        }
    }, [addMessage, botText, setStatus, t]);

    // Walks the conversation graph from `startId`, following automatic `next` transitions
    // iteratively (no recursion) until a node waits for the user (options / input) or ends.
    const enterStep = useCallback(async (startId: string): Promise<void> => {
        let stepId: string | undefined = startId;

        while (stepId) {
            const step: BotStep | undefined = BOT_FLOWS[stepId];
            if (!step) return;

            const runId = ++runIdRef.current;
            clearTimers();
            setOptions([]);
            setInput(null);

            for (const msg of step.messages) {
                setStatus('typing');
                const ok = await wait(TYPING_MS, runId);
                if (!ok) return;
                emitStepMessage(msg);
            }

            if (runId !== runIdRef.current) return;
            setStatus('idle');

            if (step.input) {
                setInput(step.input);
                return;
            }
            if (step.options) {
                setOptions(step.options);
                return;
            }
            stepId = step.next;
        }
    }, [clearTimers, emitStepMessage, setInput, setOptions, setStatus, wait]);

    const selectOption = useCallback((option: BotOption) => {
        addMessage({ id: makeId(), role: 'user', kind: 'text', text: t(option.labelKey) });
        setOptions([]);
        void enterStep(option.next);
    }, [addMessage, enterStep, setOptions, t]);

    const submitInput = useCallback(async (value: string) => {
        const request = useChatBotStore.getState().input;
        if (!request) return;
        addMessage({ id: makeId(), role: 'user', kind: 'text', text: value });
        setInput(null);
        const runId = ++runIdRef.current;
        await runAction(request.action, value, runId);
        if (runId === runIdRef.current) {
            await enterStep('anythingElse');
        }
    }, [addMessage, enterStep, runAction, setInput]);

    const restart = useCallback(() => {
        ++runIdRef.current;
        clearTimers();
        reset({ enableBot: true });
        void enterStep(ROOT_STEP);
    }, [clearTimers, enterStep, reset]);

    const close = useCallback(() => {
        ++runIdRef.current;
        clearTimers();
        reset();
    }, [clearTimers, reset]);

    // Start (or resume) the conversation. The runId epoch makes this safe against
    // React StrictMode's double-invoke; the empty conversation check avoids restarting
    // when remounting on client-side navigation (the store survives navigation).
    useEffect(() => {
        const state = useChatBotStore.getState();
        if (state.enableBot && state.messages.length === 0) {
            void enterStep(ROOT_STEP);
        }
        return () => clearTimers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close the bot whenever the user navigates to another page: the store is global
    // and survives navigation, so without this it would reopen on the next route.
    useEffect(() => {
        const handleRouteChange = () => {
            ++runIdRef.current;
            clearTimers();
            reset();
        };
        router.events.on("routeChangeStart", handleRouteChange);
        return () => router.events.off("routeChangeStart", handleRouteChange);
    }, [router.events, clearTimers, reset]);

    // Close the bot when the mobile hamburger menu opens so they don't overlap.
    useEffect(() => {
        if (hamburger) {
            ++runIdRef.current;
            clearTimers();
            reset();
        }
    }, [hamburger, clearTimers, reset]);

    return {
        t,
        messages,
        status,
        options,
        input,
        selectOption,
        submitInput,
        restart,
        close,
    };
};

export { useChatBot };
