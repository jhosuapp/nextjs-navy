import type { JSX } from "react";
import { motion } from 'framer-motion';
import { ItemBotMessage } from '../../interfaces/chatBot.interface';
import { fadeInNoneMotion } from '@/shared/motion/fadeIn.motion';
import { BotMessageWrapper } from './BotMessageWrapper';

import styles from './botMessage.module.css';

type Props = ItemBotMessage & {
    isLast?: boolean;
    onAnimationComplete?: () => void;
};

const BotMessage = ({ text, userResponse = false, delayMessage = 0, isLast = false, onAnimationComplete }: Props): JSX.Element => {
    return (
        <motion.div 
            {...fadeInNoneMotion(delayMessage, 0)}
            className={ `${styles.botMessage} ${userResponse && styles.botMessageResponse}` }
            onAnimationComplete={() => {
                if (isLast && onAnimationComplete) {
                    onAnimationComplete();
                }
            }}
        >
            <BotMessageWrapper>
                <p>{ text }</p>
            </BotMessageWrapper>
        </motion.div>
    )
}

export { BotMessage }