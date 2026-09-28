import { memo, type JSX } from "react";
import Link from "next/link";
import { ChevronLeftIcon, CloseIcon } from "@/config/assets/icon/admin/AdminIcons";
import { paths } from "@/shared/constants/routes";
import { ITranslations } from "@/shared/interfaces/globals";
import { cn } from "@/shared/helpers/cn";
import styles from "./sidebarHeader.module.css";

type Props = {
    t: ITranslations;
    collapsed: boolean;
    onToggleCollapsed: () => void;
    onCloseMobile: () => void;
};

const SidebarHeader = memo(
    ({ t, collapsed, onToggleCollapsed, onCloseMobile }: Props): JSX.Element => (
        <div className={cn(styles.sidebarHeader, collapsed && styles.sidebarHeader__collapsed)}>
            <Link href={paths.applicationsAdmin} className={styles.sidebarHeader__brand} aria-label={t("nav.brand")}>
                <span className={styles.sidebarHeader__logo}>N</span>
                <span className={styles.sidebarHeader__text}>
                    <strong>NAVY</strong>
                    <small>{t("nav.panel")}</small>
                </span>
            </Link>

            <button
                type="button"
                className={styles.sidebarHeader__collapse}
                onClick={onToggleCollapsed}
                aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
                aria-expanded={!collapsed}
                title={collapsed ? t("nav.expand") : t("nav.collapse")}
            >
                <ChevronLeftIcon size={18} />
            </button>

            <button
                type="button"
                className={styles.sidebarHeader__close}
                onClick={onCloseMobile}
                aria-label={t("nav.closeMenu")}
            >
                <CloseIcon size={18} />
            </button>
        </div>
    )
);

SidebarHeader.displayName = "SidebarHeader";

export { SidebarHeader };
