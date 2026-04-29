import type { JSX } from "react";
import { motion } from 'framer-motion';
import { ITranslations } from "../../interfaces";

import styles from './videoModal.module.css';

type Props = {
    isPlaying: boolean;
    isMuted: boolean;
    progress: number;
    t: ITranslations;
    handlePlay: () => void;
    handlePause: () => void;
    handleMute: () => void;
    handleUnmute: () => void;
    handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VideoModalControls = ({ 
    isPlaying,
    isMuted,
    progress,
    t,
    handlePlay,
    handlePause,
    handleMute,
    handleUnmute,
    handleProgressClick    
}:Props):JSX.Element => {
    return (
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
                    { t('videoModal.play') }
                    </button>
                ) : (
                    <button className={styles.controlBtn} onClick={handlePause}>
                    { t('videoModal.pause') }
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
                    {t('videoModal.mute')}
                    </button>
                ) : (
                    <button className={styles.controlBtn} onClick={handleUnmute}>
                    {t('videoModal.unmute')}
                    </button>
                )}
            </div>
        </motion.div>
    )
}



export { VideoModalControls }