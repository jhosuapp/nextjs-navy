import { HiddenState, OverrideMeta } from "@/features/admin-core/interfaces";
import { StaffStatus } from "@/shared/constants/staffProfile";

export type StaffEditableFields = {
    nick: string | null;
    role_name: string;
    role_colour: string;
    role_weight: number;
};

export type AdminStaffMember = HiddenState &
    OverrideMeta & {
        discord_id: string;
        uuid: string | null;
        is_premium: boolean | null;
        role_id: string;
        /** Valores efectivos (bot + overrides). */
        current: StaffEditableFields;
        /** Valores que escribió el bot. */
        original: StaffEditableFields;
        /** Solo los campos con override activo. */
        overrides: Partial<StaffEditableFields>;
        /** Perfil público editable (`staff_profiles`). */
        profile: StaffProfileFields;
        activity: StaffActivity;
    };

export type StaffProfileFields = {
    bio: string | null;
    status_mode: StaffStatus | null;
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    twitch: string | null;
    x: string | null;
    github: string | null;
    linkedin: string | null;
    discord_username: string | null;
    show_namemc: boolean;
    spotify_track_id: string | null;
    spotify_title: string | null;
    spotify_artist: string | null;
    spotify_cover: string | null;
};

/** Metadatos de la canción: los resuelve el servidor, el panel solo envía el id. */
type SpotifyMetaFields = "spotify_title" | "spotify_artist" | "spotify_cover";

export type StaffProfilePatchBody = Partial<Omit<StaffProfileFields, SpotifyMetaFields>>;

export type SpotifyTrackResult = {
    id: string;
    title: string;
    artist: string;
    cover: string | null;
    duration_ms: number;
    explicit: boolean;
};

export type SpotifySearchResponse = {
    data: SpotifyTrackResult[];
};

/** Canción elegida en el formulario (lo mínimo para pintarla). */
export type StaffSong = Pick<SpotifyTrackResult, "id" | "title" | "artist" | "cover">;

/** Actividad como tester, para calcular el estado automático. */
export type StaffActivity = {
    total_tests: number;
    recent_tests: number;
    /** Estado que se mostraría en modo automático. */
    auto_status: StaffStatus | null;
};

export type AdminStaffResponse = {
    data: AdminStaffMember[];
};

export type StaffPatchBody = {
    [K in keyof StaffEditableFields]?: StaffEditableFields[K] | null;
} & {
    hidden?: boolean;
    hidden_reason?: string | null;
};

export type StaffVisibilityFilter = "visible" | "hidden";
