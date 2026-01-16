import { ReactNode } from "react";
import { motion } from 'framer-motion';

import styles from './cardWrapperSecondary.module.css';
import { fadeUpMotion } from "@/shared/motion";
import { Divider } from "@/shared/components";

type Props = {
    children: ReactNode;
    title: string;
    text: string;
    isSmallGrid?: boolean;
}

const CardWrappersecondary = ({ children, title, text, isSmallGrid = false }:Props):JSX.Element => {
    return (
        <section className={ `${styles.cardWrappersecondary} ${isSmallGrid && styles.cardWrappersecondarySmall}` }>
            <motion.div {...fadeUpMotion(0.7, 0.13)}>
                <article className={ styles.cardWrappersecondary__top }>
                    <h2 className={ styles.cardWrappersecondary__title }>{ title }</h2>
                    <div className={ styles.cardWrappersecondary__chip }>
                        <p>{ text }</p>
                    </div>
                </article>
                <Divider />
            </motion.div>
            <article className={ styles.cardWrappersecondary__content }>
                { children }
            </article>
        </section>
    )
}

export { CardWrappersecondary } 