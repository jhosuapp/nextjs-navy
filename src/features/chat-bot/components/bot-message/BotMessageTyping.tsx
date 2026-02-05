import { motion } from 'framer-motion';
import { BotMessageWrapper } from "./BotMessageWrapper";

import styles from './botMessage.module.css';

const BotMessageTyping = ():JSX.Element => {
    return (
        <BotMessageWrapper isPurple>
            <motion.div 
                className={ styles.botMessageTyping }
            >
                <span />
                <span />
                <span />
            </motion.div>
        </BotMessageWrapper>
    )
}

export { BotMessageTyping }