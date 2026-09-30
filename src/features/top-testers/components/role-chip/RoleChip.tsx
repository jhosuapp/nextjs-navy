import { memo, type JSX } from "react";

import styles from './roleChip.module.css';

type Props = {
    name: string;
    colour: string | null;
}

/** Chip con el rol de staff actual del tester, tintado con el color del rol. */
const RoleChip = memo(({ name, colour }: Props): JSX.Element => {
    // Discord usa #000000 para "sin color": se queda con el morado por defecto.
    const tint = colour && colour.toLowerCase() !== '#000000' ? colour : undefined;

    return (
        <span className={ styles.roleChip } style={{ color: tint, borderColor: tint }}>
            <span className={ styles.roleChip__dot } style={{ backgroundColor: tint }} aria-hidden="true" />
            { name }
        </span>
    );
});

RoleChip.displayName = 'RoleChip';

export { RoleChip }
