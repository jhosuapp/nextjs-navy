import { memo, type JSX, type ReactNode } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./panel.module.css";

type Props = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

/** Superficie base del panel (tarjeta con cabecera opcional). */
const Panel = memo(
    ({ title, description, icon, actions, children, className }: Props): JSX.Element => (
        <section className={cn(styles.panel, className)}>
            {(title || actions) && (
                <header className={styles.panel__header}>
                    <div className={styles.panel__heading}>
                        {icon && <span className={styles.panel__icon}>{icon}</span>}
                        <div>
                            {title && <h2 className={styles.panel__title}>{title}</h2>}
                            {description && <p className={styles.panel__description}>{description}</p>}
                        </div>
                    </div>
                    {actions && <div className={styles.panel__actions}>{actions}</div>}
                </header>
            )}
            {children}
        </section>
    )
);

Panel.displayName = "Panel";

export { Panel };
