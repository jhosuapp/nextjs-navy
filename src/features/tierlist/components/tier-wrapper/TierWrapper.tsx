import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import styles from './tierWrapper.module.css';
import icon from '@/config/assets/svg/icon-award-secondary.svg';
import { fadeInMotion } from '@/shared/motion';

type Props = {
    children: ReactNode;
    tier: 1 | 2 | 3 | 4 | 5;
    variants: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth';
    count: number;
    delay?: { enter: number, exit: number };
}

const TierWrapper = ({ children, variants, tier, count, delay = { enter: 0, exit: 0 } }:Props):JSX.Element => {
    return (
        <motion.article className={ `${styles.tierWrapper} ${styles[`tierWrapper__${variants}`]}` } {...fadeInMotion(delay.enter, delay.exit)}>
            <div className={ styles.tierWrapper__tier }>
                <div className={ styles.tierWrapper__tier__item }>
                    <Image src={ icon } alt='Copa Navy' />
                    <span>TIER { tier }</span>
                </div>
                <p>{ count }</p>
            </div>
            <div className={ styles.tierWrapper__content } data-lenis-prevent>
                { children }
            </div>
        </motion.article>
    )
}

export { TierWrapper }