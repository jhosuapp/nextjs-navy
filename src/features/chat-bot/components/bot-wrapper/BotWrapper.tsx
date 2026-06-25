import { useEffect, useRef, type JSX } from "react";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { zoomInMotion } from '@/shared/motion/zoomIn.motion';
import { useChatBot } from '../../hooks/useChatBot.controller';
import { BotMessage } from '../bot-message/BotMessage';
import { BotMessageTyping } from '../bot-message/BotMessageTyping';
import { BotMessageLoad } from '../bot-message/BotMessageLoad';
import { BotOptions } from '../bot-options/BotOptions';
import { BotInput } from '../bot-input/BotInput';

import styles from './botWrapper.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';
import bg from '@/config/assets/svg/bg-chat.svg';

const BotWrapper = (): JSX.Element => {
    const {
        t,
        messages,
        status,
        options,
        input,
        selectOption,
        submitInput,
        restart,
        close,
    } = useChatBot();

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Keep the view pinned to the latest message. A ResizeObserver on the growing
    // content fires on every height change — message added, bubble fading in, typing
    // dots toggling — so we anchor instantly (no smooth-scroll lag, no missed updates).
    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const pinToBottom = () => {
            container.scrollTop = container.scrollHeight;
        };

        const observer = new ResizeObserver(pinToBottom);
        observer.observe(content);
        pinToBottom();

        return () => observer.disconnect();
    }, []);

    return (
        <motion.section className={ styles.botWrapper } {...zoomInMotion(0, 0)}>
            <article className={ styles.botWrapperNav }>
                <div className={ styles.botWrapperNav__name }>
                    <Image src={ iconBot } alt='icon bot navy' />
                    <div className={ styles.botWrapperNav__info }>
                        <p>{ t('chatBot.title') }</p>
                        <span className={ styles.botWrapperNav__status }>
                            <i></i>{ t('chatBot.status') }
                        </span>
                    </div>
                </div>
                <div className={ styles.botWrapperNav__actions }>
                    <button
                        type='button'
                        className={ styles.botWrapperNav__action }
                        onClick={ restart }
                        aria-label={ t('chatBot.restart') }
                        title={ t('chatBot.restart') }
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </button>
                    <button
                        type='button'
                        className={ styles.botWrapperNav__action }
                        onClick={ close }
                        aria-label={ t('chatBot.close') }
                        title={ t('chatBot.close') }
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            </article>
            <article className={ styles.botWrapper__content }>
                <Image src={ bg } alt='' aria-hidden="true" className={ styles.botWrapper__bg } />
                <div
                    className={ styles.botWrapper__content__block }
                    data-lenis-prevent="true"
                    ref={ containerRef }
                >
                    <div className={ styles.botWrapper__content__inner } ref={ contentRef }>
                        {messages.map((message) => (
                            <BotMessage key={ message.id } message={ message } />
                        ))}
                        { status === 'typing' && <BotMessageTyping /> }
                        { status === 'loading' && <BotMessageLoad /> }
                        { status === 'idle' && options.length > 0 && (
                            <BotOptions options={ options } onSelect={ selectOption } t={ t } />
                        )}
                    </div>
                </div>
            </article>
            { input && (
                <article>
                    <BotInput
                        placeholder={ t(input.placeholderKey) }
                        sendLabel={ t('chatBot.send') }
                        onSubmit={ submitInput }
                    />
                </article>
            )}
        </motion.section>
    )
}

export { BotWrapper }
