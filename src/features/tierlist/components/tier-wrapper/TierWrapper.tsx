import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import styles from './tierWrapper.module.css';
import icon from '@/config/assets/svg/icon-award-secondary.svg';
import { fadeUpMotion } from '@/shared/motion';

type Props = {
    children: ReactNode;
    tier: 1 | 2 | 3 | 4 | 5;
    variants: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth';
    count: number;
}

const TierWrapper = ({ children, variants, tier, count }:Props):JSX.Element => {
    return (
        <motion.article className={ `${styles.tierWrapper} ${styles[`tierWrapper__${variants}`]}` } {...fadeUpMotion(0.7,0.13)}>
            <div className={ styles.tierWrapper__tier }>
                <div className={ styles.tierWrapper__tier__item }>
                    <Image src={ icon } alt='Copa Navy' />
                    <span>TIER { tier }</span>
                </div>
                <p>{ count }</p>
            </div>
            <div>
                { children }
            </div>
        </motion.article>
    )
}

export { TierWrapper }