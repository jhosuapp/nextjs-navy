import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Un único reproductor de Spotify para toda la página de staff, controlado con
 * la iFrame API (https://developer.spotify.com/documentation/embeds/references/iframe-api).
 *
 * El iframe de Spotify vive oculto en un contenedor fijo (opacidad 0, dentro del
 * viewport: fuera de pantalla Chrome lo congela) y la UI visible es el chip de
 * cada card.
 *
 * Autoplay: el navegador solo deja sonar el audio si `play()` se llama durante
 * el clic. Crear el reproductor tarda ~2 s, así que se PRECARGA antes (al pasar
 * el ratón, enfocar o tocar el chip: `prepare`) y el clic solo llama a `play()`.
 * Si al hacer clic aún no está listo se intenta al terminar de cargar, y si en
 * `FALLBACK_MS` no suena, el estado pasa a `fallback` y la card sustituye el chip
 * por el reproductor oficial para darle play a mano.
 */

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const FALLBACK_MS = 4500;

type PlaybackUpdate = {
    data: { isPaused: boolean; isBuffering: boolean; duration: number; position: number; playingURI?: string };
};

type SpotifyController = {
    play: () => void;
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    destroy: () => void;
    addListener: {
        (event: "ready", callback: () => void): void;
        (event: "playback_update", callback: (event: PlaybackUpdate) => void): void;
    };
};

type SpotifyIFrameAPI = {
    createController: (
        element: HTMLElement,
        options: { uri: string; width?: number | string; height?: number | string },
        callback: (controller: SpotifyController) => void
    ) => void;
};

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
    }
}

let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

/** Carga el script de la iFrame API una sola vez por página. */
const loadSpotifyApi = (): Promise<SpotifyIFrameAPI> => {
    apiPromise ??= new Promise<SpotifyIFrameAPI>((resolve, reject) => {
        window.onSpotifyIframeApiReady = resolve;
        const script = document.createElement("script");
        script.src = API_SRC;
        script.async = true;
        script.onerror = () => {
            apiPromise = null;
            reject(new Error("Spotify iFrame API failed to load"));
        };
        document.body.appendChild(script);
    });
    return apiPromise;
};

export type SpotifyPlayerStatus = "idle" | "loading" | "playing" | "paused" | "fallback";

export type SpotifyPlayerState = {
    trackId: string | null;
    status: SpotifyPlayerStatus;
    /** 0–1. */
    progress: number;
};

const IDLE: SpotifyPlayerState = { trackId: null, status: "idle", progress: 0 };

const useSpotifyPlayer = () => {
    const hostRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<SpotifyController | null>(null);
    /** Canción cargada en el controller (sonando o solo precargada). */
    const loadedTrackRef = useRef<string | null>(null);
    const readyRef = useRef<boolean>(false);
    /** Se pulsó play antes de que el controller estuviera listo. */
    const pendingPlayRef = useRef<boolean>(false);
    const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [state, setState] = useState<SpotifyPlayerState>(IDLE);
    // Copia del estado para los callbacks: así su referencia no cambia con cada
    // actualización de progreso y las cards memoizadas no se re-renderizan.
    const stateRef = useRef<SpotifyPlayerState>(IDLE);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const clearFallback = () => {
        if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
    };

    const destroyController = useCallback(() => {
        clearFallback();
        controllerRef.current?.destroy();
        controllerRef.current = null;
        loadedTrackRef.current = null;
        readyRef.current = false;
        pendingPlayRef.current = false;
        if (hostRef.current) hostRef.current.replaceChildren();
    }, []);

    const armFallback = useCallback((trackId: string) => {
        clearFallback();
        fallbackTimer.current = setTimeout(() => {
            console.warn("[spotify] la reproducción no arrancó; se muestra el reproductor de Spotify");
            destroyController();
            setState((current) =>
                current.trackId === trackId && current.status === "loading"
                    ? { ...current, status: "fallback" }
                    : current
            );
        }, FALLBACK_MS);
    }, [destroyController]);

    /** Crea el controller oculto con una canción, sin reproducirla. */
    const load = useCallback(async (trackId: string) => {
        destroyController();
        loadedTrackRef.current = trackId;

        try {
            const api = await loadSpotifyApi();
            const host = hostRef.current;
            if (!host || loadedTrackRef.current !== trackId) return;

            // La API sustituye este nodo por el iframe.
            const mount = document.createElement("div");
            host.appendChild(mount);

            api.createController(mount, { uri: `spotify:track:${trackId}`, width: 300, height: 80 }, (controller) => {
                if (loadedTrackRef.current !== trackId) return void controller.destroy();
                controllerRef.current = controller;

                controller.addListener("ready", () => {
                    readyRef.current = true;
                    // Mejor esfuerzo: fuera del clic el navegador puede bloquearlo (→ fallback).
                    if (pendingPlayRef.current) {
                        pendingPlayRef.current = false;
                        controller.play();
                    }
                });

                controller.addListener("playback_update", ({ data }) => {
                    if (controllerRef.current !== controller) return;
                    const progress = data.duration > 0 ? Math.min(1, data.position / data.duration) : 0;
                    if (data.position > 0) clearFallback();

                    setState((current) => {
                        // Precargada pero sin pulsar play: no se refleja en la UI.
                        if (current.trackId !== trackId || current.status === "fallback" || current.status === "idle") {
                            return current;
                        }
                        // Posición 0: mientras carga se queda en "cargando" (Spotify manda eventos
                        // previos al arranque); si ya sonaba, es que terminó o volvió al inicio.
                        if (data.position === 0) {
                            if (current.status === "loading") return current;
                            return { trackId, status: data.isPaused ? "paused" : "loading", progress: 0 };
                        }
                        const ended = data.isPaused && progress >= 0.99;
                        return { trackId, status: data.isPaused ? "paused" : "playing", progress: ended ? 0 : progress };
                    });
                });
            });
        } catch (error) {
            console.warn("[spotify] no se pudo cargar la iFrame API:", error);
            if (loadedTrackRef.current !== trackId) return;
            destroyController();
            setState((current) => (current.trackId === trackId ? { ...current, status: "fallback" } : current));
        }
    }, [destroyController]);

    /**
     * Precarga (hover / foco / toque). No interrumpe una canción que esté sonando
     * o cargando: solo cambia la precarga si el reproductor está libre.
     */
    const prepare = useCallback((trackId: string) => {
        const current = stateRef.current;
        if (loadedTrackRef.current === trackId) return;
        if (current.trackId && (current.status === "playing" || current.status === "loading")) return;
        // Una canción en pausa pierde su reproductor al precargar otra: vuelve a reposo.
        if (current.trackId && current.trackId !== trackId && current.status !== "fallback") setState(IDLE);
        void load(trackId);
    }, [load]);

    /** Play/pausa de una canción; si es otra, para la actual y empieza la nueva. */
    const toggle = useCallback((trackId: string) => {
        const controller = controllerRef.current;
        const current = stateRef.current;
        const isLoaded = loadedTrackRef.current === trackId;

        // Ya sonando o en pausa: play/pausa directo.
        if (isLoaded && controller && current.trackId === trackId && (current.status === "playing" || current.status === "paused")) {
            controller.togglePlay();
            return;
        }

        setState({ trackId, status: "loading", progress: 0 });
        armFallback(trackId);

        // Precargada y lista: `play()` dentro del clic, que es lo que permite el autoplay.
        if (isLoaded && controller && readyRef.current) {
            controller.play();
            return;
        }

        if (!isLoaded) void load(trackId);
        pendingPlayRef.current = true;
    }, [armFallback, load]);

    const stop = useCallback(() => {
        destroyController();
        setState(IDLE);
    }, [destroyController]);

    useEffect(() => destroyController, [destroyController]);

    return { hostRef, state, prepare, toggle, stop };
};

export type SpotifyPlayer = ReturnType<typeof useSpotifyPlayer>;

export { useSpotifyPlayer };
