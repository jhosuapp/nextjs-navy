import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, useScroll } from 'framer-motion';
import { ChipModalities, PropsChipModalities } from '@/shared/components';

import styles from './counter.module.css';

type Props = {
    value: number;
    label: string;
    suffix?: string;
    index: number;
} & PropsChipModalities;

const AnimatedCounter = ({ value, label, suffix = '', index, modalitie, modalitieImage }:Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [hasAnimated, setHasAnimated] = useState(false);
    
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [0, -100 * (index + 1)]);
    const motionValue = useSpring(0, {
        damping: 30,
        stiffness: 100
    });
    
    const rounded = useTransform(motionValue, latest => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        if (isInView && !hasAnimated) {
            motionValue.set(value);
            setHasAnimated(true);
        }
    }, [isInView, value, motionValue, hasAnimated]);
    
    useEffect(() => {
        return rounded.on('change', latest => setDisplayValue(latest));
    }, [rounded]);
    
    return (
        <motion.div
            ref={ref}
            style={{ y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { 
                opacity: 1, 
                scale: 1 
            } : {}}
            transition={{
                duration: 0.6,
                delay: index * -0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={ styles.counter }
        >
            <motion.div
                transition={{ 
                    delay: 0.2 + (index * 0.15),
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                }}
                className={ styles.counter__block }
            >   
                <div className={ styles.counter__modalities }>
                    <ChipModalities modalitie={ modalitie } modalitieImage={ modalitieImage } isButton />
                </div>
                <div className={ styles.counter__text }>
                    {displayValue}{suffix}
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + (index * 0.15) }}
                    className={ styles.counter__label }
                >
                    {label}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export { AnimatedCounter }