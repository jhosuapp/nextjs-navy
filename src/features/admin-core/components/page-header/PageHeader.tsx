import { memo, type JSX, type ReactNode } from "react";
import styles from "./pageHeader.module.css";

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

const PageHeader = memo(
    ({ title, description, actions }: Props): JSX.Element => (
        <header className={styles.pageHeader}>
            <div className={styles.pageHeader__text}>
                <h1 className={styles.pageHeader__title}>{title}</h1>
                {description && <p className={styles.pageHeader__description}>{description}</p>}
            </div>
            {actions && <div className={styles.pageHeader__actions}>{actions}</div>}
        </header>
    )
);

PageHeader.displayName = "PageHeader";

export { PageHeader };
