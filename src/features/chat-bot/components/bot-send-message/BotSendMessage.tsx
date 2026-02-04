import styles from './botSendMessage.module.css';
import iconSend from '@/config/assets/png/icon-send.png';
import Image from 'next/image';

const BotSendMessage = ():JSX.Element => {
    return (
        <form className={ styles.BotSendMessage }>
            <input type="text" placeholder='Write ur uuid' />
            <button>
                <Image src={ iconSend } alt="Send icon navy" />
            </button>
        </form>
    )
}

export { BotSendMessage }