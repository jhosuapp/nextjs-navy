import { memo, type JSX } from "react";
import { BotMessage as BotMessageType } from '../../interfaces/chatBot.interface';
import { BotMessageWrapper } from './BotMessageWrapper';
import { CustomLink } from '@/shared/components/custom-link/CustomLink';

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
                        <CustomLink className={ styles.botMessage__cta } to={ message.href }>
                            { message.ctaText ?? message.href }
                        </CustomLink>
                    )
                )}
            </BotMessageWrapper>
        </div>
    )
});

BotMessage.displayName = 'BotMessage';

export { BotMessage }
