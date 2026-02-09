import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInNoneMotion } from '@/shared/motion';

import styles from './botMessage.module.css';

type Props = {
    children: ReactNode;
    isPurple?: boolean;
}

const BotMessageWrapper = ({ children, isPurple = false }:Props):JSX.Element => {
    return (
        <motion.div 
            className={ `${styles.botMessage__content} ${isPurple && styles.botMessage__contentPurple}` }
            {...fadeInNoneMotion(0, 0)}
        >
            { children }
        </motion.div>
    )
}

export { BotMessageWrapper }