import { memo, type CSSProperties, type JSX } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ITranslations } from "@/shared/interfaces/globals";
import { spotifyEmbedUrl } from "@/shared/constants/staffProfile";
import { StaffSong } from "../../interfaces";
import type { SpotifyPlayerState } from "../../hooks/useSpotifyPlayer";

import styles from './cardStaffSong.module.css';

type Props = {
    song: StaffSong;
    nick: string;
    tint: string;
    /** `null` = esta canción no es la que está en el reproductor. */
    state: SpotifyPlayerState | null;
    onPrepare: (trackId: string) => void;
    onToggle: (trackId: string) => void;
    onStop: () => void;
    t: ITranslations;
}

const PlayIcon = (): JSX.Element => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" /></svg>
);

const PauseIcon = (): JSX.Element => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" /></svg>
);

/**
 * Chip de la canción: es el propio reproductor (el iframe de Spotify va oculto
 * y lo controla `useSpotifyPlayer`). Solo si el navegador no deja arrancar el
 * audio se despliega el reproductor oficial para darle play a mano.
 */
const CardStaffSong = memo(({ song, nick, tint, state, onPrepare, onToggle, onStop, t }: Props): JSX.Element => {
    const reduceMotion = useReducedMotion();
    const status = state?.status ?? 'idle';
    const isPlaying = status === 'playing';
    const isLoading = status === 'loading';
    const isFallback = status === 'fallback';
    const panelId = `song-${song.id}`;

    const label = isPlaying
        ? t('song.pause', { title: song.title })
        : t('song.play', { title: song.title, artist: song.artist });

    const prepare = () => onPrepare(song.id);

    return (
        <div className={ styles.cardStaffSong } style={{ '--song-tint': tint } as CSSProperties}>
            {/* El chip y el reproductor de respaldo nunca se ven a la vez: uno sustituye al otro. */}
            <AnimatePresence mode="wait" initial={ false }>
                {isFallback ? (
                    <motion.div
                        key="fallback"
                        id={ panelId }
                        className={ styles.cardStaffSong__panel }
                        initial={ reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 } }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={ reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 } }
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <iframe
                            className={ styles.cardStaffSong__embed }
                            src={ spotifyEmbedUrl(song.id) }
                            title={ t('song.player', { nick }) }
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        />
                        <p className={ styles.cardStaffSong__fallback }>
                            { t('song.fallback') }
                            <button type="button" onClick={ onStop }>{ t('song.dismiss') }</button>
                        </p>
                    </motion.div>
                ) : (
                    <motion.button
                        key="chip"
                        type="button"
                        className={ `${styles.cardStaffSong__chip} ${status !== 'idle' ? styles.cardStaffSong__chip__active : ''} ${isPlaying ? styles.cardStaffSong__chip__playing : ''}` }
                        aria-label={ label }
                        aria-pressed={ isPlaying }
                        aria-busy={ isLoading }
                        onPointerEnter={ prepare }
                        onPointerDown={ prepare }
                        onFocus={ prepare }
                        onClick={ () => onToggle(song.id) }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <span className={ styles.cardStaffSong__aura } aria-hidden="true" />
                        <span className={ styles.cardStaffSong__disc } aria-hidden="true">
                            {song.cover && <img src={ song.cover } alt="" loading="lazy" />}
                        </span>
                        <span className={ styles.cardStaffSong__text }>
                            <span className={ styles.cardStaffSong__title }>{ song.title }</span>
                            <span className={ styles.cardStaffSong__artist }>{ song.artist }</span>
                        </span>
                        {isPlaying && (
                            <span className={ styles.cardStaffSong__bars } aria-hidden="true">
                                <span /><span /><span /><span />
                            </span>
                        )}
                        <span className={ `${styles.cardStaffSong__action} ${isLoading ? styles.cardStaffSong__action__loading : ''}` } aria-hidden="true">
                            { isPlaying ? <PauseIcon /> : <PlayIcon /> }
                        </span>
                        <span className={ styles.cardStaffSong__progress } aria-hidden="true">
                            <span style={{ transform: `scaleX(${state?.progress ?? 0})` }} />
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
});

CardStaffSong.displayName = 'CardStaffSong';

export { CardStaffSong }
