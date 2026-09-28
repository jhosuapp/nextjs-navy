import { memo, type ButtonHTMLAttributes, type JSX, type ReactNode } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./adminButton.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger" | "subtle";
    size?: "sm" | "md";
    icon?: ReactNode;
    isLoading?: boolean;
};

const AdminButton = memo(
    ({
        variant = "primary",
        size = "md",
        icon,
        isLoading = false,
        className,
        children,
        disabled,
        type = "button",
        ...props
    }: Props): JSX.Element => (
        <button
            type={type}
            className={cn(
                styles.adminButton,
                styles[`adminButton__${variant}`],
                styles[`adminButton__${size}`],
                className
            )}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...props}
        >
            {isLoading ? <span className={styles.adminButton__spinner} aria-hidden="true" /> : icon}
            {children && <span>{children}</span>}
        </button>
    )
);

AdminButton.displayName = "AdminButton";

export { AdminButton };
