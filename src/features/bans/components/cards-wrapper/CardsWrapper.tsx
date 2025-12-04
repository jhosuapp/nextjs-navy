import { ReactNode } from "react";
import { motion } from 'framer-motion';

import styles from './cardsWrapper.module.css';
import { fadeUpMotion } from "@/shared/motion";

type Props = {
    children: ReactNode;
    title: string;
}

const CardsWrapper = ({ children, title }:Props):JSX.Element => {
    return (
        <section className={ styles.cardsWrapper }>
            <motion.h2 className={ styles.cardsWrapper__title } {...fadeUpMotion(0.7, 0.13)}>{ title }</motion.h2>
            <article className={ styles.cardsWrapper__content }>
                { children }
            </article>
        </section>
    )
}

export { CardsWrapper } 