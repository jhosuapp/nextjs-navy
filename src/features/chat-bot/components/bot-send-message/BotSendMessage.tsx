import Image from 'next/image';
import { useChatBotStore } from '../../stores/chatBot.store';

import styles from './botSendMessage.module.css';
import iconSend from '@/config/assets/png/icon-send.png';

const BotSendMessage = ():JSX.Element => {
    const isChatEnabled = useChatBotStore( state => state.isChatEnabled );
    const placeholder = useChatBotStore( state => state.placeholder );

    return (
        <form className={ `${styles.BotSendMessage} ${!isChatEnabled && 'opacity-65'}` }>
            <input type="text" placeholder={ placeholder } disabled={ !isChatEnabled } />
            <button disabled={ !isChatEnabled }>
                <Image src={ iconSend } alt="Send icon navy" />
            </button>
        </form>
    )
}

export { BotSendMessage }