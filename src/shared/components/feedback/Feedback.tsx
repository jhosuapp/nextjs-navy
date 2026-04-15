import { HTMLAttributes, type JSX } from 'react';
import { motion, MotionProps } from 'framer-motion';

import styles from './feedback.module.css';
import { containerVariants, pathVariants } from './feedback.motion';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';

type NativeProps = HTMLAttributes<HTMLElement>;

type CustomProps = {
    className?: string;
    texFeedback?: string; 
}

type Props = NativeProps & CustomProps & MotionProps;

const Feedback = ({ texFeedback, className, ...props }:Props): JSX.Element => {

    return (
        <section className={`${styles.feedback} ${className ?? ''}`}>
            <motion.article
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={ styles.feedbackContent }
                {...props}
            >
                <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"
                    className={ styles.feedbackSvg }
                >
                    <motion.path 
                        d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                        variants={pathVariants}
                        strokeWidth="2"
                        className={ styles.feedbackPath }
                    />
                </motion.svg>
            </motion.article>
            <motion.article className={styles.feedbackText} {...fadeInMotion(1.2,0)}>
                <p>{texFeedback}</p>
            </motion.article>
        </section>
    )
}

export { Feedback };