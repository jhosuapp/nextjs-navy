'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { UseVimeoModalReturn } from '../../hooks';

import styles from './videoModal.module.css';
import Image from 'next/image';

type VideoModalProps = {
    vimeo: UseVimeoModalReturn;
    iframeSrc: string;
    locale?: 'en' | 'es';
}

const VideoModal = ({ vimeo, iframeSrc, locale = 'es' }: VideoModalProps) => {
    const {
        iframeRef,
        isOpen,
        isPlaying,
        isMuted,
        progress,
        closeModal,
        handlePlay,
        handlePause,
        handleMute,
        handleUnmute,
        handleProgressClick,
    } = vimeo;

    // ── Follower cursor ──────────────────────────────────────────────
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

    const labels = {
        play: locale === 'en' ? 'Play' : 'Reproducir',
        pause: locale === 'en' ? 'Pause' : 'Pausar',
        mute: locale === 'en' ? 'Mute' : 'Silenciar',
        unmute: locale === 'en' ? 'Unmute' : 'Activar sonido',
        close: locale === 'en' ? 'Close video' : 'Cerrar video',
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
                key="video-modal"
                className={styles.modal}
                style={{ pointerEvents: 'all' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {/* ── Follower cursor (desktop) ── */}
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
                    aria-label={labels.close}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && closeModal()}
                />

                {/* ── Mobile close button ── */}
                <button
                    className={`${styles.closeButton} close-video-modal`}
                    onClick={closeModal}
                    aria-label={labels.close}
                >
                    <Image src="/images/icon-close-white.svg" width={24} height={24} alt="Navy imagen cerrar" />
                </button>

                {/* ── Iframe ── */}
                <motion.article
                    className={styles.iframeWrapper}
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.94, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <iframe
                        ref={iframeRef}
                        id="vimeo-player"
                        src={iframeSrc}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        title="Video player"
                    />
                </motion.article>

                {/* ── Controls ── */}
                <motion.div
                    className={styles.controls}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
                >
                    {/* Play / Pause */}
                    <div>
                        {!isPlaying ? (
                            <button className={styles.controlBtn} onClick={handlePlay}>
                            {labels.play}
                            </button>
                        ) : (
                            <button className={styles.controlBtn} onClick={handlePause}>
                            {labels.pause}
                            </button>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div
                        className={styles.progressContainer}
                        onClick={handleProgressClick}
                        role="slider"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress)}
                        aria-label="Video progress"
                        tabIndex={0}
                    >
                        <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Mute / Unmute */}
                    <div>
                        {!isMuted ? (
                            <button className={styles.controlBtn} onClick={handleMute}>
                            {labels.mute}
                            </button>
                        ) : (
                            <button className={styles.controlBtn} onClick={handleUnmute}>
                            {labels.unmute}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}


export { VideoModal };