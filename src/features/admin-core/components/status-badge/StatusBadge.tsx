import { memo, type JSX, type ReactNode } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./statusBadge.module.css";

export type BadgeTone = "success" | "danger" | "warning" | "neutral" | "info";

type Props = {
    tone?: BadgeTone;
    children: ReactNode;
    title?: string;
};

const StatusBadge = memo(
    ({ tone = "neutral", children, title }: Props): JSX.Element => (
        <span className={cn(styles.statusBadge, styles[`statusBadge__${tone}`])} title={title}>
            {children}
        </span>
    )
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
