import Image from "next/image";
import { useEffect, useState, type JSX } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { ITranslations } from "@/shared/interfaces/globals";

import styles from './videoModal.module.css';

type Props = {
    isOpen: boolean;
    t: ITranslations;
    closeModal: () => void;
}

const VideoModalFollower = ({ isOpen, t, closeModal }:Props):JSX.Element => {
    const [followerActive, setFollowerActive] = useState(false);
    const [followerSmall, setFollowerSmall] = useState(true);
    const mouseX = useMotionValue(-200);
    const mouseY = useMotionValue(-200);
    
    const springConfig = {
        stiffness: 100,
        damping: 8,
        mass: 0.5
    };
    
    const followerX = useSpring(mouseX, springConfig);
    const followerY = useSpring(mouseY, springConfig);
      
    useEffect(() => {
        if (!isOpen) return;
        
        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [isOpen, mouseX, mouseY]);

    // Block body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <motion.div
                className={`${styles.follower} ${followerSmall ? styles.followerSmall : ''}`}
                style={{
                    left: followerX,
                    top: followerY,
                    opacity: followerActive ? 1 : 0,
                }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: { duration: 2 }
                }}
                >
                <Image src="/images/icon-close-white.svg" width={24} height={24} alt="Navy imagen cerrar" />
            </motion.div>
            {/* ── Overlay close area (desktop) ── */}
            <div
                className={styles.closeSecondary}
                onClick={closeModal}
                onMouseEnter={() => {
                    setFollowerActive(true);
                    setFollowerSmall(false);
                }}
                onMouseLeave={() => {
                    setFollowerActive(false);
                    setFollowerSmall(true);
                }}
                aria-label={ t('videoModal.close') }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && closeModal()}
            />
            {/* ── Mobile close button ── */}
            <button
                className={`${styles.closeButton} close-video-modal`}
                onClick={closeModal}
                aria-label={ t('videoModal.close') }
            >
                <Image src="/images/icon-close-white.svg" width={24} height={24} alt="Navy imagen cerrar" />
            </button>
        </>
    )
}

export { VideoModalFollower }