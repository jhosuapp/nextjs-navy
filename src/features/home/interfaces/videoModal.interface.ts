export type UseVimeoModalOptions = {
    defaultVideoId?: string | number;
}

export type UseVimeoModalReturn = {
    iframeRef: React.RefObject<HTMLIFrameElement | null>;
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

export type VimeoPlayerInstance = {
    play(): Promise<void>;
    pause(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    setCurrentTime(time: number): Promise<void>;
    getCurrentTime(): Promise<number>;
    getDuration(): Promise<number>;
    loadVideo(id: string | number): Promise<void>;
}
