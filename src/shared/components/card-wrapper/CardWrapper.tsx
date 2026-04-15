import { memo, useMemo, type JSX } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { Divider } from "@/shared/components/divider/Divider";

import styles from './cardWrapper.module.css';


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

const DEFAULT_ANIMATION = { delayInit: 0.7, delayEnd: 0.13 };

const CardWrapper = memo(({ title, icon, className = '', classNameParent = '', isFadeUp = true, animation = DEFAULT_ANIMATION, children }:Props):JSX.Element => {
    const motionProps = useMemo(() => {
        return isFadeUp
            ? fadeUpMotion(animation.delayInit, animation.delayEnd)
            : fadeInMotion(animation.delayInit, animation.delayEnd);
    }, [isFadeUp, animation.delayInit, animation.delayEnd]);

    return (
        <motion.section className={ `${styles.cardWrapper} ${classNameParent}` } {...motionProps} >
            {title && (
                <>
                    <article className={ styles.cardWrapper__title }>
                        <h2>{ title }</h2>
                        {icon && <Image src={ icon } alt="test" width={20} height={20} />}
                    </article>
                    <Divider />
                </>
            )}
            <article className={ `${styles.cardWrapper__content} ${className}` }>
                { children }
            </article>
        </motion.section>
    )
})

export { CardWrapper }