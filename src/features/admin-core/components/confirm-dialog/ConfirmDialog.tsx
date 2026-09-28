import { memo, useState, type JSX } from "react";
import { AdminDialog } from "../admin-dialog/AdminDialog";
import { AdminButton } from "../admin-button/AdminButton";
import styles from "./confirmDialog.module.css";

type Props = {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    closeLabel: string;
    tone?: "danger" | "primary";
    isLoading?: boolean;
    /** Si se da, muestra un campo opcional de motivo (p. ej. al ocultar). */
    reasonLabel?: string;
    reasonPlaceholder?: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
};

/** Confirmación de acciones sensibles (sustituye a `window.confirm`). */
const ConfirmDialog = memo(
    ({
        isOpen,
        title,
        description,
        confirmLabel,
        cancelLabel,
        closeLabel,
        tone = "danger",
        isLoading = false,
        reasonLabel,
        reasonPlaceholder,
        onConfirm,
        onCancel,
    }: Props): JSX.Element => {
        const [reason, setReason] = useState("");

        const close = () => {
            setReason("");
            onCancel();
        };

        const confirm = () => {
            onConfirm(reason.trim());
            setReason("");
        };

        return (
            <AdminDialog
                isOpen={isOpen}
                onClose={close}
                title={title}
                description={description}
                closeLabel={closeLabel}
                footer={
                    <>
                        <AdminButton variant="ghost" onClick={close} disabled={isLoading}>
                            {cancelLabel}
                        </AdminButton>
                        <AdminButton variant={tone} onClick={confirm} isLoading={isLoading}>
                            {confirmLabel}
                        </AdminButton>
                    </>
                }
            >
                {reasonLabel && (
                    <label className={styles.confirmDialog__field}>
                        <span className={styles.confirmDialog__label}>{reasonLabel}</span>
                        <input
                            className={styles.confirmDialog__input}
                            value={reason}
                            maxLength={255}
                            placeholder={reasonPlaceholder}
                            onChange={(event) => setReason(event.target.value)}
                        />
                    </label>
                )}
            </AdminDialog>
        );
    }
);

ConfirmDialog.displayName = "ConfirmDialog";

export { ConfirmDialog };
