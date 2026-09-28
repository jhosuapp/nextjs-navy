import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./formFields.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean };

const AdminInput = forwardRef<HTMLInputElement, InputProps>(({ hasError, className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(styles.input, hasError && styles.input__error, className)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError && props.id ? `${props.id}-error` : undefined}
        {...props}
    />
));

AdminInput.displayName = "AdminInput";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean };

const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ hasError, className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(styles.input, styles.textarea, hasError && styles.input__error, className)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError && props.id ? `${props.id}-error` : undefined}
        {...props}
    />
));

AdminTextarea.displayName = "AdminTextarea";

export { AdminInput, AdminTextarea };
