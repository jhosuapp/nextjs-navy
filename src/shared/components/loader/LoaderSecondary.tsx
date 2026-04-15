import { HTMLAttributes, type JSX } from 'react';
import { motion, MotionProps } from "framer-motion";
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';

import styles from './loaderSecondary.module.css';

type NativeProps = HTMLAttributes<HTMLElement>;

type CustomProps = {
    className?: string;
    textLoader?: string; 
    isSmall?: boolean; 
}

 type Props = NativeProps & CustomProps & MotionProps;

const LoaderSecondary = ({ textLoader, className, isSmall = false, ...props }:Props):JSX.Element => {

    return (
        <motion.section 
            className={`${styles.loaderSecondary} ${className ?? ''} ${isSmall && styles.loaderSecondarySmall}`}
            {...fadeInMotion()}
            {...props}
        >
            <motion.article 
                className={styles.loaderSecondaryContent}
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
            >
                <span className={`${styles.loaderSeconaryInner} ${styles.loaderInner1}`}></span>
                <span className={`${styles.loaderSeconaryInner} ${styles.loaderInner2}`}></span>
                <span className={`${styles.loaderSeconaryInner} ${styles.loaderInner3}`}></span>
                <span className={`${styles.loaderSeconaryInner} ${styles.loaderInner4}`}></span>
            </motion.article>
            <article className={ styles.loaderSecondaryText}>
                <p>{textLoader ?? 'loading'}</p>
            </article>
        </motion.section>
    )
}

export { LoaderSecondary }