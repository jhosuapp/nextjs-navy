import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminSidebarState {
    /** Colapsado en desktop (persistido). */
    collapsed: boolean;
    /** Drawer abierto en móvil (no persistido). */
    mobileOpen: boolean;
}

interface Actions {
    toggleCollapsed: () => void;
    setMobileOpen: (value: boolean) => void;
}

type Store = AdminSidebarState & Actions;

const storeAPI: StateCreator<Store, [["zustand/devtools", never], ["zustand/persist", unknown]]> = (set) => ({
    collapsed: false,
    mobileOpen: false,

    toggleCollapsed: () =>
        set((state) => ({ collapsed: !state.collapsed }), false, "toggleCollapsed"),

    setMobileOpen: (value: boolean) =>
        set({ mobileOpen: value }, false, "setMobileOpen"),
});

export const useAdminSidebarStore = create<Store>()(
    devtools(
        persist(storeAPI, {
            name: "navy-admin-sidebar",
            partialize: (state) => ({ collapsed: state.collapsed }),
            // Se rehidrata tras montar (useSidebar) para no romper la hidratación SSR.
            skipHydration: true,
        }),
        { name: "admin-sidebar-store" }
    )
);
