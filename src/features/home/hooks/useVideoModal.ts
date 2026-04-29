import { useRef, useState, useEffect, useCallback } from 'react';
import { UseVimeoModalReturn, VimeoPlayerInstance } from '../interfaces';
import { loadVimeoScript, waitForRef } from '../helpers';


const useVimeoModal = (): UseVimeoModalReturn => {
    const iframeRef   = useRef<HTMLIFrameElement>(null);
    const playerRef   = useRef<VimeoPlayerInstance | null>(null);
    const scriptReady = useRef(false);
    const durationRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [isOpen,    setIsOpen]    = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted,   setIsMuted]   = useState(false);
    const [progress,  setProgress]  = useState(0);
    const [mounted, setMounted] = useState(false);

    const initPlayer = useCallback(async () => {
        if (playerRef.current) return playerRef.current;

        if (!scriptReady.current) {
            await loadVimeoScript();
            scriptReady.current = true;
        }

        const iframe = await waitForRef(iframeRef);

        const player = new window.Vimeo.Player(iframe as HTMLIFrameElement);
        playerRef.current = player;

        const d = await player.getDuration();
        durationRef.current = d;

        return player;
    }, []);

    // ── Progress polling (only while open) ───────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;

        intervalRef.current = setInterval(async () => {
            if (!playerRef.current || durationRef.current === 0) return;
            try {
                const seconds = await playerRef.current.getCurrentTime();
                setProgress((seconds / durationRef.current) * 100);
            } catch {  }
        }, 500);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isOpen]);

    // ── openModal ─────────────────────────────────────────────────────────────
    const openModal = useCallback(
        async (videoId: string | number) => {
            setIsOpen(true);

            try {
                const player = await initPlayer();

                await player.loadVideo(videoId);
                const d = await player.getDuration();
                durationRef.current = d;

                await player.play();
                await player.setVolume(1);

                setIsPlaying(true);
                setIsMuted(false);
                setProgress(0);
            } catch (err) {
                console.error('Error opening modal video:', err);
            }
        },
        [initPlayer]
    );

    // ── closeModal ────────────────────────────────────────────────────────────
    const closeModal = useCallback(async () => {
        setIsOpen(false);
        setIsPlaying(false);
        setProgress(0);

        if (playerRef.current) {
            try {
                await playerRef.current.pause();
            } catch { }

            try {
                await playerRef.current.destroy();
            } catch {  }

            playerRef.current = null;
            durationRef.current = 0;
        }
    }, []);

    // ── Playback controls ─────────────────────────────────────────────────────
    const handlePlay = useCallback(async () => {
        try {
            const player = await initPlayer();
            await player.play();
            setIsPlaying(true);
        } catch (err) {
            console.error('Error playing:', err);
        }
    }, [initPlayer]);

    const handlePause = useCallback(async () => {
        if (!playerRef.current) return;
        await playerRef.current.pause();
        setIsPlaying(false);
    }, []);

    const handleMute = useCallback(async () => {
        if (!playerRef.current) return;
        await playerRef.current.setVolume(0);
        setIsMuted(true);
    }, []);

    const handleUnmute = useCallback(async () => {
        if (!playerRef.current) return;
        await playerRef.current.setVolume(1);
        setIsMuted(false);
    }, []);

    const handleProgressClick = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            if (!playerRef.current || durationRef.current === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            await playerRef.current.setCurrentTime(percent * durationRef.current);
        },
        []
    );

    useEffect(() => setMounted(true), []);

    return {
        iframeRef,
        isOpen,
        isPlaying,
        isMuted,
        progress,
        openModal,
        closeModal,
        handlePlay,
        handlePause,
        handleMute,
        handleUnmute,
        handleProgressClick,
        mounted
    };
}

export { useVimeoModal }