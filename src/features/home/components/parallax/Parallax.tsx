import type { JSX } from "react";
import { motion } from 'framer-motion';

import { fadeInMotion, flowerMotion } from '@/shared/motion';
import { Flower } from '@/shared/components';

import styles from './parallax.module.css';

const FlowersFirstScreen = ():JSX.Element => {
    const setTranslateY = (number: number) => {
        const translateY = { initial: (window.innerHeight * 1), end: ((-window.innerHeight * 1.5) - number) }

        return translateY;
    }

    return (
        <motion.section 
            {...fadeInMotion(0,0)}
            className={ styles.flowersFirstScreen }
        >

            {/* Flowers */}
            <section className={ styles.flowersFirstScreen__content__flowers }>
                <Flower
                    {...flowerMotion(1, 0)}
                    className={ `${styles.flowersFirstScreen__flower}` }
                    src='/images/flower-1.png' 
                    alt='flor victoria'
                    factor={0.6}
                    translateY={ setTranslateY(400) }
                    parallaxFactor={1.2}
                />

                <Flower
                    {...flowerMotion(1, 0)}
                    className={ `${styles.flowersFirstScreen__flower} ${styles.flowersFirstScreen__flower__bottom}` }
                    src='/images/flower-1.png' 
                    alt='flor victoria'
                    factor={0.6}
                    translateY={ setTranslateY(400) }
                    parallaxFactor={1.2}
                />

                <Flower
                    {...flowerMotion(1, 0)}
                    className={ `${styles.flowersFirstScreen__flower} ${styles.flowersFirstScreen__flower__bottom__two}` }
                    src='/images/flower-1.png' 
                    alt='flor victoria'
                    factor={0.5}
                    translateY={ setTranslateY(50) }
                    parallaxFactor={1.1}
                />

                <Flower
                    {...flowerMotion(1, 0)}
                    className={ styles.flowersFirstScreen__flower__secondary }
                    src='/images/flower-2.png' 
                    alt='flor victoria'
                    factor={0.5}
                    translateY={ setTranslateY(50) }
                    parallaxFactor={1.1}
                />
                <Flower
                    {...flowerMotion(1, 0)}
                    className={ `${styles.flowersFirstScreen__flower__secondary} ${styles.flowersFirstScreen__flower__secondary__bottom}` }
                    src='/images/flower-2.png' 
                    alt='flor victoria'
                    factor={0.5}
                    translateY={ setTranslateY(50) }
                    parallaxFactor={1.1}
                />
            </section>
            {/* End Flowers */}
        </motion.section>
    )
}

export { FlowersFirstScreen }