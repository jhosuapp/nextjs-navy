import { memo, type JSX, type ReactNode } from "react";
import styles from "./formFields.module.css";

type Props = {
    id: string;
    label: string;
    error?: string;
    /** Texto de ayuda bajo el campo (p. ej. el valor original del bot). */
    hint?: ReactNode;
    /** Acción a la derecha de la etiqueta (p. ej. "Restablecer"). */
    action?: ReactNode;
    children: ReactNode;
};

const FieldShell = memo(
    ({ id, label, error, hint, action, children }: Props): JSX.Element => (
        <div className={styles.field}>
            <div className={styles.field__top}>
                <label htmlFor={id} className={styles.field__label}>
                    {label}
                </label>
                {action}
            </div>
            <div className="relative">
                {children}
                {error && (
                    <span className="field__error" role="alert" id={`${id}-error`}>
                        {error}
                    </span>
                )}
            </div>
            {hint && <p className={styles.field__hint}>{hint}</p>}
        </div>
    )
);

FieldShell.displayName = "FieldShell";

export { FieldShell };
