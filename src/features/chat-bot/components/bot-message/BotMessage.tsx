import { memo, type JSX } from "react";
import Link from "next/link";
import { BotMessage as BotMessageType } from '../../interfaces/chatBot.interface';
import { BotMessageWrapper } from './BotMessageWrapper';

import styles from './botMessage.module.css';

type Props = {
    message: BotMessageType;
};

const BotMessage = memo(({ message }: Props): JSX.Element => {
    const isUser = message.role === 'user';

    return (
        <div className={ `${styles.botMessage} ${isUser ? styles.botMessageResponse : ''}` }>
            <BotMessageWrapper>
                { message.text && <p>{ message.text }</p> }
                { message.kind === 'link' && message.href && (
                    message.external ? (
                        <a
                            className={ styles.botMessage__cta }
                            href={ message.href }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            { message.ctaText ?? message.href }
                        </a>
                    ) : (
                        <Link className={ styles.botMessage__cta } href={ message.href }>
                            { message.ctaText ?? message.href }
                        </Link>
                    )
                )}
            </BotMessageWrapper>
        </div>
    )
});

BotMessage.displayName = 'BotMessage';

export { BotMessage }
