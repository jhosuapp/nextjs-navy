import { memo, useState, type JSX } from "react";
import { SearchIcon } from "@/config/assets/icon/admin/AdminIcons";
import { AdminButton, AdminInput } from "@/features/admin-core/components";
import { ITranslations } from "@/shared/interfaces/globals";
import { spotifyEmbedUrl } from "@/shared/constants/staffProfile";
import { useSpotifySearch } from "../../hooks/useSpotifySearch";
import { StaffSong } from "../../interfaces";
import styles from "./songPicker.module.css";

type Props = {
    t: ITranslations;
    value: StaffSong | null;
    onChange: (song: StaffSong | null) => void;
};

const formatDuration = (ms: number): string => {
    const seconds = Math.round(ms / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Buscador de canciones de Spotify + vista previa de la elegida. */
const SongPicker = memo(({ t, value, onChange }: Props): JSX.Element => {
    const [query, setQuery] = useState("");
    const [isChanging, setIsChanging] = useState(false);
    const { results, isSearching, isError, hasQuery, isTyping } = useSpotifySearch(query);

    const showSearch = !value || isChanging;

    const pick = (song: StaffSong) => {
        onChange(song);
        setQuery("");
        setIsChanging(false);
    };

    return (
        <div className={styles.songPicker}>
            {value && !isChanging && (
                <div className={styles.songPicker__selected}>
                    <div className={styles.songPicker__selectedHead}>
                        {value.cover && <img src={value.cover} alt="" className={styles.songPicker__cover} />}
                        <div className={styles.songPicker__meta}>
                            <p>{value.title}</p>
                            <span>{value.artist}</span>
                        </div>
                        <div className={styles.songPicker__actions}>
                            <AdminButton variant="ghost" onClick={() => setIsChanging(true)}>
                                {t("staff.profile.song.change")}
                            </AdminButton>
                            <AdminButton variant="ghost" onClick={() => onChange(null)}>
                                {t("staff.profile.song.remove")}
                            </AdminButton>
                        </div>
                    </div>
                    <iframe
                        className={styles.songPicker__embed}
                        src={spotifyEmbedUrl(value.id)}
                        title={t("staff.profile.song.preview", { title: value.title })}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                </div>
            )}

            {showSearch && (
                <>
                    <div className={styles.songPicker__search}>
                        <SearchIcon size={16} className={styles.songPicker__searchIcon} />
                        <AdminInput
                            id="staff-song-search"
                            type="search"
                            value={query}
                            autoComplete="off"
                            maxLength={80}
                            placeholder={t("staff.profile.song.placeholder")}
                            aria-label={t("staff.profile.song.placeholder")}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        {isChanging && (
                            <AdminButton variant="ghost" onClick={() => setIsChanging(false)}>
                                {t("common.cancel")}
                            </AdminButton>
                        )}
                    </div>

                    {hasQuery && (
                        <div className={styles.songPicker__results} aria-live="polite" aria-busy={isSearching || isTyping}>
                            {isError ? (
                                <p className={styles.songPicker__state}>{t("staff.profile.song.error")}</p>
                            ) : results.length === 0 ? (
                                <p className={styles.songPicker__state}>
                                    {isSearching || isTyping ? t("staff.profile.song.searching") : t("staff.profile.song.empty")}
                                </p>
                            ) : (
                                <ul className={`${styles.songPicker__list} ${isSearching ? styles.songPicker__list__loading : ""}`}>
                                    {results.map((track) => (
                                        <li key={track.id}>
                                            <button
                                                type="button"
                                                className={styles.songPicker__option}
                                                aria-pressed={value?.id === track.id}
                                                onClick={() =>
                                                    pick({ id: track.id, title: track.title, artist: track.artist, cover: track.cover })
                                                }
                                            >
                                                {track.cover ? (
                                                    <img src={track.cover} alt="" className={styles.songPicker__cover} loading="lazy" />
                                                ) : (
                                                    <span className={styles.songPicker__cover} aria-hidden="true" />
                                                )}
                                                <span className={styles.songPicker__meta}>
                                                    <p>
                                                        {track.explicit && (
                                                            <abbr className={styles.songPicker__explicit} title={t("staff.profile.song.explicit")}>
                                                                E
                                                            </abbr>
                                                        )}
                                                        {track.title}
                                                    </p>
                                                    <span>{track.artist}</span>
                                                </span>
                                                <span className={styles.songPicker__duration}>{formatDuration(track.duration_ms)}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

SongPicker.displayName = "SongPicker";

export { SongPicker };
