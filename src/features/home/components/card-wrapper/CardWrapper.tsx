import Image from "next/image";
import { motion } from 'framer-motion';

import styles from './cardWrapper.module.css';
import { fadeUpMotion } from "@/shared/motion";

type Props = {
    title: string;
    icon: string;
    children: React.ReactNode;
    animation?: { 
        delayInit: number;
        delayEnd: number;
     }
}

const CardWrapper = ({ title, icon, animation = { delayInit: 0.7, delayEnd: 0.13 }, children }:Props):JSX.Element => {
    return (
        <motion.section className={ styles.cardWrapper } {...fadeUpMotion(animation.delayInit, animation.delayEnd)} >
            <article className={ styles.cardWrapper__title }>
                <h2>{ title }</h2>
                <Image src={ icon } alt="test" width={20} height={20} />
            </article>
            <article className={ styles.cardWrapper__content }>
                { children }
            </article>
        </motion.section>
    )
}

export { CardWrapper }