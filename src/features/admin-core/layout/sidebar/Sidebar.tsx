import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { cn } from "@/shared/helpers/cn";
import { useSidebar } from "./hooks/useSidebar";
import { SidebarHeader } from "./components/sidebar-header/SidebarHeader";
import { SidebarNav } from "./components/sidebar-nav/SidebarNav";
import { SidebarFooter } from "./components/sidebar-footer/SidebarFooter";
import styles from "./sidebar.module.css";

/**
 * Navegación lateral del panel. Orquestador delgado: el estado vive en
 * `useSidebar` y cada zona es su propio componente. Colapsable en desktop
 * (persistido) y drawer off-canvas en móvil.
 */
const Sidebar = (): JSX.Element => {
    const { t, currentPath, collapsed, mobileOpen, toggleCollapsed, closeMobile, username, role, onLogout, isLoggingOut } =
        useSidebar();

    return (
        <>
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div className={styles.overlay} onClick={closeMobile} aria-hidden="true" {...fadeInMotion()} />
                )}
            </AnimatePresence>

            <aside
                id="admin-sidebar"
                className={cn(styles.sidebar, collapsed && styles.sidebar__collapsed, mobileOpen && styles.sidebar__mobileOpen)}
                data-lenis-prevent
            >
                <SidebarHeader t={t} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} onCloseMobile={closeMobile} />
                <SidebarNav t={t} currentPath={currentPath} collapsed={collapsed} />
                <SidebarFooter
                    t={t}
                    username={username}
                    roleLabel={t(`nav.roles.${role}`)}
                    collapsed={collapsed}
                    onLogout={onLogout}
                    isLoggingOut={isLoggingOut}
                />
            </aside>
        </>
    );
};

export { Sidebar };
