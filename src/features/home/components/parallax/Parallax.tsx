import { useEffect, useState, type JSX } from "react";
import { motion } from 'framer-motion';

import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { flowerMotion } from '@/shared/motion/flower.motion';
import { Flower } from '@/shared/components/flower/Flower';

import styles from './parallax.module.css';

type Props = {
    enableSomeFlowers?: boolean;
}

const FlowersFirstScreen = ({ enableSomeFlowers = true }:Props):JSX.Element => {
    const [height, setHeight] = useState(() => {
        if (typeof window !== "undefined") {
          return window.innerHeight;
        }
        return 0;
    });

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const setTranslateY = (number: number) => {
        return {
            initial: height * 1,
            end: (-height * 1.5) - number
        };
    };

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
                    alt='flor Navy'
                    factor={0.6}
                    translateY={ setTranslateY(400) }
                    parallaxFactor={1.2}
                />

                <Flower
                    {...flowerMotion(1, 0)}
                    className={ styles.flowersFirstScreen__flower__secondary }
                    src='/images/flower-2.png' 
                    alt='flor Navy'
                    factor={0.5}
                    translateY={ setTranslateY(50) }
                    parallaxFactor={1.1}
                />

                {enableSomeFlowers && (
                    <>
                        <Flower
                            {...flowerMotion(1, 0)}
                            className={ `${styles.flowersFirstScreen__flower} ${styles.flowersFirstScreen__flower__bottom}` }
                            src='/images/flower-1.png' 
                            alt='flor Navy'
                            factor={0.6}
                            translateY={ setTranslateY(400) }
                            parallaxFactor={1.2}
                        />

                        <Flower
                            {...flowerMotion(1, 0)}
                            className={ `${styles.flowersFirstScreen__flower} ${styles.flowersFirstScreen__flower__bottom__two}` }
                            src='/images/flower-1.png' 
                            alt='flor Navy'
                            factor={0.5}
                            translateY={ setTranslateY(50) }
                            parallaxFactor={1.1}
                        />

  
                        <Flower
                            {...flowerMotion(1, 0)}
                            className={ `${styles.flowersFirstScreen__flower__secondary} ${styles.flowersFirstScreen__flower__secondary__bottom}` }
                            src='/images/flower-2.png' 
                            alt='flor Navy'
                            factor={0.5}
                            translateY={ setTranslateY(50) }
                            parallaxFactor={1.1}
                        />
                    </>
                )}
            </section>
            {/* End Flowers */}
        </motion.section>
    )
}

export { FlowersFirstScreen }