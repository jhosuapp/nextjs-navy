import { memo, type JSX } from "react";
import styles from "./formFields.module.css";

type Props = {
    label: string;
    onClick: () => void;
};

/** Enlace "Restablecer" de un campo con override: vuelve al valor del bot. */
const ResetButton = memo(
    ({ label, onClick }: Props): JSX.Element => (
        <button type="button" className={styles.reset} onClick={onClick}>
            {label}
        </button>
    )
);

ResetButton.displayName = "ResetButton";

export { ResetButton };
