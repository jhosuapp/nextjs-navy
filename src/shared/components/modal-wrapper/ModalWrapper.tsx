import Image from 'next/image';
import { ReactNode, useEffect, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { fadeUpMotion } from '@/shared/motion/fadeUp.motion';

import styles from './modalWrapper.module.css';
import iconClose from '@/config/assets/svg/icon-close.svg';

type Props = {
    children: ReactNode;
    callBackClose: ()=> void;
}

const ModalWrapper = ({ children, callBackClose }:Props):JSX.Element | null => {
    const [mounted, setMounted] = useState(false);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        setPortalRoot(document.getElementById('portal-modal'));
    }, []);
    
    if (!mounted || !portalRoot) return null;

    return createPortal(
        <motion.section
            className={ styles.modal }
            {...fadeInMotion()}
        >
            <article className={ styles.modalBg } onClick={ callBackClose }></article>
            <motion.article 
                className={ styles.modalContent }
                {...fadeUpMotion(0, 0.1)}
            >
                <button className={ styles.modalClose } onClick={ callBackClose }>
                    <Image src={ iconClose } alt='icon close'/>
                </button>
                { children }
            </motion.article>
        </motion.section>,
        portalRoot
    )
}

export { ModalWrapper }