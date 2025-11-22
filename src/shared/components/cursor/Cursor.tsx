import { useEffect } from "react";
import { motion, useSpring, useMotionValue } from 'framer-motion';
import styles from './cursor.module.css';
import { useCursorStore } from "@/shared/stores";
import { useMediaQuery } from "@/shared/hooks";

const Cursor = (): JSX.Element => {
    const isDesktop = useMediaQuery({});
    const coords = useCursorStore(state => state.coords);
    const setCoords = useCursorStore(state => state.setCoords);
    const initCoords = coords.clientX === 0 && coords.clientY === 0;
    const motionX = useMotionValue(coords.clientX);
    const motionY = useMotionValue(coords.clientY);

    const springConfig = { stiffness: 100, damping: 40, mass: 1.5 };
    const springX = useSpring(motionX, springConfig);
    const springY = useSpring(motionY, springConfig);

    useEffect(() => {
        const handleMousemove = (e: MouseEvent) => {
            setCoords({ clientX: e.clientX, clientY: e.clientY });
        };
        document.body.addEventListener('mousemove', handleMousemove);
        return () => document.body.removeEventListener('mousemove', handleMousemove);
    }, [setCoords]);

    useEffect(() => {
        motionX.set(coords.clientX);
        motionY.set(coords.clientY);
    }, [coords.clientX, coords.clientY, motionX, motionY]);

    if(!isDesktop){
        return (
            <>
            </>
        )
    }

    return (
        <motion.div
            className={`${styles.cursor} ${initCoords ? 'opacity-0' : ''}`}
            style={{
                left: springX,
                top: springY,
                x: '-50%',
                y: '-50%',
            }}
        >
            {/* Glow exterior */}
            <div className={styles.glowOuter} />
            {/* Glow medio */}
            <div className={styles.glowMid} />
            {/* Núcleo brillante */}
            <div className={styles.glowCore} />
        </motion.div>
    );
};

export { Cursor };