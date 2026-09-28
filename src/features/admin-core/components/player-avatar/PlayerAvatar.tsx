import { memo, type JSX } from "react";
import styles from "./playerAvatar.module.css";

type Props = {
    /** uuid (preferido) o nick de Minecraft. */
    id: string;
    nick: string;
    subtitle?: string;
};

/** Cabeza de Minecraft + nick. Imagen decorativa: el nick ya es el texto. */
const PlayerAvatar = memo(
    ({ id, nick, subtitle }: Props): JSX.Element => (
        <div className={styles.playerAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.playerAvatar__img}
                src={`https://mc-heads.net/avatar/${encodeURIComponent(id)}/32`}
                alt=""
                width={32}
                height={32}
                loading="lazy"
            />
            <div className={styles.playerAvatar__text}>
                <span className={styles.playerAvatar__nick}>{nick}</span>
                {subtitle && <span className={styles.playerAvatar__subtitle}>{subtitle}</span>}
            </div>
        </div>
    )
);

PlayerAvatar.displayName = "PlayerAvatar";

export { PlayerAvatar };
