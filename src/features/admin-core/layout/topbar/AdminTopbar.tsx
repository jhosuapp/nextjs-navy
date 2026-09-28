import { memo, type JSX } from "react";
import { MenuIcon } from "@/config/assets/icon/admin/AdminIcons";
import { useAdminSidebarStore } from "@/shared/stores/adminSidebar.store";
import styles from "./adminTopbar.module.css";

type Props = {
    title: string;
    openMenuLabel: string;
};

/** Barra superior solo en móvil: hamburguesa + sección actual. */
const AdminTopbar = memo(
    ({ title, openMenuLabel }: Props): JSX.Element => {
        const mobileOpen = useAdminSidebarStore((state) => state.mobileOpen);
        const setMobileOpen = useAdminSidebarStore((state) => state.setMobileOpen);

        return (
            <div className={styles.adminTopbar}>
                <button
                    type="button"
                    className={styles.adminTopbar__menu}
                    onClick={() => setMobileOpen(true)}
                    aria-label={openMenuLabel}
                    aria-expanded={mobileOpen}
                    aria-controls="admin-sidebar"
                >
                    <MenuIcon />
                </button>
                <span className={styles.adminTopbar__title}>{title}</span>
            </div>
        );
    }
);

AdminTopbar.displayName = "AdminTopbar";

export { AdminTopbar };
