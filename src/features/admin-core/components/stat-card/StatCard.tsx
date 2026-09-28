import { memo, type JSX, type ReactNode } from "react";
import styles from "./statCard.module.css";

type Props = {
    label: string;
    value: ReactNode;
    hint?: string;
};

const StatCard = memo(
    ({ label, value, hint }: Props): JSX.Element => (
        <div className={styles.statCard}>
            <span className={styles.statCard__label}>{label}</span>
            <span className={styles.statCard__value}>{value}</span>
            {hint && <span className={styles.statCard__hint}>{hint}</span>}
        </div>
    )
);

StatCard.displayName = "StatCard";

export { StatCard };
