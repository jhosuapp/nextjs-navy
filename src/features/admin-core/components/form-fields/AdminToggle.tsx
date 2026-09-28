import { memo, type JSX } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./formFields.module.css";

type Props = {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
};

/** Interruptor accesible (checkbox con role="switch"). */
const AdminToggle = memo(
    ({ id, label, description, checked, onChange, disabled }: Props): JSX.Element => (
        <label htmlFor={id} className={cn(styles.toggle, disabled && styles.toggle__disabled)}>
            <span className={styles.toggle__text}>
                <span className={styles.toggle__label}>{label}</span>
                {description && <span className={styles.toggle__description}>{description}</span>}
            </span>
            <input
                id={id}
                type="checkbox"
                role="switch"
                className="sr-only peer"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onChange(event.target.checked)}
            />
            <span className={styles.toggle__track} aria-hidden="true">
                <span className={styles.toggle__thumb} />
            </span>
        </label>
    )
);

AdminToggle.displayName = "AdminToggle";

export { AdminToggle };
