import { memo, type CSSProperties, type JSX } from "react";
import styles from "./roleChip.module.css";

type Props = {
    name: string;
    colour: string;
};

/** Chip con el color del rol de Discord (el color es dato, va como variable CSS). */
const RoleChip = memo(
    ({ name, colour }: Props): JSX.Element => (
        <span className={styles.roleChip} style={{ "--role-colour": colour } as CSSProperties}>
            <span className={styles.roleChip__dot} aria-hidden="true" />
            {name}
        </span>
    )
);

RoleChip.displayName = "RoleChip";

export { RoleChip };
