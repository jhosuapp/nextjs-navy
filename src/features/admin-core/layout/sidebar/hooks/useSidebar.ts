import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAdminSidebarStore } from "@/shared/stores/adminSidebar.store";
import { useAdminSessionController } from "../../../hooks";

/** Estado y efectos del sidebar: colapsado, drawer móvil, ruta activa y sesión. */
const useSidebar = () => {
    const { t } = useTranslation("admin");
    const { pathname, events } = useRouter();
    const collapsed = useAdminSidebarStore((state) => state.collapsed);
    const mobileOpen = useAdminSidebarStore((state) => state.mobileOpen);
    const toggleCollapsed = useAdminSidebarStore((state) => state.toggleCollapsed);
    const setMobileOpen = useAdminSidebarStore((state) => state.setMobileOpen);
    const { username, onLogout, isLoggingOut } = useAdminSessionController();

    // Estado persistido (colapsado) solo tras montar: evita mismatch de hidratación.
    useEffect(() => {
        useAdminSidebarStore.persist.rehydrate();
    }, []);

    // Cerrar el drawer al navegar.
    useEffect(() => {
        const close = () => setMobileOpen(false);
        events.on("routeChangeStart", close);
        return () => events.off("routeChangeStart", close);
    }, [events, setMobileOpen]);

    // Escape cierra el drawer móvil.
    useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen, setMobileOpen]);

    return {
        t,
        currentPath: pathname,
        collapsed,
        mobileOpen,
        toggleCollapsed,
        closeMobile: () => setMobileOpen(false),
        username,
        onLogout,
        isLoggingOut,
    };
};

export { useSidebar };
