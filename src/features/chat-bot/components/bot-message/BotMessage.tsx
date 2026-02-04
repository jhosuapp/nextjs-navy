import styles from './botMessage.module.css';

type Props = {
    text: string;
    userResponse?: boolean;
}

const BotMessage = ({ text, userResponse = false }:Props):JSX.Element => {
    return (
        <div className={ `${styles.botMessage} ${userResponse && styles.botMessageResponse}` }>
            <div className={ styles.botMessage__content }>
                <p>{ text }</p>
            </div>
        </div>
    )
}

export { BotMessage }