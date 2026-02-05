import { ReactNode } from 'react';
import styles from './botMessage.module.css';

type Props = {
    children: ReactNode;
    isPurple?: boolean;
}

const BotMessageWrapper = ({ children, isPurple = false }:Props):JSX.Element => {
    return (
        <div className={ `${styles.botMessage__content} ${isPurple && styles.botMessage__contentPurple}` }>
            { children }
        </div>
    )
}

export { BotMessageWrapper }