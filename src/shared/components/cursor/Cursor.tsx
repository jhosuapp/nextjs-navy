import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue } from 'framer-motion';

import styles from './cursor.module.css';
import pick from '@/config/assets/png/icon-pick.png';
import { useCursorStore } from "@/shared/stores";

const Cursor = ():JSX.Element => {
    const coords = useCursorStore( state => state.coords );
    const setCoords = useCursorStore( state => state.setCoords );
    const initCoords = coords.clientX === 0 && coords.clientY === 0;
    //Get body
    const body = document.body;
    //Handler when mouse move
    const handleMousemove = (e:MouseEvent)=>{
        const { clientX, clientY } = e;
        setCoords({clientX, clientY });
    }
    //Mount and unmount listener
    useEffect(()=>{
        body?.addEventListener('mousemove', handleMousemove);
        //Unmount
        return ()=> {
            body?.removeEventListener('mousemove', handleMousemove);
        }
    }, []);
    // Use motion value and spring to animate the cursor position
    const motionX = useMotionValue(coords.clientX);
    const motionY = useMotionValue(coords.clientY);
    // Use spring to animate the cursor position
    const springX = useSpring(motionX, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    const springY = useSpring(motionY, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    // Update motion values when coords change
    useEffect(() => {
        motionX.set(coords.clientX);
        motionY.set(coords.clientY);
    }, [coords.clientX, coords.clientY]);

    return (
        <motion.div 
            className={ `${styles.cursor} ${initCoords && 'opacity-0'}` }
            style={{ 
                left: springX, 
                top: springY,
            }} 
        >
            <Image src={ pick } alt="espada blotcraft"></Image>
        </motion.div>
    )
}

export { Cursor }