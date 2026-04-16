import { ReactNode, type JSX } from "react";
import { motion } from 'framer-motion';
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { Divider } from "@/shared/components/divider/Divider";
import { Search } from "@/shared/components/search/Search";
import { CardWrapperSecondaryChip } from "./CardWrapperSecondaryChip";

import styles from './cardWrapperSecondary.module.css';

type Props = {
    children: ReactNode;
    title: string;
    text?: string;
    isSmallGrid?: boolean;
    hasSearch?: boolean;
    hasAnimation?: boolean;
    placeholder?: string;
}

const CardWrappersecondary = ({ children, title, text = '', isSmallGrid = false, hasSearch = false, hasAnimation = false, placeholder = '' }:Props):JSX.Element => {
    return (
        <section className={ `${styles.cardWrappersecondary} ${isSmallGrid && styles.cardWrappersecondarySmall}` }>
            <motion.div {...fadeUpMotion(0.7, 0.13)}>
                <article className={ styles.cardWrappersecondary__top }>
                    <h2 className={ styles.cardWrappersecondary__title }>{ title }</h2>
                    {hasSearch ? (
                        <Search placeholder={ placeholder } />
                    ) : (
                        <CardWrapperSecondaryChip text={ text } />
                    )}
                </article>
                <Divider />
            </motion.div>
            {hasAnimation ? (
                <motion.article className={ styles.cardWrappersecondary__content } {...fadeUpMotion(0.7, 0.13)}>
                    { children }
                </motion.article>
            ) : (
                <article className={ styles.cardWrappersecondary__content }>
                    { children }
                </article>
            )}
        </section>
    )
}

export { CardWrappersecondary } 