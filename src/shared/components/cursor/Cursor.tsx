import { useEffect, type JSX } from "react";
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMediaQuery } from "@/shared/hooks/useMediaquery";

import styles from './cursor.module.css';

const Cursor = (): JSX.Element => {
    const isDesktop = useMediaQuery({});

    const motionX = useMotionValue(0);
    const motionY = useMotionValue(0);

    const springConfig = { stiffness: 100, damping: 40, mass: 1.5 };
    const springX = useSpring(motionX, springConfig);
    const springY = useSpring(motionY, springConfig);

    useEffect(() => {
        if (!isDesktop) return;

        const handleMousemove = (e: MouseEvent) => {
            motionX.set(e.clientX);
            motionY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMousemove);

        return () => {
            window.removeEventListener('mousemove', handleMousemove);
        };
    }, [isDesktop, motionX, motionY]);

    if (!isDesktop) return <></>;

    return (
        <motion.div
            className={styles.cursor}
            style={{
                left: springX,
                top: springY,
                x: '-50%',
                y: '-50%',
            }}
        >
            <div className={styles.glowOuter} />
            <div className={styles.glowMid} />
            <div className={styles.glowCore} />
        </motion.div>
    );
};

export { Cursor };