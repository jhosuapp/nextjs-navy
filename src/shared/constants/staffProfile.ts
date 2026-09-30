/**
 * Perfil público del staff (`staff_profiles`): reglas compartidas entre la
 * validación de la API, el formulario del panel y la card pública.
 *
 * Las redes se guardan como handle, nunca como URL: la URL se construye aquí,
 * así un valor editado desde el panel no puede apuntar a un dominio ajeno.
 */

export const STAFF_STATUS_MODES = ["active", "inactive", "paused"] as const;
export type StaffStatus = (typeof STAFF_STATUS_MODES)[number];

/** Días sin tests a partir de los cuales un tester pasa a "inactivo" (modo automático). */
export const STAFF_ACTIVE_WINDOW_DAYS = 30;

export const STAFF_SOCIALS = ["instagram", "tiktok", "youtube", "twitch", "x", "github", "linkedin", "discord_username"] as const;
export type StaffSocialKey = (typeof STAFF_SOCIALS)[number];

export const STAFF_PROFILE_RULES = {
    bioMax: 160,
    /** instagram, tiktok, twitch, x. */
    handleRegex: /^[A-Za-z0-9_.]{1,40}$/,
    /** `@handle` o id de canal (`UC…`). */
    youtubeRegex: /^(@[A-Za-z0-9_.-]{3,30}|UC[A-Za-z0-9_-]{22})$/,
    /** Usuario de GitHub. */
    githubRegex: /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/,
    /** Slug de perfil de LinkedIn (`linkedin.com/in/<slug>`). */
    linkedinRegex: /^[A-Za-z0-9-]{3,100}$/,
    /** Usuario de Discord (sistema nuevo, sin #0000). */
    discordRegex: /^[a-z0-9_.]{2,32}$/,
} as const;

export const socialRegex = (key: StaffSocialKey): RegExp => {
    if (key === "youtube") return STAFF_PROFILE_RULES.youtubeRegex;
    if (key === "github") return STAFF_PROFILE_RULES.githubRegex;
    if (key === "linkedin") return STAFF_PROFILE_RULES.linkedinRegex;
    if (key === "discord_username") return STAFF_PROFILE_RULES.discordRegex;
    return STAFF_PROFILE_RULES.handleRegex;
};

/** Rutas que preceden al handle en la URL de cada red (se quitan si pegan la URL entera). */
const URL_PATH_PREFIX: Partial<Record<StaffSocialKey, RegExp>> = {
    youtube: /^(channel\/|c\/|user\/)/,
    linkedin: /^in\//,
};

/**
 * Deja solo el handle: quita espacios, la URL completa si la pegan
 * (`https://www.linkedin.com/in/jhosua-penagos/` → `jhosua-penagos`), las
 * barras finales, `?query`/`#hash` y la `@` inicial (salvo en YouTube, donde
 * forma parte del handle).
 */
export const normalizeHandle = (key: StaffSocialKey, value: string): string => {
    let trimmed = value
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/[?#].*$/, "")
        .replace(/\/+$/, "")
        // Solo si tras el dominio queda ruta: `navy.tiers` (handle con punto) no se toca.
        .replace(/^(www\.|m\.)?[a-z0-9.-]+\.[a-z]{2,}\//i, "");
    const pathPrefix = URL_PATH_PREFIX[key];
    if (pathPrefix) trimmed = trimmed.replace(pathPrefix, "");

    if (key === "youtube") return trimmed.startsWith("UC") || trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
    const handle = trimmed.replace(/^@/, "");
    return key === "discord_username" ? handle.toLowerCase() : handle;
};

/** Prefijo que se muestra en el input del panel. */
export const SOCIAL_PREFIX: Record<StaffSocialKey, string> = {
    instagram: "instagram.com/",
    tiktok: "tiktok.com/@",
    youtube: "youtube.com/",
    twitch: "twitch.tv/",
    x: "x.com/",
    github: "github.com/",
    linkedin: "linkedin.com/in/",
    discord_username: "@",
};

/** URL pública de una red. Discord no tiene URL: se copia el usuario. */
export const socialUrl = (key: Exclude<StaffSocialKey, "discord_username">, handle: string): string => {
    const value = encodeURIComponent(handle.replace(/^@/, ""));
    switch (key) {
        case "instagram":
            return `https://www.instagram.com/${value}`;
        case "tiktok":
            return `https://www.tiktok.com/@${value}`;
        case "youtube":
            return handle.startsWith("UC")
                ? `https://www.youtube.com/channel/${value}`
                : `https://www.youtube.com/@${value}`;
        case "twitch":
            return `https://www.twitch.tv/${value}`;
        case "x":
            return `https://x.com/${value}`;
        case "github":
            return `https://github.com/${value}`;
        case "linkedin":
            return `https://www.linkedin.com/in/${value}`;
    }
};

export const namemcUrl = (nick: string): string => `https://namemc.com/profile/${encodeURIComponent(nick)}`;

/** Reproductor embebido de Spotify (compacto, tema oscuro). */
export const spotifyEmbedUrl = (trackId: string): string =>
    `https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?utm_source=generator&theme=0`;

export const spotifyTrackUrl = (trackId: string): string =>
    `https://open.spotify.com/track/${encodeURIComponent(trackId)}`;
