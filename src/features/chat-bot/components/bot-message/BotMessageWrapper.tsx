import { motion } from 'framer-motion';
import { ReactNode, type JSX } from 'react';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';

import styles from './botMessage.module.css';

type Props = {
    children: ReactNode;
    rowDirection?: boolean;
    isPurple?: boolean;
}

const BotMessageWrapper = ({ children, isPurple = false, rowDirection = false }:Props):JSX.Element => {
    return (
        <motion.div
            className={ `${styles.botMessage__content} ${isPurple && styles.botMessage__contentPurple} ${rowDirection ? styles.botMessage__content__row : ''}` }
            {...fadeInMotion(0, 0)}
        >
            { children }
        </motion.div>
    )
}

export { BotMessageWrapper }