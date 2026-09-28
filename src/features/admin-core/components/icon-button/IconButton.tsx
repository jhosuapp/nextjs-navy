import { memo, type ButtonHTMLAttributes, type JSX, type ReactNode } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./iconButton.module.css";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    /** Texto accesible y tooltip nativo. */
    label: string;
    icon: ReactNode;
    tone?: "neutral" | "danger" | "success";
};

const IconButton = memo(
    ({ label, icon, tone = "neutral", className, type = "button", ...props }: Props): JSX.Element => (
        <button
            type={type}
            aria-label={label}
            title={label}
            className={cn(styles.iconButton, styles[`iconButton__${tone}`], className)}
            {...props}
        >
            {icon}
        </button>
    )
);

IconButton.displayName = "IconButton";

export { IconButton };
