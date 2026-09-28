import { memo, type JSX } from "react";
import { ITranslations } from "@/shared/interfaces/globals";
import { findActiveItem, SIDEBAR_ITEMS } from "../../constants/sidebar.constants";
import { SidebarItemRow } from "../sidebar-item/SidebarItemRow";
import styles from "./sidebarNav.module.css";

type Props = {
    t: ITranslations;
    currentPath: string;
    collapsed: boolean;
};

const SidebarNav = memo(
    ({ t, currentPath, collapsed }: Props): JSX.Element => {
        const activeKey = findActiveItem(currentPath)?.key;

        return (
            <nav className={styles.sidebarNav} aria-label={t("nav.label")}>
                <ul className={styles.sidebarNav__list}>
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarItemRow
                            key={item.key}
                            item={item}
                            label={t(item.labelKey)}
                            isActive={item.key === activeKey}
                            collapsed={collapsed}
                        />
                    ))}
                </ul>
            </nav>
        );
    }
);

SidebarNav.displayName = "SidebarNav";

export { SidebarNav };
