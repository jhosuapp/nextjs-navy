import type { JSX } from "react";
import {
    GavelIcon,
    InboxIcon,
    SettingsIcon,
    ShieldIcon,
    TrophyIcon,
    UsersIcon,
    type AdminIconProps,
} from "@/config/assets/icon/admin/AdminIcons";
import { paths } from "@/shared/constants/routes";

export type SidebarItem = {
    key: "applications" | "settings" | "staff" | "testers" | "bans" | "users";
    href: string;
    /** Clave i18n del namespace `admin`. */
    labelKey: string;
    Icon: (props: AdminIconProps) => JSX.Element;
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
    { key: "applications", href: paths.applicationsAdmin, labelKey: "nav.applications", Icon: InboxIcon },
    { key: "settings", href: paths.adminSettings, labelKey: "nav.settings", Icon: SettingsIcon },
    { key: "staff", href: paths.adminStaff, labelKey: "nav.staff", Icon: ShieldIcon },
    { key: "testers", href: paths.adminTesters, labelKey: "nav.testers", Icon: TrophyIcon },
    { key: "bans", href: paths.adminBans, labelKey: "nav.bans", Icon: GavelIcon },
    { key: "users", href: paths.adminUsers, labelKey: "nav.users", Icon: UsersIcon },
];

/** Ítem activo para una ruta (también en subrutas). */
export const findActiveItem = (pathname: string): SidebarItem | undefined =>
    SIDEBAR_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
