import { memo, type JSX } from "react";
import Link from "next/link";
import { cn } from "@/shared/helpers/cn";
import type { SidebarItem } from "../../constants/sidebar.constants";
import styles from "./sidebarItem.module.css";

type Props = {
    item: SidebarItem;
    label: string;
    isActive: boolean;
    collapsed: boolean;
};

const SidebarItemRow = memo(
    ({ item, label, isActive, collapsed }: Props): JSX.Element => {
        const { Icon } = item;

        return (
            <li>
                <Link
                    href={item.href}
                    className={cn(styles.sidebarItem, isActive && styles.sidebarItem__active, collapsed && styles.sidebarItem__collapsed)}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                >
                    <Icon className={styles.sidebarItem__icon} />
                    <span className={styles.sidebarItem__label}>{label}</span>
                    {collapsed && (
                        <span className={styles.sidebarItem__tooltip} role="tooltip">
                            {label}
                        </span>
                    )}
                </Link>
            </li>
        );
    }
);

SidebarItemRow.displayName = "SidebarItemRow";

export { SidebarItemRow };
