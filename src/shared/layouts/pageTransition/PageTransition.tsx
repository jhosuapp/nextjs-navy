import React, { ReactNode, useEffect, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import { anim, text, } from './pageTransition.motion';
import { routes } from '@/shared/constants';
import { SVG } from './PageTransitionSVG';
import { useLoaderStore } from '@/shared/stores/loader.store';
import { useModalStore } from '@/shared/stores/modal.store';
import { ModalUser } from '@/shared/components/modal-user/ModalUser';

import styles from './pageTransition.module.css';

type Props = {
    children: ReactNode;
}

const PageTransition = ({ children }:Props):JSX.Element => {
    const router = useRouter();
    const { t } = useTranslation("common");
    const isLoadingDelay = useLoaderStore( state => state.isLoadingDelay );
    const showModal = useModalStore( state => state.showModal );
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
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
            <AnimatePresence mode="wait">
                {showModal && <ModalUser />}
            </AnimatePresence>
            <div style={{opacity: dimensions.width == null ? 1 : 0}} className={ styles.curve__bg } />
            {isLoadingDelay ? (
                <motion.p 
                    className={ `${styles.curve__route} ${styles.curve__route__transition}` } 
                    {...anim(text)}
                >
                    Navy Tierlist
                </motion.p>
            ) : (
                <motion.p className={ `${styles.curve__route}` } {...anim(text)}>
                    {t(`nav.${routes[router.route]}`) ?? '404'}
                </motion.p>
            )}
            {dimensions.width != null && dimensions.height != null && (
                <div className={ styles.curve__svg }>
                    <SVG width={dimensions.width} height={ dimensions.height } />
                </div>
            )}
            { children }
        </div>
    )
}

export { PageTransition }