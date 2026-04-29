import { useRef, useState, useEffect, useCallback } from 'react';

declare global {
    interface Window {
        Vimeo: {
            Player: new (element: HTMLIFrameElement) => VimeoPlayerInstance;
        };
    }
}

interface VimeoPlayerInstance {
    play(): Promise<void>;
    pause(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    setCurrentTime(time: number): Promise<void>;
    getCurrentTime(): Promise<number>;
    getDuration(): Promise<number>;
    loadVideo(id: string | number): Promise<void>;
}

const loadVimeoScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return;
        if (window.Vimeo) { resolve(); return; }

        const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://player.vimeo.com/api/player.js"]'
        );
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Vimeo script failed to load'));
        document.body.appendChild(script);
    });
};

function waitForRef<T>(
    ref: React.RefObject<T>,
    { interval = 20, timeout = 5000 } = {}
): Promise<T> {
    return new Promise((resolve, reject) => {
        if (ref.current) { resolve(ref.current); return; }

        const start = Date.now();
        const id = setInterval(() => {
            if (ref.current) {
                clearInterval(id);
                resolve(ref.current);
            } else if (Date.now() - start > timeout) {
                clearInterval(id);
                reject(new Error('Timed out waiting for iframe ref'));
            }
        }, interval);
    });
}

interface UseVimeoModalOptions {
    defaultVideoId?: string | number;
}

export interface UseVimeoModalReturn {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isOpen: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  openModal: (videoId: string | number) => Promise<void>;
  closeModal: () => Promise<void>;
  handlePlay: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleMute: () => Promise<void>;
  handleUnmute: () => Promise<void>;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
}

export function useVimeoModal({
  defaultVideoId,
}: UseVimeoModalOptions = {}): UseVimeoModalReturn {
  const iframeRef   = useRef<HTMLIFrameElement>(null);
  const playerRef   = useRef<VimeoPlayerInstance | null>(null);
  const scriptReady = useRef(false);
  const durationRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isOpen,    setIsOpen]    = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted,   setIsMuted]   = useState(false);
  const [progress,  setProgress]  = useState(0);

  // ── Init player ───────────────────────────────────────────────────────────
  // Sets isOpen first so React renders the iframe, then waits for the ref
  // to be populated before creating the Vimeo.Player instance.
  const initPlayer = useCallback(async () => {
    if (playerRef.current) return playerRef.current;

    if (!scriptReady.current) {
      await loadVimeoScript();
      scriptReady.current = true;
    }

    // iframeRef.current may still be null right after setIsOpen(true)
    // because React hasn't committed the render yet — poll until it appears.
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
      } catch {
        // player not ready yet — ignore
      }
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  // ── openModal ─────────────────────────────────────────────────────────────
  const openModal = useCallback(
    async (videoId: string | number) => {
      setIsOpen(true); // renders the iframe — waitForRef will detect it

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

    if (!playerRef.current) return;

    try {
      await playerRef.current.pause();

      if (defaultVideoId) {
        setTimeout(async () => {
          try {
            await playerRef.current?.loadVideo(defaultVideoId);
          } catch {
            // player may be gone after exit animation
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error closing modal:', err);
    }
  }, [defaultVideoId]);

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
  };
}