import { memo, useId, useRef, type JSX, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/config/assets/icon/admin/AdminIcons";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { popInMotion, slideInMotion } from "@/shared/motion/slideIn.motion";
import { cn } from "@/shared/helpers/cn";
import { useDialogA11y } from "../../hooks/useDialogA11y";
import styles from "./adminDialog.module.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    closeLabel: string;
    /** `drawer` = panel lateral derecho (formularios), `dialog` = centrado. */
    variant?: "dialog" | "drawer";
    footer?: ReactNode;
    children?: ReactNode;
};

const DialogContent = ({
    onClose,
    title,
    description,
    closeLabel,
    variant = "dialog",
    footer,
    children,
}: Omit<Props, "isOpen">): JSX.Element => {
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useDialogA11y(true, onClose, panelRef);

    const isDrawer = variant === "drawer";

    return (
        <div className={cn(styles.adminDialog, isDrawer && styles.adminDialog__drawerRoot)}>
            <motion.div className={styles.adminDialog__overlay} onClick={onClose} aria-hidden="true" {...fadeInMotion()} />
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                className={cn(styles.adminDialog__panel, isDrawer ? styles.adminDialog__drawer : styles.adminDialog__dialog)}
                {...(isDrawer ? slideInMotion("right") : popInMotion())}
            >
                <header className={styles.adminDialog__header}>
                    <div className="min-w-0">
                        <h2 id={titleId} className={styles.adminDialog__title}>
                            {title}
                        </h2>
                        {description && (
                            <p id={descriptionId} className={styles.adminDialog__description}>
                                {description}
                            </p>
                        )}
                    </div>
                    <button type="button" className={styles.adminDialog__close} onClick={onClose} aria-label={closeLabel}>
                        <CloseIcon size={18} />
                    </button>
                </header>

                {children && (
                    <div className={styles.adminDialog__body} data-lenis-prevent>
                        {children}
                    </div>
                )}

                {footer && <footer className={styles.adminDialog__footer}>{footer}</footer>}
            </motion.div>
        </div>
    );
};

/** Diálogo/drawer del panel, renderizado en `#portal-modal`. */
const AdminDialog = memo(({ isOpen, ...props }: Props): JSX.Element | null => {
    if (typeof document === "undefined") return null;
    const portalRoot = document.getElementById("portal-modal");
    if (!portalRoot) return null;

    return createPortal(<AnimatePresence>{isOpen && <DialogContent {...props} />}</AnimatePresence>, portalRoot);
});

AdminDialog.displayName = "AdminDialog";

export { AdminDialog };
