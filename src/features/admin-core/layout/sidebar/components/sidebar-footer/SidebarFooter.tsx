import { memo, type JSX } from "react";
import Link from "next/link";
import { ExternalIcon, LogoutIcon } from "@/config/assets/icon/admin/AdminIcons";
import { paths } from "@/shared/constants/routes";
import { ITranslations } from "@/shared/interfaces/globals";
import { cn } from "@/shared/helpers/cn";
import styles from "./sidebarFooter.module.css";

type Props = {
    t: ITranslations;
    username?: string;
    collapsed: boolean;
    onLogout: () => void;
    isLoggingOut: boolean;
};

const SidebarFooter = memo(
    ({ t, username, collapsed, onLogout, isLoggingOut }: Props): JSX.Element => (
        <div className={cn(styles.sidebarFooter, collapsed && styles.sidebarFooter__collapsed)}>
            <Link href={paths.home} className={styles.sidebarFooter__link} title={collapsed ? t("nav.viewSite") : undefined}>
                <ExternalIcon size={18} />
                <span className={styles.sidebarFooter__label}>{t("nav.viewSite")}</span>
            </Link>

            <div className={styles.sidebarFooter__user}>
                <span className={styles.sidebarFooter__avatar} aria-hidden="true">
                    {username?.charAt(0).toUpperCase() ?? "?"}
                </span>
                <span className={styles.sidebarFooter__name}>
                    <small>{t("nav.session")}</small>
                    <strong>{username}</strong>
                </span>
                <button
                    type="button"
                    className={styles.sidebarFooter__logout}
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    aria-label={t("nav.logout")}
                    title={t("nav.logout")}
                >
                    <LogoutIcon size={18} />
                </button>
            </div>
        </div>
    )
);

SidebarFooter.displayName = "SidebarFooter";

export { SidebarFooter };
