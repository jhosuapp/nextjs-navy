import type { JSX } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';

import styles from './cardWrapper.module.css';
import { fadeInMotion, fadeUpMotion } from "@/shared/motion";
import { Divider } from "@/shared/components";


type Props = {
    title?: string;
    icon?: string;
    children: React.ReactNode;
    className?: string;
    classNameParent?: string;
    animation?: { 
        delayInit: number;
        delayEnd: number;
    }
    isFadeUp?: boolean 
}

const CardWrapper = ({ title, icon, className = '', classNameParent = '', isFadeUp = true, animation = { delayInit: 0.7, delayEnd: 0.13 }, children }:Props):JSX.Element => {
    const motionProps =
        isFadeUp
            ? fadeUpMotion(animation.delayInit, animation.delayEnd)
            : fadeInMotion(animation.delayInit, animation.delayEnd);

    return (
        <motion.section className={ `${styles.cardWrapper} ${classNameParent}` } {...motionProps} >
            {title && (
                <>
                    <article className={ styles.cardWrapper__title }>
                        <h2>{ title }</h2>
                        <Image src={ icon } alt="test" width={20} height={20} />
                    </article>
                    <Divider></Divider>
                </>
            )}
            <article className={ `${styles.cardWrapper__content} ${className}` }>
                { children }
            </article>
        </motion.section>
    )
}

export { CardWrapper }