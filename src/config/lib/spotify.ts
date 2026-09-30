/**
 * Spotify Web API con client credentials (sin login de usuario): solo sirve
 * para consultar el catálogo. Se usa desde el panel para buscar la canción del
 * perfil de staff y, al guardar, para resolver sus metadatos en el servidor.
 *
 * Requiere `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET`. El token dura 1 h y
 * se reutiliza en memoria mientras la instancia siga viva.
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";
/** Margen para renovar el token antes de que caduque. */
const TOKEN_MARGIN_MS = 60_000;
const REQUEST_TIMEOUT_MS = 8_000;

export const SPOTIFY_TRACK_ID_REGEX = /^[A-Za-z0-9]{22}$/;

export type SpotifyTrack = {
    id: string;
    title: string;
    artist: string;
    /** Portada ~300 px (o la mayor disponible). */
    cover: string | null;
    duration_ms: number;
    explicit: boolean;
};

export class SpotifyNotConfiguredError extends Error {
    constructor() {
        super("Spotify no está configurado (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET)");
    }
}

type RawImage = { url: string; width: number | null };
type RawTrack = {
    id: string;
    name: string;
    duration_ms: number;
    explicit: boolean;
    artists: Array<{ name: string }>;
    album: { images: RawImage[] };
};

let cachedToken: { value: string; expiresAt: number } | null = null;

export const isSpotifyConfigured = (): boolean =>
    Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);

async function getAccessToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt - TOKEN_MARGIN_MS > Date.now()) return cachedToken.value;

    const id = process.env.SPOTIFY_CLIENT_ID;
    const secret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!id || !secret) throw new SpotifyNotConfiguredError();

    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Spotify token ${response.status}`);

    const data = (await response.json()) as { access_token: string; expires_in: number };
    cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return data.access_token;
}

async function spotifyGet<T>(path: string, params?: Record<string, string>, retry = true): Promise<T | null> {
    const token = await getAccessToken();
    const url = `${API_URL}${path}${params ? `?${new URLSearchParams(params)}` : ""}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // Token revocado antes de tiempo: se pide otro una vez.
    if (response.status === 401 && retry) {
        cachedToken = null;
        return spotifyGet<T>(path, params, false);
    }
    if (response.status === 404 || response.status === 400) return null;
    if (!response.ok) throw new Error(`Spotify ${path} ${response.status}`);
    return (await response.json()) as T;
}

const pickCover = (images: RawImage[]): string | null => {
    if (images.length === 0) return null;
    // Spotify las devuelve de mayor a menor (640, 300, 64): la de ~300 basta.
    const medium = images.find((image) => image.width !== null && image.width <= 320 && image.width >= 200);
    return (medium ?? images[0]).url;
};

const toTrack = (raw: RawTrack): SpotifyTrack => ({
    id: raw.id,
    title: raw.name,
    artist: raw.artists.map((artist) => artist.name).join(", "),
    cover: pickCover(raw.album.images),
    duration_ms: raw.duration_ms,
    explicit: raw.explicit,
});

export async function searchSpotifyTracks(query: string, limit = 8): Promise<SpotifyTrack[]> {
    const data = await spotifyGet<{ tracks: { items: RawTrack[] } }>("/search", {
        q: query,
        type: "track",
        limit: String(limit),
    });
    return (data?.tracks.items ?? []).filter(Boolean).map(toTrack);
}

/** `null` si el id no existe. */
export async function getSpotifyTrack(id: string): Promise<SpotifyTrack | null> {
    if (!SPOTIFY_TRACK_ID_REGEX.test(id)) return null;
    const raw = await spotifyGet<RawTrack>(`/tracks/${id}`);
    return raw ? toTrack(raw) : null;
}
