import { type JSX } from "react";
import styles from './loader.module.css';
import { motion } from 'framer-motion';
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";

const Loader = ():JSX.Element => {

    return (
        <motion.section className={styles.loader} {...fadeInMotion(0.1, 0)}>
            <article className={styles.loader__bg}></article>
            <article className={`${styles.loader__bg} ${styles.loader__bg__secondary}`}></article>
            <article className={styles.loader__content}>
                <div className={styles.loader__text}>
                    <p style={{ animationDelay: '0.1s' }} className={`text-primary ${styles.navy}`}>N</p>
                    <p style={{ animationDelay: '0.125s' }} className={`text-fifth ${styles.navy}`}>A</p>
                    <p style={{ animationDelay: '0.150s' }} className={`text-primary ${styles.navy}`}>V</p>
                    <p style={{ animationDelay: '0.175s' }} className={`text-fifth ${styles.navy}`}>Y</p>
                    <p style={{ animationDelay: '0.175s' }} className={`text-fifth ${styles.craft}`}>&nbsp;</p>
                    <p style={{ animationDelay: '0.2s' }} className={`text-primary ${styles.craft}`}>P</p>
                    <p style={{ animationDelay: '0.225s' }} className={`text-fifth ${styles.craft}`}>V</p>
                    <p style={{ animationDelay: '0.250s' }} className={`text-primary ${styles.craft}`}>P</p>
                </div>
            </article>
        </motion.section>
    )
}

export { Loader }