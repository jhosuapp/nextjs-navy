import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { anim, text, } from './pageTransition.motion';
import { routes } from '@/shared/constants';
import { SVG } from './PageTransitionSVG';
import { useLoaderStore } from '@/shared/stores';

import styles from './pageTransition.module.css';

type Props = {
    children: ReactNode;
}

const PageTransition = ({ children }:Props):JSX.Element => {
    const router = useRouter();
    const isLoadingDelay = useLoaderStore( state => state.isLoadingDelay );
    const [dimensions, setDimensions] = useState({
        width: null,
        height: null
    });

    useEffect( () => {
        function resize(){
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        }
    }, []);

    return (
        <div 
            className={ styles.curve }
        >
            <div style={{opacity: dimensions.width == null ? 1 : 0}} className={ styles.curve__bg } />
            {isLoadingDelay ? (
                <motion.p 
                    className={ `${styles.curve__route} ${styles.curve__route__transition}` } 
                    {...anim(text)}
                >
                    Cargando
                </motion.p>
            ) : (
                <motion.p className={ styles.curve__route } {...anim(text)}>
                    {routes[router.route] ?? '404'}
                </motion.p>
            )}
            {dimensions.width != null && (
                <div className={ styles.curve__svg }>
                    <SVG {...dimensions}/>
                </div>
            )}
            { children }
        </div>
    )
}

export { PageTransition }