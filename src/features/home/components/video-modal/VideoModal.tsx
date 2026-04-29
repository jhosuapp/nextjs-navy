'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { UseVimeoModalReturn } from '../../interfaces';
import { VideoModalFollower } from './VideoModalFollower';
import { VideoModalControls } from './VideoModalControls';
import { ITranslations } from '@/shared/interfaces/globals';

import styles from './videoModal.module.css';

type VideoModalProps = {
    vimeo: UseVimeoModalReturn;
    iframeSrc: string;
    t: ITranslations;
}

const VideoModal = ({ vimeo, iframeSrc, t }: VideoModalProps) => {
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
                    {/* ── Follower cursor ── */}
                    <VideoModalFollower 
                        t={ t }
                        closeModal={ closeModal }
                        isOpen={ isOpen }
                    />

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

                    <VideoModalControls
                        isPlaying={isPlaying}
                        isMuted={isMuted}
                        progress={progress}
                        t={ t }
                        handlePlay={handlePlay}
                        handlePause={handlePause}
                        handleMute={handleMute}
                        handleUnmute={handleUnmute}
                        handleProgressClick={handleProgressClick}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}


export { VideoModal };